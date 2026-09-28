import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { isDemo, signOut, supabase } from '../lib/api';
import Logo from '../components/Logo';
import Login from './Login';
import Dashboard from './Dashboard';
import ProjectsAdmin from './ProjectsAdmin';
import ClientsAdmin from './ClientsAdmin';
import './admin.css';

type AuthState = 'loading' | 'signed-out' | 'not-admin' | 'ready';

const icons = {
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
  clients: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5Z" />
    </svg>
  ),
  site: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  ),
};

export default function AdminApp() {
  const [state, setState] = useState<AuthState>(isDemo ? 'ready' : 'loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    document.title = 'Painel — WAW Studio';
    if (!supabase) return;

    const check = async (current: Session | null) => {
      setSession(current);
      if (!current) return setState('signed-out');
      const { data } = await supabase!.from('admins').select('user_id').eq('user_id', current.user.id).maybeSingle();
      setState(data ? 'ready' : 'not-admin');
    };

    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => {
      // Evita chamar o Supabase dentro do callback (recomendação da lib).
      setTimeout(() => check(current), 0);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (state === 'loading') return <div className="admin-center">Carregando…</div>;
  if (state === 'signed-out') return <Login />;

  if (state === 'not-admin') {
    return (
      <div className="admin-center">
        <div className="login">
          <h1 className="login__title">
            Acesso <em>negado</em>
          </h1>
          <p className="login__text">
            O usuário {session?.user.email} ainda não está na tabela <code>admins</code>. Veja o passo 4 do README.
          </p>
          <button type="button" className="btn btn--red" onClick={() => signOut()}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  const email = session?.user.email ?? 'demo@waw.studio';
  const name = email.split('@')[0].replace(/[._-]+/g, ' ');

  return (
    <div className="admin">
      <aside className="sidebar">
        <a href="/" className="sidebar__brand" aria-label="Ver o site">
          <Logo variant="waw" className="sidebar__logo" />
          <span className="sidebar__brand-text">Painel</span>
        </a>

        <nav className="sidebar__nav">
          <NavLink to="/admin/dashboard" className="sidebar__link">
            {icons.dashboard}
            Dashboard
          </NavLink>
          <NavLink to="/admin/portfolio" className="sidebar__link">
            {icons.portfolio}
            Portfólio
          </NavLink>
          <NavLink to="/admin/clientes" className="sidebar__link">
            {icons.clients}
            Clientes
          </NavLink>
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
              <small className="topbar__role">Administração</small>
            </span>
            {!isDemo && (
              <button type="button" className="topbar__logout" onClick={() => signOut()}>
                Sair
              </button>
            )}
          </div>
        </header>

        <main className="admin__main">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="portfolio" element={<ProjectsAdmin />} />
            <Route path="clientes" element={<ClientsAdmin />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
