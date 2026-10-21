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

export const statuses = ["demo", "soon", "offline", "domain-lost"];

function gallery(id, count) {
  return Array.from({ length: count }, (_, index) => `/works/${id}/${String(index + 1).padStart(2, "0")}.webp`);
}

export const projects = [
  {
    id: "alseqjob",
    name: "AlseqJob",
    year: 2026,
    status: "soon",
    shots: gallery("alseqjob", 6),
    skills: ["vue", "javascript", "symfony", "api-platform", "php"],
    stack: ["Pinia", "Vite", "Doctrine", "SQLite", "Mercado Pago"],
    text: {
      fr: "Les offres d’emploi du Brésil au même endroit, pour tous les métiers, avec un kanban pour suivre ses candidatures. Vue 3 et Symfony.",
      en: "Job offers from across Brazil in one place, for every trade, with a kanban board to track applications. Vue 3 and Symfony.",
      "pt-br": "As vagas do Brasil num só lugar, para todos os ofícios, com um kanban para acompanhar as candidaturas. Vue 3 e Symfony.",
    },
    kind: {
      fr: "Projet perso",
      en: "Personal project",
      "pt-br": "Projeto pessoal",
    },
    team: {
      fr: "Seul",
      en: "Solo",
      "pt-br": "Sozinho",
    },
    story: {
      fr: "En arrivant au Brésil, je cherchais du travail. Plutôt que d’ouvrir dix sites, j’ai commencé à récupérer les annonces au même endroit. D’abord pour moi, seulement le développement web. Puis je l’ai ouvert à tout le monde : un dev ajoute ses langages, une infirmière son service. Le site est en portugais et vise le marché brésilien.",
      en: "When I moved to Brazil, I was looking for work. Instead of opening ten sites, I started pulling the job ads into one place. First just for me, only web development. Then I opened it to everyone: a developer adds their languages, a nurse adds their ward. The site is in Portuguese and aims at the Brazilian market.",
      "pt-br": "Quando cheguei ao Brasil, eu estava procurando trabalho. Em vez de abrir dez sites, comecei a juntar as vagas num só lugar. Primeiro só para mim, só desenvolvimento web. Depois abri para todo mundo: um dev adiciona as linguagens dele, uma enfermeira o setor dela. O site é em português e foca no mercado brasileiro.",
    },
    note: {
      fr: "La recherche est gratuite. Le suivi coûte R$ 9,90 par mois, sans renouvellement automatique. Mise en ligne prochainement.",
      en: "Searching is free. Tracking costs R$ 9.90 a month, with no automatic renewal. Going live soon.",
      "pt-br": "A busca é grátis. O acompanhamento custa R$ 9,90 por mês, sem renovação automática. Em breve no ar.",
    },
    features: {
      fr: [
        "Les annonces de plusieurs sites dans une seule recherche : Gupy, Adzuna, Trampos, Remotive…",
        "Un profil par métier, avec des mots à mettre en avant ou à exclure",
        "Un kanban pour suivre chaque candidature",
        "La capture d’une annonce déjà ouverte, ou son import par adresse",
        "Le paiement au mois avec Mercado Pago",
      ],
      en: [
        "Ads from several sites in a single search: Gupy, Adzuna, Trampos, Remotive…",
        "One profile per trade, with words to boost or to hide",
        "A kanban board to follow each application",
        "Capturing an ad you already have open, or importing it from its address",
        "Monthly payment through Mercado Pago",
      ],
      "pt-br": [
        "As vagas de vários sites numa só busca: Gupy, Adzuna, Trampos, Remotive…",
        "Um perfil por ofício, com palavras para priorizar ou esconder",
        "Um kanban para acompanhar cada candidatura",
        "A captura de uma vaga já aberta, ou a importação pelo endereço",
        "O pagamento mensal pelo Mercado Pago",
      ],
    },
  },
  {
    id: "hemadex",
    name: "Hemadex",
    status: "domain-lost",
    shots: gallery("hemadex", 1),
    skills: ["symfony", "api-platform", "mysql", "aws", "s3", "stripe"],
    stack: ["React", "TypeScript", "Redux", "Tailwind"],
    text: {
      fr: "Une plateforme de vidéos sur les arts martiaux historiques européens. J’ai fait tout le backend : Symfony, API Platform, vidéos sur AWS S3 et paiements Stripe.",
      en: "A video platform for historical European martial arts. I built the whole backend: Symfony, API Platform, videos on AWS S3, and Stripe payments.",
      "pt-br": "Uma plataforma de vídeos sobre artes marciais históricas europeias. Fiz todo o back-end: Symfony, API Platform, vídeos na AWS S3 e pagamentos com Stripe.",
    },
    kind: {
      fr: "Projet en équipe",
      en: "Team project",
      "pt-br": "Projeto em equipe",
    },
    team: {
      fr: "Tout le backend",
      en: "The whole backend",
      "pt-br": "Todo o back-end",
    },
    story: {
      fr: "Hemadex est une plateforme de vidéo à la demande pour le HEMA, les arts martiaux historiques européens. On y trouve des tutoriels, des compétitions, des maîtres d’armes et des techniques anciennes, en accès libre ou payant. J’ai construit toute l’API, du stockage des vidéos jusqu’au paiement.",
      en: "Hemadex is a video-on-demand platform for HEMA, historical European martial arts. It has tutorials, competitions, fencing masters, and old techniques, some free and some paid. I built the whole API, from video storage to payment.",
      "pt-br": "Hemadex é uma plataforma de vídeo sob demanda para o HEMA, as artes marciais históricas europeias. Tem tutoriais, competições, mestres de armas e técnicas antigas, com acesso livre ou pago. Construí toda a API, do armazenamento dos vídeos até o pagamento.",
    },
    note: {
      fr: "Le nom de domaine n’a pas été renouvelé et appartient maintenant à un autre site. C’est pour ça qu’il n’y a pas de lien.",
      en: "The domain name wasn't renewed and now belongs to another site. That's why there is no link.",
      "pt-br": "O domínio não foi renovado e agora pertence a outro site. Por isso não há link.",
    },
    features: {
      fr: [
        "Une API REST en Symfony et API Platform",
        "Les vidéos stockées et servies depuis AWS S3",
        "Les contenus payants réglés avec Stripe",
        "Des filtres par type de contenu, art martial, maître et technique",
      ],
      en: [
        "A REST API in Symfony and API Platform",
        "Videos stored and served from AWS S3",
        "Paid content handled with Stripe",
        "Filters by content type, martial art, master, and technique",
      ],
      "pt-br": [
        "Uma API REST em Symfony e API Platform",
        "Os vídeos armazenados e servidos pela AWS S3",
        "Os conteúdos pagos cobrados com Stripe",
        "Filtros por tipo de conteúdo, arte marcial, mestre e técnica",
      ],
    },
  },
  {
    id: "ludoplanet",
    name: "LudoPlanet",
    year: 2026,
    status: "offline",
    shots: gallery("ludoplanet", 1),
    skills: ["symfony", "php", "svelte", "mysql", "docker", "stripe"],
    stack: ["SvelteKit", "Tailwind", "JWT", "PHPUnit", "Vitest"],
    text: {
      fr: "Une boutique de jeux de société. Symfony, PHP, Svelte, MySQL et Docker : le catalogue, le panier, le paiement Stripe et un tableau de bord pour l’admin.",
      en: "A board game shop. Symfony, PHP, Svelte, MySQL, and Docker: the catalog, the cart, Stripe payment, and an admin dashboard.",
      "pt-br": "Uma loja de jogos de tabuleiro. Symfony, PHP, Svelte, MySQL e Docker: o catálogo, o carrinho, o pagamento com Stripe e um painel de administração.",
    },
    kind: {
      fr: "Projet en binôme",
      en: "Two-person project",
      "pt-br": "Projeto em dupla",
    },
    team: {
      fr: "À deux",
      en: "Two of us",
      "pt-br": "Em dupla",
    },
    story: {
      fr: "LudoPlanet est une boutique en ligne de jeux de société. Le front est en SvelteKit, l’API en Symfony, et tout tourne dans Docker. On parcourt le catalogue, on remplit son panier, on paie avec Stripe, puis on retrouve ses commandes dans son compte.",
      en: "LudoPlanet is an online board game shop. The front end is SvelteKit, the API is Symfony, and everything runs in Docker. You browse the catalog, fill your cart, pay with Stripe, then find your orders in your account.",
      "pt-br": "LudoPlanet é uma loja online de jogos de tabuleiro. O front é em SvelteKit, a API em Symfony, e tudo roda no Docker. Você navega pelo catálogo, enche o carrinho, paga com Stripe e depois encontra os pedidos na sua conta.",
    },
    note: {
      fr: "Le site n’est pas encore en ligne.",
      en: "The site isn't online yet.",
      "pt-br": "O site ainda não está no ar.",
    },
    features: {
      fr: [
        "Un catalogue avec des filtres et une fiche par jeu",
        "Le panier et le paiement avec Stripe Checkout",
        "Un espace client : profil et historique des commandes",
        "Un tableau de bord admin pour les jeux, les catégories et les commandes",
        "Une connexion par JWT en cookie httpOnly, avec un nombre d’essais limité",
      ],
      en: [
        "A catalog with filters and a page for each game",
        "The cart and payment with Stripe Checkout",
        "A customer area: profile and order history",
        "An admin dashboard for games, categories, and orders",
        "JWT login in an httpOnly cookie, with a limited number of attempts",
      ],
      "pt-br": [
        "Um catálogo com filtros e uma página para cada jogo",
        "O carrinho e o pagamento com Stripe Checkout",
        "Uma área do cliente: perfil e histórico de pedidos",
        "Um painel de administração para jogos, categorias e pedidos",
        "Login por JWT em cookie httpOnly, com número de tentativas limitado",
      ],
    },
  },
  {
    id: "flavourfusion",
    name: "FlavourFusion",
    status: "demo",
    demo: "https://bobasdev.com/flavourfusion/",
    shots: gallery("flavourfusion", 3),
    skills: ["vue", "javascript"],
    stack: ["TheCocktailDB"],
    text: {
      fr: "Des recettes de cocktails en Vue.js 3. On peut chercher par nom, par catégorie et par ingrédient.",
      en: "Cocktail recipes in Vue.js 3. You can search by name, category, and ingredient.",
      "pt-br": "Receitas de coquetéis em Vue.js 3. Dá para buscar por nome, categoria e ingrediente.",
    },
    kind: {
      fr: "Projet de formation",
      en: "School project",
      "pt-br": "Projeto de formação",
    },
    team: {
      fr: "Seul",
      en: "Solo",
      "pt-br": "Sozinho",
    },
    length: {
      fr: "1 semaine sur les 2 prévues",
      en: "1 week out of the 2 planned",
      "pt-br": "1 semana das 2 previstas",
    },
    story: {
      fr: "FlavourFusion est un site de cocktails en Vue.js 3, branché sur l’API TheCocktailDB. J’avais deux semaines pour le faire. Je l’ai fini en une.",
      en: "FlavourFusion is a cocktail site in Vue.js 3, connected to the TheCocktailDB API. I had two weeks to build it. I finished in one.",
      "pt-br": "FlavourFusion é um site de coquetéis em Vue.js 3, ligado à API TheCocktailDB. Eu tinha duas semanas para fazer. Terminei em uma.",
    },
    features: {
      fr: [
        "La recherche par nom, par catégorie ou par ingrédient",
        "Le cocktail du jour et un carrousel des plus recherchés",
        "Les cocktails avec ou sans alcool",
        "Toutes les données viennent de l’API, sans base à moi",
      ],
      en: [
        "Search by name, category, or ingredient",
        "The cocktail of the day and a carousel of the most searched",
        "Cocktails with or without alcohol",
        "All the data comes from the API, with no database of my own",
      ],
      "pt-br": [
        "A busca por nome, categoria ou ingrediente",
        "O coquetel do dia e um carrossel dos mais buscados",
        "Os coquetéis com ou sem álcool",
        "Todos os dados vêm da API, sem banco próprio",
      ],
    },
  },
  {
    id: "homeaway",
    name: "HomeAway",
    status: "demo",
    demo: "https://bobasdev.com/homeaway1.0/",
    shots: gallery("homeaway", 2),
    skills: ["php", "javascript", "mysql"],
    stack: ["Twig", "AltoRouter", "Leaflet", "Google Geocoding"],
    text: {
      fr: "Un site pour réserver un logement, en PHP et JavaScript, avec une carte et un calendrier.",
      en: "A site for booking a place to stay, in PHP and JavaScript, with a map and a calendar.",
      "pt-br": "Um site para reservar uma hospedagem, em PHP e JavaScript, com mapa e calendário.",
    },
    kind: {
      fr: "Projet de formation",
      en: "School project",
      "pt-br": "Projeto de formação",
    },
    team: {
      fr: "Équipe de 3, j’étais au front",
      en: "Team of 3, I led the front end",
      "pt-br": "Equipe de 3, eu cuidava do front",
    },
    story: {
      fr: "HomeAway est un site de réservation de locations de vacances, en PHP orienté objet avec AltoRouter et Twig. C’était mon premier projet en programmation orientée objet, et j’y ai compris à quoi elle sert : un code qu’on peut reprendre et faire grandir.",
      en: "HomeAway is a holiday rental booking site, in object-oriented PHP with AltoRouter and Twig. It was my first object-oriented project, and it showed me what it is for: code you can come back to and grow.",
      "pt-br": "HomeAway é um site de reserva de casas de temporada, em PHP orientado a objetos com AltoRouter e Twig. Foi meu primeiro projeto orientado a objetos, e foi ali que entendi para que serve: um código que dá para retomar e fazer crescer.",
    },
    features: {
      fr: [
        "Une carte Leaflet avec un marqueur et une fenêtre par logement",
        "La recherche d’adresse avec l’API de géocodage de Google",
        "Une galerie qui défile à l’horizontale",
        "Un calendrier de réservation et des filtres",
        "Une page 404 faite maison",
      ],
      en: [
        "A Leaflet map with a marker and a popup for each place",
        "Address search with Google's geocoding API",
        "A gallery that scrolls sideways",
        "A booking calendar and filters",
        "A home-made 404 page",
      ],
      "pt-br": [
        "Um mapa Leaflet com um marcador e uma janela por hospedagem",
        "A busca de endereço com a API de geocodificação do Google",
        "Uma galeria que rola na horizontal",
        "Um calendário de reserva e filtros",
        "Uma página 404 feita em casa",
      ],
    },
  },
  {
    id: "kitsutheque",
    name: "Kitsuthèque",
    status: "demo",
    demo: "https://bobasdev.com/kitsutheque/",
    shots: gallery("kitsutheque", 4),
    skills: ["html", "scss", "javascript", "php", "mysql"],
    stack: ["Fetch API"],
    text: {
      fr: "Une bibliothèque de mangas, avec une recherche, des filtres, et un slider que l’on peut faire glisser.",
      en: "A manga library, with search, filters, and a slider you can drag.",
      "pt-br": "Uma biblioteca de mangás, com busca, filtros e um slider que dá para arrastar.",
    },
    kind: {
      fr: "Projet de formation",
      en: "School project",
      "pt-br": "Projeto de formação",
    },
    team: {
      fr: "À deux au lieu de trois, j’ai mené le projet",
      en: "Two of us instead of three, I led it",
      "pt-br": "Em dois em vez de três, eu liderei",
    },
    length: {
      fr: "4 semaines",
      en: "4 weeks",
      "pt-br": "4 semanas",
    },
    story: {
      fr: "Le sujet était le site d’une bibliothèque. On en a fait une mangathèque. J’ai dessiné toute l’interface et codé ce que voit le lecteur, plus une partie de l’administration, en PHP et MySQL.",
      en: "The brief was a library website. We made it a manga library. I designed the whole interface and coded everything the reader sees, plus part of the admin side, in PHP and MySQL.",
      "pt-br": "O tema era o site de uma biblioteca. Fizemos uma mangateca. Desenhei toda a interface e programei tudo o que o leitor vê, mais uma parte da administração, em PHP e MySQL.",
    },
    features: {
      fr: [
        "Le design complet du site",
        "Une barre de recherche",
        "Des filtres par genre, public et catégorie, chargés avec fetch",
        "Un slider des nouveautés, qu’on fait glisser au doigt sur mobile",
        "Les comptes lecteurs et une partie de l’espace admin",
      ],
      en: [
        "The whole design of the site",
        "A search bar",
        "Filters by genre, audience, and category, loaded with fetch",
        "A slider of new releases you can swipe on mobile",
        "Reader accounts and part of the admin area",
      ],
      "pt-br": [
        "O design completo do site",
        "Uma barra de busca",
        "Filtros por gênero, público e categoria, carregados com fetch",
        "Um slider de novidades que dá para arrastar no celular",
        "As contas de leitor e uma parte da área de administração",
      ],
    },
  },
  {
    id: "jadoo",
    name: "Jadoo",
    status: "demo",
    demo: "https://bobasdev.com/judo-sushi/",
    shots: gallery("jadoo", 3),
    skills: ["html", "css", "javascript"],
    stack: [],
    text: {
      fr: "Le site d’un restaurant japonais, parti d’une maquette en HTML, CSS et JavaScript.",
      en: "A Japanese restaurant site, started from a mockup in HTML, CSS, and JavaScript.",
      "pt-br": "O site de um restaurante japonês, feito a partir de um mockup em HTML, CSS e JavaScript.",
    },
    kind: {
      fr: "Exercice d’intégration",
      en: "Front-end exercise",
      "pt-br": "Exercício de integração",
    },
    team: {
      fr: "Seul",
      en: "Solo",
      "pt-br": "Sozinho",
    },
    length: {
      fr: "1 semaine",
      en: "1 week",
      "pt-br": "1 semana",
    },
    story: {
      fr: "Jadoo est la vitrine d’un restaurant japonais. Je suis parti d’une maquette et je l’ai codée en HTML, CSS et JavaScript, en une semaine.",
      en: "Jadoo is the showcase site of a Japanese restaurant. I started from a mockup and coded it in HTML, CSS, and JavaScript, in one week.",
      "pt-br": "Jadoo é a vitrine de um restaurante japonês. Parti de um mockup e programei em HTML, CSS e JavaScript, em uma semana.",
    },
    features: {
      fr: [
        "L’intégration fidèle de la maquette",
        "Des animations et des effets au survol",
        "Un formulaire de contact pour réserver",
      ],
      en: [
        "A faithful build of the mockup",
        "Animations and hover effects",
        "A contact form to book a table",
      ],
      "pt-br": [
        "A integração fiel do mockup",
        "Animações e efeitos ao passar o mouse",
        "Um formulário de contato para reservar",
      ],
    },
  },
  {
    id: "caeli",
    name: "Caeli",
    status: "demo",
    demo: "https://bobasdev.com/caeliV2/",
    shots: gallery("caeli", 4),
    skills: ["html", "scss", "javascript"],
    stack: [],
    text: {
      fr: "Un site de démonstration sur la qualité de l’air dans les rénovations, en HTML, SCSS et JavaScript.",
      en: "A demo site about air quality in home renovations, in HTML, SCSS, and JavaScript.",
      "pt-br": "Um site de demonstração sobre a qualidade do ar nas reformas, em HTML, SCSS e JavaScript.",
    },
    kind: {
      fr: "Premier projet client",
      en: "First client project",
      "pt-br": "Primeiro projeto para cliente",
    },
    team: {
      fr: "Seul, avec le client",
      en: "Solo, with the client",
      "pt-br": "Sozinho, com o cliente",
    },
    story: {
      fr: "Caeli Environnement voulait un site de démonstration sur la qualité de l’air dans les maisons qu’on rénove, pour présenter son projet. Je l’ai construit à partir de son cahier des charges, en échangeant avec le client tout au long.",
      en: "Caeli Environnement wanted a demo site about air quality in homes being renovated, to pitch its project. I built it from their specification, talking with the client all along.",
      "pt-br": "A Caeli Environnement queria um site de demonstração sobre a qualidade do ar nas casas em reforma, para apresentar o projeto. Construí a partir do caderno de encargos, conversando com o cliente do começo ao fim.",
    },
    note: {
      fr: "Le site est statique. Le PHP et la base de données étaient prévus si le projet continuait.",
      en: "The site is static. PHP and a database were planned if the project went ahead.",
      "pt-br": "O site é estático. O PHP e o banco de dados estavam previstos se o projeto continuasse.",
    },
    features: {
      fr: [
        "Un parcours guidé, étape par étape",
        "Le choix des matériaux par zone : gros-œuvre, second-œuvre, finitions",
        "Des chiffres sur l’air intérieur, avec leurs sources",
      ],
      en: [
        "A guided path, step by step",
        "Choosing materials by layer: structure, insulation, finishes",
        "Facts about indoor air, with their sources",
      ],
      "pt-br": [
        "Um percurso guiado, passo a passo",
        "A escolha dos materiais por camada: estrutura, enchimento, acabamento",
        "Números sobre o ar interior, com as fontes",
      ],
    },
  },
];

