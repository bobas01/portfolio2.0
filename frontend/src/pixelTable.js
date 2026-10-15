const WOOD = ["#efd0a0", "#e0b56e", "#c99558", "#d7a66a", "#b8834a"];
const SEAM = "#6a4124";
const EDGE = "#4a2c14";
const LIP = ["#f6e2bc", "#d7a66a", "#a56c38", "#6b4224", "#3a2212"];

export function drawBench(canvas) {
  const pixel = 8;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width < pixel || height < pixel) return;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);

  const legHeight = pixel * 14;
  const lipHeight = pixel * LIP.length;
  const topHeight = height - legHeight;
  const backInset = Math.round((width * 0.12) / pixel) * pixel;

  for (let y = 0; y < topHeight - lipHeight; y += pixel) {
    const progress = y / Math.max(1, topHeight - lipHeight);
    const inset = Math.round((backInset * (1 - progress)) / pixel) * pixel;
    const row = Math.floor(y / pixel);
    const seam = row % 4 === 3;
    ctx.fillStyle = seam ? SEAM : WOOD[Math.floor(row / 4) % WOOD.length];
    ctx.fillRect(inset, y, width - inset * 2, pixel);
    ctx.fillStyle = EDGE;
    ctx.fillRect(inset, y, pixel, pixel);
    ctx.fillRect(width - inset - pixel, y, pixel, pixel);
    if (!seam && row % 4 === 0) {
      ctx.fillStyle = "#fff1d4";
      ctx.fillRect(inset + pixel, y, width - inset * 2 - pixel * 2, pixel);
    }
    if (row % 11 === 5) {
      ctx.fillStyle = "#8d5a30";
      ctx.fillRect(inset + pixel * 8, y, pixel * 2, pixel);
      ctx.fillRect(width - inset - pixel * 14, y, pixel * 3, pixel);
    }
  }

  const lipY = topHeight - lipHeight;
  LIP.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, lipY + index * pixel, width, pixel);
  });

  const legWidth = pixel * 4;
  [pixel * 3, width - pixel * 3 - legWidth].forEach((x) => {
    for (let y = lipY + lipHeight - pixel; y < height; y += pixel) {
      ctx.fillStyle = Math.floor(y / pixel) % 2 === 0 ? "#7a4c28" : "#3e2614";
      ctx.fillRect(x, y, legWidth, pixel);
      ctx.fillStyle = "#24150c";
      ctx.fillRect(x, y, pixel, pixel);
      ctx.fillStyle = "#c99558";
      ctx.fillRect(x + legWidth - pixel, y, pixel, pixel);
    }
  });
}
