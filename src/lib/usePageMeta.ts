import { useEffect } from 'react';
import { DEFAULT_SITE_URL, pageMeta } from '../data/seo';

const siteUrl = ((import.meta.env.VITE_SITE_URL as string | undefined) || DEFAULT_SITE_URL).replace(/\/+$/, '');

function setTag(selector: string, attribute: 'content' | 'href', value: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

/** Atualiza título, descrição, link canônico e prévia de compartilhamento da página atual (dados em src/data/seo.ts). */
export function usePageMeta(path: string) {
  useEffect(() => {
    const { title, description } = pageMeta(path);
    const url = `${siteUrl}${path === '/' ? '/' : path}`;
    document.title = title;
    setTag('meta[name="description"]', 'content', description);
    setTag('link[rel="canonical"]', 'href', url);
    setTag('meta[property="og:url"]', 'content', url);
    setTag('meta[property="og:title"]', 'content', title);
    setTag('meta[name="twitter:title"]', 'content', title);
    setTag('meta[property="og:description"]', 'content', description);
    setTag('meta[name="twitter:description"]', 'content', description);
  }, [path]);
}
