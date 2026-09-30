import julia from '../assets/julia-alsina.jpeg';
import frame from '../assets/moldura.png';
import './sections.css';

const facts = [
  { value: '3 anos', label: 'em comunicação digital' },
  { value: '3 frentes', label: 'design, web e tráfego pago' },
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
            A WAW Studio une estratégia, criatividade e tecnologia para construir marcas que têm algo a dizer,
            experiências que despertam interesse e projetos que fazem sentido para o negócio.
          </p>
          <p className="lead">
            Do primeiro conceito ao último detalhe, pensamos em como sua marca pode ser percebida, lembrada e
            escolhida.
          </p>
        </div>
      </div>

      <div className="container founder">
        <figure className="founder__photo">
          <span className="founder__picture">
            <img src={julia} alt="Julia Alsina, CEO da WAW Studio" loading="lazy" />
            <img src={frame} alt="" className="founder__frame" loading="lazy" />
          </span>
          <figcaption>Julia Alsina, fundadora da WAW</figcaption>
        </figure>

        <div className="founder__text">
          <p className="eyebrow">Liderança</p>
          <h2 className="display">
            Quem está à frente da <b>WAW?</b>
          </h2>
          <p className="lead">
            Sou a Ju, fundadora da WAW! Há 3 anos trabalho com comunicação digital, ajudando marcas a
            descobrirem o próprio jeito de aparecer: da estratégia ao post, do posicionamento ao site no ar.
          </p>
          <p className="lead">
            Criei a WAW para ser o lugar onde estratégia e criatividade andam juntas. Acompanho cada projeto de
            perto e conto com uma equipe bem preparada em design, conteúdo, tráfego e desenvolvimento, para que
            cada entrega tenha cuidado do começo ao fim.
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
