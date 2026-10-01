import { splitCategories, type Project } from '../lib/types';
import './Portfolio.css';

const linkLabels = { behance: 'ver no Behance', site: 'ver o site', instagram: 'ver no Instagram', none: '' };

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.link_type !== 'none' && project.link_url ? project.link_url : null;
  const categories = project.categories ? splitCategories(project.categories).join(', ') : '';

  const content = (
    <>
      {project.cover_url && <img src={project.cover_url} alt="" className="project__image" loading="lazy" />}
      <span className="project__info">
        <span className="project__name">{project.title}</span>
        {categories && <span className="project__tags">{categories}</span>}
      </span>
      {href && (
        <span className="project__go" aria-hidden="true">
          ver
        </span>
      )}
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="project project--link"
      aria-label={`${project.title}: ${linkLabels[project.link_type]}`}
    >
      {content}
    </a>
  ) : (
    <div className="project">{content}</div>
  );
}
