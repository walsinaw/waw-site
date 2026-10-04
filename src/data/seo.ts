// Títulos, descrições e dados da empresa para o Google, prévias de link e IAs.
// Usado pelo site (cada página atualiza as tags) e pelo build (sitemap, robots.txt, llms.txt).
// Sem imports: este arquivo também roda no vite.config.ts.

/** Endereço oficial do site. Na Vercel, a variável VITE_SITE_URL substitui este valor, se precisar. */
export const DEFAULT_SITE_URL = 'https://wawstudio.com.br';

/** Projeto do Microsoft Clarity (carrega só depois do aceite no aviso de cookies). */
export const CLARITY_ID = 'yqnylezmxb';

/** Google Analytics 4 (carrega só depois do aceite no aviso de cookies). */
export const GA_ID = 'G-BT86QHCHXZ';

/** Código do Google Search Console (o mesmo vale para o registro TXT no DNS do domínio). */
export const GOOGLE_SITE_VERIFICATION = 'XFSjT-XkP6asotiKFtC6SnedjhEDTGAk6VbewOxzHj0';

export const business = {
  name: 'WAW Studio',
  slogan: 'O extraordinário começa com um UAU.',
  description:
    'Agência de marketing e studio criativo de Pelotas/RS, com atendimento online para todo o Brasil e o exterior: identidade visual, social media, audiovisual, sites e sistemas, comunicação e tráfego pago.',
  founder: 'Julia Alsina',
  phone: '+55 53 98152-6416',
  whatsappUrl: 'https://wa.me/5553981526416',
  instagramUrl: 'https://www.instagram.com/wawstudio.br/',
  behanceUrl: 'https://www.behance.net/walsinaw',
  /** Atende online e no cliente (sem endereço aberto ao público). */
  city: 'Pelotas',
  region: 'RS',
  regionName: 'Rio Grande do Sul',
  /** Perfil da Empresa no Google (Maps) e link para pedir avaliação. */
  googleMapsUrl: 'https://maps.google.com/?cid=13187970864247851813',
  googleReviewUrl: 'https://g.page/r/CSXLsc-gFQW3EAE/review',
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
  /** Importância no sitemap (0 a 1). Padrão: 1 na home, 0.8 nas outras. */
  priority?: number;
}

export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'WAW Studio | Agência de marketing em Pelotas/RS',
    description:
      'WAW Studio: agência de marketing e studio criativo em Pelotas/RS, atendendo todo o Brasil. Identidade visual, social media, sites e tráfego pago.',
  },
  {
    path: '/portfolio',
    title: 'Portfólio — WAW Studio',
    description:
      'Projetos de identidade visual, sites e comunicação criados pela WAW Studio para marcas de diferentes mercados.',
  },
  {
    path: '/servicos/design',
    title: 'Identidade visual e design em Pelotas/RS — WAW Studio',
    description:
      'Identidade visual, rebranding e design para redes sociais e campanhas, em Pelotas/RS e online para todo o Brasil. Posts, carrosséis, stories e ebooks.',
  },
  {
    path: '/servicos/web',
    title: 'Criação de sites e sistemas em Pelotas/RS — WAW Studio',
    description:
      'Sites, landing pages, lojas virtuais, sistemas e UX/UI para web, em Pelotas/RS e online para todo o Brasil. Presença digital que trabalha pelo seu negócio.',
  },
  {
    path: '/servicos/ads',
    title: 'Tráfego pago e marketing digital em Pelotas/RS — WAW Studio',
    description:
      'Gestão de tráfego pago no Meta Ads e Google Ads, conteúdo e performance, em Pelotas/RS e online para todo o Brasil.',
  },
  {
    path: '/privacidade',
    title: 'Política de privacidade — WAW Studio',
    description:
      'Como a WAW Studio coleta, usa e protege os seus dados no site e no formulário de contato, de acordo com a LGPD.',
    priority: 0.3,
  },
];

export const pageMeta = (path: string) => pages.find((p) => p.path === path) ?? pages[0];
