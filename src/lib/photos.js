const MAX_PHOTOS = 5;
const MAX_EDGE = 1600;

export function driveIdFromUrl(value) {
  const text = String(value || "");
  const match = text.match(/[?&]id=([a-zA-Z0-9_-]+)/) || text.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}

export function photosFromItem(item) {
  return (item.photos || []).filter(Boolean).map((src, index) => ({
    key: `${src}-${index}`,
    src,
    id: driveIdFromUrl(src),
  }));
}

async function blobToBase64(blob) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("写真を読み取れませんでした。"));
    reader.readAsDataURL(blob);
  });
  return dataUrl.split(",")[1] || "";
}

export async function compressImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const blob = await drawToJpeg(bitmap.width, bitmap.height, (context, width, height) => {
      context.drawImage(bitmap, 0, 0, width, height);
    });
    bitmap.close();
    return namedJpeg(file, blob);
  } catch (error) {
    const image = await loadImage(file);
    const blob = await drawToJpeg(image.naturalWidth, image.naturalHeight, (context, width, height) => {
      context.drawImage(image, 0, 0, width, height);
    });
    return namedJpeg(file, blob);
  }
}

function namedJpeg(file, blob) {
  return blobToBase64(blob).then((data) => ({
    name: String(file.name || "photo").replace(/\.[^.]+$/, "") + ".jpg",
    mimeType: "image/jpeg",
    data,
  }));
}

async function drawToJpeg(sourceWidth, sourceHeight, draw) {
  const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight, 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  draw(canvas.getContext("2d"), canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) throw new Error("写真を変換できませんでした。");
  return blob;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("写真を読み取れませんでした。"));
    image.src = URL.createObjectURL(file);
  });
}

export async function photosToPayload(items) {
  const limited = items.slice(0, MAX_PHOTOS);
  const payload = [];
  for (const item of limited) {
    if (item.file) {
      payload.push(await compressImage(item.file));
    } else if (item.id || item.src) {
      payload.push({ id: item.id || driveIdFromUrl(item.src), url: item.src || "" });
    }
  }
  return payload;
}

export { MAX_PHOTOS };
