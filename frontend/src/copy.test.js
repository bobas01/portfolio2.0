import { describe, expect, it } from "vitest";
import { findLocale, resolveLocale, textFor } from "./copy.js";

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
