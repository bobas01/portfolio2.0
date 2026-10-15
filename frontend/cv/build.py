"""Build the three one-page CVs from one set of facts."""

from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT.parent / "public" / "cv"
PHOTO = ROOT / "photo.png"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

ADDRESS = ["Rua Monteiro Lobato, 464", "Barreto, Niterói", "CEP 24111-170, RJ"]
LINKEDIN = "https://www.linkedin.com/in/alexandre-sequeira/"
GITHUB = "https://github.com/bobas01"
WHATSAPP = "+55 62 99152-5466"
PHONE_FR = "+33 6 28 65 75 15"

CVS = {
    "fr": {
        "file": "alexandre-sequeira-fr.pdf",
        "email": "alexandre.sequeira01@gmail.com",
        "phone": PHONE_FR,
        "phone_icon": "phone",
        "phone_href": "tel:+33628657515",
        "role": "Développeur web fullstack",
        "summary": "Je construis des sites et des applications. Après une alternance comme chef de projet digital, j’ai obtenu en 2026 le titre de concepteur développeur d’applications. Ce qui me stimule, c’est un projet qui me pousse, une technologie nouvelle, et une équipe avec qui partager les idées.",
        "skills_title": "Compétences",
        "devops": "DevOps",
        "devops_body": "Docker, Git, microservices, mise en ligne d’une application web",
        "front": "Front-end",
        "front_body": "HTML, CSS, SCSS, JavaScript, Svelte, notions de React et de Vue.js. Design : Figma",
        "back": "Back-end",
        "back_body": "PHP, Symfony, API Platform",
        "soft_title": "Savoir-être",
        "soft": "Autonomie, communication, empathie, esprit d’équipe",
        "work_title": "Expérience",
        "jobs": [
            (
                "Développeur web fullstack en alternance",
                "Août 2024 – août 2025 · Sportyneo, Écully",
                "Version 2 de l’application, pour vendre des licences sportives en plusieurs échéances. Back-end : Silverstripe, Stripe, API REST. Front-end : Svelte, SvelteKit, CSS. Deux dossiers : un pour les utilisateurs, un pour les clubs.",
            ),
            (
                "Projet freelance Hemadex",
                "Février 2024 – octobre 2024",
                "Site de vidéo à la demande. Back-end : Symfony, API Platform, Stripe, AWS. Front-end : React, SCSS, TypeScript.",
            ),
            (
                "Stage chez Hubwiser",
                "Octobre 2023 – décembre 2023 · Chambéry",
                "Application mobile. Back-end : Symfony, API Platform. Front-end : Nuxt, Ionic, Tailwind, Pinia.",
            ),
        ],
        "edu_title": "Formation",
        "edu": [
            ("Concepteur développeur d’applications", "Novembre 2025 – mars 2026 · ALT, Rennes"),
            ("Chef de projet digital, Bachelor", "Août 2024 – août 2025 · EEMI, Lyon"),
            ("Développeur web et web mobile", "Décembre 2022 – décembre 2023 · Online FormaPro, Saint-Denis-lès-Bourg"),
            ("Diplôme d’État d’aide-soignant", "2013 – 2014 · I.F.S.I. Le Vinatier, Bron"),
        ],
        "other_title": "Autres expériences",
        "other": [
            "Cariste, région lyonnaise et Bourg-en-Bresse, 2019 – 2022",
            "Volontariat en auberge de jeunesse, Amérique du Sud, 2018",
            "Aide-soignant, région lyonnaise, 2014 – 2018",
        ],
        "lang_title": "Langues",
        "langs": [("Français", "Langue maternelle"), ("Anglais", "B2"), ("Portugais", "Notions"), ("Espagnol", "Notions")],
        "interest_title": "Centres d’intérêt",
        "interests": "Sport (musculation, cardio, dix ans de volley). Animation japonaise. Jeux vidéo, en solo et en FPS. Voyages : Colombie, Pérou, Bolivie, Chili, Argentine, Brésil.",
        "social": "Réseaux",
        "remote": "Travail à distance",
        "linkedin": "LinkedIn",
    },
    "en": {
        "file": "alexandre-sequeira-en.pdf",
        "email": "sequeira.alexandre01@gmail.com",
        "phone": WHATSAPP,
        "phone_icon": "whatsapp",
        "phone_href": "https://wa.me/5562991525466",
        "role": "Full-stack web developer",
        "summary": "I build websites and applications. After a work-study bachelor’s in digital project management, I completed a 2026 degree in application design and development, the French CDA. I like work that pushes me, a new technology, and a team to share ideas with.",
        "skills_title": "Skills",
        "devops": "DevOps",
        "devops_body": "Docker, Git, microservices, deploying a web application",
        "front": "Front-end",
        "front_body": "HTML, CSS, SCSS, JavaScript, Svelte, some React and Vue.js. Design: Figma",
        "back": "Back-end",
        "back_body": "PHP, Symfony, API Platform",
        "soft_title": "Soft skills",
        "soft": "Independence, clear communication, empathy, and team spirit",
        "work_title": "Experience",
        "jobs": [
            (
                "Full-stack web developer, work-study",
                "August 2024 – August 2025 · Sportyneo, Écully",
                "Built version 2 of the application, to sell sports licenses in installments. Back-end: Silverstripe, Stripe, REST API. Front-end: Svelte, SvelteKit, CSS. Two folders: one for users, one for clubs.",
            ),
            (
                "Freelance project, Hemadex",
                "February 2024 – October 2024",
                "A video-on-demand site. Back-end: Symfony, API Platform, Stripe, AWS. Front-end: React, SCSS, TypeScript.",
            ),
            (
                "Internship at Hubwiser",
                "October 2023 – December 2023 · Chambéry",
                "A mobile application. Back-end: Symfony, API Platform. Front-end: Nuxt, Ionic, Tailwind, Pinia.",
            ),
        ],
        "edu_title": "Education",
        "edu": [
            ("Application design and development (CDA)", "November 2025 – March 2026 · ALT, Rennes"),
            ("Digital project management, bachelor’s degree", "August 2024 – August 2025 · EEMI, Lyon"),
            ("Web and mobile developer", "December 2022 – December 2023 · Online FormaPro, Saint-Denis-lès-Bourg"),
            ("State diploma as a care assistant", "2013 – 2014 · I.F.S.I. Le Vinatier, Bron"),
        ],
        "other_title": "Earlier work",
        "other": [
            "Forklift operator, Lyon area and Bourg-en-Bresse, 2019 – 2022",
            "Volunteering in a youth hostel, South America, 2018",
            "Care assistant, Lyon area, 2014 – 2018",
        ],
        "lang_title": "Languages",
        "langs": [("French", "Native"), ("English", "B2"), ("Portuguese", "Basic"), ("Spanish", "Basic")],
        "interest_title": "Interests",
        "interests": "Sport (weights, cardio, ten years of volleyball). Japanese animation. Video games, single-player and FPS. Travel: Colombia, Peru, Bolivia, Chile, Argentina, Brazil.",
        "social": "Networks",
        "remote": "Remote work",
        "linkedin": "LinkedIn",
    },
    "pt": {
        "file": "alexandre-sequeira-pt.pdf",
        "email": "sequeira.alexandre01@gmail.com",
        "phone": WHATSAPP,
        "phone_icon": "whatsapp",
        "phone_href": "https://wa.me/5562991525466",
        "role": "Desenvolvedor web fullstack",
        "summary": "Faço sites e aplicações. Depois de um bacharelado em gestão de projetos digitais, conciliando trabalho e estudo, concluí em 2026 o diploma francês de concepção e desenvolvimento de aplicações (CDA). O que me motiva é um projeto que me exige, uma tecnologia nova e uma equipe com quem trocar ideias.",
        "skills_title": "Conhecimentos",
        "devops": "DevOps",
        "devops_body": "Docker, Git, microsserviços, publicação de uma aplicação web",
        "front": "Front-end",
        "front_body": "HTML, CSS, SCSS, JavaScript, Svelte, noção de React e Vue.js. Design: Figma",
        "back": "Back-end",
        "back_body": "PHP, Symfony, API Platform",
        "soft_title": "Habilidades interpessoais",
        "soft": "Autonomia, comunicação clara, empatia e espírito de equipe",
        "work_title": "Experiência",
        "jobs": [
            (
                "Desenvolvedor web fullstack, trabalho e estudo",
                "Agosto de 2024 – agosto de 2025 · Sportyneo, Écully",
                "Versão 2 da aplicação, para vender licenças esportivas parceladas. Back-end: Silverstripe, Stripe, API REST. Front-end: Svelte, SvelteKit, CSS. Duas pastas: uma para os usuários e outra para os clubes.",
            ),
            (
                "Projeto freelance Hemadex",
                "Fevereiro de 2024 – outubro de 2024",
                "Site de vídeo sob demanda. Back-end: Symfony, API Platform, Stripe, AWS. Front-end: React, SCSS, TypeScript.",
            ),
            (
                "Estágio na Hubwiser",
                "Outubro de 2023 – dezembro de 2023 · Chambéry",
                "Aplicativo móvel. Back-end: Symfony, API Platform. Front-end: Nuxt, Ionic, Tailwind, Pinia.",
            ),
        ],
        "edu_title": "Formação",
        "edu": [
            ("Concepção e desenvolvimento de aplicações (CDA)", "Novembro de 2025 – março de 2026 · ALT, Rennes"),
            ("Bacharelado em gestão de projetos digitais", "Agosto de 2024 – agosto de 2025 · EEMI, Lyon"),
            ("Desenvolvedor web e mobile", "Dezembro de 2022 – dezembro de 2023 · Online FormaPro, Saint-Denis-lès-Bourg"),
            ("Diploma de auxiliar de enfermagem", "2013 – 2014 · I.F.S.I. Le Vinatier, Bron"),
        ],
        "other_title": "Outras experiências",
        "other": [
            "Operador de empilhadeira, região de Lyon e Bourg-en-Bresse, 2019 – 2022",
            "Voluntariado em albergue da juventude, América do Sul, 2018",
            "Auxiliar de enfermagem, região de Lyon, 2014 – 2018",
        ],
        "lang_title": "Idiomas",
        "langs": [("Francês", "Língua materna"), ("Inglês", "B2"), ("Português", "Básico"), ("Espanhol", "Básico")],
        "interest_title": "Interesses",
        "interests": "Esporte (musculação, cardio, dez anos de vôlei). Animação japonesa. Jogos solo e FPS. Viagens: Colômbia, Peru, Bolívia, Chile, Argentina e Brasil.",
        "social": "Redes",
        "remote": "Trabalho remoto",
        "linkedin": "LinkedIn",
    },
}

