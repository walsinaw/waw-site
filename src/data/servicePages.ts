// Páginas de cada nicho (/servicos/design, /servicos/web, /servicos/ads).
// Em qualquer texto, **assim** vira destaque (negrito / Pirso nos títulos).
import type { ServiceId } from './content';

export interface Faq {
  q: string;
  a: string;
}

export type Block =
  /** Título + texto; "big" são frases grandes em lista; "chips" são etiquetas */
  | {
      type: 'statement';
      id?: string;
      eyebrow: string;
      title: string;
      subtitle?: string;
      body?: string[];
      big?: string[];
      chips?: string[];
      outro?: string[];
      light?: boolean;
    }
  /** Lista numerada em linhas (serviços) */
  | {
      type: 'services';
      eyebrow: string;
      title: string;
      items: { title: string; text?: string; tags?: string }[];
    }
  /** Etapas numeradas em grade (processo) */
  | {
      type: 'steps';
      eyebrow: string;
      title: string;
      intro?: string[];
      items: { title: string; text: string }[];
    }
  /** Chamada vermelha no meio da página */
  | { type: 'band'; title: string; text?: string[]; button: string };

export interface ServicePageData {
  id: ServiceId;
  label: string;
  eyebrow: string;
  title: string;
  intro: string[];
  primary: string;
  secondary: { label: string; href: string };
  blocks: Block[];
  faq: Faq[];
  closing: { title: string; text: string; button: string };
}

