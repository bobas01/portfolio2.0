import { describe, expect, it } from "vitest";
import { keyDirection } from "./useJourney.js";
import { createWalk, reduceWalk, stops, WORLD } from "./walk.js";

function travel(state, dir, distance) {
  return reduceWalk(state, { type: "tick", dir, distance });
}

describe("reduceWalk", () => {
  it("part à gauche, tourné vers la droite", () => {
    expect(createWalk()).toMatchObject({ x: 220, facing: 1, mode: "walk", hint: true });
  });

  it("avance et recule sans sortir du chemin", () => {
    const right = travel(createWalk(), 1, 40);
    expect(right.x).toBe(260);
    expect(right.facing).toBe(1);

    const left = travel(right, -1, 400);
    expect(left.x).toBe(260 - WORLD.maxStep);
    expect(left.x).toBeGreaterThan(WORLD.minX);
    expect(left.facing).toBe(-1);

    const end = travel({ ...createWalk(), x: WORLD.maxX - 10 }, 1, 40);
    expect(end.x).toBe(WORLD.maxX);
  });

  it("ouvre la pancarte quand on l'atteint, même en un grand pas", () => {
    const before = { ...createWalk(), x: stops[0].x - 20, hint: true };
    const arrived = travel(before, 1, 80);
    expect(arrived).toMatchObject({
      mode: "sign",
      stopId: "propos",
      x: stops[0].x,
      hint: false,
    });
  });

  it("ignore la marche tant que la pancarte ou la page est ouverte", () => {
    const sign = travel({ ...createWalk(), x: stops[0].x - 10 }, 1, 40);
    expect(travel(sign, 1, 40)).toEqual(sign);
    const page = reduceWalk(sign, { type: "enter" });
    expect(page.mode).toBe("page");
    expect(travel(page, 1, 40)).toEqual(page);
  });

  it("entrer ne fait rien tant qu'une pancarte n'est pas ouverte", () => {
    expect(reduceWalk(createWalk(), { type: "enter" }).mode).toBe("walk");
  });

  it("continuer libère la pancarte sans la rouvrir tant qu'on ne s'éloigne pas", () => {
    const sign = reduceWalk(createWalk(), { type: "open", id: "skills" });
    const walking = reduceWalk(sign, { type: "continue" });
    expect(walking).toMatchObject({ mode: "walk", stopId: null, hold: "skills" });
    expect(walking.x).toBeGreaterThan(stops[1].x + WORLD.leave);

    const still = travel(walking, 1, 30);
    expect(still.mode).toBe("walk");
    expect(still.hold).toBe(null);
    expect(still.stopId).toBe(null);
  });

  it("rencontre la pancarte la plus proche dans le sens de la marche", () => {
    const between = { ...createWalk(), x: stops[1].x + 30, facing: 1 };
    const back = travel(between, -1, 40);
    expect(back.stopId).toBe("skills");
  });

  it("refuse un arrêt inconnu ou injecté", () => {
    const start = createWalk();
    expect(reduceWalk(start, { type: "open", id: "<img onerror=alert(1)>" })).toEqual(start);
    expect(reduceWalk(start, { type: "open", id: "https://wa.me/1" })).toEqual(start);
    expect(reduceWalk(start, { type: "nope" })).toEqual(start);
  });

  it("borne un pas aberrant", () => {
    const next = travel(createWalk(), 1, 10_000);
    expect(next.x - createWalk().x).toBeLessThanOrEqual(WORLD.maxStep);
  });
});

describe("keyDirection", () => {
  it("reconnaît les flèches gauche et droite", () => {
    expect(keyDirection({ key: "ArrowLeft" })).toBe(-1);
    expect(keyDirection({ key: "ArrowRight" })).toBe(1);
    expect(keyDirection({ key: "", code: "ArrowLeft" })).toBe(-1);
    expect(keyDirection({ key: "Enter", code: "Enter" })).toBe(0);
  });
});
