import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Workbench from "./Workbench.vue";

describe("Workbench", () => {
  it("allume les compétences du projet survolé, sans lien", async () => {
    const wrapper = mount(Workbench, { props: { localeId: "fr" } });
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.findAll(".entry")).toHaveLength(8);
    expect(wrapper.text()).toContain("arts martiaux historiques");

    const hemadex = wrapper.findAll(".entry").find((entry) => entry.text() === "Hemadex");
    await hemadex.trigger("mouseenter");
    const lit = wrapper.findAll(".skills .is-lit").map((node) => node.text());
    expect(lit).toContain("Symfony");
    expect(lit).not.toContain("Vue.js");
  });

  it("ouvre la page du projet depuis le livre", async () => {
    const wrapper = mount(Workbench, { props: { localeId: "fr" } });
    await wrapper.get('[data-id="caeli"] .more').trigger("click");
    expect(wrapper.emitted("open")).toEqual([["caeli"]]);
  });
});
