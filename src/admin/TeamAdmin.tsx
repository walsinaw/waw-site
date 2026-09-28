import { useCallback, useEffect, useMemo, useState } from 'react';
import { listClients, listTeam, type TeamMemberWithPhoto } from '../lib/api';
import { contractLabels, specialties, type Client, type ContractType } from '../lib/types';
import TeamForm from './TeamForm';
import Filters from './Filters';
import { money, whatsappLink } from './format';

const valueSuffix: Record<ContractType, string> = { fixo: '/mês', freelancer: '/projeto', avulso: '' };

export default function TeamAdmin() {
  const [team, setTeam] = useState<TeamMemberWithPhoto[] | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<TeamMemberWithPhoto | 'new' | null>(null);
  const [contract, setContract] = useState('todos');
  const [area, setArea] = useState('todos');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [members, allClients] = await Promise.all([listTeam(), listClients()]);
      setTeam(members);
      setClients(allClients);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clientName = useMemo(() => {
    const names = new Map(clients.map((c) => [c.id, c.company || c.name]));
    return (id: number) => names.get(id);
  }, [clients]);

  const visible = useMemo(
    () =>
      (team ?? []).filter(
        (m) =>
          (contract === 'todos' || m.contract_type === contract) &&
          (area === 'todos' || m.areas.some((a) => a.toLowerCase() === area.toLowerCase())),
      ),
    [team, contract, area],
  );

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Funcionários</h1>
          <p className="page-subtitle">
            {team ? `${team.length} ${team.length === 1 ? 'pessoa' : 'pessoas'} na equipe` : 'Quem trabalha com a WAW'}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--red" onClick={() => setEditing('new')}>
            Cadastrar Funcionário
          </button>
          <Filters
            filters={[
              {
                label: 'Tipo',
                value: contract,
                onChange: setContract,
                options: [['todos', 'Todos'], ...(Object.entries(contractLabels) as [string, string][])],
              },
              {
                label: 'Área',
                value: area,
                onChange: setArea,
                options: [['todos', 'Todas'], ...specialties.map((s): [string, string] => [s, s])],
              },
            ]}
          />
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="panel">
        {team === null ? (
          <p className="panel__empty">Carregando…</p>
        ) : visible.length === 0 ? (
          <p className="panel__empty">
            {team.length === 0 ? 'Ninguém cadastrado ainda. Clique em “Cadastrar Funcionário”.' : 'Ninguém com esses filtros.'}
          </p>
        ) : (
          <ul className="cards">
            {visible.map((member) => {
              const projects = member.client_ids.map(clientName).filter(Boolean);
              return (
                <li key={member.id} className="card card--person">
                  <div className="person">
                    <span className="person__photo">
                      {member.photo_url ? <img src={member.photo_url} alt="" /> : member.name.charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <h3 className="card__title">{member.name}</h3>
                      <span className="tag">{contractLabels[member.contract_type]}</span>
                    </span>
                  </div>
                  <p className="card__meta">{member.areas.join(' · ') || 'Sem área definida'}</p>
                  <p className="card__text">
                    {projects.length > 0 ? (
                      <>
                        <strong>Projetos: </strong>
                        {projects.join(', ')}
                      </>
                    ) : (
                      'Sem projetos vinculados.'
                    )}
                  </p>
                  <div className="card__footer">
                    <span className="card__info">
                      {member.agreed_value != null
                        ? `${money.format(member.agreed_value)}${valueSuffix[member.contract_type]}`
                        : 'Valor a combinar'}
                    </span>
                    {member.phone && (
                      <a
                        href={whatsappLink(member.phone)}
                        target="_blank"
                        rel="noreferrer"
                        className="card__icon"
                        aria-label={`WhatsApp de ${member.name}`}
                        title={member.phone}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1l-2.2 2.2Z" />
                        </svg>
                      </a>
                    )}
                    <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(member)}>
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
        <TeamForm
          member={editing === 'new' ? null : editing}
          clients={clients}
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
