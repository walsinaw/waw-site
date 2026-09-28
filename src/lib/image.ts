// Prepara imagens antes do upload: qualquer tamanho/formato vira uma imagem leve
// recortada no formato certo (capa do portfólio ou foto da equipe).
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

/** Capa do portfólio: formato dos cards (783 × 479, em 2x = 1566 × 958). */
export const prepareCover = (file: File) => prepareImage(file, 1566, 958);

/** Foto da equipe: quadrada, 480 × 480. */
export const preparePhoto = (file: File) => prepareImage(file, 480, 480);

/** Recorta pelo centro na proporção pedida, reduz e comprime em WEBP. */
async function prepareImage(file: File, targetWidth: number, targetHeight: number): Promise<Blob> {
  const image = await loadImage(file);
  const targetRatio = targetWidth / targetHeight;
  const sourceRatio = image.naturalWidth / image.naturalHeight;

  // Área da imagem original que cabe na proporção do card (mesmo efeito do object-fit: cover).
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (sourceRatio > targetRatio) sw = sh * targetRatio;
  else sh = sw / targetRatio;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;

  // Nunca aumenta imagens pequenas (ficariam borradas); só reduz as grandes.
  const scale = Math.min(1, targetWidth / sw);
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
