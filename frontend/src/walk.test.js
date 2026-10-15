import { describe, expect, it } from "vitest";
import { createWalk, reduceWalk, stops, WORLD } from "./walk.js";

function travel(state, dir, distance) {
  return reduceWalk(state, { type: "tick", dir, distance });
}

describe("reduceWalk", () => {
  it("part à gauche, tourné vers la droite", () => {
    expect(createWalk()).toMatchObject({ x: WORLD.minX, facing: 1, mode: "walk", hint: true });
  });

  it("avance et recule sans sortir du chemin", () => {
    const right = travel(createWalk(), 1, 40);
    expect(right.x).toBe(WORLD.minX + 40);
    expect(right.facing).toBe(1);

    const left = travel(right, -1, 400);
    expect(left.x).toBe(WORLD.minX);
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
    expect(walking).toMatchObject({ mode: "walk", stopId: null, hold: "skills", x: stops[1].x });

    const still = travel(walking, 1, 30);
    expect(still.mode).toBe("walk");
    expect(still.hold).toBe("skills");

    let away = still;
    for (let step = 0; step < 6; step += 1) away = travel(away, 1, 40);
    expect(away.hold).toBe(null);
    expect(away.mode).toBe("walk");
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
    expect(next.x - WORLD.minX).toBeLessThanOrEqual(WORLD.maxStep);
  });
});
