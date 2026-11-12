"""CV de Matéo Bourdin (FR/EN) — version lisible par les ATS.

Rendu : python3 build.py  ->  Mateo_Bourdin_CV_FR.pdf / Mateo_Bourdin_CV_EN.pdf

Choix « ATS » :
- le contenu principal est écrit AVANT la colonne de gauche dans le HTML
  (la mise en page la remet visuellement à gauche) : un ATS lit d'abord
  expérience, compétences, projets et formation ;
- titres de section sans espacement de lettres (sinon « F O R M AT I O N ») ;
- puces écrites dans le texte (pas de marqueurs de liste séparés) ;
- dates collées au titre de chaque poste / diplôme ;
- mots-clés standard (SQL, tests automatisés, qualité de code).
"""
import base64
import pathlib
from weasyprint import HTML

HERE = pathlib.Path(__file__).resolve().parent


def b64(name, mime):
    return f"data:{mime};base64," + base64.b64encode((HERE / name).read_bytes()).decode()


PHOTO = b64("photo.jpg", "image/jpeg")
QR = b64("qr.png", "image/png")
PORTFOLIO = "https://mateobourdin.github.io"

CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Liberation Sans', Arial, sans-serif; color: #23303d; font-size: 9.1pt; line-height: 1.3; }
a { color: inherit; text-decoration: none; }
.page { position: relative; width: 210mm; height: 297mm; overflow: hidden; }
.sidebar { position: absolute; left: 0; top: 0; width: 196pt; height: 297mm; background: #2b2d33; color: #dbe3ea; padding: 12pt 13pt 12pt 15pt; }
.photo { display: block; width: 92pt; height: 108pt; margin: 0 auto 4pt auto; border-radius: 5pt; object-fit: cover; }
.s-h { font-weight: bold; font-size: 8pt; color: #d9a3ac; text-transform: uppercase; border-bottom: 1pt solid #3d4048; padding-bottom: 2.5pt; margin: 7pt 0 4pt 0; }
.c-lbl { font-size: 7.4pt; color: #93a3b1; margin-top: 2pt; }
.c-val { font-size: 8.7pt; color: #dbe3ea; }
.lang { display: flex; justify-content: space-between; align-items: baseline; font-size: 8.8pt; margin: 2pt 0 3pt 0; }
.lang span { font-size: 7.4pt; color: #d9a3ac; }
.ss { font-size: 8.3pt; line-height: 1.25; margin: 0 0 3pt 0; padding-left: 11pt; text-indent: -11pt; }
.ss .ar { color: #d9a3ac; font-family: 'DejaVu Sans'; margin-right: 4pt; }
.ss b { color: #fff; }
.mi { margin-bottom: 3pt; font-size: 8pt; line-height: 1.25; }
.mi b { display: block; font-size: 8.3pt; color: #fff; }
.refnote { font-style: italic; font-size: 7.4pt; color: #aebccb; margin-bottom: 4pt; }
.ref { margin-bottom: 4pt; }
.ref .n { font-weight: bold; font-size: 8.5pt; color: #fff; }
.ref .r { font-size: 8pt; color: #aebccb; }
.ref .w { font-size: 7.8pt; color: #d9a3ac; font-style: italic; }
.qr { position: absolute; left: 15pt; right: 13pt; bottom: 12pt; display: flex; align-items: center; background: #fff; border: 1pt solid #d9a3ac; border-radius: 6pt; padding: 6pt 8pt; }
.qr img { width: 50pt; height: 50pt; margin-right: 9pt; }
.qr .l { font-weight: bold; font-size: 7.2pt; color: #8a3542; }
.qr .u { font-weight: bold; font-size: 7.8pt; color: #2b2d33; margin: 2pt 0; }
.qr .d { font-size: 7.4pt; color: #5a6b78; }
.main { margin-left: 196pt; }
.band { background: #2b2d33; height: 76pt; padding: 17pt 18pt 0 18pt; }
.band h1 { margin: 0; font-size: 24pt; color: #fff; }
.band .t { font-weight: bold; font-size: 10.5pt; color: #d9a3ac; margin-top: 4pt; }
.content { padding: 10pt 20pt 0 18pt; }
.acc { background: #f4f6f8; border-left: 2.5pt solid #8a3542; padding: 6pt 9pt 6pt 13.5pt; font-style: italic; font-size: 9pt; color: #3a4a58; line-height: 1.38; }
.m-h { background: #2b2d33; color: #fff; font-size: 8.8pt; text-transform: uppercase; padding: 3pt 8pt; margin: 7pt 0 4pt 0; }
.job { margin-bottom: 4pt; }
.jt { font-weight: bold; font-size: 9.4pt; color: #2b2d33; }
.badge { display: inline-block; background: #8a3542; color: #fff; font-weight: normal; font-size: 7.4pt; border-radius: 6pt; padding: 1pt 7pt; margin-left: 6pt; vertical-align: 1pt; }
.org { font-style: italic; font-size: 8.3pt; color: #5a6b78; margin-top: 1pt; }
.li { font-size: 9.1pt; padding-left: 10pt; text-indent: -6pt; margin-top: 1.5pt; }
.sk, .pr { font-size: 8.3pt; color: #3a4a58; margin-bottom: 3pt; line-height: 1.36; }
.sk b, .pr b { font-size: 9pt; color: #2b2d33; }
.ed { margin-bottom: 5pt; }
.ed .jt { font-size: 8.9pt; }
.ed .org { font-size: 8pt; }
.ed .ds { font-size: 7.4pt; color: #8a3542; margin-top: 1pt; }
"""


def link(text, href):
    return f'<a href="{href}">{text}</a>'


def page(t):
    H = t["h"]
    jobs = "".join(
        f'<div class="job"><div class="jt">{title}<span class="badge">{date}</span></div>'
        f'<div class="org">{org}</div>'
        + "".join(f'<div class="li">•&nbsp;{x}</div>' for x in items)
        + "</div>"
        for title, date, org, items in t["jobs"])
    skills = "".join(f'<div class="sk"><b>{a}</b> — {b}</div>' for a, b in t["skills"])
    projs = "".join(f'<div class="pr"><b>{a}</b> — {b}</div>' for a, b in t["projects"])
    eds = "".join(
        f'<div class="ed"><div class="jt">{title}<span class="badge">{date}</span></div>'
        f'<div class="org">{org}</div>'
        + "".join(f'<div class="ds">{x}</div>' for x in details)
        + "</div>"
        for title, date, org, details in t["edu"])
    contact = "".join(f'<div class="c-lbl">{a}</div><div class="c-val">{b}</div>' for a, b in t["contact"])
    langs = "".join(f'<div class="lang">{a}<span>{b}</span></div>' for a, b in t["langs"])
    soft = "".join(f'<div class="ss"><span class="ar">▸</span><b>{a}</b> — {b}</div>' for a, b in t["soft"])
    misc = "".join(f'<div class="mi"><b>{a}</b>{b}</div>' for a, b in t["misc"])
    refs = "".join(f'<div class="ref"><div class="n">{a}</div><div class="r">{b}</div><div class="w">→ {c}</div></div>'
                   for a, b, c in t["refs"])
    return f"""<!DOCTYPE html><html lang="{t['lang']}"><head><meta charset="utf-8">
<title>{t['doc_title']}</title><meta name="author" content="Matéo Bourdin">
<meta name="keywords" content="{t['keywords']}"><style>{CSS}</style></head><body>
<div class="page">
 <div class="main">
  <div class="band"><h1>MATÉO BOURDIN</h1><div class="t">{t['title']}</div></div>
  <div class="content">
   <div class="acc">{t['acc']}</div>
   <div class="m-h">{H['exp']}</div>{jobs}
   <div class="m-h">{H['skills']}</div>{skills}
   <div class="m-h">{H['proj']}</div>{projs}
   <div class="m-h">{H['edu']}</div>{eds}
  </div>
 </div>
 <div class="sidebar">
  <img class="photo" src="{PHOTO}" alt="">
  <div class="s-h">{H['contact']}</div>{contact}
  <div class="s-h">{H['langs']}</div>{langs}
  <div class="s-h">{H['soft']}</div>{soft}
  <div class="s-h">{H['misc']}</div>{misc}
  <div class="s-h">{H['refs']}</div><div class="refnote">{H['refnote']}</div>{refs}
  <div class="qr">{link(f'<img src="{QR}" alt="">', PORTFOLIO)}<div><div class="l">PORTFOLIO</div>
   <div class="u">{link('mateobourdin.github.io', PORTFOLIO)}</div><div class="d">{H['pfd']}</div></div></div>
 </div>
</div></body></html>"""


CONTACT_LINKS = dict(
    phone=link("+33 (0)6 11 62 43 81", "tel:+33611624381"),
    email=link("mateo.bourdin@etu.univ-smb.fr", "mailto:mateo.bourdin@etu.univ-smb.fr"),
    linkedin=link("linkedin.com/in/BOURDINMateo", "https://www.linkedin.com/in/BOURDINMateo"),
    github=link("github.com/MateoBourdin", "https://github.com/MateoBourdin"),
)
P = lambda txt: link(txt, PORTFOLIO)  # noqa: E731

FR = dict(
    lang="fr", doc_title="CV - Matéo Bourdin",
    keywords="Stage, développeur, C#, .NET, ASP.NET Core, Vue.js, Python, SQL, PostgreSQL, Power BI, Grafana, Azure, Docker, GitLab CI/CD, BUT Informatique",
    title="Étudiant en Informatique — Bachelor (BUT), 3e année",
    h=dict(contact="Contact", langs="Langues", soft="Compétences transversales", misc="Divers",
           refs="Références", refnote="Coordonnées sur demande", pfd="Code, architecture et démos de chaque projet",
           exp="Expérience professionnelle", skills="Compétences techniques", proj="Projets universitaires",
           edu="Formation"),
    acc="Étudiant en 3e et dernière année de Bachelor (BUT) Informatique, parcours Réalisation d’Applications, "
        "à l’IUT d’Annecy, je recherche un stage de 16 semaines à partir du 19 janvier 2027. Développeur full-stack "
        "(C#/.NET, Vue.js, Python) fort d’une première expérience en studio de jeux vidéo, je m’appuie sur un solide "
        "bagage en mathématiques et en data/IA, domaine dans lequel j’aimerais poursuivre en master.",
    jobs=[("Développeur logiciel — Stage BUT2, Lappi Soft", "Avril – juin 2026",
           "Studio de jeux vidéo indépendant · moins de 5 salariés · Pers-Jussy, France",
           ["Conception et développement autonome du système « Discovery Diary » en C# (12 scripts, ~2 400 lignes) pour le jeu « The Inspector » (Unity)",
            "Développement d’un outil éditeur d’import d’assets, documentation bilingue FR/EN, gain de performance ×42 (de 2 à 84 FPS) sur la scène de test"]),
          ("Game designer bénévole — MagicalSky", "Févr. 2025 – mars 2026",
           "Serveur Minecraft communautaire (magicalsky.fr) · équipe de 13-14 bénévoles · à distance",
           ["Création de mobs et d’objets (MythicMobs, MMOItems), serveurs et plugins Paper en Java, modélisation 3D (Blockbench)"]),
          ("Vendeur — Intersport", "Été 2024", "Distribution d’articles de sport · ~20 salariés · Fouesnant, France",
           ["Conseil clientèle sur les équipements sportifs, gestion des stocks"]),
          ("Employé boulangerie — Carrefour Market", "Été 2023", "Grande distribution · 30 à 40 salariés · Bénodet, France",
           ["Préparation des produits, contrôle qualité"])],
    skills=[("Backend", "C# / ASP.NET Core (confirmé), Python / Flask (confirmé), Java (intermédiaire), PHP / Laravel (intermédiaire)"),
            ("Frontend / Mobile", "Vue 3 (confirmé), HTML / CSS / JS (confirmé), Flutter (notions)"),
            ("Données & IA", "SQL / PostgreSQL (confirmé), EF Core (intermédiaire), MongoDB (notions) · NumPy, pandas (confirmé), TensorFlow (notions) : régression, ACP, classification d’images · Power BI, Grafana"),
            ("DevOps & qualité", "Git (confirmé), Docker Compose, GitLab CI/CD (intermédiaire), Kubernetes (en cours), Azure / Azure DevOps · Tests automatisés unitaires et d’intégration (MSTest, Moq), qualité de code · Linux, Windows Server · Code assisté par IA (Claude Code)")],
    projects=[("CUBE Bikes — Plateforme e-commerce (projet fictif)", "API REST ASP.NET Core / EF Core, frontend Vue 3 + Pinia, auth JWT, Stripe, PostgreSQL ; première version en Laravel. Équipe de 5, IUT Annecy."),
              ("Clone Twitter/X — Réseau social", "Laravel/PHP, PostgreSQL, Redis, WebSockets, conteneurisé avec Docker. Équipe de 4, IUT Annecy."),
              ("TP de 3e année", "API ASP.NET Core testée (Moq, intégration PostgreSQL), appli Flask + TensorFlow sous Docker, pipelines GitLab CI/CD. IUT Annecy.")],
    edu=[("Bachelor Universitaire de Technologie (BUT) Informatique", "2024 – 2027",
          "Parcours Réalisation d’Applications · IUT Annecy, Annecy-le-Vieux, France",
          ["Diplôme national de niveau Bachelor (bac+3, 180 ECTS) — 3e et dernière année en cours",
           "Major de promotion en mathématiques, 16,5/20 de moyenne au dernier semestre",
           "Cours de 3e année dispensés en anglais, à l’initiative de l’IUT et de ses étudiants"]),
         ("Année préparatoire intégrée aux écoles d’ingénieurs", "2023 – 2024", "ENIB, Brest, France", []),
         ("Baccalauréat général, mention Bien — Maths &amp; Informatique", "2023", "Lycée Sainte-Thérèse, Quimper, France",
          ["Cordées de la réussite 2022 : 1re place — analyse d’un réseau de lycéens par la théorie des graphes (Python, Graphviz)"])],
    contact=[("Nationalité", "Française"), ("Adresse", "613 rue de la Gare, 74930 Reignier-Ésery, France"),
             ("Téléphone", CONTACT_LINKS["phone"]), ("Email", CONTACT_LINKS["email"]),
             ("LinkedIn", CONTACT_LINKS["linkedin"]), ("GitHub", CONTACT_LINKS["github"]),
             ("Mobilité", "Permis B, véhiculé · Frontalier, éligible au permis G")],
    langs=[("Français", "NATIF"), ("Anglais", "C1 · CECRL"), ("Italien", "B2 · CECRL")],
    soft=[("Autonomie", "seul développeur de mon module chez Lappi Soft, de la conception à la documentation"),
          ("Travail d’équipe", "projets en groupe de 2 à 4 en méthode Scrum"),
          ("Adaptabilité", "polyvalent sur 5 stacks techniques différentes en 3 ans"),
          ("Analyse", "régression et descente de gradient implémentées de zéro")],
    misc=[("Ski de compétition &amp; snowboard", "Niveau national, 13 ans de pratique · Station de Combloux"),
          ("Équitation", "3e au Championnat de France de saut d’obstacles 2019 (Club Hippique de Pont-l’Abbé) · Champion de France de polo (Polo Club Reden, Gouesnac’h)")],
    refs=[("Maxime Bernard", "Fondateur &amp; directeur, Lappi Soft", "maître de stage, avril – juin 2026"),
          ("Luc Damas", "Enseignant développement web, IUT Annecy", "référent CUBE Bikes &amp; Twitter Clone")],
)

EN = dict(
    lang="en", doc_title="Resume - Matéo Bourdin",
    keywords="Internship, software developer, C#, .NET, ASP.NET Core, Vue.js, Python, SQL, PostgreSQL, Power BI, Grafana, Azure, Docker, GitLab CI/CD, Computer Science",
    title="Computer Science Student — Bachelor’s degree (BUT), 3rd year",
    h=dict(contact="Contact", langs="Languages", soft="Soft skills", misc="Interests",
           refs="References", refnote="Contact details available on request", pfd="Code, architecture and demos for every project",
           exp="Professional experience", skills="Technical skills", proj="University projects", edu="Education"),
    acc="In the third and final year of a Bachelor’s degree in Computer Science (BUT Informatique, Application Development "
        "track) at IUT d’Annecy, I am seeking a 16-week internship starting on 19 January 2027. A full-stack developer "
        "(C#/.NET, Vue.js, Python) with first professional experience in a video game studio, I bring a strong background "
        "in maths and data/AI, the field I hope to pursue in a Master’s.",
    jobs=[("Software Developer — 2nd-year Internship, Lappi Soft", "Apr – Jun 2026",
           "Independent video game studio · fewer than 5 employees · Pers-Jussy, France",
           ["Independently designed and developed the “Discovery Diary” system in C# (12 scripts, ~2,400 lines) for the game “The Inspector” (Unity)",
            "Built an editor tool for asset import, wrote bilingual EN/FR developer documentation, achieved a 42× performance gain (2 to 84 FPS) on the test scene"]),
          ("Volunteer Game Designer — MagicalSky", "Feb 2025 – Mar 2026",
           "Community Minecraft server (magicalsky.fr) · team of 13–14 volunteers · remote",
           ["Created mobs and items (MythicMobs, MMOItems), set up Paper servers and Java plugins, 3D modelling (Blockbench)"]),
          ("Sales Assistant — Intersport", "Summer 2024", "Sporting goods retailer · ~20 employees · Fouesnant, France",
           ["Advised customers on sports equipment, managed stock"]),
          ("Bakery Assistant — Carrefour Market", "Summer 2023", "Supermarket · 30–40 employees · Bénodet, France",
           ["Prepared bakery products, carried out quality checks"])],
    skills=[("Back end", "C# / ASP.NET Core (advanced), Python / Flask (advanced), Java (intermediate), PHP / Laravel (intermediate)"),
            ("Front end / Mobile", "Vue 3 (advanced), HTML / CSS / JS (advanced), Flutter (basic)"),
            ("Data &amp; AI", "SQL / PostgreSQL (advanced), EF Core (intermediate), MongoDB (basic) · NumPy, pandas (advanced), TensorFlow (basic): regression, PCA, image classification · Power BI and Grafana dashboards"),
            ("DevOps &amp; quality", "Git (advanced), Docker Compose, GitLab CI/CD (intermediate), Kubernetes (in progress), Azure / Azure DevOps · Automated unit and integration testing (MSTest, Moq), code quality · Linux, Windows Server · AI-assisted coding (Claude Code)")],
    projects=[("CUBE Bikes — E-commerce platform (fictional)", "ASP.NET Core / EF Core REST API, Vue 3 + Pinia front end, JWT authentication, Stripe, PostgreSQL; first version in Laravel. Team of 5, IUT Annecy."),
              ("Twitter/X Clone — Social network", "Laravel/PHP, PostgreSQL, Redis, WebSockets, containerised with Docker. Team of 4, IUT Annecy."),
              ("3rd-year labs", "ASP.NET Core API with unit and integration tests (Moq, PostgreSQL), Flask + TensorFlow app on Docker, GitLab CI/CD pipelines. IUT Annecy.")],
    edu=[("Bachelor’s degree in Computer Science (BUT Informatique)", "2024 – 2027",
          "Application Development track · IUT Annecy, Annecy-le-Vieux, France",
          ["French national Bachelor’s degree (3 years, 180 ECTS) — 3rd and final year in progress",
           "Top of class in mathematics, 16.5/20 average in the last semester",
           "3rd-year courses taught in English, at the initiative of the IUT and its students"]),
         ("Integrated preparatory year for engineering schools", "2023 – 2024", "ENIB (national engineering school), Brest, France", []),
         ("French Baccalauréat with Distinction — Maths &amp; Computer Science", "2023", "High-school diploma · Lycée Sainte-Thérèse, Quimper, France",
          ["Cordées de la réussite 2022 (French equal-opportunity programme): 1st place — graph analysis of a student network (Python, Graphviz)"])],
    contact=[("Nationality", "French"), ("Address", "613 rue de la Gare, 74930 Reignier-Ésery, France"),
             ("Phone", CONTACT_LINKS["phone"]), ("Email", CONTACT_LINKS["email"]),
             ("LinkedIn", CONTACT_LINKS["linkedin"]), ("GitHub", CONTACT_LINKS["github"]),
             ("Mobility", "Driving licence (B), own car · Cross-border commuter, eligible for a G permit")],
    langs=[("French", "NATIVE"), ("English", "C1 · CEFR"), ("Italian", "B2 · CEFR")],
    soft=[("Autonomy", "sole developer of my module at Lappi Soft, from design to documentation"),
          ("Teamwork", "group projects of 2 to 4 people using Scrum"),
          ("Adaptability", "worked with 5 different tech stacks in 3 years"),
          ("Analysis", "regression and gradient descent implemented from scratch")],
    misc=[("Competitive skiing &amp; snowboarding", "National level, 13 years of practice · Combloux ski resort"),
          ("Horse riding", "3rd, French Show Jumping Championship 2019 (Club Hippique de Pont-l’Abbé) · French Polo Champion (Polo Club Reden, Gouesnac’h)")],
    refs=[("Maxime Bernard", "Founder &amp; Director, Lappi Soft", "internship supervisor, Apr – Jun 2026"),
          ("Luc Damas", "Web Development Lecturer, IUT Annecy", "project referee, CUBE Bikes &amp; Twitter Clone")],
)

if __name__ == "__main__":
    for t, name in ((FR, "Mateo_Bourdin_CV_FR"), (EN, "Mateo_Bourdin_CV_EN")):
        html = page(t)
        (HERE / f"{name}.html").write_text(html, encoding="utf-8")
        doc = HTML(string=html).render()
        print(name, "pages:", len(doc.pages))
        doc.write_pdf(HERE / f"{name}.pdf")