export const servicePages: Record<ServiceId, ServicePageData> = {
  design: {
    id: 'design',
    label: 'Design',
    eyebrow: 'Design · Branding · Identidade',
    title: 'Sua marca fala **antes mesmo de você dizer qualquer coisa.**',
    intro: [
      'Uma cor. Uma tipografia. Uma imagem. Um símbolo.',
      'Tudo comunica.',
      'Na WAW, transformamos estratégia e criatividade em **identidades visuais, campanhas e experiências de marca** que ajudam empresas a serem reconhecidas, lembradas e percebidas do jeito certo.',
    ],
    primary: 'Quero construir minha marca',
    secondary: { label: 'Ver projetos', href: '/portfolio' },
    blocks: [
      {
        type: 'statement',
        eyebrow: 'Percepção',
        title: 'Não é só sobre como sua marca parece.',
        subtitle: 'É sobre **como ela é percebida.**',
        body: [
          'Uma identidade visual precisa funcionar no Instagram, no site, em uma apresentação, em uma embalagem, em um anúncio e em todos os lugares onde sua marca aparece.',
          'Por isso, criamos sistemas visuais que vão além do logotipo.',
        ],
      },
      {
        type: 'services',
        eyebrow: 'O que fazemos',
        title: 'Marcas com personalidade. **Sistemas com propósito.**',
        items: [
          {
            title: 'Identidade Visual',
            text: 'Construímos os elementos que dão forma à sua marca.',
            tags: 'Logotipo · Paleta · Tipografia · Elementos gráficos · Direção visual',
          },
          {
            title: 'Branding',
            text: 'Para marcas que precisam encontrar ou redefinir seu espaço.',
            tags: 'Posicionamento · Conceito · Personalidade · Tom de voz · Estratégia de marca',
          },
          {
            title: 'Rebranding',
            text: 'Sua empresa evoluiu. Sua identidade também pode evoluir. Reestruturamos a presença visual da marca sem perder aquilo que faz ela ser reconhecida.',
          },
          {
            title: 'Direção de Arte',
            text: 'Uma linguagem visual consistente para transformar ideias em comunicação.',
            tags: 'Campanhas · Social Media · Materiais institucionais · Digital · Audiovisual',
          },
          {
            title: 'Materiais de marca',
            text: 'Porque uma identidade não termina no manual.',
            tags: 'Apresentações · PDFs · Papelaria · Social Media · Campanhas · Materiais comerciais',
          },
        ],
      },
      {
        type: 'steps',
        eyebrow: 'Processo',
        title: 'Primeiro, a gente entende. **Depois, a gente cria.**',
        intro: [
          'Uma boa identidade não nasce de uma referência bonita encontrada no Pinterest.',
          'Ela nasce de contexto.',
        ],
        items: [
          { title: 'Imersão', text: 'Conhecemos a empresa, o mercado, o público e o momento da marca.' },
          {
            title: 'Estratégia',
            text: 'Definimos caminhos visuais e conceitos capazes de traduzir aquilo que a marca precisa comunicar.',
          },
          { title: 'Conceito', text: 'Transformamos estratégia em uma direção criativa.' },
          { title: 'Identidade', text: 'Construímos os elementos visuais que formam o sistema da marca.' },
          {
            title: 'Aplicação',
            text: 'Colocamos a identidade em situações reais para garantir que ela funcione de verdade.',
          },
          {
            title: 'Entrega',
            text: 'Organizamos arquivos, diretrizes e materiais para que a marca continue consistente depois do projeto.',
          },
        ],
      },
      {
        type: 'statement',
        eyebrow: 'Pontos de contato',
        light: true,
        title: 'Uma marca não vive **em um único lugar.**',
        body: ['Ela aparece em todos os pontos de contato.'],
        big: [
          'Instagram.',
          'Site.',
          'Apresentação.',
          'Anúncio.',
          'Embalagem.',
          'Vídeo.',
          'Cartão.',
          'Proposta comercial.',
        ],
        outro: ['Por isso, pensamos a identidade para existir **fora da apresentação do projeto também.**'],
      },
      {
        type: 'statement',
        eyebrow: 'Memória',
        title: 'Design que chama atenção é bom.',
        subtitle: '**Design que permanece na memória é melhor.**',
        body: [
          'Queremos criar marcas que tenham personalidade suficiente para serem reconhecidas e flexibilidade suficiente para continuarem evoluindo.',
          'Porque o objetivo não é simplesmente fazer algo bonito.',
          'É fazer algo que **faça sentido para a sua marca.**',
        ],
      },
      { type: 'band', title: 'Sua marca está pronta para dar um **uau?**', button: 'Quero criar minha identidade' },
    ],
    faq: [
      {
        q: 'Vocês fazem apenas logotipos?',
        a: 'Não. Podemos desenvolver desde uma identidade visual até um sistema completo de branding, dependendo da necessidade da marca.',
      },
      {
        q: 'Já tenho uma identidade. Vocês fazem rebranding?',
        a: 'Sim. Podemos evoluir uma identidade existente, preservando elementos importantes ou reconstruindo completamente sua linguagem visual.',
      },
      {
        q: 'Vocês também criam materiais depois da identidade?',
        a: 'Sim. Podemos desenvolver aplicações para redes sociais, apresentações, campanhas, materiais comerciais e outros pontos de contato.',
      },
      {
        q: 'Quanto custa uma identidade visual?',
        a: 'O investimento depende da profundidade do projeto e dos materiais envolvidos. Após entender a necessidade da marca, estruturamos uma proposta personalizada.',
      },
      {
        q: 'Vocês fazem branding para empresas que estão começando?',
        a: 'Sim. Inclusive, começar com uma base estratégica e visual consistente pode ajudar a marca a crescer de forma mais organizada.',
      },
    ],
    closing: {
      title: 'Uma boa marca começa com **uma boa ideia.**',
      text: 'E uma boa ideia merece ser bem construída.',
      button: 'Falar com a WAW',
    },
  },

  web: {
    id: 'web',
    label: 'Web',
    eyebrow: 'Web · UX/UI · Desenvolvimento',
    title: 'Seu site pode ser **muito mais do que uma vitrine.**',
    intro: [
      'Sua marca merece uma presença digital que faça sentido para quem chega, funcione para quem navega e trabalhe pelo seu negócio.',
      'Na WAW, criamos sites, landing pages e experiências digitais que unem **estratégia, design e tecnologia** para transformar ideias em experiências que conectam, comunicam e geram oportunidades.',
    ],
    primary: 'Quero criar meu site',
    secondary: { label: 'Ver projetos', href: '/portfolio' },
    blocks: [
      {
        type: 'statement',
        eyebrow: 'Ponto de partida',
        title: 'Seu negócio mudou. **Seu site também deveria.**',
        body: [
          'Um site desatualizado pode fazer uma marca parecer menor do que ela realmente é.',
          'Por isso, não começamos pelo código.',
          'Começamos entendendo **quem você é, o que você oferece, quem precisa encontrar você e qual ação queremos que essa pessoa tome.**',
          'Depois, transformamos tudo isso em uma experiência digital bonita, intuitiva e funcional.',
        ],
      },
      {
        type: 'statement',
        eyebrow: 'Experiência',
        light: true,
        title: 'Do primeiro clique **ao próximo passo.**',
        body: ['Seu site precisa responder rapidamente:'],
        big: ['Quem é você?', 'O que você faz?', 'Por que eu deveria escolher você?', 'Como posso entrar em contato?'],
        outro: ['Nós organizamos conteúdo, experiência e tecnologia para que essas respostas aconteçam de forma natural.'],
      },
      {
        type: 'services',
        eyebrow: 'O que fazemos',
        title: 'O que podemos criar **para sua marca.**',
        items: [
          {
            title: 'Sites institucionais',
            text: 'Uma presença digital profissional para apresentar sua empresa, seus serviços, sua história e tudo aquilo que torna sua marca única.',
            tags: 'Estratégia · UX/UI · Design · Desenvolvimento',
          },
          {
            title: 'Landing Pages',
            text: 'Uma página criada para uma ação específica: captar leads, apresentar um serviço, divulgar uma campanha ou transformar tráfego em oportunidade.',
            tags: 'Copy · Design · Conversão · Integrações',
          },
          {
            title: 'Lojas virtuais',
            text: 'Experiências de compra pensadas para apresentar seus produtos, facilitar a navegação e tornar o caminho até a compra mais simples.',
            tags: 'UX/UI · E-commerce · Catálogo · Conversão',
          },
          {
            title: 'Experiências digitais',
            text: 'Projetos sob medida para necessidades que vão além de um site tradicional.',
            tags: 'Interfaces · Sistemas · Aplicações · Integrações',
          },
        ],
      },
      {
        type: 'steps',
        eyebrow: 'Processo',
        title: 'Design bonito. **Experiência melhor ainda.**',
        intro: [
          'Antes de desenvolver, pensamos em como as pessoas vão usar.',
          'Arquitetura de informação, hierarquia visual, navegação, responsividade e microinterações fazem parte da construção de uma experiência que não apenas chama atenção, mas também funciona.',
        ],
        items: [
          { title: 'Descobrir', text: 'Entendemos o negócio, o público e o objetivo do projeto.' },
          { title: 'Estruturar', text: 'Organizamos conteúdo, páginas e caminhos de navegação.' },
          { title: 'Criar', text: 'Transformamos estratégia em interface, identidade e experiência.' },
          {
            title: 'Desenvolver',
            text: 'Construímos uma solução funcional, responsiva e preparada para o mundo real.',
          },
          { title: 'Publicar', text: 'Testamos, ajustamos e colocamos o projeto no ar.' },
        ],
      },
      {
        type: 'statement',
        eyebrow: 'Tecnologia',
        title: 'Tecnologia que trabalha **por trás da experiência.**',
        body: ['Do visual ao código, pensamos no projeto como um todo.'],
        chips: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'APIs', 'CMS', 'SEO'],
        outro: ['A tecnologia escolhida depende do projeto, não o contrário.'],
      },
      {
        type: 'statement',
        eyebrow: 'Propósito',
        title: 'Não fazemos sites para **preencher espaço na internet.**',
        body: [
          'Fazemos sites para **representar marcas, facilitar decisões e criar novas possibilidades.**',
          'Seu site pode ser o primeiro contato com sua empresa.',
          'Faça esse contato valer a pena.',
        ],
      },
      {
        type: 'band',
        title: 'Vamos criar algo que **dê vontade de ficar.**',
        button: 'Quero conversar sobre meu projeto',
      },
    ],
    faq: [
      {
        q: 'Vocês criam o conteúdo do site?',
        a: 'Podemos trabalhar com o conteúdo fornecido pelo cliente ou desenvolver e estruturar os textos em conjunto, de acordo com o escopo.',
      },
      {
        q: 'Eu preciso ter domínio e hospedagem?',
        a: 'Não necessariamente. Podemos orientar ou cuidar da configuração necessária para colocar o projeto no ar.',
      },
      {
        q: 'O site funciona no celular?',
        a: 'Sim. Todos os projetos são pensados para diferentes tamanhos de tela e dispositivos.',
      },
      {
        q: 'Vocês fazem manutenção depois da entrega?',
        a: 'Sim. Podemos estruturar suporte e manutenção de acordo com a necessidade do projeto.',
      },
      {
        q: 'Quanto custa criar um site?',
        a: 'Cada projeto é diferente. O investimento depende do tipo de site, quantidade de páginas, funcionalidades, conteúdo e nível de personalização.',
      },
    ],
    closing: {
      title: 'Seu próximo projeto digital **começa com uma conversa.**',
      text: 'Você traz a ideia. A gente transforma em experiência.',
      button: 'Falar com a WAW',
    },
  },

  ads: {
    id: 'ads',
    label: 'Ads',
    eyebrow: 'Ads · Performance · Estratégia',
    title: 'Mais alcance **não significa mais resultado.**',
    intro: [
      'Colocar dinheiro em anúncios é fácil.',
      'Fazer esse investimento trabalhar de verdade é outra história.',
      'Na WAW, unimos **estratégia, criatividade, mídia paga e análise de dados** para construir campanhas que encontram as pessoas certas e conduzem cada uma delas ao próximo passo.',
    ],
    primary: 'Quero anunciar',
    secondary: { label: 'Conhecer nossa estratégia', href: '#estrategia' },
    blocks: [
      {
        type: 'statement',
        eyebrow: 'A jornada',
        title: 'Seu anúncio é **só o começo.**',
        body: ['Um anúncio pode chamar atenção.', 'Mas o que acontece depois?'],
        big: [
          'A pessoa clica.',
          'Entra no site.',
          'Vê uma oferta.',
          'Preenche um formulário.',
          'Chama no WhatsApp.',
          'Ou simplesmente vai embora.',
        ],
        outro: ['Por isso, não olhamos apenas para o anúncio.', 'Olhamos para **a jornada inteira.**'],
      },
      {
        type: 'statement',
        id: 'estrategia',
        eyebrow: 'Estratégia',
        light: true,
        title: 'Estratégia antes do **botão “publicar”.**',
        body: ['Antes de colocar uma campanha no ar, entendemos:'],
        big: [
          'O que você quer alcançar?',
          'Quem precisa encontrar sua marca?',
          'Qual oferta faz sentido?',
          'Qual mensagem pode gerar interesse?',
          'Para onde vamos levar esse público?',
          'Como vamos medir o resultado?',
        ],
        outro: ['A partir disso, construímos a estratégia da campanha.'],
      },
      {
        type: 'services',
        eyebrow: 'O que fazemos',
        title: 'O que fazemos **em Ads.**',
        items: [
          {
            title: 'Tráfego Pago',
            text: 'Campanhas estruturadas para levar sua marca, produto ou serviço até públicos relevantes.',
            tags: 'Meta Ads · Google Ads · Remarketing · Geração de leads · Conversão',
          },
          {
            title: 'Campanhas',
            text: 'Do conceito ao acompanhamento. Criamos campanhas para lançamentos, ofertas, eventos, captação e objetivos específicos.',
          },
          {
            title: 'Criativos',
            text: 'O anúncio precisa parar o scroll. Criamos peças estáticas, carrosséis, vídeos e variações pensadas para diferentes públicos e etapas da jornada.',
          },
          {
            title: 'Landing Pages',
            text: 'Quando o clique precisa virar ação, a página também precisa fazer sua parte. Criamos ou estruturamos landing pages alinhadas à campanha e ao objetivo.',
          },
          {
            title: 'Remarketing',
            text: 'Nem todo mundo está pronto para comprar na primeira visita. Criamos estratégias para continuar conversando com quem já demonstrou interesse.',
          },
          {
            title: 'Análise e otimização',
            text: 'Campanha publicada não significa trabalho terminado. Acompanhamos dados, identificamos oportunidades e ajustamos a estratégia continuamente.',
          },
        ],
      },
      {
        type: 'statement',
        eyebrow: 'Tudo junto',
        title: 'Criativo + mídia + **estratégia.**',
        body: [
          'Quando essas três coisas trabalham separadas, o resultado pode se perder no caminho.',
          'Na WAW, pensamos nelas juntas.',
        ],
        big: [
          'A estratégia define o caminho.',
          'O criativo chama atenção.',
          'A mídia encontra o público.',
          'Os dados mostram o que fazer depois.',
        ],
      },
      {
        type: 'statement',
        eyebrow: 'Diagnóstico',
        title: 'E se a campanha **não estiver funcionando?**',
        body: ['A gente investiga.'],
        big: [
          'Pode ser o público.',
          'Pode ser a oferta.',
          'Pode ser o criativo.',
          'Pode ser a mensagem.',
          'Pode ser a página.',
          'Pode ser o momento.',
        ],
        outro: [
          'Por isso, não olhamos apenas para métricas isoladas.',
          'Analisamos o contexto para descobrir **onde a jornada está perdendo força.**',
        ],
      },
      {
        type: 'steps',
        eyebrow: 'Processo',
        title: 'Nosso **processo.**',
        items: [
          { title: 'Diagnóstico', text: 'Entendemos o negócio, objetivo, público e cenário atual.' },
          {
            title: 'Estratégia',
            text: 'Definimos canais, públicos, ofertas, mensagens e estrutura de campanha.',
          },
          {
            title: 'Criação',
            text: 'Desenvolvemos os criativos e materiais necessários para colocar a estratégia em prática.',
          },
          {
            title: 'Configuração',
            text: 'Estruturamos campanhas, públicos, eventos, conversões e integrações conforme o projeto.',
          },
          {
            title: 'Otimização',
            text: 'Acompanhamos os dados e fazemos ajustes com base no comportamento das campanhas.',
          },
          { title: 'Análise', text: 'Transformamos números em informações para orientar os próximos passos.' },
        ],
      },
      {
        type: 'statement',
        eyebrow: 'Sem fórmula mágica',
        title: 'Não prometemos uma **fórmula mágica.**',
        body: [
          'Porque marketing não funciona assim.',
          'O que fazemos é construir uma operação baseada em **estratégia, testes, criatividade e dados.**',
          'Cada campanha ensina alguma coisa.',
          'Cada dado abre uma possibilidade.',
          'Cada otimização aproxima a estratégia do objetivo.',
        ],
      },
      {
        type: 'band',
        title: 'Seu próximo cliente pode estar **a um clique.**',
        text: [
          'Mas antes desse clique, existe estratégia.',
          '**Vamos colocar sua marca na frente das pessoas certas.**',
        ],
        button: 'Quero falar sobre minha campanha',
      },
    ],
    faq: [
      {
        q: 'Vocês trabalham com Meta Ads?',
        a: 'Sim. Trabalhamos com campanhas em plataformas como Meta Ads e Google Ads, de acordo com os objetivos e o público de cada projeto.',
      },
      {
        q: 'Quanto preciso investir em anúncios?',
        a: 'Não existe um valor único. O investimento depende do objetivo, mercado, região, público e capacidade de atendimento do negócio. Definimos a estratégia considerando o cenário de cada cliente.',
      },
      {
        q: 'O valor da mídia está incluído no serviço?',
        a: 'Não. O investimento destinado às plataformas de anúncios é separado do valor de gestão e operação.',
      },
      {
        q: 'Vocês criam os anúncios?',
        a: 'Sim. Podemos desenvolver os criativos necessários para as campanhas, conforme o escopo contratado.',
      },
      {
        q: 'Vocês garantem vendas?',
        a: 'Nenhuma campanha séria pode garantir um número específico de vendas. O trabalho é estruturar, acompanhar, testar e otimizar a operação para buscar os melhores resultados possíveis dentro do cenário do negócio.',
      },
      {
        q: 'Preciso ter um site para anunciar?',
        a: 'Não necessariamente. Dependendo do objetivo, podemos trabalhar com WhatsApp, formulários, landing pages, redes sociais ou outras estruturas de conversão.',
      },
    ],
    closing: {
      title: 'Pronto para transformar **atenção em oportunidade?**',
      text: 'Sua marca já existe. Agora vamos fazer mais gente encontrá-la.',
      button: 'Falar com a WAW',
    },
  },
};
