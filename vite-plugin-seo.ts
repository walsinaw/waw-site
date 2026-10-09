// Plugin de SEO: tags, JSON-LD, sitemap.xml, robots.txt e llms.txt
import type { Plugin } from 'vite';
import { business, CLARITY_ID, DEFAULT_SITE_URL, GA_ID, GOOGLE_SITE_VERIFICATION, pages } from './src/data/seo.ts';

interface SeoEnv {
  VITE_SITE_URL?: string;
  VITE_CLARITY_ID?: string;
  VITE_GA_ID?: string;
  VITE_GOOGLE_SITE_VERIFICATION?: string;
}

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function seo(env: SeoEnv): Plugin {
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
  const home = pages[0];
  const image = `${siteUrl}/og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#organizacao`,
        name: business.name,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/favicon.png`,
        image,
        slogan: business.slogan,
        description: business.description,
        telephone: business.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: business.city,
          addressRegion: business.region,
          addressCountry: 'BR',
        },
        areaServed: [
          { '@type': 'City', name: `${business.city}, ${business.region}` },
          { '@type': 'State', name: business.regionName },
          { '@type': 'Country', name: 'Brasil' },
        ],
        hasMap: business.googleMapsUrl,
        founder: { '@type': 'Person', name: business.founder, jobTitle: 'Fundadora' },
        sameAs: [business.googleMapsUrl, business.instagramUrl, business.behanceUrl],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: business.phone,
          contactType: 'customer service',
          availableLanguage: 'Portuguese',
          url: business.whatsappUrl,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serviços',
          itemListElement: business.services.map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.name, description: service.text },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#site`,
        url: `${siteUrl}/`,
        name: business.name,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${siteUrl}/#organizacao` },
      },
    ],
  };

  const headTags = [
    `<link rel="canonical" href="${siteUrl}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="${business.name}" />`,
    `<meta property="og:title" content="${escape(home.title)}" />`,
    `<meta property="og:description" content="${escape(home.description)}" />`,
    `<meta property="og:url" content="${siteUrl}/" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="WAW Studio: o extraordinário começa com um UAU." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(home.title)}" />`,
    `<meta name="twitter:description" content="${escape(home.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ];

  const verification = env.VITE_GOOGLE_SITE_VERIFICATION || GOOGLE_SITE_VERIFICATION;
  if (verification) {
    headTags.push(`<meta name="google-site-verification" content="${escape(verification)}" />`);
  }
  // Analytics e Clarity
  const gaId = env.VITE_GA_ID || GA_ID;
  const clarityId = env.VITE_CLARITY_ID || CLARITY_ID;
  if (gaId || clarityId) {
    headTags.push(`<script>
      window.wawAnalytics = function () {
        if (window.__wawAnalytics || location.pathname.startsWith('/admin') || /^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)) return;
        window.__wawAnalytics = true;
        var ga = ${JSON.stringify(gaId ?? '')}, clarity = ${JSON.stringify(clarityId ?? '')};
        if (ga) {
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
          document.head.appendChild(s);
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', ga);
        }
        if (clarity) {
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",clarity);
        }
      };
      try { if (localStorage.getItem('waw-cookies') === 'aceito') window.wawAnalytics(); } catch (e) {}
    </script>`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const files: Record<string, string> = {
    'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${(page.priority ?? (page.path === '/' ? 1 : 0.8)).toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
    'robots.txt': `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`,
    'llms.txt': `# ${business.name}

> ${business.description}

A WAW Studio é uma agência de marketing e studio criativo de ${business.city}/${business.region}, fundada por ${business.founder}, que trabalha há 3 anos com comunicação digital. Atende online clientes de todo o Brasil e do exterior. Une estratégia, criatividade e tecnologia em projetos de marca, conteúdo e presença digital, com uma equipe de design, conteúdo, tráfego e desenvolvimento.

## Serviços

${business.services.map((service) => `- **${service.name}:** ${service.text}`).join('\n')}

## Páginas

${pages.map((page) => `- [${page.title}](${siteUrl}${page.path}): ${page.description}`).join('\n')}

## Contato

- WhatsApp: ${business.whatsappUrl}
- Instagram: ${business.instagramUrl}
- Behance: ${business.behanceUrl}
- Google Maps (Perfil da Empresa): ${business.googleMapsUrl}
- Localização: ${business.city}/${business.region}, Brasil (atendimento online e no cliente)
`,
  };

  return {
    name: 'waw-seo',
    transformIndexHtml(html, ctx) {
      const logo = Object.keys(ctx.bundle ?? {}).find((file) => /assets\/logo-waw-[\w-]+\.webp$/.test(file));
      const preload = logo ? [`<link rel="preload" as="image" href="/${logo}" fetchpriority="high" />`] : [];
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${escape(home.title)}</title>`)
        .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(home.description)}" />`)
        .replace('</head>', `    ${[...preload, ...headTags].join('\n    ')}\n  </head>`);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split('?')[0].slice(1) ?? '';
        if (!(name in files)) return next();
        res.setHeader('Content-Type', name.endsWith('.xml') ? 'application/xml' : 'text/plain; charset=utf-8');
        res.end(files[name]);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
  };
}
