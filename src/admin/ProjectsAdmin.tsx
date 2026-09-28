import { useCallback, useEffect, useState } from 'react';
import { deleteProject, listProjects, reorderProjects, saveProject } from '../lib/api';
import type { Project } from '../lib/types';
import ProjectForm from './ProjectForm';

const linkLabels = { behance: 'Behance', site: 'Site', none: 'Sem link' };

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | 'new' | null>(null);
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

  const run = async (action: () => Promise<unknown>) => {
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggle = (project: Project, key: 'published' | 'featured') => {
    const { id, created_at: _createdAt, ...input } = project;
    return run(() => saveProject({ ...input, [key]: !project[key] }, id));
  };

  const move = (index: number, direction: -1 | 1) => {
    if (!projects) return;
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const ordered = [...projects];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    setProjects(ordered);
    return run(() => reorderProjects(ordered));
  };

  const remove = (project: Project) => {
    if (!window.confirm(`Apagar o projeto "${project.title}"? Isso não pode ser desfeito.`)) return;
    return run(() => deleteProject(project.id));
  };

  return (
    <section>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Portfólio</h1>
          <p className="admin-muted">
            A ordem aqui é a ordem do site. A home mostra até 6 projetos marcados como “Na home”.
          </p>
        </div>
        <button type="button" className="admin-button admin-button--primary" onClick={() => setEditing('new')}>
          + Novo projeto
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {projects === null ? (
        <p className="admin-muted">Carregando…</p>
      ) : projects.length === 0 ? (
        <p className="admin-empty">Nenhum projeto ainda. Clique em “Novo projeto”.</p>
      ) : (
        <ul className="admin-projects">
          {projects.map((project, index) => (
            <li key={project.id} className={`admin-project${project.published ? '' : ' admin-project--draft'}`}>
              <div className="admin-project__order">
                <button type="button" aria-label="Subir" onClick={() => move(index, -1)} disabled={index === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Descer"
                  onClick={() => move(index, 1)}
                  disabled={index === projects.length - 1}
                >
                  ↓
                </button>
              </div>

              <div className="admin-project__thumb">
                {project.cover_url && <img src={project.cover_url} alt="" />}
              </div>

              <div className="admin-project__info">
                <strong>{project.title}</strong>
                <span className="admin-muted">{project.categories || '—'}</span>
                <span className="admin-pill">
                  {linkLabels[project.link_type]}
                  {project.link_url && project.link_type !== 'none' && (
                    <a href={project.link_url} target="_blank" rel="noreferrer" className="admin-pill__link">
                      ↗
                    </a>
                  )}
                </span>
              </div>

              <label className="admin-switch">
                <input type="checkbox" checked={project.published} onChange={() => toggle(project, 'published')} />
                <span>Publicado</span>
              </label>
              <label className="admin-switch">
                <input type="checkbox" checked={project.featured} onChange={() => toggle(project, 'featured')} />
                <span>Na home</span>
              </label>

              <div className="admin-project__actions">
                <button type="button" className="admin-link" onClick={() => setEditing(project)}>
                  Editar
                </button>
                <button type="button" className="admin-link admin-link--danger" onClick={() => remove(project)}>
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
