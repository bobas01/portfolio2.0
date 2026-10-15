import { describe, expect, it } from "vitest";
import { projects, sentenceFor, shotAt, skillLit, skills } from "./works.js";

describe("works", () => {
  it("reprend les compétences de BobasDev, dont Svelte, Docker et API Platform", () => {
    const names = skills.map((skill) => skill.name);
    expect(names).toEqual(
      expect.arrayContaining(["Vue.js", "Svelte", "Symfony", "Docker", "API Platform"]),
    );
    expect(skills).toHaveLength(20);
  });

  it("allume le bon outil au survol d’un projet", () => {
    expect(skillLit("hemadex", "symfony")).toBe(true);
    expect(skillLit("hemadex", "vue")).toBe(false);
    expect(skillLit("ludoplanet", "docker")).toBe(true);
    expect(skillLit("flavourfusion", "vue")).toBe(true);
    expect(skillLit("inconnu", "symfony")).toBe(false);
    expect(skillLit("hemadex", "<script>")).toBe(false);
  });

  it("n’a plus d’adresse de site", () => {
    expect(projects.some((project) => "url" in project)).toBe(false);
  });

  it("retombe sur le français et fait défiler les captures", () => {
    const project = { text: { fr: "Texte français" }, shots: ["/a.webp", "/b.webp"] };
    expect(sentenceFor(project, "en")).toBe("Texte français");
    expect(shotAt(project, 0)).toBe("/a.webp");
    expect(shotAt(project, 2)).toBe("/a.webp");
    expect(shotAt(project, -1)).toBe("/b.webp");
  });
});
