import { prepareCover } from './image';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Client, ClientInput, LeadInput, Project, ProjectInput } from './types';
import { seedProjects } from './seed';

/**
 * Com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env, tudo vai para o Supabase.
 * Sem eles, o site roda em "modo demonstração": os dados ficam só no navegador (localStorage).
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;
export const isDemo = !supabase;

// ---------------------------------------------------------------------------
// Modo demonstração
// ---------------------------------------------------------------------------

const PROJECTS_KEY = 'waw-demo-projects';
const CLIENTS_KEY = 'waw-demo-clients';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error('Não foi possível salvar no navegador (imagem grande demais para o modo demonstração?).');
  }
}

const nextId = (items: { id: number }[]) => items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

function fileToDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

const byPosition = (a: Project, b: Project) => a.position - b.position || a.id - b.id;

// ---------------------------------------------------------------------------
// Portfólio
// ---------------------------------------------------------------------------

export async function listProjects(options: { onlyPublished?: boolean } = {}): Promise<Project[]> {
  if (!supabase) {
    const all = readLocal<Project[]>(PROJECTS_KEY, seedProjects).sort(byPosition);
    return options.onlyPublished ? all.filter((p) => p.published) : all;
  }
  let query = supabase.from('projects').select('*').order('position').order('id');
  if (options.onlyPublished) query = query.eq('published', true);
  return unwrap(await query);
}

export async function saveProject(input: ProjectInput, id?: number): Promise<Project> {
  if (!supabase) {
    const all = readLocal<Project[]>(PROJECTS_KEY, seedProjects);
    let saved: Project;
    if (id) {
      saved = { ...all.find((p) => p.id === id)!, ...input };
      writeLocal(PROJECTS_KEY, all.map((p) => (p.id === id ? saved : p)));
    } else {
      saved = { ...input, id: nextId(all), created_at: new Date().toISOString() };
      writeLocal(PROJECTS_KEY, [...all, saved]);
    }
    return saved;
  }
  const query = id
    ? supabase.from('projects').update(input).eq('id', id).select().single()
    : supabase.from('projects').insert(input).select().single();
  return unwrap(await query);
}

export async function deleteProject(id: number) {
  if (!supabase) {
    writeLocal(
      PROJECTS_KEY,
      readLocal<Project[]>(PROJECTS_KEY, seedProjects).filter((p) => p.id !== id),
    );
    return;
  }
  unwrap(await supabase.from('projects').delete().eq('id', id));
}

/** Salva a nova ordem (lista já ordenada). */
export async function reorderProjects(ordered: Project[]) {
  const updates = ordered.map((p, index) => ({ id: p.id, position: index + 1 }));
  if (!supabase) {
    const positions = new Map(updates.map((u) => [u.id, u.position]));
    const all = readLocal<Project[]>(PROJECTS_KEY, seedProjects);
    writeLocal(PROJECTS_KEY, all.map((p) => ({ ...p, position: positions.get(p.id) ?? p.position })));
    return;
  }
  await Promise.all(
    updates.map(async (u) => unwrap(await supabase!.from('projects').update({ position: u.position }).eq('id', u.id))),
  );
}

export async function uploadCover(file: File): Promise<string> {
  // Sem limite de tamanho: a imagem é recortada, reduzida e comprimida antes de subir.
  const cover = await prepareCover(file);
  if (!supabase) return fileToDataUrl(cover);
  const path = `${crypto.randomUUID()}.webp`;
  unwrap(await supabase.storage.from('portfolio').upload(path, cover, { contentType: 'image/webp' }));
  return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
}

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------

export async function listClients(): Promise<Client[]> {
  if (!supabase) {
    return readLocal<Client[]>(CLIENTS_KEY, []).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return unwrap(await supabase.from('clients').select('*').order('created_at', { ascending: false }));
}

export async function saveClient(input: ClientInput, id?: number): Promise<Client> {
  if (!supabase) {
    const all = readLocal<Client[]>(CLIENTS_KEY, []);
    let saved: Client;
    if (id) {
      saved = { ...all.find((c) => c.id === id)!, ...input };
      writeLocal(CLIENTS_KEY, all.map((c) => (c.id === id ? saved : c)));
    } else {
      saved = { ...input, id: nextId(all), created_at: new Date().toISOString() };
      writeLocal(CLIENTS_KEY, [...all, saved]);
    }
    return saved;
  }
  const query = id
    ? supabase.from('clients').update(input).eq('id', id).select().single()
    : supabase.from('clients').insert(input).select().single();
  return unwrap(await query);
}

export async function deleteClient(id: number) {
  if (!supabase) {
    writeLocal(CLIENTS_KEY, readLocal<Client[]>(CLIENTS_KEY, []).filter((c) => c.id !== id));
    return;
  }
  unwrap(await supabase.from('clients').delete().eq('id', id));
}

/** Chamado pelo formulário do site: vira um lead no painel. */
export async function createLead(lead: LeadInput) {
  const input: ClientInput = {
    ...lead,
    email: '',
    instagram: '',
    status: 'lead',
    value: null,
    start_date: null,
    source: 'site',
  };
  if (!supabase) {
    await saveClient(input);
    return;
  }
  // Sem .select(): o visitante pode criar o lead, mas não pode ler a tabela.
  unwrap(await supabase.from('clients').insert(input));
}

// ---------------------------------------------------------------------------
// Login do painel
// ---------------------------------------------------------------------------

export async function signIn(email: string, password: string) {
  if (!supabase) return;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error) return;
  if (error.code === 'email_not_confirmed') {
    throw new Error('E-mail ainda não confirmado. No Supabase: Authentication → Users → confirme o usuário.');
  }
  if (error.code === 'invalid_credentials') throw new Error('E-mail ou senha incorretos.');
  throw new Error(`Não foi possível entrar: ${error.message}`);
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}
