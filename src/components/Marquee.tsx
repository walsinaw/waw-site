import './Marquee.css';

// Resumo dos serviços da WAW
const items = [
  'Design e identidade visual',
  'Social media',
  'Edição de vídeo',
  'Captação de foto e vídeo',
  'Assessoria e copywriting',
  'Sites e sistemas',
  'Tráfego pago',
];

// Faixa off-white com os serviços passando, separados pelo W vermelho. A lista aparece duas vezes para o loop não ter emenda;
// leitores de tela ouvem só a primeira.
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
