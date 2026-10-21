import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProjectPage from "./ProjectPage.vue";
import { findProject } from "../works.js";

describe("ProjectPage", () => {
  it("montre la fiche, la stack et un lien vers la démo", () => {
    const wrapper = mount(ProjectPage, { props: { project: findProject("kitsutheque"), localeId: "fr" } });
    expect(wrapper.get("h1").text()).toBe("Kitsuthèque");
    expect(wrapper.text()).toContain("Démo en ligne");
    expect(wrapper.text()).toContain("4 semaines");
    expect(wrapper.findAll(".chips li").map((chip) => chip.text())).toContain("MySQL");
    const demo = wrapper.get("a.demo");
    expect(demo.attributes("href")).toBe("https://bobasdev.com/kitsutheque/");
    expect(demo.attributes("rel")).toBe("noopener noreferrer");
  });

  it("n’a aucun lien quand le site n’est plus en ligne", () => {
    const wrapper = mount(ProjectPage, { props: { project: findProject("hemadex"), localeId: "en" } });
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("Offline, domain lost");
  });

  it("fait défiler les captures et propose le projet suivant", async () => {
    const wrapper = mount(ProjectPage, { props: { project: findProject("caeli"), localeId: "fr" } });
    expect(wrapper.get(".counter").text()).toBe("1 / 4");
    await wrapper.get(".turn.is-next").trigger("click");
    expect(wrapper.get(".counter").text()).toBe("2 / 4");
    await wrapper.get(".frame").trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.get(".counter").text()).toBe("1 / 4");
    await wrapper.findAll(".thumbs button")[3].trigger("click");
    expect(wrapper.get(".counter").text()).toBe("4 / 4");
    await wrapper.get(".sequel .is-next").trigger("click");
    expect(wrapper.emitted("open")[0][0]).toBe("alseqjob");
  });
});
