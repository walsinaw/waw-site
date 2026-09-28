import heroBg from '../assets/hero-bg.png';
import Arrow from './Arrow';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="inicio" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero__content container">
        <p className="hero__kicker">Seu studio de criatividade e crescimento digital.</p>

        <h1 className="hero__title" aria-label="O extraordinário começa com um UAU.">
          <span className="hero__line" aria-hidden="true">
            O EXTRAORDINÁRIO
          </span>
          <span className="hero__line hero__line--second" aria-hidden="true">
            {/* A cedilha é um "s" menor sob o C, exatamente como no Figma */}
            COME
            <span className="hero__cedilla">
              C<span className="hero__cedilla-mark">s</span>
            </span>
            A COM UM <span className="hero__uau">UAU</span>.
          </span>
        </h1>

        <div className="hero__bottom">
          <p className="hero__support">
            Estratégia, design, tecnologia e comunicação para transformar ideias em marcas que não passam
            despercebidas.
          </p>
          <div className="hero__actions">
            <a href="#contato" className="pill pill--red">
              Vamos criar algo incrível
              <Arrow variant="small" direction="right" className="pill__arrow" />
            </a>
            <a href="#sobre" className="hero__more">
              Saiba mais
              <Arrow variant="down" direction="down" className="hero__more-arrow" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
