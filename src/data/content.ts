// Textos fixos do site

export type ServiceId = 'design' | 'web' | 'ads';

export interface Service {
  id: ServiceId;
  number: string;
  label: string;
  title: string;
  description: string;
  items: string[];
}

export const contact = {
  whatsappDisplay: '(53) 98152-6416',
  whatsappNumber: '5553981526416',
  instagramHandle: '@wawstudio.br',
  instagramUrl: 'https://www.instagram.com/wawstudio.br/',
  behanceUrl: 'https://www.behance.net/walsinaw',
};

// Nossas Soluções
export const services: Service[] = [
  {
    id: 'design',
    number: '01',
    label: 'DESIGN',
    title: 'Identidade, Conteúdo e Comunicação Visual',
    description:
      'Construímos a identidade visual da sua marca e criamos todos os materiais necessários para que ela se comunique de forma consistente e marcante.',
    items: [
      'Identidade Visual e Branding',
      'Rebranding',
      'Design para Redes Sociais',
      'Carrosséis, Posts e Stories',
      'Designs de Campanhas Publicitárias',
      'Key Visuals',
      'Motion Design',
      'Ebooks e Apresentações',
      'Materiais Institucionais',
    ],
  },
  {
    id: 'web',
    number: '02',
    label: 'WEB',
    title: 'Criação de Sites e Experiências Digitais',
    description:
      'Criamos experiências digitais que unem design, tecnologia e estratégia para transformar a presença da sua marca na internet.',
    items: [
      'Criação de Sites',
      'Landing Pages',
      'Lojas Virtuais',
      'Sistemas',
      'UX/UI para Web',
      'Manutenção e Automações',
    ],
  },
  {
    id: 'ads',
    number: '03',
    label: 'ADS',
    title: 'Marketing, Conteúdo e Performance',
    description:
      'Unimos criatividade e estratégia para fortalecer sua comunicação, alcançar o público certo e transformar campanhas em resultados.',
    items: [
      'Gestão de Redes Sociais',
      'Planejamento e Criação de Conteúdo',
      'Tráfego Pago',
      'Google Ads e Meta Ads',
      'Captação e Edição de Fotos e Vídeos',
      'Criativos para Anúncios',
      'Assessoria de Imprensa',
      'Copywriting e Produção de Textos',
      'Roteiros e Releases',
    ],
  },
];

export const connected = {
  statements: [
    'Uma identidade sem estratégia não sustenta uma marca.',
    'Um site sem experiência não cria conexão.',
    'Conteúdo sem direção vira apenas mais um post.',
  ],
  pillars: ['Estratégia', 'Design', 'Tecnologia', 'Comunicação'],
};

export const reasons = [
  {
    title: 'Pensamos antes de criar',
    text: 'Toda solução começa entendendo o contexto, o público e o objetivo.',
  },
  {
    title: 'Criatividade com propósito',
    text: 'Design bonito chama atenção. Design com estratégia cria percepção.',
  },
  {
    title: 'Tecnologia sem complicação',
    text: 'Transformamos ideias em experiências digitais funcionais, rápidas e intuitivas.',
  },
  {
    title: 'Olhamos o todo',
    text: 'Marca, conteúdo, site, campanhas e comunicação precisam falar a mesma língua.',
  },
  {
    title: 'Criamos junto',
    text: 'Mais do que fornecedores, queremos construir projetos ao lado de quem acredita na própria marca.',
  },
];

export const steps = [
  { title: 'Descobrir', text: 'Entendemos sua marca, seu momento e o que você quer alcançar.' },
  { title: 'Pensar', text: 'Transformamos informações em estratégia, conceito e direção criativa.' },
  {
    title: 'Criar',
    text: 'É hora de colocar a ideia no mundo: identidade, conteúdo, site, campanha ou experiência.',
  },
  {
    title: 'Evoluir',
    text: 'Analisamos, ajustamos e encontramos novas oportunidades para sua marca continuar crescendo.',
  },
];

export const footerServices = ['Branding', 'Web', 'Social Media', 'Marketing', 'Audiovisual', 'Estratégia'];
