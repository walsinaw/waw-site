// Edge Function "admin-users": cria e gerencia os logins do painel.
// Roda no servidor do Supabase, onde a chave secreta (service_role) fica guardada —
// ela nunca vai para o site. Só administradores ativos conseguem usar.
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const AREAS = ['dashboard', 'portfolio', 'clientes', 'funcionarios'];
const BLOCKED = '876000h'; // ~100 anos: login bloqueado até ser liberado de novo

interface Payload {
  action?: string;
  user_id?: string;
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  permissions?: unknown;
  team_id?: unknown;
  active?: boolean;
}

function cleanFields(input: Payload) {
  const role = input.role === 'admin' ? 'admin' : 'equipe';
  return {
    name: String(input.name ?? '').trim().slice(0, 120),
    role,
    permissions:
      role === 'admin' || !Array.isArray(input.permissions)
        ? []
        : input.permissions.filter((p): p is string => typeof p === 'string' && AREAS.includes(p)),
    team_id: Number.isInteger(input.team_id) ? (input.team_id as number) : null,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Quem está pedindo? Precisa ser um administrador ativo.
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const {
    data: { user },
    error: userError,
  } = await service.auth.getUser(token);
  if (userError || !user) return json({ error: 'Sua sessão expirou. Entre de novo.' }, 401);

  const { data: me } = await service.from('admins').select('role, active').eq('user_id', user.id).maybeSingle();
  if (!me || !me.active || me.role !== 'admin') {
    return json({ error: 'Só administradores podem gerenciar logins.' }, 403);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Pedido inválido.' }, 400);
  }

  try {
    switch (body.action) {
      case 'list': {
        const { data: rows, error } = await service.from('admins').select('*');
        if (error) throw error;
        const { data: list, error: listError } = await service.auth.admin.listUsers({ perPage: 1000 });
        if (listError) throw listError;
        const users = new Map(list.users.map((u) => [u.id, u]));
        return json(
          rows.map((row) => ({
            ...row,
            email: users.get(row.user_id)?.email ?? '(login removido)',
            last_sign_in_at: users.get(row.user_id)?.last_sign_in_at ?? null,
          })),
        );
      }

      case 'create': {
        const email = String(body.email ?? '').trim().toLowerCase();
        const password = String(body.password ?? '');
        if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'E-mail inválido.' }, 400);
        if (password.length < 8) return json({ error: 'A senha precisa ter pelo menos 8 caracteres.' }, 400);

        const fields = cleanFields(body);
        const { data, error } = await service.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: fields.name },
        });
        if (error) {
          const taken = /already|registered|exists/i.test(error.message);
          return json({ error: taken ? 'Já existe um login com esse e-mail.' : error.message }, 400);
        }

        const { error: insertError } = await service
          .from('admins')
          .insert({ user_id: data.user.id, ...fields, active: true });
        if (insertError) {
          // Não deixa um login "solto" sem permissões.
          await service.auth.admin.deleteUser(data.user.id);
          throw insertError;
        }
        return json({ ok: true });
      }

      case 'update': {
        const id = String(body.user_id ?? '');
        const fields = cleanFields(body);
        const active = body.active !== false;
        if (id === user.id && (fields.role !== 'admin' || !active)) {
          return json({ error: 'Você não pode tirar o seu próprio acesso de administrador.' }, 400);
        }
        if (body.password && body.password.length < 8) {
          return json({ error: 'A nova senha precisa ter pelo menos 8 caracteres.' }, 400);
        }

        const { error } = await service.from('admins').update({ ...fields, active }).eq('user_id', id);
        if (error) throw error;

        const { error: authError } = await service.auth.admin.updateUserById(id, {
          ban_duration: active ? 'none' : BLOCKED,
          ...(body.password ? { password: body.password } : {}),
          user_metadata: { name: fields.name },
        });
        if (authError) throw authError;
        return json({ ok: true });
      }

      case 'delete': {
        const id = String(body.user_id ?? '');
        if (id === user.id) return json({ error: 'Você não pode excluir o seu próprio login.' }, 400);
        // A linha em "admins" some junto (on delete cascade).
        const { error } = await service.auth.admin.deleteUser(id);
        if (error) throw error;
        return json({ ok: true });
      }

      default:
        return json({ error: 'Ação desconhecida.' }, 400);
    }
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Erro inesperado.' }, 500);
  }
});
