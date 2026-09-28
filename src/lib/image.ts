// Prepara a capa antes do upload: qualquer tamanho/formato vira uma imagem leve
// no formato exato dos cards do portfólio (783 × 479, em 2x = 1566 × 958).
const TARGET_WIDTH = 1566;
const TARGET_HEIGHT = 958;
const QUALITY = 0.86;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não consegui abrir essa imagem. Tente um JPG, PNG ou WEBP.'));
    };
    image.src = url;
  });
}

/** Recorta pelo centro na proporção do card, reduz para 1566 × 958 e comprime em WEBP. */
export async function prepareCover(file: File): Promise<Blob> {
  const image = await loadImage(file);
  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const sourceRatio = image.naturalWidth / image.naturalHeight;

  // Área da imagem original que cabe na proporção do card (mesmo efeito do object-fit: cover).
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (sourceRatio > targetRatio) sw = sh * targetRatio;
  else sh = sw / targetRatio;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;

  // Nunca aumenta imagens pequenas (ficariam borradas); só reduz as grandes.
  const scale = Math.min(1, TARGET_WIDTH / sw);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);

  const context = canvas.getContext('2d')!;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Não consegui converter a imagem.'))),
      'image/webp',
      QUALITY,
    ),
  );
}
