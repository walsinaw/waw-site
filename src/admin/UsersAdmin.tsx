import { useCallback, useEffect, useMemo, useState } from 'react';
import { listPanelUsers, listTeam, supabase, type TeamMemberWithPhoto } from '../lib/api';
import { areaLabels, roleLabels, type PanelUser } from '../lib/types';
import UserForm from './UserForm';

const lastAccess = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export default function UsersAdmin() {
  const [users, setUsers] = useState<PanelUser[] | null>(null);
  const [team, setTeam] = useState<TeamMemberWithPhoto[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PanelUser | 'new' | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [list, members] = await Promise.all([listPanelUsers(), listTeam().catch(() => [])]);
      setUsers(list.sort((a, b) => (a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'admin' ? -1 : 1)));
      setTeam(members);
    } catch (err) {
      setUsers([]);
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
    supabase?.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null));
  }, [load]);

  const memberOf = useMemo(() => {
    const members = new Map(team.map((m) => [m.id, m]));
    return (id: number | null) => (id == null ? undefined : members.get(id));
  }, [team]);

  const admins = users?.filter((u) => u.role === 'admin').length ?? 0;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Acessos</h1>
          <p className="page-subtitle">
            {users
              ? `${users.length} ${users.length === 1 ? 'login' : 'logins'} · ${admins} ${admins === 1 ? 'administrador' : 'administradores'}`
              : 'Quem pode entrar no painel'}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--red" onClick={() => setEditing('new')}>
            Criar Login
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="panel">
        {users === null ? (
          <p className="panel__empty">Carregando…</p>
        ) : users.length === 0 ? (
          <p className="panel__empty">Nenhum login para mostrar.</p>
        ) : (
          <ul className="cards">
            {users.map((user) => {
              const isMe = user.user_id === myId;
              const displayName = user.name || user.email.split('@')[0];
              const member = memberOf(user.team_id);
              return (
                <li
                  key={user.user_id}
                  className={`card card--person${user.active ? '' : ' card--off'}${user.role === 'admin' ? '' : ' card--team'}`}
                >
                  <div className="person">
                    <span className="person__photo">
                      {member?.photo_url ? <img src={member.photo_url} alt="" /> : displayName.charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <h3 className="card__title">
                        {displayName}
                        {isMe && <small className="card__me"> (você)</small>}
                      </h3>
                      <span className="card__tags card__tags--inline">
                        <span className="tag">{roleLabels[user.role]}</span>
                        {!user.active && <span className="tag tag--dark">Bloqueado</span>}
                      </span>
                    </span>
                  </div>
                  <p className="card__meta">{user.email}</p>
                  <p className="card__text">
                    <strong>Pode ver: </strong>
                    {user.role === 'admin'
                      ? 'tudo, inclusive Acessos'
                      : user.permissions.map((p) => areaLabels[p]).join(', ') || 'nenhuma área'}
                    {member && (
                      <>
                        <br />
                        <strong>Funcionário: </strong>
                        {member.name}
                      </>
                    )}
                  </p>
                  <div className="card__footer">
                    <span className="card__info">
                      {user.last_sign_in_at
                        ? `Último acesso ${lastAccess.format(new Date(user.last_sign_in_at))}`
                        : 'Nunca entrou'}
                    </span>
                    <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(user)}>
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
        <UserForm
          user={editing === 'new' ? null : editing}
          isMe={editing !== 'new' && editing.user_id === myId}
          team={team}
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
