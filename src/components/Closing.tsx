import Arrow from './Arrow';
import './sections.css';

export default function Closing() {
  return (
    <section className="closing">
      <div className="container">
        <div className="split">
          <p className="eyebrow">Próximo passo</p>
          <div>
            <h2 className="display">
              Sua próxima grande ideia <b>começa aqui.</b>
            </h2>
            <p className="closing__text">
              Você traz o desafio. A gente transforma em algo que dá vontade de dizer:
            </p>
          </div>
        </div>

        <p className="closing__waw" aria-hidden="true">
          WAW.
        </p>

        <div className="closing__action">
          <a href="#contato" className="pill pill--white">
            Vamos conversar
            <Arrow variant="small" direction="right" className="pill__arrow closing__arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
