import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../components/useProjects';
import '../components/Portfolio.css';
import { useScrollReveal } from '../lib/useScrollReveal';
import { usePageMeta } from '../lib/usePageMeta';

export default function PortfolioPage() {
  useScrollReveal();
  usePageMeta('/portfolio');
  const projects = useProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header alwaysScrolled />
      <main className="section portfolio-page">
        <div className="container split">
          <p className="eyebrow">Portfólio</p>
          <div>
            <h1 className="display">
              Projetos que <b>fizeram acontecer.</b>
            </h1>
            <p className="lead">
              Cada projeto começa com um desafio. O resultado é uma solução pensada para fazer a marca avançar.
            </p>
          </div>
        </div>

        <div className="container">
          <div className="portfolio__grid" aria-busy={projects === null}>
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {projects?.length === 0 && <p className="lead">Nenhum projeto publicado ainda.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
