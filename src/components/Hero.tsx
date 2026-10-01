import Arrow from './Arrow';
import Grainient from './Grainient';
import './Hero.css';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__bg" aria-hidden="true">
        <Grainient
          color1="#b30208"
          color2="#09040a"
          color3="#d9d6cf"
          timeSpeed={reducedMotion ? 0 : 0.25}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
      </div>
      <div className="hero__content container">
        <p className="hero__kicker">Seu studio de criatividade e crescimento digital.</p>

        <h1 className="hero__title" aria-label="O extraordinário começa com um UAU.">
          <span className="hero__line" aria-hidden="true">
            O EXTRAORDINÁRIO
          </span>
          <span className="hero__line hero__line--second" aria-hidden="true">
            COMEÇA COM UM <span className="hero__uau">UAU</span>.
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
