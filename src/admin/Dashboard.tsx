import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listClients, listProjects } from '../lib/api';
import { clientStatuses, statusLabels, type Client, type Project } from '../lib/types';
import { money, whatsappLink } from './format';

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
  const inProgress = clients?.filter((c) => c.status === 'ativo').reduce((sum, c) => sum + (c.value ?? 0), 0) ?? 0;
  const leads = clients?.filter((c) => c.status === 'lead').slice(0, 5) ?? [];

  const stats = [
    { label: 'Novos leads', value: count('lead'), to: '/admin/clientes' },
    { label: 'Em andamento', value: count('ativo'), to: '/admin/clientes' },
    { label: 'Projetos publicados', value: projects?.filter((p) => p.published).length ?? 0, to: '/admin/portfolio' },
    { label: 'Valor em andamento', value: money.format(inProgress), to: '/admin/clientes' },
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
                          <a href={whatsappLink(lead.whatsapp)} target="_blank" rel="noreferrer" className="btn btn--red btn--sm">
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
            </div>
          </>
        )}
      </div>
    </section>
  );
}
