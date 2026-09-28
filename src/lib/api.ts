import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  Access,
  Client,
  ClientInput,
  LeadInput,
  PanelUser,
  PanelUserInput,
  Project,
  ProjectInput,
  TeamInput,
  TeamMember,
  TeamPayment,
  TeamPaymentInput,
} from './types';
import { prepareCover, preparePhoto } from './image';
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
const TEAM_KEY = 'waw-demo-team';
const TEAM_PAYMENTS_KEY = 'waw-demo-team-payments';
const USERS_KEY = 'waw-demo-users';

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

const withClientDefaults = (client: Client): Client => ({
  ...client,
  document: client.document ?? '',
  value_type: client.value_type ?? 'fixo',
  extra_payments: client.extra_payments ?? [],
  due_day: client.due_day ?? null,
});

export async function listClients(): Promise<Client[]> {
  if (!supabase) {
    return readLocal<Client[]>(CLIENTS_KEY, [])
      .map(withClientDefaults)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const rows = unwrap(await supabase.from('clients').select('*').order('created_at', { ascending: false }));
  return (rows as Client[]).map(withClientDefaults);
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
  if (!supabase) {
    await saveClient({
      ...lead,
      email: '',
      instagram: '',
      document: '',
      status: 'lead',
      value: null,
      value_type: 'fixo',
      extra_payments: [],
      due_day: null,
      start_date: null,
      source: 'site',
    });
    return;
  }
  // Sem .select(): o visitante pode criar o lead, mas não pode ler a tabela.
  // Os outros campos ficam com o valor padrão do banco.
  unwrap(await supabase.from('clients').insert({ ...lead, status: 'lead', source: 'site' }));
}

// ---------------------------------------------------------------------------
// Equipe
// ---------------------------------------------------------------------------

export type TeamMemberWithPhoto = TeamMember & { photo_url: string | null };

export async function listTeam(): Promise<TeamMemberWithPhoto[]> {
  if (!supabase) {
    return readLocal<TeamMember[]>(TEAM_KEY, [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((m) => ({ ...m, photo_url: m.photo_path }));
  }
  const members = unwrap(await supabase.from('team').select('*').order('name')) as TeamMember[];
  // As fotos ficam num bucket privado: gera links temporários (1 hora) para exibir.
  const paths = members.map((m) => m.photo_path).filter((p): p is string => !!p);
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data } = await supabase.storage.from('team').createSignedUrls(paths, 60 * 60);
    data?.forEach((item) => item.path && item.signedUrl && urls.set(item.path, item.signedUrl));
  }
  return members.map((m) => ({ ...m, photo_url: m.photo_path ? urls.get(m.photo_path) ?? null : null }));
}

export async function saveTeamMember(input: TeamInput, id?: number): Promise<TeamMember> {
  if (!supabase) {
    const all = readLocal<TeamMember[]>(TEAM_KEY, []);
    let saved: TeamMember;
    if (id) {
      saved = { ...all.find((m) => m.id === id)!, ...input };
      writeLocal(TEAM_KEY, all.map((m) => (m.id === id ? saved : m)));
    } else {
      saved = { ...input, id: nextId(all), created_at: new Date().toISOString() };
      writeLocal(TEAM_KEY, [...all, saved]);
    }
    return saved;
  }
  const query = id
    ? supabase.from('team').update(input).eq('id', id).select().single()
    : supabase.from('team').insert(input).select().single();
  return unwrap(await query);
}

export async function deleteTeamMember(member: TeamMember) {
  if (!supabase) {
    writeLocal(TEAM_KEY, readLocal<TeamMember[]>(TEAM_KEY, []).filter((m) => m.id !== member.id));
    return;
  }
  unwrap(await supabase.from('team').delete().eq('id', member.id));
  if (member.photo_path) await supabase.storage.from('team').remove([member.photo_path]);
}

/** Envia a foto (recortada em quadrado) e devolve o caminho para salvar + um link para mostrar já. */
export async function uploadTeamPhoto(file: File): Promise<{ path: string; url: string }> {
  const photo = await preparePhoto(file);
  if (!supabase) {
    const dataUrl = await fileToDataUrl(photo);
    return { path: dataUrl, url: dataUrl };
  }
  const path = `${crypto.randomUUID()}.webp`;
  unwrap(await supabase.storage.from('team').upload(path, photo, { contentType: 'image/webp' }));
  return { path, url: URL.createObjectURL(photo) };
}

// ---------------------------------------------------------------------------
// Pagamentos da equipe
// ---------------------------------------------------------------------------

export async function listTeamPayments(): Promise<TeamPayment[]> {
  if (!supabase) {
    return readLocal<TeamPayment[]>(TEAM_PAYMENTS_KEY, []).sort((a, b) => b.paid_on.localeCompare(a.paid_on));
  }
  return unwrap(
    await supabase.from('team_payments').select('*').order('paid_on', { ascending: false }).order('id', { ascending: false }),
  );
}

export async function addTeamPayment(input: TeamPaymentInput): Promise<TeamPayment> {
  if (!supabase) {
    const all = readLocal<TeamPayment[]>(TEAM_PAYMENTS_KEY, []);
    const saved = { ...input, id: nextId(all), created_at: new Date().toISOString() };
    writeLocal(TEAM_PAYMENTS_KEY, [...all, saved]);
    return saved;
  }
  return unwrap(await supabase.from('team_payments').insert(input).select().single());
}

export async function deleteTeamPayment(id: number) {
  if (!supabase) {
    writeLocal(TEAM_PAYMENTS_KEY, readLocal<TeamPayment[]>(TEAM_PAYMENTS_KEY, []).filter((p) => p.id !== id));
    return;
  }
  unwrap(await supabase.from('team_payments').delete().eq('id', id));
}

// ---------------------------------------------------------------------------
// Acessos (logins do painel)
// ---------------------------------------------------------------------------

/** O que o login atual pode ver. null = não tem acesso ao painel. */
export async function getMyAccess(userId: string): Promise<Access | null> {
  if (!supabase) return { name: 'Demo', role: 'admin', permissions: [], active: true };
  const { data } = await supabase
    .from('admins')
    .select('name, role, permissions, active')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data) return null;
  // Antes da atualização 03 a tabela só tinha user_id: quem estava nela era admin.
  return {
    name: data.name ?? '',
    role: data.role ?? 'admin',
    permissions: data.permissions ?? [],
    active: data.active ?? true,
  };
}

