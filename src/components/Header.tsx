import { useEffect, useState } from 'react';
import Arrow from './Arrow';
import Logo from './Logo';
import './Header.css';

const links = [
  { href: '/#inicio', label: 'Início' },
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/portfolio', label: 'Portfólio' },
];

interface HeaderProps {
  /** Em páginas sem o hero vermelho, o menu já começa no estado "rolado". */
  alwaysScrolled?: boolean;
}

export default function Header({ alwaysScrolled = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(alwaysScrolled);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alwaysScrolled) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [alwaysScrolled]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}${open ? ' header--open' : ''}`}>
      <div className="header__inner container">
        <a href="/#inicio" className="header__brand" aria-label="WAW Studio — início" onClick={close}>
          <span className="header__logo">
            <Logo variant="waw" className="header__logo-waw" />
            <Logo variant="w" className="header__logo-w" />
          </span>
          <span className="header__tagline">Studio de criatividade e crescimento digital</span>
        </a>

        <nav className="header__nav" aria-label="Principal">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="header__link" onClick={close}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="/#contato" className="header__cta" onClick={close}>
          Orçamento
          <Arrow variant="small" direction="right" className="header__cta-arrow" />
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
