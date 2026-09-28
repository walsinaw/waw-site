import type { Project } from './types';

// Projetos de exemplo do modo demonstração (os mesmos do supabase/schema.sql).
const base = {
  cover_url: null,
  link_type: 'none' as const,
  link_url: null,
  featured: true,
  published: true,
  created_at: '2026-01-01T00:00:00.000Z',
};

export const seedProjects: Project[] = [
  {
    ...base,
    id: 1,
    position: 1,
    title: 'Dandala Sousa',
    categories: 'Landing Page · Desenvolvimento Web · UX/UI',
    description: 'Uma presença digital construída para comunicar acolhimento, profissionalismo e proximidade.',
  },
  {
    ...base,
    id: 2,
    position: 2,
    title: 'Dream Tech',
    categories: 'Web Design · Desenvolvimento · Identidade Digital',
    description: 'Uma experiência digital para apresentar tecnologia de forma sofisticada e acessível.',
  },
  {
    ...base,
    id: 3,
    position: 3,
    title: 'WAW Informática',
    categories: 'Social Media · Design · Estratégia',
    description: 'Uma comunicação mais clara e atual para aproximar tecnologia das pessoas.',
  },
  {
    ...base,
    id: 4,
    position: 4,
    title: 'Marquesa',
    categories: 'Design',
    description: '',
  },
];
