import { reasons } from '../data/content';
import './sections.css';

export default function Reasons() {
  return (
    <section className="section reasons" id="por-que">
      <div className="container split">
        <p className="eyebrow">Por que a WAW</p>
        <h2 className="display">
          Por que WAW? <b>Porque fazer o básico nunca foi suficiente.</b>
        </h2>
      </div>

      <ol className="container reasons__list">
        {reasons.map((reason, index) => (
          <li key={reason.title} className="reasons__item">
            <span className="reasons__number">/ {String(index + 1).padStart(2, '0')}</span>
            <div className="reasons__body">
              <h3 className="reasons__title">{reason.title}</h3>
              <p className="reasons__text">{reason.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
