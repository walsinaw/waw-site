import { Fragment } from 'react';
import { connected } from '../data/content';
import './sections.css';

export default function Connected() {
  return (
    <section className="section connected">
      <div className="container split">
        <p className="eyebrow">Tudo conectado</p>
        <h2 className="display">
          Tudo conectado. <b>Tudo com propósito.</b>
        </h2>

        <ul className="connected__statements">
          {connected.statements.map((statement) => (
            <li key={statement}>{statement}</li>
          ))}
        </ul>

        <p className="connected__note">Na WAW, cada parte do projeto conversa com a outra.</p>
      </div>

      <div className="container">
        {/* Leitores de tela leem o texto como está na tela: "Estratégia + Design + …" */}
        <p className="connected__equation">
          {connected.pillars.map((pillar, index) => (
            <Fragment key={pillar}>
              {index > 0 && <span className="connected__plus">+</span>}
              <span>{pillar}</span>
            </Fragment>
          ))}
        </p>
      </div>

      <div className="container split">
        <p className="connected__closing">
          Porque quando tudo funciona junto, sua marca vai <b>muito mais longe.</b>
        </p>
      </div>
    </section>
  );
}
