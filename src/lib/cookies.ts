// Escolha do aviso de cookies (LGPD), compartilhada entre o aviso e o rodapé.

export const COOKIES_STORAGE_KEY = 'waw-cookies';
export const COOKIES_OPEN_EVENT = 'waw:cookies';

/** Abre o aviso de cookies de novo (link "Preferências de cookies" do rodapé). */
export const openCookiePreferences = () => window.dispatchEvent(new Event(COOKIES_OPEN_EVENT));
