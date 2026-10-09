import { useCallback, useEffect, useMemo, useState } from 'react';
import { listProjects, reorderProjects } from '../lib/api';
import type { LinkType, Project } from '../lib/types';
import ProjectForm from './ProjectForm';
import Filters from './Filters';

const linkLabels: Record<LinkType, string> = { behance: 'Behance', site: 'Site', instagram: 'Instagram', none: 'Sem link' };

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | 'new' | null>(null);
  const [status, setStatus] = useState('todos');
  const [link, setLink] = useState('todos');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setProjects(await listProjects());
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = status !== 'todos' || link !== 'todos';
  const visible = useMemo(
    () =>
      (projects ?? []).filter(
        (p) =>
          (status === 'todos' ||
            (status === 'publicado' && p.published) ||
            (status === 'home' && p.published && p.featured) ||
            (status === 'rascunho' && !p.published)) &&
          (link === 'todos' || p.link_type === link),
      ),
    [projects, status, link],
  );

  const move = async (project: Project, direction: -1 | 1) => {
    if (!projects) return;
    const index = projects.findIndex((p) => p.id === project.id);
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const ordered = [...projects];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    setProjects(ordered);
    try {
      await reorderProjects(ordered);
    } catch (err) {
      setError((err as Error).message);
      load();
    }
  };

  const published = projects?.filter((p) => p.published).length ?? 0;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Portfólio</h1>
          <p className="page-subtitle">
            {projects ? `${published} publicados · a ordem aqui é a ordem do site` : 'Visão total dos projetos'}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn--red" onClick={() => setEditing('new')}>
            Cadastrar Projeto
          </button>
          <Filters
            filters={[
              {
                label: 'Status',
                value: status,
                onChange: setStatus,
                options: [
                  ['todos', 'Todos'],
                  ['publicado', 'Publicados'],
                  ['home', 'Na home'],
                  ['rascunho', 'Desativados'],
                ],
              },
              {
                label: 'Link',
                value: link,
                onChange: setLink,
                options: [['todos', 'Todos'], ...Object.entries(linkLabels)],
              },
            ]}
          />
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="panel">
        {projects === null ? (
          <p className="panel__empty">Carregando…</p>
        ) : visible.length === 0 ? (
          <p className="panel__empty">
            {projects.length === 0 ? 'Nenhum projeto ainda. Clique em “Cadastrar Projeto”.' : 'Nenhum projeto com esses filtros.'}
          </p>
        ) : (
          <ul className="cards">
            {visible.map((project) => (
              <li key={project.id} className={`card${project.published ? '' : ' card--off'}`}>
                <div className="card__cover">
                  {project.cover_url ? <img src={project.cover_url} alt="" /> : <span>Sem capa</span>}
                  <span className="card__tags">
                    {!project.published && <span className="tag tag--dark">Desativado</span>}
                    {project.published && project.featured && <span className="tag">Na home</span>}
                  </span>
                </div>
                <h3 className="card__title">{project.title}</h3>
                <p className="card__meta">{project.categories || 'Sem especialidades'}</p>
                <p className="card__text">{project.description || 'Sem descrição.'}</p>
                <div className="card__footer">
                  <span className="card__info">
                    {linkLabels[project.link_type]}
                    {project.link_url && project.link_type !== 'none' && (
                      <a href={project.link_url} target="_blank" rel="noreferrer" aria-label="Abrir link">
                        ↗
                      </a>
                    )}
                  </span>
                  {!filtered && (
                    <span className="card__order">
                      <button type="button" aria-label="Mover para trás" onClick={() => move(project, -1)}>
                        ←
                      </button>
                      <button type="button" aria-label="Mover para frente" onClick={() => move(project, 1)}>
                        →
                      </button>
                    </span>
                  )}
                  <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(project)}>
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && (
        <ProjectForm
          project={editing === 'new' ? null : editing}
          nextPosition={(projects?.reduce((max, p) => Math.max(max, p.position), 0) ?? 0) + 1}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </section>
  );
}
