export const STOP_IDS = ["propos", "skills", "travaux", "contact"];

export const stops = [
  { id: "propos", x: 420 },
  { id: "skills", x: 780 },
  { id: "travaux", x: 1140 },
  { id: "contact", x: 1500 },
];

export const WORLD = {
  minX: 40,
  maxX: 1700,
  width: 1920,
  speed: 260,
  radius: 54,
  leave: 140,
  maxStep: 48,
};

const HINT_KEY = "chemin-hint";

export function isStopId(id) {
  return STOP_IDS.includes(id);
}

export function createWalk() {
  return {
    x: 220,
    facing: 1,
    mode: "walk",
    stopId: null,
    hold: null,
    hint: true,
  };
}

export function readHintDismissed() {
  try {
    return window.localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeHintDismissed() {
  try {
    window.localStorage.setItem(HINT_KEY, "1");
  } catch {
    // Navigation privée : le rappel reviendra, rien n'est affiché depuis le stockage.
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function stopAt(id) {
  return stops.find((stop) => stop.id === id) ?? null;
}

function crossedStop(from, to, hold) {
  const left = Math.min(from, to);
  const right = Math.max(from, to);
  const hits = stops.filter((stop) => stop.id !== hold && stop.x >= left && stop.x <= right);
  hits.sort((a, b) => Math.abs(a.x - from) - Math.abs(b.x - from));
  return hits[0] ?? null;
}

export function reduceWalk(state, action) {
  const current = state && Number.isFinite(state.x) ? state : createWalk();
  if (!action || typeof action.type !== "string") return current;

  if (action.type === "tick") {
    if (current.mode !== "walk") return current;
    const dir = action.dir === 1 || action.dir === -1 ? action.dir : 0;
    if (dir === 0) return current;
    const raw = Number.isFinite(action.distance) ? action.distance : 0;
    const distance = clamp(raw, 0, WORLD.maxStep);
    if (distance === 0) return current;
    const from = current.x;
    let x = clamp(from + dir * distance, WORLD.minX, WORLD.maxX);
    let hold = current.hold;
    const held = stopAt(hold);
    if (!held || Math.abs(held.x - x) > WORLD.leave) hold = null;
    const arrived = crossedStop(from, x, hold);
    if (arrived) {
      return {
        ...current,
        x: arrived.x,
        facing: dir,
        mode: "sign",
        stopId: arrived.id,
        hold: null,
        hint: false,
      };
    }
    return { ...current, x, facing: dir, hold, hint: false };
  }

  if (action.type === "open") {
    const stop = stopAt(action.id);
    if (!stop) return current;
    return {
      ...current,
      x: stop.x,
      mode: "sign",
      stopId: stop.id,
      hold: null,
      hint: false,
    };
  }

  if (action.type === "enter") {
    if (current.mode !== "sign" || !isStopId(current.stopId)) return current;
    return { ...current, mode: "page" };
  }

  if (action.type === "continue") {
    if (current.mode !== "sign" && current.mode !== "page") return current;
    if (!isStopId(current.stopId)) return { ...current, mode: "walk", stopId: null, hold: null };
    const stop = stopAt(current.stopId);
    const nudged = clamp(stop.x + current.facing * (WORLD.leave + 8), WORLD.minX, WORLD.maxX);
    return { ...current, x: nudged, mode: "walk", hold: current.stopId, stopId: null };
  }

  if (action.type === "dismiss-hint") {
    return { ...current, hint: false };
  }

  return current;
}
