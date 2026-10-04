import julia from '../assets/julia-alsina.webp';
import juliaSmall from '../assets/julia-alsina-sm.webp';
import frame from '../assets/moldura.webp';
import frameSmall from '../assets/moldura-sm.webp';
import './sections.css';

const facts = [
  { value: '3 anos', label: 'em comunicação digital' },
  { value: '3 frentes', label: 'design, desenvolvimento e marketing' },
  { value: '1 equipe', label: 'do briefing à entrega' },
];

export default function Intro() {
  return (
    <section className="section intro" id="sobre">
      <div className="container split">
        <p className="eyebrow">Sobre a WAW</p>
        <h2 className="display">
          Não fazemos só comunicação. <b>Criamos presença.</b>
        </h2>
        <div className="intro__text">
          <p className="lead">
            A WAW Studio é uma agência de marketing e studio criativo de Pelotas/RS que atende marcas de todo o Brasil.
            Unimos estratégia, criatividade e tecnologia para construir marcas que têm algo a dizer, experiências que
            despertam interesse e projetos que fazem sentido para o negócio.
          </p>
          <p className="lead">
            Do primeiro conceito ao último detalhe, pensamos em como sua marca pode ser percebida, lembrada e escolhida.
          </p>
        </div>
      </div>

      <div className="container founder">
        <figure className="founder__photo">
          <span className="founder__picture">
            {/* Versões menores para o celular; o navegador escolhe pelo tamanho e pela densidade da tela */}
            <img
              src={julia}
              srcSet={`${juliaSmall} 700w, ${julia} 1000w`}
              sizes="(max-width: 860px) min(86vw, 362px), 520px"
              alt="Julia Alsina, CEO da WAW Studio"
              loading="lazy"
            />
            <img
              src={frame}
              srcSet={`${frameSmall} 760w, ${frame} 900w`}
              sizes="(max-width: 860px) min(98vw, 412px), 590px"
              alt=""
              className="founder__frame"
              loading="lazy"
            />
          </span>
          <figcaption>Julia Alsina, fundadora da WAW</figcaption>
        </figure>

        <div className="founder__text">
          <p className="eyebrow">Liderança</p>
          <h2 className="display">
            Quem está à frente da <b>WAW?</b>
          </h2>
          <p className="lead">
            Sou a Ju, fundadora da WAW! Há 3 anos trabalho com comunicação digital, ajudando marcas a descobrirem o
            próprio jeito de aparecer: da estratégia ao post, do posicionamento ao site no ar.
          </p>
          <p className="lead">
            Criei a WAW pra ser o lugar onde estratégia e criatividade andam juntas. Acompanho cada projeto de perto e
            conto com uma equipe bem preparada em design, conteúdo, tráfego e desenvolvimento, para que cada entrega
            tenha cuidado do começo ao fim.
          </p>

          <dl className="founder__facts">
            {facts.map((fact) => (
              <div key={fact.value}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
