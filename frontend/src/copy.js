export const locales = [
  { id: "fr", htmlLang: "fr", label: "FR" },
  { id: "en", htmlLang: "en", label: "EN" },
  { id: "pt-br", htmlLang: "pt-BR", label: "PT" },
];

const messages = {
  fr: {
    title: "Alexandre Sequeira",
    lead: "Je construis des sites et des outils avec Vue, Symfony et Docker.",
    languages: "Langues",
    portfolio: "Portfolio",
    travaux: "Projets",
    propos: "À propos",
    contact: "Contact",
    skills: "Savoir-faire",
    enter: "Entrer",
    continue: "Continuer",
    resume: "Continuer le voyage",
    hint: "Les flèches ou les boutons font marcher le panda.",
    hintClose: "Compris",
    walkLeft: "Marcher vers la gauche",
    walkRight: "Marcher vers la droite",
    skillsIntro: "Ce avec quoi je construis.",
    about: "Je m'appelle Alexandre Sequeira. J'habite à Niterói. J'ai commencé seul, sur OpenClassrooms, puis j'ai fait mes premiers projets freelance en front-end, aux côtés d'un développeur senior.",
    aboutNext: "J'ai continué à apprendre pendant deux ans, en parallèle du travail. En décembre 2023, j'ai validé un Bac+2 en développement web et web mobile chez Online FormaPro, puis j'ai fait un stage chez Hubwiser. Ensuite, une alternance full stack chez Sportyneo. En juillet 2025, j'ai obtenu un Bachelor chef de projet digital, en conception, développement et cybersécurité. En 2026, j'ai obtenu le titre de concepteur développeur d'applications.",
    aboutNow: "Aujourd'hui, je construis des sites et des applications, souvent avec Symfony côté serveur, et Vue ou Svelte côté client.",
    contactIntro: "Un projet ? Écris-moi.",
    cv: "CV français",
    grove: "Clairière",
    toolsLabel: "Outils",
    others: "Les autres projets",
    openSite: "Voir le site",
    prev: "Projet précédent",
    next: "Projet suivant",
  },
  en: {
    title: "Alexandre Sequeira",
    lead: "I build sites and tools with Vue, Symfony and Docker.",
    languages: "Languages",
    portfolio: "Portfolio",
    travaux: "Projects",
    propos: "About",
    contact: "Contact",
    skills: "Skills",
    enter: "Enter",
    continue: "Continue",
    resume: "Continue the journey",
    hint: "Arrow keys or the buttons walk the panda.",
    hintClose: "Got it",
    walkLeft: "Walk left",
    walkRight: "Walk right",
    skillsIntro: "What I build with.",
    about: "My name is Alexandre Sequeira. I live in Niterói. I started on my own, on OpenClassrooms, then worked on my first freelance front-end projects alongside a senior developer.",
    aboutNext: "I kept studying for two years while I was working. In December 2023 I completed a two-year degree in web development, including mobile web, at Online FormaPro, then interned at Hubwiser. After that I joined Sportyneo as a full-stack developer, splitting my time between work and school. In July 2025 I earned a bachelor's degree in digital project management, focused on design, development, and cybersecurity. In 2026 I earned the CDA, France's degree in application design and development.",
    aboutNow: "These days I build websites and applications, often with Symfony on the server and Vue or Svelte on the client.",
    contactIntro: "Got a project? Write to me.",
    cv: "English CV",
    grove: "Clearing",
    toolsLabel: "Tools",
    others: "Other projects",
    openSite: "Open the site",
    prev: "Previous project",
    next: "Next project",
  },
  "pt-br": {
    title: "Alexandre Sequeira",
    lead: "Desenvolvo sites e ferramentas com Vue, Symfony e Docker.",
    languages: "Idiomas",
    portfolio: "Portfólio",
    travaux: "Projetos",
    propos: "Sobre",
    contact: "Contato",
    skills: "Habilidades",
    enter: "Entrar",
    continue: "Continuar",
    resume: "Seguir viagem",
    hint: "As setas ou os botões fazem o panda andar.",
    hintClose: "Entendi",
    walkLeft: "Andar para a esquerda",
    walkRight: "Andar para a direita",
    skillsIntro: "Com o que eu construo.",
    about: "Meu nome é Alexandre Sequeira. Moro em Niterói. Comecei sozinho, na OpenClassrooms, e depois fiz os primeiros projetos freelance de front-end ao lado de um desenvolvedor sênior.",
    aboutNext: "Continuei estudando por dois anos, enquanto trabalhava. Em dezembro de 2023, concluí uma formação de dois anos em desenvolvimento web e mobile na Online FormaPro e, em seguida, fiz um estágio na Hubwiser. Depois, entrei na Sportyneo como desenvolvedor full stack, dividindo o tempo entre o trabalho e os estudos. Em julho de 2025, concluí um bachelor em gestão de projetos digitais, com foco em concepção, desenvolvimento e cibersegurança. Em 2026, obtive o CDA, o diploma francês de concepção e desenvolvimento de aplicações.",
    aboutNow: "Hoje faço sites e aplicações, muitas vezes com Symfony no servidor e Vue ou Svelte no cliente.",
    contactIntro: "Tem um projeto? Escreve pra mim.",
    cv: "CV em português",
    grove: "Clareira",
    toolsLabel: "Ferramentas",
    others: "Os outros projetos",
    openSite: "Ver o site",
    prev: "Projeto anterior",
    next: "Próximo projeto",
  },
};

export const cvByLocale = {
  fr: "/cv/alexandre-sequeira-fr.pdf",
  en: "/cv/alexandre-sequeira-en.pdf",
  "pt-br": "/cv/alexandre-sequeira-pt.pdf",
};

export const contact = {
  email: "alseqdev@gmail.com",
  whatsapp: "https://wa.me/5562991525466",
  phone: "+55 62 99152-5466",
  place: "Niterói, Rio de Janeiro",
};

export function findLocale(id) {
  return locales.find((locale) => locale.id === id) ?? locales[0];
}

export function textFor(localeId, key) {
  const table = messages[localeId] ?? messages.fr;
  const value = table[key];
  if (typeof value === "string") {
    return value;
  }
  const fallback = messages.fr[key];
  return typeof fallback === "string" ? fallback : "";
}

export function resolveLocale(nextId) {
  const locale = findLocale(nextId);
  return {
    id: locale.id,
    htmlLang: locale.htmlLang,
    title: textFor(locale.id, "title"),
  };
}
