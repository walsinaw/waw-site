alter table public.clients add column if not exists due_day smallint;

alter table public.clients drop constraint if exists clients_due_day_check;
alter table public.clients add constraint clients_due_day_check check (due_day between 1 and 31);

select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'clients' and column_name = 'due_day';
