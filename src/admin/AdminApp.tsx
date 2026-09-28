import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { getMyAccess, isDemo, signOut, supabase } from '../lib/api';
import { areaLabels, roleLabels, type Access, type Area } from '../lib/types';
import Logo from '../components/Logo';
import Login from './Login';
import Dashboard from './Dashboard';
import ProjectsAdmin from './ProjectsAdmin';
import ClientsAdmin from './ClientsAdmin';
import TeamAdmin from './TeamAdmin';
import UsersAdmin from './UsersAdmin';
import PasswordForm from './PasswordForm';
import './admin.css';

type AuthState = 'loading' | 'signed-out' | 'not-admin' | 'blocked' | 'ready';

const icons: Record<Area | 'users' | 'site', ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />
    </svg>
  ),
  portfolio: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2Z" />
    </svg>
  ),
  clientes: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5Z" />
    </svg>
  ),
  funcionarios: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 13c-3.3 0-7 1.6-7 4.5V20h14v-2.5C16 14.6 12.3 13 9 13Zm8 0c-.5 0-1 0-1.6.1 1.6 1.1 2.6 2.6 2.6 4.4V20h4v-2.5c0-2.9-2.7-4.5-5-4.5Z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 12.2c-2 0-3.8-1-4.9-2.6.1-1.6 3.3-2.5 4.9-2.5s4.8.9 4.9 2.5A5.9 5.9 0 0 1 12 19.2Z" />
    </svg>
  ),
  site: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  ),
};

const routes: { area: Area; path: string; element: ReactNode }[] = [
  { area: 'dashboard', path: 'dashboard', element: <Dashboard /> },
  { area: 'portfolio', path: 'portfolio', element: <ProjectsAdmin /> },
  { area: 'clientes', path: 'clientes', element: <ClientsAdmin /> },
  { area: 'funcionarios', path: 'funcionarios', element: <TeamAdmin /> },
];

export default function AdminApp() {
  const [state, setState] = useState<AuthState>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [access, setAccess] = useState<Access | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const check = useCallback(async (current: Session | null) => {
    setSession(current);
    if (!current && !isDemo) return setState('signed-out');
    const mine = await getMyAccess(current?.user.id ?? '');
    setAccess(mine);
    setState(!mine ? 'not-admin' : mine.active ? 'ready' : 'blocked');
  }, []);

  useEffect(() => {
    document.title = 'Painel — WAW Studio';
    if (!supabase) {
      check(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => {
      // Evita chamar o Supabase dentro do callback (recomendação da lib).
      setTimeout(() => check(current), 0);
    });
    return () => listener.subscription.unsubscribe();
  }, [check]);

  if (state === 'loading') return <div className="admin-center">Carregando…</div>;
  if (state === 'signed-out') return <Login />;

  if (state === 'not-admin' || state === 'blocked') {
    return (
      <div className="admin-center">
        <div className="login">
          <h1 className="login__title">
            Acesso <em>{state === 'blocked' ? 'bloqueado' : 'negado'}</em>
          </h1>
          <p className="login__text">
            {state === 'blocked'
              ? 'Seu login está bloqueado. Fale com o administrador da WAW.'
              : `O login ${session?.user.email} ainda não tem acesso ao painel. Peça para um administrador liberar em Acessos.`}
          </p>
          <button type="button" className="btn btn--red" onClick={() => signOut()}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  const me = access!;
  const isAdmin = me.role === 'admin';
  const can = (area: Area) => isAdmin || me.permissions.includes(area);
  const allowed = routes.filter((route) => can(route.area));
  const home = allowed[0]?.path ?? (isAdmin ? 'acessos' : null);

  const email = session?.user.email ?? 'demo@waw.studio';
  const name = me.name || email.split('@')[0].replace(/[._-]+/g, ' ');

  return (
    <div className="admin">
      <aside className="sidebar">
        <a href="/" className="sidebar__brand" aria-label="Ver o site">
          <Logo variant="waw" className="sidebar__logo" />
          <span className="sidebar__brand-text">Painel</span>
        </a>

        <nav className="sidebar__nav">
          {allowed.map((route) => (
            <NavLink key={route.path} to={`/admin/${route.path}`} className="sidebar__link">
              {icons[route.area]}
              {areaLabels[route.area]}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin/acessos" className="sidebar__link">
              {icons.users}
              Acessos
            </NavLink>
          )}
          <a href="/" target="_blank" rel="noreferrer" className="sidebar__link sidebar__link--muted">
            {icons.site}
            Ver site
          </a>
        </nav>

        <Logo variant="w" className="sidebar__footer-logo" />
      </aside>

      <div className="admin__body">
        <header className="topbar">
          {isDemo && <span className="topbar__demo">Modo demonstração — salvo só neste navegador</span>}
          <div className="topbar__user">
            <span className="topbar__avatar" aria-hidden="true">
              {name.charAt(0).toUpperCase()}
            </span>
            <span>
              <strong className="topbar__name">{name}</strong>
              <small className="topbar__role">{roleLabels[me.role]}</small>
            </span>
            {!isDemo && (
              <>
                <button type="button" className="topbar__logout" onClick={() => setChangingPassword(true)}>
                  Minha senha
                </button>
                <button type="button" className="topbar__logout" onClick={() => signOut()}>
                  Sair
                </button>
              </>
            )}
          </div>
        </header>

        <main className="admin__main">
          {home === null ? (
            <p className="panel__empty panel__empty--light">
              Seu login ainda não tem nenhuma área liberada. Fale com o administrador.
            </p>
          ) : (
            <Routes>
              <Route index element={<Navigate to={home} replace />} />
              {allowed.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              {isAdmin && <Route path="acessos" element={<UsersAdmin />} />}
              <Route path="*" element={<Navigate to={home} replace />} />
            </Routes>
          )}
        </main>
      </div>

      {changingPassword && <PasswordForm onClose={() => setChangingPassword(false)} />}
    </div>
  );
}
