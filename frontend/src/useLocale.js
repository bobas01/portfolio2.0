import { computed, ref } from "vue";
import { locales, resolveLocale, textFor } from "./copy.js";

export function useLocale() {
  const localeId = ref("fr");

  const title = computed(() => textFor(localeId.value, "title"));
  const lead = computed(() => textFor(localeId.value, "lead"));
  const languagesLabel = computed(() => textFor(localeId.value, "languages"));

  function chooseLocale(nextId) {
    const locale = resolveLocale(nextId);
    localeId.value = locale.id;
    document.documentElement.lang = locale.htmlLang;
    document.title = locale.title;
  }

  return {
    locales,
    localeId,
    title,
    lead,
    languagesLabel,
    chooseLocale,
  };
}
