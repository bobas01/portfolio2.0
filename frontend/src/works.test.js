import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  listFor,
  neighbours,
  projectIdFromPath,
  projectPath,
  projects,
  sentenceFor,
  shotAt,
  skillLit,
  skills,
  skillsIn,
  stackFor,
  statuses,
} from "./works.js";

const locales = ["fr", "en", "pt-br"];

describe("works", () => {
  it("reprend les compétences de BobasDev, dont Svelte, Docker et API Platform", () => {
    const names = skills.map((skill) => skill.name);
    expect(names).toEqual(
      expect.arrayContaining(["Vue.js", "Svelte", "Symfony", "Docker", "API Platform"]),
    );
    expect(skills).toHaveLength(20);
    expect(skillsIn("dev").map((skill) => skill.name)).toContain("Vue.js");
    expect(skillsIn("tools").map((skill) => skill.name)).toEqual(
      expect.arrayContaining(["Git", "Figma", "Jira", "Agile"]),
    );
    expect(skillsIn("cloud").map((skill) => skill.name)).toEqual(
      expect.arrayContaining(["AWS", "Stripe", "SMTP"]),
    );
    expect(skillsIn("<script>")).toEqual([]);
  });

  it("allume le bon outil au survol d’un projet", () => {
    expect(skillLit("hemadex", "symfony")).toBe(true);
    expect(skillLit("hemadex", "vue")).toBe(false);
    expect(skillLit("ludoplanet", "docker")).toBe(true);
    expect(skillLit("flavourfusion", "vue")).toBe(true);
    expect(skillLit("alseqjob", "vue")).toBe(true);
    expect(skillLit("inconnu", "symfony")).toBe(false);
    expect(skillLit("hemadex", "<script>")).toBe(false);
  });

  it("ne met un lien que vers les démos encore en ligne", () => {
    for (const project of projects) {
      expect(statuses).toContain(project.status);
      if (project.status === "demo") {
        expect(project.demo).toMatch(/^https:\/\/bobasdev\.com\//);
      } else {
        expect(project.demo).toBeUndefined();
      }
    }
    expect(projects.some((project) => JSON.stringify(project).includes("hemadex.com"))).toBe(false);
  });

  it("a une fiche complète dans les trois langues, avec des captures qui existent", () => {
    for (const project of projects) {
      for (const localeId of locales) {
        expect(project.text[localeId]).toBeTruthy();
        expect(project.story[localeId]).toBeTruthy();
        expect(project.kind[localeId]).toBeTruthy();
        expect(listFor(project, "features", localeId).length).toBeGreaterThan(0);
      }
      expect(project.shots.length).toBeGreaterThan(0);
      for (const shot of project.shots) {
        expect(existsSync(resolve(__dirname, "../public", `.${shot}`))).toBe(true);
      }
    }
  });

  it("donne une adresse à chaque projet et refuse les autres", () => {
    expect(projectPath("caeli")).toBe("/projets/caeli");
    expect(projectPath("<script>")).toBe("/");
    expect(projectIdFromPath("/projets/caeli")).toBe("caeli");
    expect(projectIdFromPath("/projets/caeli/")).toBe("caeli");
    expect(projectIdFromPath("/projets/inconnu")).toBe("");
    expect(projectIdFromPath("/projets/../etc")).toBe("");
    expect(projectIdFromPath("/")).toBe("");
  });

  it("tourne en boucle entre les projets", () => {
    const first = projects[0];
    const last = projects[projects.length - 1];
    expect(neighbours(first.id).prev.id).toBe(last.id);
    expect(neighbours(last.id).next.id).toBe(first.id);
    expect(neighbours("inconnu")).toEqual({ prev: null, next: null });
  });

  it("met les logos connus avant les autres outils", () => {
    const stack = stackFor(projects.find((project) => project.id === "hemadex"));
    expect(stack[0]).toEqual({ name: "Symfony", logo: "/tools/symfony.svg" });
    expect(stack.find((item) => item.name === "React")).toEqual({ name: "React", logo: "" });
  });

  it("retombe sur le français et fait défiler les captures", () => {
    const project = { text: { fr: "Texte français" }, shots: ["/a.webp", "/b.webp"] };
    expect(sentenceFor(project, "en")).toBe("Texte français");
    expect(sentenceFor(project, "constructor")).toBe("Texte français");
    expect(shotAt(project, 0)).toBe("/a.webp");
    expect(shotAt(project, 2)).toBe("/a.webp");
    expect(shotAt(project, -1)).toBe("/b.webp");
  });
});
