import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  createWalk,
  isStopId,
  readHintDismissed,
  reduceWalk,
  WORLD,
  writeHintDismissed,
} from "./walk.js";

export function useJourney() {
  const walk = ref(createWalk());
  const reduced = ref(false);
  let left = false;
  let right = false;
  let frame = 0;
  let last = 0;

  function direction() {
    return (right ? 1 : 0) - (left ? 1 : 0);
  }

  function tick(now) {
    frame = window.requestAnimationFrame(tick);
    const dir = direction();
    if (walk.value.mode !== "walk" || dir === 0 || reduced.value) {
      last = now;
      return;
    }
    const elapsed = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    const next = reduceWalk(walk.value, {
      type: "tick",
      dir,
      distance: WORLD.speed * elapsed,
    });
    if (walk.value.hint && !next.hint) writeHintDismissed();
    walk.value = next;
  }

  function press(dir) {
    if (dir === -1) left = true;
    if (dir === 1) right = true;
    last = 0;
  }

  function release(dir) {
    if (dir === -1) left = false;
    if (dir === 1) right = false;
  }

  function enter() {
    const next = reduceWalk(walk.value, { type: "enter" });
    if (next.mode !== "page" || !isStopId(next.stopId)) return "";
    walk.value = next;
    return next.stopId;
  }

  function resume() {
    left = false;
    right = false;
    walk.value = reduceWalk(walk.value, { type: "continue" });
  }

  function open(id) {
    walk.value = reduceWalk(walk.value, { type: "open", id });
  }

  function dismiss() {
    walk.value = reduceWalk(walk.value, { type: "dismiss-hint" });
    writeHintDismissed();
  }

  function onKeyDown(event) {
    if (event.key === "Escape" && walk.value.mode !== "walk") {
      event.preventDefault();
      resume();
      return;
    }
    if (walk.value.mode !== "walk" || reduced.value) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    if (event.repeat) return;
    press(event.key === "ArrowLeft" ? -1 : 1);
  }

  function onKeyUp(event) {
    if (event.key === "ArrowLeft") release(-1);
    if (event.key === "ArrowRight") release(1);
  }

  onMounted(() => {
    reduced.value = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (readHintDismissed()) walk.value = { ...walk.value, hint: false };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    frame = window.requestAnimationFrame(tick);
  });

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  });

  return { walk, reduced, press, release, enter, resume, open, dismiss };
}
