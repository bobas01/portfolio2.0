const SOURCE = 72;
const STEP = 2;
const GRID = SOURCE / STEP;
const DEPTH = 9;
const BLOCK = 2;

function shade(rgb, scale) {
  return [rgb[0] * scale, rgb[1] * scale, rgb[2] * scale];
}

function paint(ctx, x, y, rgb) {
  ctx.fillStyle = `rgb(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0})`;
  ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
}

function sample(pixels, x, y) {
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;
  for (let dy = 0; dy < STEP; dy += 1) {
    for (let dx = 0; dx < STEP; dx += 1) {
      const index = ((y + dy) * SOURCE + (x + dx)) * 4;
      if (pixels[index + 3] < 80) continue;
      red += pixels[index];
      green += pixels[index + 1];
      blue += pixels[index + 2];
      count += 1;
    }
  }
  if (!count) return null;
  return [red / count, green / count, blue / count];
}

function fillEnclosed(cells, color) {
  const seen = new Uint8Array(GRID * GRID);
  const stack = [];
  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return;
    const index = y * GRID + x;
    if (seen[index] || cells[index]) return;
    seen[index] = 1;
    stack.push(index);
  };
  for (let x = 0; x < GRID; x += 1) {
    visit(x, 0);
    visit(x, GRID - 1);
  }
  for (let y = 0; y < GRID; y += 1) {
    visit(0, y);
    visit(GRID - 1, y);
  }
  while (stack.length) {
    const index = stack.pop();
    const x = index % GRID;
    const y = Math.floor(index / GRID);
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }
  for (let index = 0; index < cells.length; index += 1) {
    if (!cells[index] && !seen[index]) cells[index] = color;
  }
}

function parseHex(value) {
  const parts = value.replace("#", "").match(/[\da-f]{2}/gi);
  if (!parts || parts.length < 3) return [180, 255, 80];
  return parts.slice(0, 3).map((part) => Number.parseInt(part, 16));
}

export function extrudeMark(image, led, holeColor) {
  const source = document.createElement("canvas");
  source.width = SOURCE;
  source.height = SOURCE;
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  sourceContext.imageSmoothingEnabled = false;
  sourceContext.clearRect(0, 0, SOURCE, SOURCE);
  sourceContext.drawImage(image, 0, 0, SOURCE, SOURCE);
  const pixels = sourceContext.getImageData(0, 0, SOURCE, SOURCE).data;
  const cells = new Array(GRID * GRID).fill(null);
  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      cells[y * GRID + x] = sample(pixels, x * STEP, y * STEP);
    }
  }
  if (holeColor) fillEnclosed(cells, parseHex(holeColor));

  const at = (x, y) => {
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return null;
    return cells[y * GRID + x];
  };

  const pad = led ? 2 : 1;
  const canvas = document.createElement("canvas");
  canvas.width = (GRID + DEPTH + pad * 2) * BLOCK;
  canvas.height = (GRID + DEPTH + pad * 2) * BLOCK;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  for (let depth = DEPTH; depth >= 1; depth -= 1) {
    const scale = 0.22 + ((DEPTH - depth) / DEPTH) * 0.38;
    for (let y = 0; y < GRID; y += 1) {
      for (let x = 0; x < GRID; x += 1) {
        const rgb = at(x, y);
        if (!rgb) continue;
        paint(ctx, pad + x, pad + y + depth, shade(rgb, scale));
      }
    }
  }

  if (led) {
    const glow = parseHex(led);
    for (let y = -pad; y < GRID + pad; y += 1) {
      for (let x = -pad; x < GRID + pad; x += 1) {
        if (at(x, y)) continue;
        const near =
          at(x + 1, y) || at(x - 1, y) || at(x, y + 1) || at(x, y - 1) || at(x + 1, y + 1);
        if (near) paint(ctx, pad + x, pad + y, glow);
      }
    }
  }

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      const rgb = at(x, y);
      if (!rgb) continue;
      const lit = !at(x, y - 1) || !at(x - 1, y);
      paint(
        ctx,
        pad + x,
        pad + y,
        lit ? [Math.min(255, rgb[0] + 48), Math.min(255, rgb[1] + 48), Math.min(255, rgb[2] + 36)] : rgb,
      );
    }
  }

  return canvas.toDataURL();
}
