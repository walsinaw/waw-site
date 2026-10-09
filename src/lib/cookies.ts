// Aviso de cookies

export const COOKIES_STORAGE_KEY = 'waw-cookies';
export const COOKIES_OPEN_EVENT = 'waw:cookies';

export const openCookiePreferences = () => window.dispatchEvent(new Event(COOKIES_OPEN_EVENT));
