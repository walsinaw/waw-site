import { contact, footerServices } from '../data/content';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <a href="/#inicio" aria-label="WAW Studio — voltar ao início">
              <Logo variant="waw" alt="WAW Studio" className="footer__logo" />
            </a>
            <p className="footer__about">
              Estratégia, criatividade e tecnologia para marcas que querem ser lembradas.
            </p>
          </div>

          <div>
            <p className="footer__heading">// Serviços</p>
            <p className="footer__services">{footerServices.join(' · ')}</p>
          </div>

          <nav aria-label="Rodapé">
            <p className="footer__heading">// Links</p>
            <ul className="footer__list">
              <li><a href="/#sobre">Sobre</a></li>
              <li><a href="/#servicos">Serviços</a></li>
              <li><a href="/portfolio">Portfólio</a></li>
              <li><a href="/#contato">Orçamento</a></li>
            </ul>
          </nav>

          <div>
            <p className="footer__heading">// Contato</p>
            <ul className="footer__list">
              <li>
                <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noreferrer">
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={contact.instagramUrl} target="_blank" rel="noreferrer">
                  {contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer__signature">
          O extraordinário começa com um <b>uau.</b>
        </p>

        <p className="footer__copy">© {new Date().getFullYear()} WAW Studio</p>
      </div>
    </footer>
  );
}
