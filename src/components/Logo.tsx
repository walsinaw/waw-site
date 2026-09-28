import logoWaw from '../assets/logo-waw.png';
import logoW from '../assets/logo-w.png';

// Os PNGs originais têm muita margem; o recorte reproduz o do Figma.
const crops = {
  waw: { src: logoWaw, width: '100%', height: '318.18%', left: '0', top: '-109.09%' },
  w: { src: logoW, width: '156.84%', height: '226.1%', left: '-29.47%', top: '-63.81%' },
};

interface LogoProps {
  variant: keyof typeof crops;
  className?: string;
  alt?: string;
}

export default function Logo({ variant, className, alt = '' }: LogoProps) {
  const { src, ...position } = crops[variant];
  return (
    <span className={className} style={{ display: 'block', overflow: 'hidden' }}>
      <img src={src} alt={alt} style={{ position: 'absolute', maxWidth: 'none', ...position }} />
    </span>
  );
}
