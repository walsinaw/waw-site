alter table public.admins add column if not exists name text not null default '';
alter table public.admins add column if not exists role text not null default 'admin';
alter table public.admins add column if not exists permissions text[] not null default '{}';
alter table public.admins add column if not exists active boolean not null default true;
alter table public.admins add column if not exists team_id bigint references public.team (id) on delete set null;

alter table public.admins alter column role set default 'equipe';

alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check check (role in ('admin', 'equipe'));
alter table public.admins drop constraint if exists admins_permissions_check;
alter table public.admins add constraint admins_permissions_check
  check (permissions <@ array['dashboard', 'portfolio', 'clientes', 'funcionarios']::text[]);

create index if not exists admins_team_idx on public.admins (team_id);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where user_id = (select auth.uid()) and active and role = 'admin'
  );
$$;

create or replace function private.can(area text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where user_id = (select auth.uid()) and active and (role = 'admin' or area = any (permissions))
  );
$$;

revoke execute on function private.can(text) from public, anon;
grant execute on function private.can(text) to authenticated;

drop policy if exists "logado vê publicados, admin vê todos" on public.projects;
create policy "logado vê publicados, admin vê todos" on public.projects
  for select to authenticated
  using (published or (select private.can('portfolio')));

drop policy if exists "admin cria projetos" on public.projects;
create policy "admin cria projetos" on public.projects
  for insert to authenticated
  with check ((select private.can('portfolio')));

drop policy if exists "admin edita projetos" on public.projects;
create policy "admin edita projetos" on public.projects
  for update to authenticated
  using ((select private.can('portfolio')))
  with check ((select private.can('portfolio')));

drop policy if exists "admin apaga projetos" on public.projects;
create policy "admin apaga projetos" on public.projects
  for delete to authenticated
  using ((select private.can('portfolio')));

drop policy if exists "admin vê clientes" on public.clients;
create policy "admin vê clientes" on public.clients
  for select to authenticated
  using ((select private.can('clientes')));

drop policy if exists "admin cria clientes" on public.clients;
create policy "admin cria clientes" on public.clients
  for insert to authenticated
  with check ((select private.can('clientes')));

drop policy if exists "admin edita clientes" on public.clients;
create policy "admin edita clientes" on public.clients
  for update to authenticated
  using ((select private.can('clientes')))
  with check ((select private.can('clientes')));

drop policy if exists "admin apaga clientes" on public.clients;
create policy "admin apaga clientes" on public.clients
  for delete to authenticated
  using ((select private.can('clientes')));

drop policy if exists "admin gerencia equipe" on public.team;
create policy "admin gerencia equipe" on public.team
  for all to authenticated
  using ((select private.can('funcionarios')))
  with check ((select private.can('funcionarios')));

drop policy if exists "admin envia imagens" on storage.objects;
create policy "admin envia imagens" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and (select private.can('portfolio')));

drop policy if exists "admin substitui imagens" on storage.objects;
create policy "admin substitui imagens" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and (select private.can('portfolio')));

drop policy if exists "admin apaga imagens" on storage.objects;
create policy "admin apaga imagens" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and (select private.can('portfolio')));

drop policy if exists "admin vê fotos da equipe" on storage.objects;
create policy "admin vê fotos da equipe" on storage.objects
  for select to authenticated
  using (bucket_id = 'team' and (select private.can('funcionarios')));

drop policy if exists "admin envia fotos da equipe" on storage.objects;
create policy "admin envia fotos da equipe" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'team' and (select private.can('funcionarios')));

drop policy if exists "admin troca fotos da equipe" on storage.objects;
create policy "admin troca fotos da equipe" on storage.objects
  for update to authenticated
  using (bucket_id = 'team' and (select private.can('funcionarios')));

drop policy if exists "admin apaga fotos da equipe" on storage.objects;
create policy "admin apaga fotos da equipe" on storage.objects
  for delete to authenticated
  using (bucket_id = 'team' and (select private.can('funcionarios')));

create table if not exists public.team_payments (
  id bigint generated always as identity primary key,
  member_id bigint not null references public.team (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  paid_on date not null default current_date,
  reference text not null default '' check (char_length(reference) <= 120),  
  client_id bigint references public.clients (id) on delete set null,       
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);

create index if not exists team_payments_member_idx on public.team_payments (member_id, paid_on desc);
create index if not exists team_payments_client_idx on public.team_payments (client_id);

alter table public.team_payments enable row level security;

grant select, insert, update, delete on public.team_payments to authenticated;

drop policy if exists "equipe: pagamentos" on public.team_payments;
create policy "equipe: pagamentos" on public.team_payments
  for all to authenticated
  using ((select private.can('funcionarios')))
  with check ((select private.can('funcionarios')));

select u.email, a.role, a.active from public.admins a join auth.users u on u.id = a.user_id;
