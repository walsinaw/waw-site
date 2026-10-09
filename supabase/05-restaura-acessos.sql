-- WAW Studio — 05: restaura as regras de acesso por área

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
drop policy if exists "equipe: pagamentos" on public.team_payments;
create policy "equipe: pagamentos" on public.team_payments
  for all to authenticated
  using ((select private.can('funcionarios')))
  with check ((select private.can('funcionarios')));

-- Conferência
select tablename, policyname, coalesce(qual, with_check) as regra
from pg_policies
where (schemaname = 'public' and tablename in ('projects', 'clients', 'team', 'team_payments'))
   or (schemaname = 'storage' and tablename = 'objects')
order by tablename, policyname;
