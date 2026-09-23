const MAX_LENGTH = 100_000;
const SIZES = [256, 192, 128];

export class ImageTooLargeError extends Error {}

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image could not be read'));
    };
    img.src = url;
  });

const draw = (img, size, crop) => {
  const { naturalWidth: w, naturalHeight: h } = img;
  let sx = 0;
  let sy = 0;
  let sw = w;
  let sh = h;
  if (crop) {
    const side = Math.min(w, h);
    sx = (w - side) / 2;
    sy = (h - side) / 2;
    sw = side;
    sh = side;
  }

  const scale = Math.min(1, size / Math.max(sw, sh));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sw * scale));
  canvas.height = Math.max(1, Math.round(sh * scale));
  canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
};

export async function resizeImage(file, { crop = false } = {}) {
  const img = await loadImage(file);

  for (const size of SIZES) {
    const canvas = draw(img, size, crop);
    let dataUrl = canvas.toDataURL('image/webp', 0.85);
    if (!dataUrl.startsWith('data:image/webp')) {
      dataUrl = crop ? canvas.toDataURL('image/jpeg', 0.85) : canvas.toDataURL('image/png');
    }
    if (dataUrl.length <= MAX_LENGTH) return dataUrl;
  }

  throw new ImageTooLargeError('Image is too large');
}
