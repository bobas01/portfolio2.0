import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PathScene from "./PathScene.vue";
import { createWalk, reduceWalk } from "../walk.js";

function mountPath(walk = createWalk(), localeId = "fr") {
  return mount(PathScene, { props: { walk, localeId } });
}

describe("PathScene", () => {
  it("montre les boutons de marche et pas de page", () => {
    const wrapper = mountPath();
    expect(wrapper.get('[aria-label="Marcher vers la gauche"]').exists()).toBe(true);
    expect(wrapper.get('[aria-label="Marcher vers la droite"]').exists()).toBe(true);
    expect(wrapper.find("[role=dialog]").exists()).toBe(false);
    expect(wrapper.text()).toContain("Les flèches ou les boutons font marcher le panda.");
  });

  it("ouvre la pancarte avec entrer et continuer, sans html injecté", async () => {
    const walk = reduceWalk(createWalk(), { type: "open", id: "propos" });
    const wrapper = mountPath({ ...walk, stopId: "<img onerror=alert(1)>" });
    expect(wrapper.text()).not.toContain("<img");
    expect(wrapper.text()).not.toContain("alert");

    const real = mountPath(walk);
    expect(real.get("[role=dialog]").text()).toContain("À propos");
    await real.get("[role=dialog] button").trigger("click");
    expect(real.emitted("enter")).toHaveLength(1);
    await real.get("[role=dialog]").findAll("button")[1].trigger("click");
    expect(real.emitted("resume")).toHaveLength(1);

    await real.get("[role=dialog]").trigger("keydown", { key: "ArrowDown" });
    await real.get(".path").trigger("pointerdown");
    expect(real.emitted("resume").length).toBeGreaterThan(1);
  });

  it("transmet la direction du bouton", async () => {
    const wrapper = mountPath();
    await wrapper.get('[aria-label="Marcher vers la droite"]').trigger("pointerdown");
    expect(wrapper.emitted("press")[0]).toEqual([1]);
  });
});
