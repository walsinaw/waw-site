import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { useProjects } from './useProjects';
import './Portfolio.css';

export default function Portfolio() {
  const projects = useProjects(true);

  return (
    <section className="section portfolio" id="portfolio">
      <div className="container">
        <div className="portfolio__header">
          <h2>
            <span className="figma-title__label">WAW Studio</span>
            <span className="figma-title__line">PORTFÓLIO</span>
          </h2>
          <div className="portfolio__intro">
            <p className="portfolio__intro-title">Projetos que fizeram acontecer.</p>
            <p className="portfolio__intro-text">
              Cada projeto começa com um desafio. O resultado é uma solução pensada para fazer a marca avançar.
            </p>
          </div>
        </div>

        <div className="portfolio__grid" aria-busy={projects === null}>
          {projects?.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="portfolio__more">
          <Link to="/portfolio" className="pill pill--red">
            Conhecer portfólio completo
          </Link>
        </div>
      </div>
    </section>
  );
}
