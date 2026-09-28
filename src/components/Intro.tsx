import './sections.css';

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
    </section>
  );
}
