export type LinkType = 'behance' | 'site' | 'instagram' | 'none';

// Especialidades
export const specialties = [
  'Landing Page',
  'Site + Sistema',
  'Identidade Visual',
  'Social Media',
  'Rebranding',
  'Assessoria',
  'Criação de Conteúdo',
  'Captação de Conteúdo',
  'Administração de Redes Sociais',
  'Design de Ebook',
  'Apresentação',
  'Audiovisual',
  'Tráfego Pago',
] as const;

export const joinCategories = (items: string[]) => items.join(' · ');
export const splitCategories = (value: string) =>
  value
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean);

export interface Project {
  id: number;
  title: string;
  categories: string;
  description: string;
  cover_url: string | null;
  link_type: LinkType;
  link_url: string | null;
  featured: boolean;
  published: boolean;
  position: number;
  created_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

export const clientStatuses = ['lead', 'proposta', 'ativo', 'concluido', 'pausado'] as const;
export type ClientStatus = (typeof clientStatuses)[number];

export const statusLabels: Record<ClientStatus, string> = {
  lead: 'Lead',
  proposta: 'Proposta enviada',
  ativo: 'Em andamento',
  concluido: 'Concluído',
  pausado: 'Pausado',
};

export type ValueType = 'fixo' | 'mensal';

export interface ExtraPayment {
  description: string;
  value: number;
  date: string | null;
  paid_on?: string | null;
}

export interface Client {
  id: number;
  name: string;
  company: string;
  city: string;
  whatsapp: string;
  email: string;
  instagram: string;
  document: string;
  services: string[];
  status: ClientStatus;
  value: number | null;
  value_type: ValueType;
  extra_payments: ExtraPayment[];
  due_day: number | null;
  start_date: string | null;
  notes: string;
  source: 'site' | 'manual';
  created_at: string;
}

export type ClientInput = Omit<Client, 'id' | 'created_at'>;

export type LeadInput = Pick<Client, 'name' | 'company' | 'city' | 'whatsapp' | 'services' | 'notes'>;

export type ContractType = 'fixo' | 'freelancer' | 'avulso';

export const contractLabels: Record<ContractType, string> = {
  fixo: 'Fixo (mensal)',
  freelancer: 'Freelancer (por projeto)',
  avulso: 'Pagamento único',
};

export interface TeamMember {
  id: number;
  name: string;
  phone: string;
  photo_path: string | null;
  areas: string[];
  contract_type: ContractType;
  agreed_value: number | null;
  client_ids: number[];
  notes: string;
  created_at: string;
}

export type TeamInput = Omit<TeamMember, 'id' | 'created_at'>;

export interface TeamPayment {
  id: number;
  member_id: number;
  amount: number;
  paid_on: string;
  reference: string;
  client_id: number | null;
  notes: string;
  created_at: string;
}

export type TeamPaymentInput = Omit<TeamPayment, 'id' | 'created_at'>;

// ---------------------------------------------------------------------------
// Acessos ao painel
// ---------------------------------------------------------------------------

export const areas = ['dashboard', 'portfolio', 'clientes', 'funcionarios'] as const;
export type Area = (typeof areas)[number];

export const areaLabels: Record<Area, string> = {
  dashboard: 'Dashboard',
  portfolio: 'Portfólio',
  clientes: 'Clientes',
  funcionarios: 'Funcionários',
};

export type Role = 'admin' | 'equipe';

export const roleLabels: Record<Role, string> = {
  admin: 'Administrador',
  equipe: 'Equipe',
};

export interface Access {
  name: string;
  role: Role;
  permissions: Area[];
  active: boolean;
}

export interface PanelUser extends Access {
  user_id: string;
  email: string;
  team_id: number | null;
  last_sign_in_at: string | null;
  created_at: string;
}

export interface PanelUserInput {
  email: string;
  password: string;
  name: string;
  role: Role;
  permissions: Area[];
  team_id: number | null;
  active: boolean;
}
