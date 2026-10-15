export const skills = [
  { id: "html", name: "HTML", logo: "/tools/html.svg", led: "#e44d26", category: "dev" },
  { id: "css", name: "CSS", logo: "/tools/css.svg", led: "#264de4", category: "dev" },
  { id: "scss", name: "SCSS", logo: "/tools/scss.svg", led: "#cd6799", category: "dev" },
  { id: "javascript", name: "JavaScript", logo: "/tools/javascript.svg", led: "#f0db4f", category: "dev" },
  { id: "php", name: "PHP", logo: "/tools/php.svg", led: "#8892bf", category: "dev" },
  { id: "mysql", name: "MySQL", logo: "/tools/mysql.svg", led: "#00758f", category: "dev" },
  { id: "vue", name: "Vue.js", logo: "/tools/vue.svg", led: "#42b883", category: "dev" },
  { id: "svelte", name: "Svelte", logo: "/tools/svelte.svg", led: "#ff3e00", category: "dev" },
  { id: "symfony", name: "Symfony", logo: "/tools/symfony.svg", led: "#b6ff4a", category: "dev" },
  { id: "api-platform", name: "API Platform", logo: "/tools/api-platform.svg", led: "#38b2ac", category: "dev" },
  { id: "docker", name: "Docker", logo: "/tools/docker.svg", led: "#2496ed", category: "tools" },
  { id: "figma", name: "Figma", logo: "/tools/figma.svg", led: "#f24e1e", category: "tools" },
  { id: "git", name: "Git", logo: "/tools/git.svg", led: "#f05033", category: "tools" },
  { id: "github", name: "GitHub", logo: "/tools/github.svg", led: "#b6ff4a", category: "tools" },
  { id: "jira", name: "Jira", logo: "/tools/jira.svg", led: "#2684ff", category: "tools" },
  { id: "agile", name: "Agile", logo: "/tools/agile.svg", led: "#4f9cf9", category: "tools" },
  { id: "aws", name: "AWS", logo: "/tools/aws.svg", led: "#ff9900", category: "cloud" },
  { id: "s3", name: "S3", logo: "/tools/s3.svg", led: "#e25444", category: "cloud" },
  { id: "stripe", name: "Stripe", logo: "/tools/stripe.svg", led: "#635bff", category: "cloud" },
  { id: "smtp", name: "SMTP", logo: "/tools/smtp.svg", led: "#8ec5ff", category: "cloud" },
];

export const skillCategories = ["dev", "tools", "cloud"];

export function skillsIn(category) {
  if (!skillCategories.includes(category)) return [];
  return skills.filter((skill) => skill.category === category);
}

const practiceIds = new Set(["figma", "git", "github", "jira", "agile", "smtp"]);

export const benchSkills = skills.filter((skill) => !practiceIds.has(skill.id));

const skillIds = new Set(skills.map((skill) => skill.id));

