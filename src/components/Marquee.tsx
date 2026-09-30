import './Marquee.css';

const items = [
  'Design e identidade visual',
  'Social media',
  'Edição de vídeo',
  'Captação de foto e vídeo',
  'Assessoria e copywriting',
  'Sites e sistemas',
  'Tráfego pago',
];

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__list" aria-hidden={copy === 1 || undefined}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