export function findProject(id) {
  return projects.find((project) => project.id === id) ?? null;
}

export function projectPath(id) {
  return findProject(id) ? `/projets/${id}` : "/";
}

export function projectIdFromPath(pathname) {
  const match = /^\/projets\/([a-z0-9-]+)\/?$/.exec(String(pathname ?? ""));
  return match && findProject(match[1]) ? match[1] : "";
}

export function neighbours(id) {
  const index = projects.findIndex((project) => project.id === id);
  if (index < 0) return { prev: null, next: null };
  const count = projects.length;
  return {
    prev: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}

export function skillLit(projectId, skillId) {
  if (!skillIds.has(skillId)) {
    return false;
  }
  const project = findProject(projectId);
  return project ? project.skills.includes(skillId) : false;
}

export function localized(value, localeId) {
  if (!value || typeof value !== "object") return typeof value === "string" ? value : "";
  if (Object.hasOwn(value, localeId)) return value[localeId];
  return value.fr ?? "";
}

export function sentenceFor(project, localeId) {
  const value = localized(project?.text, localeId);
  return typeof value === "string" ? value : "";
}

export function listFor(project, key, localeId) {
  const value = localized(project?.[key], localeId);
  return Array.isArray(value) ? value : [];
}

export function stackFor(project) {
  const known = (project?.skills ?? [])
    .map((id) => skills.find((skill) => skill.id === id))
    .filter(Boolean)
    .map((skill) => ({ name: skill.name, logo: skill.logo }));
  const extra = (project?.stack ?? []).map((name) => ({ name, logo: "" }));
  return [...known, ...extra];
}

export function shotAt(project, index) {
  const shots = Array.isArray(project?.shots) ? project.shots : [];
  if (shots.length === 0) {
    return "";
  }
  const safe = ((index % shots.length) + shots.length) % shots.length;
  return shots[safe];
}