const notPublished =
  'A função "admin-users" ainda não está publicada no Supabase (Edge Functions). Veja o passo "Acessos" no README.';

/** Chama a Edge Function "admin-users" (a única que pode criar logins). */
async function usersFunction<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase!.functions.invoke('admin-users', { body });
  if (error) {
    // Quando a função responde, "context" é a resposta HTTP com { error: "mensagem" }.
    // Quando nem chega nela (não publicada, sem internet), "context" é outra coisa.
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      const body = await context.json().catch(() => null);
      if (context.status === 404 && body?.code === 'NOT_FOUND') throw new Error(notPublished);
      if (body?.error) throw new Error(body.error);
      if (body?.message) throw new Error(body.message);
    }
    if (/Failed to send|not found|404/i.test(error.message)) throw new Error(notPublished);
    throw new Error(error.message);
  }
  return data as T;
}

export async function listPanelUsers(): Promise<PanelUser[]> {
  if (!supabase) return readLocal<PanelUser[]>(USERS_KEY, []);
  return usersFunction<PanelUser[]>({ action: 'list' });
}

export async function savePanelUser(input: PanelUserInput, userId?: string) {
  if (!supabase) {
    const all = readLocal<PanelUser[]>(USERS_KEY, []);
    const { password: _password, ...fields } = input;
    if (userId) {
      writeLocal(USERS_KEY, all.map((u) => (u.user_id === userId ? { ...u, ...fields, email: u.email } : u)));
    } else {
      if (all.some((u) => u.email === input.email)) throw new Error('Já existe um login com esse e-mail.');
      writeLocal(USERS_KEY, [
        ...all,
        { ...fields, user_id: crypto.randomUUID(), last_sign_in_at: null, created_at: new Date().toISOString() },
      ]);
    }
    return;
  }
  await usersFunction(userId ? { action: 'update', user_id: userId, ...input } : { action: 'create', ...input });
}

export async function deletePanelUser(userId: string) {
  if (!supabase) {
    writeLocal(USERS_KEY, readLocal<PanelUser[]>(USERS_KEY, []).filter((u) => u.user_id !== userId));
    return;
  }
  await usersFunction({ action: 'delete', user_id: userId });
}

/** Cada pessoa pode trocar a própria senha. */
export async function changeMyPassword(password: string) {
  if (!supabase) return;
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(
      error.code === 'same_password' ? 'A nova senha precisa ser diferente da atual.' : `Não foi possível trocar: ${error.message}`,
    );
  }
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
