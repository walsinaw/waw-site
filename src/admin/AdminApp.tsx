import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { isDemo, signOut, supabase } from '../lib/api';
import Logo from '../components/Logo';
import Login from './Login';
import ProjectsAdmin from './ProjectsAdmin';
import ClientsAdmin from './ClientsAdmin';
import './admin.css';

type AuthState = 'loading' | 'signed-out' | 'not-admin' | 'ready';

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

  if (state === 'loading') return <div className="admin admin--center">Carregando…</div>;
  if (state === 'signed-out') return <Login />;

  if (state === 'not-admin') {
    return (
      <div className="admin admin--center">
        <div className="admin-card admin-login">
          <h1 className="admin-login__title">Acesso negado</h1>
          <p className="admin-muted">
            O usuário {session?.user.email} ainda não está na tabela <code>admins</code>. Veja o passo 4 do README.
          </p>
          <button type="button" className="admin-button" onClick={() => signOut()}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <a href="/" className="admin-top__brand" aria-label="Ver o site">
          <Logo variant="w" className="admin-top__logo" />
          <span>Painel</span>
        </a>
        <nav className="admin-tabs">
          <NavLink to="/admin/portfolio" className="admin-tabs__link">
            Portfólio
          </NavLink>
          <NavLink to="/admin/clientes" className="admin-tabs__link">
            Clientes
          </NavLink>
        </nav>
        <div className="admin-top__actions">
          <a href="/" target="_blank" rel="noreferrer" className="admin-link">
            Ver site ↗
          </a>
          {!isDemo && (
            <button type="button" className="admin-link" onClick={() => signOut()}>
              Sair
            </button>
          )}
        </div>
      </header>

      {isDemo && (
        <p className="admin-demo">
          <strong>Modo demonstração:</strong> o Supabase ainda não está conectado, então tudo o que você salvar
          aqui fica só neste navegador. Veja o README para ligar o banco de verdade.
        </p>
      )}

      <main className="admin-main">
        <Routes>
          <Route index element={<Navigate to="portfolio" replace />} />
          <Route path="portfolio" element={<ProjectsAdmin />} />
          <Route path="clientes" element={<ClientsAdmin />} />
          <Route path="*" element={<Navigate to="portfolio" replace />} />
        </Routes>
      </main>
    </div>
  );
}
