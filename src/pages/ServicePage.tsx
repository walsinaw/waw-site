import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Arrow from '../components/Arrow';
import { services, type ServiceId } from '../data/content';
import { servicePages, type Block } from '../data/servicePages';
import { useScrollReveal } from '../lib/useScrollReveal';
import { usePageMeta } from '../lib/usePageMeta';
import './ServicePage.css';

/** "texto **destaque**" → texto <b>destaque</b> */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, index) => (index % 2 ? <b key={index}>{part}</b> : part))}
    </>
  );
}

const number = (index: number) => String(index + 1).padStart(2, '0');

function BlockView({ block }: { block: Block }) {
  if (block.type === 'band') {
    return (
      <section className="svc-band">
        <div className="container svc-band__inner">
          <div>
            <h2 className="display">
              <Rich text={block.title} />
            </h2>
            {block.text?.map((line) => (
              <p key={line} className="svc-band__text">
                <Rich text={line} />
              </p>
            ))}
          </div>
          <a href="#contato" className="pill pill--white">
            {block.button}
            <Arrow variant="small" direction="right" className="pill__arrow" />
          </a>
        </div>
      </section>
    );
  }

  if (block.type === 'services') {
    return (
      <section className="section svc-section">
        <div className="container split">
          <p className="eyebrow">{block.eyebrow}</p>
          <h2 className="display">
            <Rich text={block.title} />
          </h2>
        </div>
        <ol className="container svc-list">
          {block.items.map((item, index) => (
            <li key={item.title} className="svc-list__item">
              <span className="svc-list__number">{number(index)}</span>
              <div className="svc-list__body">
                <h3 className="svc-list__title">{item.title}</h3>
                <div>
                  {item.text && <p className="svc-list__text">{item.text}</p>}
                  {item.tags && (
                    <ul className="svc-tags">
                      {item.tags.split('·').map((tag) => (
                        <li key={tag}>{tag.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === 'steps') {
    return (
      <section className="section svc-section">
        <div className="container split">
          <p className="eyebrow">{block.eyebrow}</p>
          <h2 className="display">
            <Rich text={block.title} />
          </h2>
          {block.intro && (
            <div>
              {block.intro.map((line) => (
                <p key={line} className="lead">
                  <Rich text={line} />
                </p>
              ))}
            </div>
          )}
        </div>
        <ol className={`container svc-steps svc-steps--${block.items.length}`}>
          {block.items.map((item, index) => (
            <li key={item.title} className="svc-steps__item">
              <span className="svc-steps__number">{number(index)}</span>
              <h3 className="svc-steps__title">{item.title}</h3>
              <p className="svc-steps__text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section id={block.id} className={`section svc-section${block.light ? ' svc-section--light' : ''}`}>
      <div className="container split">
        <p className="eyebrow">{block.eyebrow}</p>
        <div>
          <h2 className="display">
            <Rich text={block.title} />
          </h2>
          {block.subtitle && (
            <p className="svc-subtitle">
              <Rich text={block.subtitle} />
            </p>
          )}
          {block.body?.map((line) => (
            <p key={line} className="lead">
              <Rich text={line} />
            </p>
          ))}
          {block.big && (
            <ul className="svc-big">
              {block.big.map((line) => (
                <li key={line}>
                  <Rich text={line} />
                </li>
              ))}
            </ul>
          )}
          {block.chips && (
            <ul className="svc-tags svc-tags--large">
              {block.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          )}
          {block.outro?.map((line) => (
            <p key={line} className="lead svc-outro">
              <Rich text={line} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceContent({ id }: { id: ServiceId }) {
  const page = servicePages[id];
  // O serviço da página já vem marcado no formulário de contato.
  const [selected, setSelected] = useState<ServiceId[]>([id]);
  const others = services.filter((s) => s.id !== id);
  useScrollReveal();
  usePageMeta(`/servicos/${id}`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <Header />
      <main className="svc">
        <section className="svc-hero">
          <span className="svc-hero__word" aria-hidden="true">
            {page.label}
          </span>
          <div className="container svc-hero__content">
            <p className="eyebrow svc-hero__eyebrow">{page.eyebrow}</p>
            <h1 className="svc-hero__title">
              <Rich text={page.title} />
            </h1>
            <div className="svc-hero__bottom">
              <div className="svc-hero__intro">
                {page.intro.map((line) => (
                  <p key={line}>
                    <Rich text={line} />
                  </p>
                ))}
              </div>
              <div className="svc-hero__actions">
                <a href="#contato" className="pill pill--red">
                  {page.primary}
                  <Arrow variant="small" direction="right" className="pill__arrow" />
                </a>
                <a href={page.secondary.href} className="svc-hero__more">
                  {page.secondary.label} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {page.blocks.map((block, index) => (
          <BlockView key={index} block={block} />
        ))}

        <section className="section svc-section">
          <div className="container split">
            <p className="eyebrow">Perguntas frequentes</p>
            <div className="svc-faq">
              {page.faq.map((item) => (
                <details key={item.q} className="svc-faq__item">
                  <summary>
                    {item.q}
                    <span className="svc-faq__icon" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="svc-closing">
          <div className="container split">
            <p className="eyebrow">Próximo passo</p>
            <div>
              <h2 className="display">
                <Rich text={page.closing.title} />
              </h2>
              <p className="svc-closing__text">{page.closing.text}</p>
              <a href="#contato" className="pill pill--white">
                {page.closing.button}
                <Arrow variant="small" direction="right" className="pill__arrow" />
              </a>
            </div>
          </div>
        </section>

        <Contact selectedServices={selected} onChangeServices={setSelected} />

        <section className="svc-others">
          <div className="container">
            <p className="eyebrow">Conheça também</p>
            <div className="svc-others__grid">
              {others.map((service) => (
                <a key={service.id} href={`/servicos/${service.id}`} className="svc-others__card">
                  <span className="svc-others__label">{service.label}</span>
                  <span className="svc-others__title">{service.title}</span>
                  <Arrow variant="small" direction="right" className="svc-others__arrow" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ServicePage() {
  const { slug } = useParams();
  if (!slug || !(slug in servicePages)) return <Navigate to="/#servicos" replace />;
  // key: trocar de /servicos/web para /servicos/ads recomeça a página do zero
  return <ServiceContent key={slug} id={slug as ServiceId} />;
}