ICONS = {
    "mail": '<path d="M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zm9 7.2 8.2-5.7H3.8L12 12.7z"/>',
    "pin": '<path d="M12 2.2a7 7 0 0 0-7 7c0 5.2 7 12.6 7 12.6s7-7.4 7-12.6a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>',
    "phone": '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>',
    "whatsapp": '<path d="M12 2.2A9.7 9.7 0 0 0 3.5 16.6L2.2 21.8l5.3-1.4A9.7 9.7 0 1 0 12 2.2zm5.5 13.7c-.23.65-1.34 1.2-1.85 1.27-.47.07-1.07.1-1.73-.11-.4-.12-.9-.3-1.55-.57-2.73-1.18-4.5-3.93-4.64-4.11-.13-.18-1.1-1.47-1.1-2.8s.7-1.99.95-2.26c.23-.27.61-.39.81-.39h.58c.18 0 .43-.07.67.51.25.6.84 2.07.91 2.22.08.15.12.34.02.54-.1.2-.15.33-.3.5-.15.17-.31.38-.44.51-.14.14-.29.29-.12.56.16.27.73 1.2 1.56 1.95 1.07.96 1.97 1.26 2.25 1.4.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.18-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.46.21.53.33.06.11.06.67-.17 1.32z"/>',
    "screen": '<path d="M3 4.5h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1zM8 19.5h8M12 16.5v3"/>',
    "linkedin": '<path d="M5 3.2A1.8 1.8 0 1 0 5 6.8 1.8 1.8 0 0 0 5 3.2zM3.4 8.2h3.2V20.8H3.4zM10 8.2h3.1v1.7h.05c.43-.82 1.48-1.68 3.05-1.68 3.26 0 3.86 2.15 3.86 4.94v7.64h-3.2v-6.78c0-1.62-.03-3.7-2.25-3.7-2.26 0-2.6 1.76-2.6 3.58v6.9H10z"/>',
    "github": '<path d="M12 .3C5.4.3 0 5.7 0 12.3c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 5.7 18.6.3 12 .3z"/>',
}


