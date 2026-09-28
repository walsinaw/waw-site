import type { Project } from '../lib/types';
import dot from '../assets/dot.svg';
import hoverGradient from '../assets/marquesa-hover.png';
import behance from '../assets/behance.svg';
import Arrow from './Arrow';
import './Portfolio.css';

// Card do portfólio: layout do Figma (imagem, nome ● categorias) + descrição curta.
export default function ProjectCard({ project }: { project: Project }) {
  const href = project.link_type !== 'none' && project.link_url ? project.link_url : null;

  const content = (
    <>
      <div className="project__media">
        {project.cover_url && <img src={project.cover_url} alt="" className="project__image" loading="lazy" />}
        {href && (
          <>
            <img src={hoverGradient} alt="" className="project__hover" />
            {project.link_type === 'behance' ? (
              <img src={behance} alt="" className="project__badge project__badge--behance" />
            ) : (
              <span className="project__badge project__badge--site">
                Ver site
                <Arrow variant="small" direction="up-right" className="project__badge-arrow" />
              </span>
            )}
          </>
        )}
      </div>
      <div className="project__caption">
        <h3 className="project__name">{project.title}</h3>
        {project.categories && (
          <p className="project__tags">
            <img src={dot} alt="" className="project__dot" />
            {project.categories}
          </p>
        )}
      </div>
      {project.description && <p className="project__description">{project.description}</p>}
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="project project--link"
      aria-label={`${project.title} — ${project.link_type === 'behance' ? 'ver no Behance' : 'ver o site'}`}
    >
      {content}
    </a>
  ) : (
    <div className="project">{content}</div>
  );
}
