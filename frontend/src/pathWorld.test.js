import { describe, expect, it } from "vitest";
import { fillSpriteHoles, toPathX } from "./pathWorld.js";
import { WORLD, stops } from "./walk.js";

describe("toPathX", () => {
  it("pose le départ à zéro et espace les pancartes", () => {
    expect(toPathX(WORLD.minX)).toBe(0);
    const places = stops.map((stop) => toPathX(stop.x));
    expect(places[0]).toBeGreaterThan(0);
    expect(places[1]).toBeGreaterThan(places[0]);
    expect(places[3]).toBeGreaterThan(places[2]);
  });
});

describe("fillSpriteHoles", () => {
  it("rebouche un trou intérieur et laisse le bord transparent", () => {
    const pixels = new Uint8ClampedArray(3 * 3 * 4);
    const paint = (x, y, alpha) => {
      const index = (y * 3 + x) * 4;
      pixels[index] = 10;
      pixels[index + 1] = 14;
      pixels[index + 2] = 12;
      pixels[index + 3] = alpha;
    };
    paint(1, 0, 255);
    paint(0, 1, 255);
    paint(2, 1, 255);
    paint(1, 2, 255);
    fillSpriteHoles(pixels, 3, 3);
    expect(pixels[(1 * 3 + 1) * 4 + 3]).toBe(255);
    expect(pixels[3]).toBe(0);
  });
});