def icon(name):
    stroke = 'fill="none" stroke="currentColor" stroke-width="1.8"' if name == "screen" else 'fill="currentColor"'
    return f'<svg viewBox="0 0 24 24" aria-hidden="true" {stroke}>{ICONS[name]}</svg>'


def row(name, html):
    return f'<p class="row">{icon(name)}<span>{html}</span></p>'


def page(data):
    address = "<br>".join(ADDRESS)
    langs = "".join(f"<p><strong>{name}</strong><br>{level}</p>" for name, level in data["langs"])
    jobs = "".join(
        "<article><h3>{title}</h3><p class='when'>{when}</p><p>{body}</p></article>".format(
            title=title,
            when=when,
            body=body.replace("Back-end", "Backend").replace("Front-end", "Frontend"),
        )
        for title, when, body in data["jobs"]
    )
    edu = "".join(f"<article><h3>{title}</h3><p class='when'>{when}</p></article>" for title, when in data["edu"])
    other = "".join(f"<li>{line}</li>" for line in data["other"])
    phone = data["phone"]
    return f"""<!DOCTYPE html>
<html lang="{data.get('html', 'fr')}">
<head>
<meta charset="utf-8">
<title>Alexandre Sequeira</title>
<style>
  @page {{ size: A4; margin: 0; }}
  * {{ box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  html, body {{ margin: 0; padding: 0; }}
  body {{
    width: 210mm; height: 297mm; overflow: hidden;
    display: grid; grid-template-columns: 68mm 1fr;
    font-family: "Segoe UI", Arial, sans-serif; color: #1d1d1d; background: #fff;
  }}
  aside {{ background: #343434; color: #f3f3f3; padding: 8mm 6mm 6mm; }}
  img {{ width: 42mm; height: 42mm; object-fit: cover; object-position: center 15%; display: block; margin: 0 auto 5mm; border-radius: 1.5mm; }}
  h1 {{ margin: 0 0 1mm; font-size: 13pt; font-weight: 700; text-align: center; }}
  .role {{ margin: 0 0 5mm; color: #7ec8ea; font-size: 9pt; font-weight: 700; text-align: center; }}
  h2 {{ margin: 5.2mm 0 1.8mm; font-size: 10.5pt; letter-spacing: 0.04em; text-transform: uppercase; }}
  aside h2 {{ color: #fff; border-bottom: 0.3mm solid #6a6a6a; padding-bottom: 1mm; }}
  .row {{ display: grid; grid-template-columns: 5mm 1fr; gap: 1.8mm; align-items: start; margin: 0 0 2.2mm; font-size: 8pt; line-height: 1.3; }}
  .row svg {{ width: 3.8mm; height: 3.8mm; margin-top: 0.3mm; }}
  .row a {{ color: inherit; text-decoration: none; }}
  aside p {{ margin: 0 0 1.6mm; font-size: 8pt; line-height: 1.3; }}
  aside strong {{ font-weight: 700; }}
  main {{ padding: 8mm 8mm 6mm 7mm; }}
  main h2 {{ color: #127eab; margin-top: 3.6mm; }}
  .lead {{ margin: 0; font-size: 9.5pt; line-height: 1.4; }}
  .block p, article p {{ margin: 0; font-size: 9.2pt; line-height: 1.38; }}
  .label {{ font-weight: 700; }}
  article {{ margin: 0 0 3mm; padding-left: 3.2mm; border-left: 0.35mm solid #d5d5d5; }}
  article h3 {{ margin: 0; font-size: 9pt; }}
  .when {{ color: #4d4d4d; font-size: 8pt; }}
  ul {{ margin: 0; padding-left: 4mm; }}
  li {{ font-size: 8.6pt; line-height: 1.32; margin: 0 0 0.6mm; }}
</style>
</head>
<body>
  <aside>
    <img src="{PHOTO.as_uri()}" alt="">
    <h1>Alexandre Sequeira</h1>
    <p class="role">{data["role"]}</p>
    {row("mail", f'<a href="mailto:{data["email"]}">{data["email"]}</a>')}
    {row("pin", address)}
    {row(data["phone_icon"], f'<a href="{data["phone_href"]}">{phone}</a>')}
    {row("screen", data["remote"])}
    <h2>{data["lang_title"]}</h2>
    {langs}
    <h2>{data["interest_title"]}</h2>
    <p>{data["interests"]}</p>
    <h2>{data["social"]}</h2>
    {row("github", f'<a href="{GITHUB}">GitHub</a>')}
    {row("linkedin", f'<a href="{LINKEDIN}">{data["linkedin"]}</a>')}
  </aside>
  <main>
    <p class="lead">{data["summary"]}</p>
    <h2>{data["skills_title"]}</h2>
    <div class="block">
      <p><span class="label">{data["devops"]}.</span> {data["devops_body"]}</p>
      <p><span class="label">{data["front"]}.</span> {data["front_body"]}</p>
      <p><span class="label">{data["back"]}.</span> {data["back_body"]}</p>
    </div>
    <h2>{data["soft_title"]}</h2>
    <p class="lead">{data["soft"]}</p>
    <h2>{data["work_title"]}</h2>
    {jobs}
    <h2>{data["edu_title"]}</h2>
    {edu}
    <h2>{data["other_title"]}</h2>
    <ul>{other}</ul>
  </main>
</body>
</html>
"""


def main():
    source = Path(r"C:\wamp64\www\portfolio2.0\.impeccable\build\cv\cvdev-0.png")
    shutil.copyfile(source, PHOTO)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    html_lang = {"fr": "fr", "en": "en", "pt": "pt-BR"}
    for key, data in CVS.items():
        data["html"] = html_lang[key]
        html_path = ROOT / f"{key}.html"
        html_path.write_text(page(data), encoding="utf-8")
        pdf_path = PUBLIC / data["file"]
        subprocess.run(
            [
                str(CHROME),
                "--headless=new",
                "--disable-gpu",
                "--no-pdf-header-footer",
                f"--print-to-pdf={pdf_path}",
                html_path.as_uri(),
            ],
            check=True,
        )
        print(pdf_path, pdf_path.stat().st_size)


if __name__ == "__main__":
    main()
