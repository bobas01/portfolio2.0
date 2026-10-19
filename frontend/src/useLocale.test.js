import { describe, expect, it } from "vitest";
import { useLocale } from "./useLocale.js";

describe("useLocale", () => {
  it("passe le document en anglais quand on choisit en", () => {
    const { chooseLocale, localeId, lead } = useLocale();

    chooseLocale("en");

    expect(localeId.value).toBe("en");
    expect(lead.value).toBe("The panda is the mascot. The code is me.");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe("Alexandre Sequeira");
  });

  it("ignore un id qui n'est pas dans la liste", () => {
    const { chooseLocale, localeId } = useLocale();

    chooseLocale("javascript:alert(1)");

    expect(localeId.value).toBe("fr");
    expect(document.documentElement.lang).toBe("fr");
  });
});
