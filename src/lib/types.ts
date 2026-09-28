export type LinkType = 'behance' | 'site' | 'none';

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

export interface Client {
  id: number;
  name: string;
  company: string;
  city: string;
  whatsapp: string;
  email: string;
  instagram: string;
  services: string[];
  status: ClientStatus;
  value: number | null;
  start_date: string | null;
  notes: string;
  source: 'site' | 'manual';
  created_at: string;
}

export type ClientInput = Omit<Client, 'id' | 'created_at'>;

export type LeadInput = Pick<Client, 'name' | 'company' | 'city' | 'whatsapp' | 'services' | 'notes'>;
