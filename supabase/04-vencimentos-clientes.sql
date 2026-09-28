-- WAW Studio — atualização 04: data limite de pagamento dos clientes.
-- Rode DEPOIS do 03: Dashboard → SQL Editor → New query → colar → Run. Pode rodar de novo.
--
-- As cobranças de cada cliente continuam na coluna "extra_payments" (lista em JSON),
-- agora com vencimento ("date") e data em que o cliente pagou ("paid_on").
-- Aqui só entra o dia do vencimento da mensalidade (clientes com valor mensal).

alter table public.clients add column if not exists due_day smallint;

alter table public.clients drop constraint if exists clients_due_day_check;
alter table public.clients add constraint clients_due_day_check check (due_day between 1 and 31);

-- Conferência: deve aparecer a coluna due_day.
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'clients' and column_name = 'due_day';
