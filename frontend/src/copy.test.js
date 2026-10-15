import { describe, expect, it } from "vitest";
import { findLocale, letterHref, resolveLocale, textFor } from "./copy.js";

describe("findLocale", () => {
  it("retourne la langue demandée quand elle existe", () => {
    expect(findLocale("en").htmlLang).toBe("en");
  });

  it("ignore un id inconnu et retombe sur le français", () => {
    expect(findLocale("xx").id).toBe("fr");
    expect(findLocale("<script>").id).toBe("fr");
  });
});

describe("textFor", () => {
  it("lit la phrase anglaise", () => {
    expect(textFor("en", "lead")).toBe("I build sites and tools with Vue, Symfony and Docker.");
  });

  it("retombe sur le français si la langue n'existe pas", () => {
    expect(textFor("xx", "lead")).toBe("Je construis des sites et des outils avec Vue, Symfony et Docker.");
  });

  it("renvoie une chaîne vide si la clé n'existe pas", () => {
    expect(textFor("en", "missing")).toBe("");
  });

  it("donne le chemin dans les trois langues", () => {
    expect(textFor("fr", "skills")).toBe("Savoir-faire");
    expect(textFor("en", "resume")).toBe("Continue the journey");
    expect(textFor("pt-br", "hintClose")).toBe("Entendi");
    expect(textFor("fr", "<img>")).toBe("");
  });
});

describe("letterHref", () => {
  it("prépare un mailto et refuse un message vide ou un e-mail invalide", () => {
    const href = letterHref("alseqdev@gmail.com", {
      name: "Alex",
      email: "alex@example.com",
      message: "Bonjour",
    });
    expect(href.startsWith("mailto:alseqdev@gmail.com?")).toBe(true);
    expect(href).toContain(encodeURIComponent("Alex <alex@example.com>"));
    expect(letterHref("alseqdev@gmail.com", { name: "A", email: "pas-un-mail", message: "B" })).toBe("");
    expect(letterHref("alseqdev@gmail.com", { name: "", email: "a@b.co", message: "B" })).toBe("");
  });
});

describe("resolveLocale", () => {
  it("prépare l'id, la langue du document et le titre", () => {
    expect(resolveLocale("pt-br")).toEqual({
      id: "pt-br",
      htmlLang: "pt-BR",
      title: "Alexandre Sequeira",
    });
  });
});
