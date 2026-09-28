import { splitCategories, type Project } from '../lib/types';
import hoverGradient from '../assets/marquesa-hover.png';
import behance from '../assets/behance.svg';
import Arrow from './Arrow';
import './Portfolio.css';

// Card do portfólio: layout do Figma (imagem, nome ● categorias) + descrição curta.
const linkLabels = { behance: 'ver no Behance', site: 'ver o site', instagram: 'ver no Instagram', none: '' };

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.link_type !== 'none' && project.link_url ? project.link_url : null;

  const content = (
    <>
      <div className="project__media">
        {project.cover_url && <img src={project.cover_url} alt="" className="project__image" loading="lazy" />}
        {/* Sombra do Figma no hover, com as soluções no canto inferior esquerdo */}
        <img src={hoverGradient} alt="" className="project__hover" />
        {project.categories && (
          <p className="project__overlay-tags">
            {splitCategories(project.categories).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        )}
        {href &&
          (project.link_type === 'behance' ? (
            <img src={behance} alt="" className="project__badge project__badge--behance" />
          ) : (
            <span className="project__badge project__badge--site">
              {project.link_type === 'instagram' ? 'Ver no Instagram' : 'Ver site'}
              <Arrow variant="small" direction="up-right" className="project__badge-arrow" />
            </span>
          ))}
      </div>
      {/* As especialidades aparecem só na imagem, no hover */}
      <h3 className="project__name">{project.title}</h3>
      {project.description && <p className="project__description">{project.description}</p>}
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="project project--link"
      aria-label={`${project.title} — ${linkLabels[project.link_type]}`}
    >
      {content}
    </a>
  ) : (
    <div className="project">{content}</div>
  );
}
