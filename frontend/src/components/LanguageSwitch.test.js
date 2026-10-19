import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("n'affiche qu'une langue, puis les autres, et attend avant de les cacher", async () => {
    vi.useFakeTimers();
    const wrapper = mount(LanguageSwitch, {
      props: {
        locales: [
          { id: "fr", label: "FR" },
          { id: "en", label: "EN" },
          { id: "pt-br", label: "PT" },
        ],
        currentId: "fr",
        label: "Langues",
        variant: "bar",
      },
    });

    expect(wrapper.findAll("button")).toHaveLength(1);
    await wrapper.get("button").trigger("click");
    expect(wrapper.findAll("button")).toHaveLength(3);
    await wrapper.get("nav").trigger("mouseleave");
    expect(wrapper.findAll("button")).toHaveLength(3);
    vi.advanceTimersByTime(900);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll("button")).toHaveLength(1);
    wrapper.unmount();
    vi.useRealTimers();
  });
});

afterEach(() => {
  vi.useRealTimers();
});
