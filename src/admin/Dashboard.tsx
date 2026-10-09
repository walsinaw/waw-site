import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listClients, listProjects } from '../lib/api';
import { clientStatuses, statusLabels, type Client, type Project } from '../lib/types';
import { money, whatsappLink } from './format';
import { clientCharges, dayMonth } from './charges';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listProjects(), listClients()])
      .then(([p, c]) => {
        setProjects(p);
        setClients(c);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const loading = projects === null || clients === null;
  const count = (status: Client['status']) => clients?.filter((c) => c.status === status).length ?? 0;
  const monthly =
    clients
      ?.filter((c) => c.status === 'ativo' && c.value_type === 'mensal')
      .reduce((sum, c) => sum + (c.value ?? 0), 0) ?? 0;
  const leads = clients?.filter((c) => c.status === 'lead').slice(0, 5) ?? [];
  const pending = (clients ?? [])
    .flatMap((client) =>
      clientCharges(client)
        .filter((charge) => charge.state !== 'pago')
        .map((charge) => ({ client, charge })),
    )
    .sort(
      (a, b) =>
        Number(b.charge.state === 'atrasado') - Number(a.charge.state === 'atrasado') ||
        (a.charge.due ?? '9999').localeCompare(b.charge.due ?? '9999'),
    );
  const overdueTotal = pending
    .filter((p) => p.charge.state === 'atrasado')
    .reduce((sum, p) => sum + (p.charge.value || 0), 0);

  const stats = [
    { label: 'Novos leads', value: count('lead'), to: '/admin/clientes' },
    { label: 'Em andamento', value: count('ativo'), to: '/admin/clientes' },
    { label: 'Projetos publicados', value: projects?.filter((p) => p.published).length ?? 0, to: '/admin/portfolio' },
    { label: 'Recorrente por mês', value: money.format(monthly), to: '/admin/clientes' },
  ];

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral do estúdio</p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="panel">
        {loading ? (
          <p className="panel__empty">Carregando…</p>
        ) : (
          <>
            <div className="stats">
              {stats.map((stat) => (
                <Link key={stat.label} to={stat.to} className="stat">
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                </Link>
              ))}
            </div>

            <div className="dash-grid">
              <div className="dash-box">
                <h2 className="dash-box__title">
                  Leads <em>recentes</em>
                </h2>
                {leads.length === 0 ? (
                  <p className="panel__empty">Nenhum lead novo. Os pedidos do site aparecem aqui.</p>
                ) : (
                  <ul className="dash-list">
                    {leads.map((lead) => (
                      <li key={lead.id}>
                        <span>
                          <strong>{lead.name}</strong>
                          <small>{[lead.company, lead.city].filter(Boolean).join(' · ') || '—'}</small>
                        </span>
                        {lead.whatsapp && (
                          <a
                            href={whatsappLink(lead.whatsapp)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn--red btn--sm"
                          >
                            WhatsApp
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="dash-box">
                <h2 className="dash-box__title">
                  Funil de <em>clientes</em>
                </h2>
                <ul className="funnel">
                  {clientStatuses.map((status) => {
                    const total = count(status);
                    const width = clients!.length ? (total / clients!.length) * 100 : 0;
                    return (
                      <li key={status}>
                        <span className="funnel__label">{statusLabels[status]}</span>
                        <span className="funnel__bar">
                          <span style={{ width: `${width}%` }} />
                        </span>
                        <span className="funnel__count">{total}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="dash-box dash-box--full">
                <h2 className="dash-box__title">
                  Pagamentos <em>pendentes</em>
                </h2>
                {pending.length === 0 ? (
                  <p className="panel__empty">Nenhuma cobrança em aberto.</p>
                ) : (
                  <>
                    {overdueTotal > 0 && <p className="dash-box__note">{money.format(overdueTotal)} em atraso</p>}
                    <ul className="dash-list">
                      {pending.slice(0, 8).map(({ client, charge }, index) => (
                        <li key={`${client.id}-${index}`}>
                          <span>
                            <strong>{client.company || client.name}</strong>
                            <small>{charge.description}</small>
                          </span>
                          <span className={`dash-due dash-due--${charge.state}`}>
                            <strong>{money.format(charge.value || 0)}</strong>
                            <small>
                              {charge.due
                                ? `${charge.state === 'atrasado' ? 'venceu' : 'vence'} ${dayMonth.format(new Date(charge.due))}`
                                : 'sem vencimento'}
                            </small>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {pending.length > 8 && (
                      <Link to="/admin/clientes" className="text-btn">
                        Ver todos os {pending.length}
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
