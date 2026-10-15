import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Intro from "./Intro.vue";

describe("Intro", () => {
  it("affiche une balise reçue en prop comme du texte", () => {
    const payload = "<img src=x onerror=alert(1)>";
    const wrapper = mount(Intro, {
      props: { title: "Alexandre Sequeira", lead: payload },
    });

    expect(wrapper.get("p").text()).toBe(payload);
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.html()).not.toContain("<img");
  });
});
