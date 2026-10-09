alter table public.projects drop constraint if exists projects_link_type_check;
alter table public.projects add constraint projects_link_type_check
  check (link_type in ('behance', 'site', 'instagram', 'none'));

alter table public.clients add column if not exists document text not null default '';
alter table public.clients add column if not exists value_type text not null default 'fixo';
alter table public.clients add column if not exists extra_payments jsonb not null default '[]'::jsonb;

alter table public.clients drop constraint if exists clients_document_check;
alter table public.clients add constraint clients_document_check check (char_length(document) <= 20);
alter table public.clients drop constraint if exists clients_value_type_check;
alter table public.clients add constraint clients_value_type_check check (value_type in ('fixo', 'mensal'));
alter table public.clients drop constraint if exists clients_extra_payments_check;
alter table public.clients add constraint clients_extra_payments_check
  check (jsonb_typeof(extra_payments) = 'array' and jsonb_array_length(extra_payments) <= 100);

drop policy if exists "site cria leads" on public.clients;
create policy "site cria leads" on public.clients
  for insert to anon, authenticated
  with check (
    source = 'site'
    and status = 'lead'
    and value is null
    and start_date is null
    and document = ''
    and extra_payments = '[]'::jsonb
  );

create table if not exists public.team (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  phone text not null default '' check (char_length(phone) <= 30),
  photo_path text,                                   
  areas text[] not null default '{}' check (cardinality(areas) <= 20),
  contract_type text not null default 'freelancer'
    check (contract_type in ('fixo', 'freelancer', 'avulso')),
  agreed_value numeric(12, 2),
  client_ids bigint[] not null default '{}',         
  notes text not null default '' check (char_length(notes) <= 5000),
  created_at timestamptz not null default now()
);

alter table public.team enable row level security;

grant select, insert, update, delete on public.team to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team', 'team', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Quem pode ver/editar funcionários e as fotos deles.
-- Se a atualização 03 (logins com áreas) já foi rodada, usa a regra por área ("funcionarios");
-- assim, rodar este arquivo de novo não tira o acesso dos logins de equipe.
do $$
declare
  rule text := case
    when to_regprocedure('private.can(text)') is null then '(select private.is_admin())'
    else '(select private.can(''funcionarios''))'
  end;
begin
  drop policy if exists "admin gerencia equipe" on public.team;
  execute format(
    'create policy "admin gerencia equipe" on public.team for all to authenticated using (%s) with check (%s)',
    rule, rule);

  drop policy if exists "admin vê fotos da equipe" on storage.objects;
  execute format(
    'create policy "admin vê fotos da equipe" on storage.objects for select to authenticated using (bucket_id = ''team'' and %s)',
    rule);

  drop policy if exists "admin envia fotos da equipe" on storage.objects;
  execute format(
    'create policy "admin envia fotos da equipe" on storage.objects for insert to authenticated with check (bucket_id = ''team'' and %s)',
    rule);

  drop policy if exists "admin troca fotos da equipe" on storage.objects;
  execute format(
    'create policy "admin troca fotos da equipe" on storage.objects for update to authenticated using (bucket_id = ''team'' and %s)',
    rule);

  drop policy if exists "admin apaga fotos da equipe" on storage.objects;
  execute format(
    'create policy "admin apaga fotos da equipe" on storage.objects for delete to authenticated using (bucket_id = ''team'' and %s)',
    rule);
end $$;

select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'clients' and column_name in ('document', 'value_type', 'extra_payments')
union all
select 'tabela team ok' where exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team');
