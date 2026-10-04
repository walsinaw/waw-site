import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COOKIES_OPEN_EVENT as OPEN_EVENT, COOKIES_STORAGE_KEY as STORAGE_KEY } from '../lib/cookies';
import './CookieBanner.css';

// Aviso de cookies (LGPD): Google Analytics e Microsoft Clarity só carregam depois do "Aceitar".
// A escolha fica no navegador; o link "Preferências de cookies" do rodapé abre o aviso de novo.

type Choice = 'aceito' | 'recusado';

declare global {
  interface Window {
    /** Definido no index.html (vite-plugin-seo.ts): carrega Analytics e Clarity. */
    wawAnalytics?: () => void;
  }
}

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'aceito' || value === 'recusado' ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* navegador sem armazenamento: o aviso volta na próxima visita */
  }
}

// Apaga os cookies que o Analytics (_ga…) e o Clarity (_clck, _clsk…) criaram.
function clearAnalyticsCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-3).join('.')}`];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^(_ga|_gid|_gat|_cl|CLID|MUID|ANONCHK|SM)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

export default function CookieBanner() {
  const [open, setOpen] = useState(() => readChoice() === null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  if (!open) return null;

  const accept = () => {
    saveChoice('aceito');
    window.wawAnalytics?.();
    setOpen(false);
  };

  const reject = () => {
    const wasAccepted = readChoice() === 'aceito';
    saveChoice('recusado');
    setOpen(false);
    if (wasAccepted) {
      // Os scripts já carregados só param de vez com a página recarregada.
      clearAnalyticsCookies();
      location.reload();
    }
  };

  return (
    <div className="cookies" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p className="cookies__text">
        Usamos cookies de análise (Google Analytics e Microsoft Clarity) para entender como o site é usado e melhorar
        sua experiência. Eles só são ativados se você aceitar.{' '}
        <Link to="/privacidade" onClick={() => setOpen(false)}>
          Política de privacidade
        </Link>
      </p>
      <div className="cookies__actions">
        <button type="button" className="cookies__btn cookies__btn--ghost" onClick={reject}>
          Recusar
        </button>
        <button type="button" className="cookies__btn cookies__btn--red" onClick={accept}>
          Aceitar
        </button>
      </div>
    </div>
  );
}
