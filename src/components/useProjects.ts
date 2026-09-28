import { useEffect, useState } from 'react';
import { listProjects } from '../lib/api';
import type { Project } from '../lib/types';

/** Projetos publicados para o site (featuredOnly = só os marcados para a home). */
export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let active = true;
    listProjects({ onlyPublished: true })
      .then((all) => active && setProjects(featuredOnly ? all.filter((p) => p.featured) : all))
      .catch(() => active && setProjects([]));
    return () => {
      active = false;
    };
  }, [featuredOnly]);

  return projects;
}
