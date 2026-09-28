import { useCallback, useEffect, useMemo, useState } from 'react';
import { listClients } from '../lib/api';
import { clientStatuses, statusLabels, type Client, type ClientStatus } from '../lib/types';
import ClientForm from './ClientForm';
import Filters from './Filters';
import { clientValue, money, shortDate, whatsappLink } from './format';
import { billing, billingLabels, dayMonth } from './charges';

export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [editing, setEditing] = useState<Client | 'new' | null>(null);
  const [status, setStatus] = useState<ClientStatus | 'todos'>('todos');
  const [origin, setOrigin] = useState('todos');
  const [payment, setPayment] = useState('todos');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setClients(await listClients());
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (clients ?? []).filter(
      (c) =>
        (status === 'todos' || c.status === status) &&
        (origin === 'todos' || c.source === origin) &&
        (payment === 'todos' || billing(c).status === payment) &&
        (!term || [c.name, c.company, c.city, c.email, c.whatsapp].some((v) => v.toLowerCase().includes(term))),
    );
  }, [clients, status, origin, payment, search]);

  const leads = clients?.filter((c) => c.status === 'lead').length ?? 0;
  const late = clients?.filter((c) => billing(c).status === 'atrasado').length ?? 0;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">
            {clients
              ? `${clients.length} no total · ${leads} ${leads === 1 ? 'lead novo' : 'leads novos'}${late ? ` · ${late} com pagamento atrasado` : ''}`
              : 'Visão total dos clientes'}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--red" onClick={() => setEditing('new')}>
            Cadastrar Cliente
          </button>
          <Filters
            filters={[
              {
                label: 'Status',
                value: status,
                onChange: (value) => setStatus(value as ClientStatus | 'todos'),
                options: [['todos', 'Todos'], ...clientStatuses.map((s): [string, string] => [s, statusLabels[s]])],
              },
              {
                label: 'Origem',
                value: origin,
                onChange: setOrigin,
                options: [
                  ['todos', 'Todos'],
                  ['site', 'Formulário do site'],
                  ['manual', 'Cadastro manual'],
                ],
              },
              {
                label: 'Pagamento',
                value: payment,
                onChange: setPayment,
                options: [['todos', 'Todos'], ...(Object.entries(billingLabels) as [string, string][])],
              },
            ]}
          >
            <input
              className="filters__search"
              type="search"
              placeholder="Buscar…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar cliente"
            />
          </Filters>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="panel">
        {clients === null ? (
          <p className="panel__empty">Carregando…</p>
        ) : visible.length === 0 ? (
          <p className="panel__empty">
            {clients.length === 0 ? 'Nenhum cliente ainda. Os pedidos do site vão aparecer aqui.' : 'Nada encontrado.'}
          </p>
        ) : (
          <ul className="cards">
            {visible.map((client) => {
              const bill = billing(client);
              return (
                <li key={client.id} className={`card card--${client.status}`}>
                  <span className="card__tags card__tags--top">
                    <span className={`tag tag--${client.status}`}>{statusLabels[client.status]}</span>
                    {client.source === 'site' && <span className="tag tag--dark">via site</span>}
                  </span>
                  <h3 className="card__title">{client.name}</h3>
                  <p className="card__meta">{[client.company, client.city].filter(Boolean).join(' · ') || '—'}</p>
                  <p className="card__text">
                    {client.services.length > 0 && <strong>{client.services.join(', ')}. </strong>}
                    {client.notes || 'Sem anotações.'}
                  </p>
                  {bill.status !== 'sem' && (
                    <p className={`card__pay card__pay--${bill.status}`}>
                      {bill.status === 'atrasado'
                        ? `Atrasado: ${money.format(bill.overdueTotal)} desde ${dayMonth.format(new Date(bill.overdue[0].due!))}`
                        : bill.status === 'aberto'
                          ? `A receber: ${money.format(bill.owed)}${bill.open[0].due ? ` até ${dayMonth.format(new Date(bill.open[0].due))}` : ''}`
                          : `Em dia${bill.lastPaid?.paid_on ? ` · pago em ${dayMonth.format(new Date(bill.lastPaid.paid_on))}` : ''}`}
                    </p>
                  )}
                  <div className="card__footer">
                    <span className="card__info">
                      {clientValue(client.value, client.value_type) ?? shortDate.format(new Date(client.created_at))}
                    </span>
                    {client.whatsapp && (
                      <a
                        href={whatsappLink(client.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="card__icon"
                        aria-label={`WhatsApp de ${client.name}`}
                        title={client.whatsapp}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
                        </svg>
                      </a>
                    )}
                    <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(client)}>
                      Editar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {editing && (
        <ClientForm
          client={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </section>
  );
}
