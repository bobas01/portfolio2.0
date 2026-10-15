import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Workbench from "./Workbench.vue";

describe("Workbench", () => {
  it("allume les compétences du projet survolé, sans lien", async () => {
    const wrapper = mount(Workbench, { props: { localeId: "fr" } });
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.findAll(".entry")).toHaveLength(7);
    expect(wrapper.text()).toContain("arts martiaux historiques");

    await wrapper.get(".entry").trigger("mouseenter");
    const lit = wrapper.findAll(".skills .is-lit").map((node) => node.text());
    expect(lit).toContain("Symfony");
    expect(lit).not.toContain("Vue.js");
  });
});
