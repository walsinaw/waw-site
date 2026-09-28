import { steps } from '../data/content';
import './sections.css';

export default function Process() {
  return (
    <section className="section process" id="processo">
      <div className="container split">
        <p className="eyebrow">Processo</p>
        <h2 className="display">
          Do primeiro uau <b>ao resultado.</b>
        </h2>
      </div>

      <ol className="container process__steps">
        {steps.map((step, index) => (
          <li key={step.title} className="process__step">
            <span className="process__number">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="process__title">{step.title}</h3>
            <p className="process__text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
