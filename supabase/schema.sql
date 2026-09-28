-- WAW Studio — banco do site e do painel /admin
-- Rode este arquivo inteiro no Supabase: Dashboard → SQL Editor → New query → colar → Run.
-- Pode rodar de novo sem problema (não duplica nada).
-- DEPOIS rode também supabase/02-equipe-e-pagamentos.sql.
-- ANTES: crie seu usuário em Authentication → Users → Add user (com o e-mail do final deste arquivo).

-- ---------------------------------------------------------------
-- Admins: só quem estiver nesta tabela acessa o painel.
-- ---------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "admins leem a própria linha" on public.admins;
create policy "admins leem a própria linha" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------
-- Portfólio
-- ---------------------------------------------------------------
create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 120),
  categories text not null default '',          -- ex.: "Landing Page · Desenvolvimento Web · UX/UI"
  description text not null default '',
  cover_url text,
  link_type text not null default 'none' check (link_type in ('behance', 'site', 'none')),
  link_url text,
  featured boolean not null default true,        -- aparece na home
  published boolean not null default true,
  position integer not null default 0,           -- ordem de exibição
  created_at timestamptz not null default now()
);

create index if not exists projects_order_idx on public.projects (published, position);

alter table public.projects enable row level security;

grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;

-- Visitante (anon) não pode chamar private.is_admin(): por isso a política dele é separada.
drop policy if exists "público vê projetos publicados" on public.projects;
drop policy if exists "visitante vê projetos publicados" on public.projects;
create policy "visitante vê projetos publicados" on public.projects
  for select to anon
  using (published);

drop policy if exists "logado vê publicados, admin vê todos" on public.projects;
create policy "logado vê publicados, admin vê todos" on public.projects
  for select to authenticated
  using (published or (select private.is_admin()));

drop policy if exists "admin cria projetos" on public.projects;
create policy "admin cria projetos" on public.projects
  for insert to authenticated
  with check ((select private.is_admin()));

drop policy if exists "admin edita projetos" on public.projects;
create policy "admin edita projetos" on public.projects
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "admin apaga projetos" on public.projects;
create policy "admin apaga projetos" on public.projects
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------
-- Clientes / leads
-- ---------------------------------------------------------------
create table if not exists public.clients (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  company text not null default '' check (char_length(company) <= 120),
  city text not null default '' check (char_length(city) <= 80),
  whatsapp text not null default '' check (char_length(whatsapp) <= 30),
  email text not null default '' check (char_length(email) <= 160),
  instagram text not null default '' check (char_length(instagram) <= 80),
  services text[] not null default '{}' check (cardinality(services) <= 10),
  status text not null default 'lead'
    check (status in ('lead', 'proposta', 'ativo', 'concluido', 'pausado')),
  value numeric(12, 2),
  start_date date,
  notes text not null default '' check (char_length(notes) <= 5000),
  source text not null default 'manual' check (source in ('site', 'manual')),
  created_at timestamptz not null default now()
);

create index if not exists clients_status_idx on public.clients (status, created_at desc);

alter table public.clients enable row level security;

grant insert on public.clients to anon;
grant select, insert, update, delete on public.clients to authenticated;

-- O formulário do site pode só CRIAR leads (não lê nada).
drop policy if exists "site cria leads" on public.clients;
create policy "site cria leads" on public.clients
  for insert to anon, authenticated
  with check (
    source = 'site'
    and status = 'lead'
    and value is null
    and start_date is null
  );

drop policy if exists "admin vê clientes" on public.clients;
create policy "admin vê clientes" on public.clients
  for select to authenticated
  using ((select private.is_admin()));

drop policy if exists "admin cria clientes" on public.clients;
create policy "admin cria clientes" on public.clients
  for insert to authenticated
  with check ((select private.is_admin()));

drop policy if exists "admin edita clientes" on public.clients;
create policy "admin edita clientes" on public.clients
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

drop policy if exists "admin apaga clientes" on public.clients;
create policy "admin apaga clientes" on public.clients
  for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------
-- Imagens do portfólio (Storage)
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists "admin envia imagens" on storage.objects;
create policy "admin envia imagens" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and (select private.is_admin()));

drop policy if exists "admin substitui imagens" on storage.objects;
create policy "admin substitui imagens" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and (select private.is_admin()));

drop policy if exists "admin apaga imagens" on storage.objects;
create policy "admin apaga imagens" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and (select private.is_admin()));

-- ---------------------------------------------------------------
-- Projetos iniciais (pode apagar/editar pelo painel depois)
-- ---------------------------------------------------------------
insert into public.projects (title, categories, description, position)
select * from (values
  ('Dandala Sousa', 'Landing Page · Desenvolvimento Web · UX/UI',
   'Uma presença digital construída para comunicar acolhimento, profissionalismo e proximidade.', 1),
  ('Dream Tech', 'Web Design · Desenvolvimento · Identidade Digital',
   'Uma experiência digital para apresentar tecnologia de forma sofisticada e acessível.', 2),
  ('WAW Informática', 'Social Media · Design · Estratégia',
   'Uma comunicação mais clara e atual para aproximar tecnologia das pessoas.', 3),
  ('Marquesa', 'Design', '', 4)
) as seed (title, categories, description, position)
where not exists (select 1 from public.projects);

-- ---------------------------------------------------------------
-- Libera você como admin (o usuário precisa já existir em Authentication → Users)
-- ---------------------------------------------------------------
insert into public.admins (user_id)
select id from auth.users where email = 'juliawalsinaw@gmail.com'
on conflict (user_id) do nothing;

-- Confere: tem que aparecer 1 linha com o seu e-mail. Se vier vazio, crie o usuário e rode de novo.
select u.email as admin from public.admins a join auth.users u on u.id = a.user_id;
