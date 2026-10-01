import { services } from '../data/content';
import checkIcon from '../assets/check.svg';
import Arrow from './Arrow';
import './Solutions.css';

export default function Solutions() {
  return (
    <section className="section solutions" id="servicos">
      <div className="container">
        <div className="solutions__header">
          <h2>
            <span className="figma-title__label">WAW Studio</span>
            <span className="figma-title__line">NOSSAS</span>
            <span className="figma-title__line">SOLUÇÕES</span>
          </h2>
          <div className="solutions__intro">
            <p className="solutions__intro-title">CRIATIVIDADE QUE VAI ALÉM DO VISUAL</p>
            <p className="solutions__intro-text">
              CRIAMOS MARCAS, EXPERIÊNCIAS DIGITAIS E CONTEÚDOS QUE UNEM ESTÉTICA, ESTRATÉGIA E PROPÓSITO.
            </p>
            <p className="solutions__intro-text">
              DO BRANDING AO DIGITAL, CADA PROJETO É PENSADO PARA FAZER SUA MARCA ACONTECER.
            </p>
          </div>
        </div>

        <div className="solutions__cards">
          {services.map((service) => (
            <a
              key={service.id}
              href={`/servicos/${service.id}`}
              className="service"
              aria-label={`${service.title} — conhecer`}
            >
              <span className="service__number" aria-hidden="true">
                {service.number}
              </span>
              <span className="service__shadow" aria-hidden="true" />
              <article className="service__card">
                <p className="service__label">{service.label}</p>
                <h3 className="service__title">{service.title}</h3>
                <p className="service__description">{service.description}</p>
                <ul className="service__items">
                  {service.items.map((item) => (
                    <li key={item} className="service__item">
                      <img src={checkIcon} alt="" className="service__check" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="service__go" aria-hidden="true">
                  <Arrow variant="card" direction="right" className="service__go-arrow" />
                </span>
              </article>
            </a>
          ))}
        </div>

        <div className="solutions__cta">
          <p className="solutions__cta-title">Estratégia e criatividade para marcas que querem ir além.</p>
          <p className="solutions__cta-text">Design, tecnologia e comunicação para fazer sua marca acontecer.</p>
          <a href="#contato" className="pill pill--white">
            Fale conosco
          </a>
        </div>
      </div>
    </section>
  );
}