export const projects = [
  {
    id: "hemadex",
    name: "Hemadex",
    shots: ["/works/hemadex.webp"],
    skills: ["symfony", "api-platform", "aws", "s3", "stripe"],
    text: {
      fr: "Une plateforme de vidéos sur les arts martiaux historiques européens. Le backend est en Symfony et API Platform, les vidéos sont sur AWS S3, et les paiements passent par Stripe. Le frontend était en React. Je n’ai pas gardé le nom de domaine.",
      en: "A video platform for historical European martial arts. The backend is Symfony and API Platform, the videos are on AWS S3, and payments go through Stripe. The frontend was React. I didn't keep the domain name.",
      "pt-br": "Uma plataforma de vídeos sobre artes marciais históricas europeias. O back-end é em Symfony e API Platform, os vídeos ficam na AWS S3 e os pagamentos passam pelo Stripe. O front-end era em React. Não fiquei com o domínio.",
    },
  },
  {
    id: "ludoplanet",
    name: "LudoPlanet",
    shots: ["/works/ludoplanet.png"],
    skills: ["symfony", "php", "svelte", "mysql", "docker", "api-platform"],
    text: {
      fr: "Une boutique de jeux de société. Symfony, PHP, Svelte, MySQL, Docker et API Platform : le catalogue, les comptes et le début d’un système de commandes.",
      en: "A board game shop. Symfony, PHP, Svelte, MySQL, Docker, and API Platform: the catalog, the accounts, and the start of an order system.",
      "pt-br": "Uma loja de jogos de tabuleiro. Symfony, PHP, Svelte, MySQL, Docker e API Platform: o catálogo, as contas e o começo de um sistema de pedidos.",
    },
  },
  {
    id: "flavourfusion",
    name: "FlavourFusion",
    shots: ["/works/projetFlavourFusion.webp"],
    skills: ["vue", "javascript"],
    text: {
      fr: "Des recettes de cocktails en Vue.js 3. On peut chercher par nom, par catégorie et par ingrédient.",
      en: "Cocktail recipes in Vue.js 3. You can search by name, category, and ingredient.",
      "pt-br": "Receitas de coquetéis em Vue.js 3. Dá para buscar por nome, categoria e ingrediente.",
    },
  },
  {
    id: "homeaway",
    name: "HomeAway",
    shots: ["/works/projetHomeAway.webp"],
    skills: ["php", "javascript"],
    text: {
      fr: "Un site pour réserver un logement, en PHP et JavaScript, avec une carte et un calendrier.",
      en: "A site for booking a place to stay, in PHP and JavaScript, with a map and a calendar.",
      "pt-br": "Um site para reservar uma hospedagem, em PHP e JavaScript, com mapa e calendário.",
    },
  },
  {
    id: "kitsutheque",
    name: "Kitsuthèque",
    shots: ["/works/projetKitsutheque.webp"],
    skills: ["html", "scss", "javascript", "php", "mysql"],
    text: {
      fr: "Une bibliothèque de mangas, avec une recherche, des filtres, et un slider que l’on peut faire glisser.",
      en: "A manga library, with search, filters, and a slider you can drag.",
      "pt-br": "Uma biblioteca de mangás, com busca, filtros e um slider que dá para arrastar.",
    },
  },
  {
    id: "jadoo",
    name: "Jadoo",
    shots: ["/works/projetJadoo.webp"],
    skills: ["html", "css", "javascript"],
    text: {
      fr: "Le site d’un restaurant japonais, parti d’une maquette en HTML, CSS et JavaScript.",
      en: "A Japanese restaurant site, started from a mockup in HTML, CSS, and JavaScript.",
      "pt-br": "O site de um restaurante japonês, feito a partir de um mockup em HTML, CSS e JavaScript.",
    },
  },
  {
    id: "caeli",
    name: "Caeli",
    shots: ["/works/CaeliV2.webp"],
    skills: ["html", "scss", "javascript"],
    text: {
      fr: "Un site de démonstration pour une rénovation écologique, en HTML, SCSS et JavaScript.",
      en: "A demo site for an eco-friendly renovation, in HTML, SCSS, and JavaScript.",
      "pt-br": "Um site de demonstração para uma reforma ecológica, em HTML, SCSS e JavaScript.",
    },
  },
];

export function findProject(id) {
  return projects.find((project) => project.id === id) ?? null;
}

export function skillLit(projectId, skillId) {
  if (!skillIds.has(skillId)) {
    return false;
  }
  const project = findProject(projectId);
  return project ? project.skills.includes(skillId) : false;
}

export function sentenceFor(project, localeId) {
  const text = project?.text ?? {};
  const value = text[localeId];
  if (typeof value === "string") {
    return value;
  }
  return typeof text.fr === "string" ? text.fr : "";
}

export function shotAt(project, index) {
  const shots = Array.isArray(project?.shots) ? project.shots : [];
  if (shots.length === 0) {
    return "";
  }
  const safe = ((index % shots.length) + shots.length) % shots.length;
  return shots[safe];
}
