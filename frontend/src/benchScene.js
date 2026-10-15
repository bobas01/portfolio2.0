import { Application, Graphics } from "pixi.js";

const COLS = 168;
const ROWS = 160;

const wood = {
  light: 0xf0d7a2,
  plank: 0xd7a45c,
  plankDark: 0xc48c44,
  seam: 0x8a5a2c,
  lip: 0x6b3e1e,
  edge: 0x3e2412,
  board: 0x8d5a30,
  drawer: 0xb67a3c,
  knob: 0xf6e7c4,
  leg: 0x4a2c16,
  legLite: 0xc99558,
};

function block(g, x, y, w, h, color) {
  g.rect(x, y, w, h).fill(color);
}

function hammer(g, x, y) {
  block(g, x + 3, y, 6, 4, 0x8d9096);
  block(g, x, y + 4, 12, 3, 0x5c6068);
  block(g, x + 5, y + 7, 2, 10, 0x6b3e1e);
}

function wrench(g, x, y) {
  block(g, x, y, 4, 3, 0x9aa0a8);
  block(g, x + 1, y + 3, 2, 8, 0x6e747c);
  block(g, x, y + 11, 4, 3, 0x9aa0a8);
}

export async function mountBench(host) {
  const app = new Application();
  const ready = app.init({
    backgroundAlpha: 0,
    antialias: false,
    roundPixels: true,
    resolution: 1,
    width: COLS,
    height: ROWS,
  });
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("pixi")), 2000);
  });
  await Promise.race([ready, timeout]);
  app.canvas.className = "pixi-wood";
  host.appendChild(app.canvas);
  const g = new Graphics();
  app.stage.addChild(g);

  const paint = () => {
    app.renderer.resize(COLS, ROWS);
    g.clear();

    block(g, 28, 0, 112, 22, wood.board);
    block(g, 28, 0, 112, 2, wood.plank);
    block(g, 28, 20, 112, 2, wood.edge);
    for (let x = 40; x < 128; x += 18) block(g, x, 6, 2, 10, wood.edge);
    hammer(g, 46, 4);
    wrench(g, 118, 3);

    block(g, 6, 22, 156, 58, wood.plank);
    for (let y = 28; y < 76; y += 4) block(g, 10, y, 148, 1, y % 8 === 4 ? wood.seam : wood.plankDark);
    block(g, 6, 22, 156, 2, wood.light);
    block(g, 6, 22, 6, 58, 0xa86b34);
    block(g, 156, 22, 6, 58, 0xa86b34);
    block(g, 6, 80, 156, 12, wood.lip);
    block(g, 6, 90, 156, 2, wood.edge);

    block(g, 16, 92, 136, 48, 0x8d552c);
    block(g, 22, 98, 58, 36, wood.drawer);
    block(g, 88, 98, 58, 36, wood.drawer);
    block(g, 22, 98, 58, 3, wood.light);
    block(g, 88, 98, 58, 3, wood.light);
    block(g, 22, 131, 58, 3, wood.edge);
    block(g, 88, 131, 58, 3, wood.edge);
    block(g, 46, 112, 8, 6, wood.knob);
    block(g, 112, 112, 8, 6, wood.knob);

    for (const x of [6, 150]) {
      block(g, x, 86, 14, 68, wood.leg);
      block(g, x + 10, 86, 4, 68, wood.legLite);
      block(g, x - 2, 150, 18, 6, wood.edge);
    }
  };

  const station = host.parentElement;
  if (station) {
    station.style.setProperty("--pad-top", `${(24 / ROWS) * 100}%`);
    station.style.setProperty("--pad-height", `${(54 / ROWS) * 100}%`);
    station.style.setProperty("--pad-left", `${(12 / COLS) * 100}%`);
    station.style.setProperty("--pad-right", `${(12 / COLS) * 100}%`);
  }

  paint();
  app.render();
  app.ticker.stop();
  return () => {
    app.destroy(true);
  };
}
