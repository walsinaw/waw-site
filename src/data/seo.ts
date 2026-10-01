// Títulos, descrições e dados da empresa para o Google, prévias de link e IAs.
// Usado pelo site (cada página atualiza as tags) e pelo build (sitemap, robots.txt, llms.txt).
// Sem imports: este arquivo também roda no vite.config.ts.

/** Endereço enquanto o .com.br não chega. Na Vercel, a variável VITE_SITE_URL substitui este valor. */
export const DEFAULT_SITE_URL = 'https://wawstudio.vercel.app';

/** Projeto do Microsoft Clarity (o código é público, aparece no site de qualquer jeito). */
export const CLARITY_ID = 'yqnylezmxb';

export const business = {
  name: 'WAW Studio',
  slogan: 'O extraordinário começa com um UAU.',
  description:
    'Studio de criatividade e crescimento digital: identidade visual, social media, audiovisual, sites e sistemas, comunicação e tráfego pago.',
  founder: 'Julia Alsina',
  phone: '+55 53 98152-6416',
  whatsappUrl: 'https://wa.me/5553981526416',
  instagramUrl: 'https://www.instagram.com/wawstudio.br/',
  behanceUrl: 'https://www.behance.net/walsinaw',
  services: [
    {
      name: 'Design',
      text: 'Identidade visual, rebranding, design para redes sociais e campanhas publicitárias; posts, carrosséis, stories, ebooks e materiais digitais.',
    },
    { name: 'Social media', text: 'Planejamento de conteúdo, criação de conteúdo e administração de redes sociais.' },
    { name: 'Audiovisual', text: 'Edição de vídeos.' },
    { name: 'Captação de conteúdo', text: 'Foto e vídeo.' },
    {
      name: 'Comunicação',
      text: 'Assessoria de imprensa, produção de textos, copywriting, roteiros, comunicação institucional e releases.',
    },
    {
      name: 'Desenvolvimento',
      text: 'Criação de sites, sistemas, landing pages, lojas virtuais e UX/UI para web.',
    },
    { name: 'Tráfego pago', text: 'Campanhas no Meta Ads e no Google Ads.' },
  ],
};

export interface PageMeta {
  path: string;
  title: string;
  description: string;
}

export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'WAW Studio — O extraordinário começa com um UAU.',
    description:
      'WAW Studio: studio de criatividade e crescimento digital. Identidade visual, social media, sites e tráfego pago para marcas que querem ir além.',
  },
  {
    path: '/portfolio',
    title: 'Portfólio — WAW Studio',
    description:
      'Projetos de identidade visual, sites e comunicação criados pela WAW Studio para marcas de diferentes mercados.',
  },
  {
    path: '/servicos/design',
    title: 'Design: identidade visual e conteúdo — WAW Studio',
    description:
      'Identidade visual, rebranding, design para redes sociais e campanhas: posts, carrosséis, stories, ebooks e materiais digitais com a cara da sua marca.',
  },
  {
    path: '/servicos/web',
    title: 'Criação de sites e sistemas — WAW Studio',
    description:
      'Sites, landing pages, lojas virtuais, sistemas e UX/UI para web: presença digital que funciona para quem navega e trabalha pelo seu negócio.',
  },
  {
    path: '/servicos/ads',
    title: 'Tráfego pago e marketing — WAW Studio',
    description:
      'Gestão de tráfego pago no Meta Ads e Google Ads, conteúdo e performance para transformar alcance em resultado.',
  },
];

export const pageMeta = (path: string) => pages.find((p) => p.path === path) ?? pages[0];
