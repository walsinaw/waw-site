import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Arrow from '../components/Arrow';
import './NotFoundPage.css';

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = 'Página não encontrada — WAW Studio';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => {
      robots.remove();
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <Header alwaysScrolled />
      <main className="section not-found">
        <div className="container">
          <p className="not-found__code" aria-hidden="true">
            404
          </p>
          <h1 className="display">
            Essa página não existe. <b>Mas o UAU continua.</b>
          </h1>
          <p className="lead">O endereço pode ter mudado ou ter sido digitado errado.</p>
          <div className="not-found__actions">
            <Link to="/" className="pill pill--red">
              Voltar para o início
              <Arrow variant="small" direction="right" className="pill__arrow" />
            </Link>
            <Link to="/portfolio" className="not-found__link">
              Ver portfólio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
