import { contact, footerServices } from '../data/content';
import Logo from './Logo';
import './Footer.css';

const socials = [
  {
    label: 'Instagram',
    href: contact.instagramUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${contact.whatsappNumber}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: contact.behanceUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.2 11.4c.9-.4 1.4-1.1 1.4-2.1C9.6 7.3 8.1 6.5 6.1 6.5H1.5v11h4.8c2 0 3.8-1 3.8-3.1 0-1.4-.7-2.5-1.9-3ZM3.6 8.3h2c.8 0 1.6.2 1.6 1.2 0 .9-.6 1.2-1.4 1.2H3.6V8.3Zm2.3 7.4H3.6v-3.1h2.3c1 0 1.7.4 1.7 1.5s-.8 1.6-1.7 1.6ZM17.6 9.4c-2.4 0-4 1.8-4 4.1 0 2.4 1.5 4.1 4 4.1 1.9 0 3.1-.8 3.7-2.7h-1.9c-.2.7-1 1-1.7 1-1.3 0-2-.8-2-2.1h5.7c.1-2.6-1.3-4.4-3.8-4.4Zm-1.9 3.3c.1-1.1.8-1.7 1.8-1.7 1.1 0 1.6.6 1.7 1.7h-3.5ZM15.2 7h4.6v1.2h-4.6V7Z" />
      </svg>
    ),
  },
];

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
            <ul className="footer__socials">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="footer__social"
                    aria-label={social.label}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer__heading">// Serviços</p>
            <ul className="footer__list">
              {footerServices.map((service) => (
                <li key={service}>
                  <a href="/#servicos">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Rodapé" className="footer__links">
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

        <p className="footer__copy">© {new Date().getFullYear()} WAW Studio</p>
      </div>
    </footer>
  );
}
