import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import LanguageSwitch from "./LanguageSwitch.vue";

const locales = [
  { id: "fr", label: "FR" },
  { id: "en", label: "EN" },
];

describe("LanguageSwitch", () => {
  it("émet l'id du bouton cliqué, et marque seulement la langue active", async () => {
    const wrapper = mount(LanguageSwitch, {
      props: { locales, currentId: "fr", label: "Langues" },
    });

    expect(wrapper.get("nav").attributes("aria-label")).toBe("Langues");
    expect(wrapper.get("button").attributes("aria-pressed")).toBe("true");

    await wrapper.findAll("button")[1].trigger("click");

    expect(wrapper.emitted("choose")).toEqual([["en"]]);
  });
});
