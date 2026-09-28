import { useCallback, useEffect, useMemo, useState } from 'react';
import { listClients, saveClient } from '../lib/api';
import { clientStatuses, statusLabels, type Client, type ClientStatus } from '../lib/types';
import ClientForm from './ClientForm';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

/** Link do WhatsApp: adiciona o 55 do Brasil quando o número vem só com DDD. */
function whatsappLink(value: string) {
  const digits = value.replace(/\D/g, '');
  return `https://wa.me/${digits.length > 11 ? digits : `55${digits}`}`;
}

export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [editing, setEditing] = useState<Client | 'new' | null>(null);
  const [status, setStatus] = useState<ClientStatus | 'todos'>('todos');
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

  const counts = useMemo(() => {
    const result = Object.fromEntries(clientStatuses.map((s) => [s, 0])) as Record<ClientStatus, number>;
    clients?.forEach((c) => (result[c.status] += 1));
    return result;
  }, [clients]);

  const activeValue = useMemo(
    () => clients?.filter((c) => c.status === 'ativo').reduce((sum, c) => sum + (c.value ?? 0), 0) ?? 0,
    [clients],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (clients ?? []).filter(
      (c) =>
        (status === 'todos' || c.status === status) &&
        (!term || [c.name, c.company, c.city, c.email, c.whatsapp].some((v) => v.toLowerCase().includes(term))),
    );
  }, [clients, status, search]);

  const changeStatus = async (client: Client, next: ClientStatus) => {
    setError('');
    const { id, created_at: _createdAt, ...input } = client;
    try {
      await saveClient({ ...input, status: next }, id);
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Clientes</h1>
          <p className="admin-muted">
            Quem preenche o formulário do site aparece aqui como <strong>Lead</strong>.
            {activeValue > 0 && <> Em andamento: {money.format(activeValue)}.</>}
          </p>
        </div>
        <button type="button" className="admin-button admin-button--primary" onClick={() => setEditing('new')}>
          + Novo cliente
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-chips" role="tablist" aria-label="Filtrar por status">
          <button
            type="button"
            className={status === 'todos' ? 'is-active' : ''}
            onClick={() => setStatus('todos')}
          >
            Todos <span>{clients?.length ?? 0}</span>
          </button>
          {clientStatuses.map((s) => (
            <button
              key={s}
              type="button"
              className={`${status === s ? 'is-active' : ''} status--${s}`}
              onClick={() => setStatus(s)}
            >
              {statusLabels[s]} <span>{counts[s]}</span>
            </button>
          ))}
        </div>
        <input
          className="admin-search"
          type="search"
          placeholder="Buscar nome, empresa, cidade…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="admin-error">{error}</p>}

      {clients === null ? (
        <p className="admin-muted">Carregando…</p>
      ) : visible.length === 0 ? (
        <p className="admin-empty">
          {clients.length === 0 ? 'Nenhum cliente ainda. Os pedidos do site vão aparecer aqui.' : 'Nada encontrado.'}
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Serviços</th>
                <th>Status</th>
                <th className="admin-table__num">Valor</th>
                <th>Entrada</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((client) => (
                <tr key={client.id} onClick={() => setEditing(client)}>
                  <td>
                    <strong>{client.name}</strong>
                    <span className="admin-muted">
                      {[client.company, client.city].filter(Boolean).join(' · ') || '—'}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {client.whatsapp && (
                      <a
                        className="admin-link"
                        href={whatsappLink(client.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {client.whatsapp}
                      </a>
                    )}
                    {client.email && (
                      <a className="admin-link admin-muted" href={`mailto:${client.email}`}>
                        {client.email}
                      </a>
                    )}
                  </td>
                  <td>{client.services.join(', ') || '—'}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`admin-status status--${client.status}`}
                      value={client.status}
                      onChange={(e) => changeStatus(client, e.target.value as ClientStatus)}
                      aria-label={`Status de ${client.name}`}
                    >
                      {clientStatuses.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="admin-table__num">{client.value != null ? money.format(client.value) : '—'}</td>
                  <td>
                    {date.format(new Date(client.created_at))}
                    {client.source === 'site' && <span className="admin-pill">site</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
