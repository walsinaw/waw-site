import setaOrcamento from '../assets/seta-orcamento.svg?raw';
import setaCard from '../assets/seta-card.svg?raw';
import setaBaixo from '../assets/seta-baixo.svg?raw';

const sources = {
  small: setaOrcamento,
  card: setaCard,
  down: setaBaixo,
};

const recolored = Object.fromEntries(
  Object.entries(sources).map(([key, svg]) => [
    key,
    svg
      .replace(/(fill|stroke)="white"/g, '$1="currentColor"')
      .replace(/ style="[^"]*"/, '')
      .replace(/ width="[^"]*" height="[^"]*"/, ' width="100%" height="100%"'),
  ]),
) as Record<keyof typeof sources, string>;

interface ArrowProps {
  variant: keyof typeof sources;
  direction: 'right' | 'down' | 'up-right';
  className?: string;
}

const rotation = { right: 90, down: 180, 'up-right': 45 };

export default function Arrow({ variant, direction, className }: ArrowProps) {
  return (
    <span
      aria-hidden="true"
      className={`arrow-svg ${className ?? ''}`}
      style={{ display: 'inline-block', flex: 'none', transform: `rotate(${rotation[direction]}deg)` }}
      dangerouslySetInnerHTML={{ __html: recolored[variant] }}
    />
  );
}
