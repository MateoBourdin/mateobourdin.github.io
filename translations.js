const translations = {
    fr: {
        shots: {
            lappi: "Le carnet Discovery Diary dans The Inspector (Unity)",
            fianchetto: "Rapport d’analyse d’une partie dans Fianchetto",
            cube: "Sélecteur de magasin CUBE Bikes sur carte Leaflet (données de démonstration)",
            twitter: "Modèle conceptuel de données du clone Twitter/X",
            sae201: "Diagramme des classes métier de l’application Cave à vin",
            portfolio: "Page d’accueil du portfolio",
            survival: "Capture de jeu de Survival Island",
            zelda: "Carte du jeu Zelda en mode texte"
        },
        metaPages: {
            coursFlask: "Flask, données et IA | Matéo Bourdin",
            coursAspnet: "API ASP.NET Core, qualité et tests | Matéo Bourdin",
            coursMaths: "Modélisation mathématique et IA | Matéo Bourdin",
            coursDocker: "Docker, CI/CD et Kubernetes | Matéo Bourdin",
            coursAspnet: "API ASP.NET Core, qualité et tests | Matéo Bourdin",
            coursMaths: "Modélisation mathématique et IA | Matéo Bourdin",
            coursDocker: "Docker, CI/CD et Kubernetes | Matéo Bourdin",
            coursMaths: "Modélisation mathématique et IA | Matéo Bourdin",
            coursDocker: "Docker, CI/CD et Kubernetes | Matéo Bourdin",
            coursDocker: "Docker, CI/CD et Kubernetes | Matéo Bourdin",
            journey: 'Parcours | Matéo Bourdin',
            projects: 'Projets | Matéo Bourdin',
            now: 'Cours actuels | Matéo Bourdin',
            skills: 'Compétences | Matéo Bourdin',
            legal: 'Mentions légales et confidentialité | Matéo Bourdin',
            arcade: 'Arcade | Matéo Bourdin',
            ski: 'Descente à Combloux | Matéo Bourdin',
            naval: 'Défends l’île | Matéo Bourdin',
            bug: 'Trouve le bug | Matéo Bourdin'
        },
        courses: {
            "back": "← Tous mes cours",
            "detail": "Page détaillée : rendus, démos et révisions →",
            "frNote": "Detailed write-ups and revision notes are in French: they are my own study notes.",
            "tabs": {
                "presentation": "Présentation",
                "rendus": "Rendus et démos",
                "reviser": "Réviser"
            },
            "docker": {
                "tag": "🐳 Cours actuel · BUT3",
                "title": "Docker, CI/CD et Kubernetes",
                "desc": "Des images Docker aux pipelines GitLab complets : 18 exercices publics, rejoués et expliqués.",
                "gitlab": "Mes exercices sur GitLab",
                "p1": "Dans ce module de virtualisation, j’ai construit 18 pipelines GitLab CI/CD, du « Hello World » jusqu’aux tests de bout en bout. Chaque exercice est un dépôt public avec son historique et le résultat de son dernier pipeline.",
                "s1": "dépôts GitLab publics",
                "s2": "pipelines au vert",
                "s3": "types de tests automatisés",
                "s4": "jobs dans les derniers pipelines",
                "learnTitle": "Ce que j’y ai appris",
                "l1t": "Construire des images",
                "l1": "Écrire des Dockerfile légers, ordonner les couches pour le cache et publier dans un registre avec des tags fiables.",
                "l2t": "Orchestrer un pipeline",
                "l2": "Étapes, dépendances entre jobs, artefacts, cache, jobs manuels, modèles réutilisables et matrices de versions.",
                "l3t": "Tester à tous les niveaux",
                "l3": "Lint, tests unitaires, intégration avec une vraie base, bout en bout dans un navigateur, charge et benchmark.",
                "l4t": "Sécuriser la chaîne",
                "l4": "Analyse du code et des dépendances, variables protégées et masquées, identifiants jamais écrits dans les logs.",
                "applyTitle": "Appliqué à ce portfolio",
                "apply": "Ce site utilise les mêmes principes : à chaque modification, GitHub Actions vérifie les traductions, le HTML, les liens et l’absence de secrets avant la mise en ligne.",
                "nextTitle": "La suite du module",
                "next": "Kubernetes arrive dans la prochaine partie du cours. Cette page sera complétée au fil des séances."
            },
            "maths": {
                "tag": "📐 Cours actuel · BUT3",
                "title": "Modélisation mathématique et IA",
                "desc": "Des statistiques aux réseaux de neurones : 8 TD, leurs résultats, et les modèles qui tournent dans le navigateur.",
                "p1": "Le module qui relie les mathématiques à l’intelligence artificielle : de NumPy et de l’analyse de données jusqu’aux réseaux de neurones convolutifs et aux Transformers. Chaque notion est travaillée dans un notebook Python, et mes résultats sont repris ici.",
                "s1": "TD en notebooks Jupyter",
                "s2": "CNN sur Fashion-MNIST",
                "s3": "CNN sur CIFAR-10",
                "s4": "démos qui tournent dans le navigateur",
                "learnTitle": "Ce que j’y ai appris",
                "l1t": "Explorer des données",
                "l1": "Nettoyer, filtrer et visualiser avec pandas, matplotlib et seaborn, et mesurer ce que coûte vraiment le calcul parallèle.",
                "l2t": "Les maths des modèles",
                "l2": "ACP par valeurs propres, régression par équation normale et par descente de gradient codée de zéro.",
                "l3t": "Classer et évaluer",
                "l3": "Régression logistique, arbres et forêts, matrice de confusion, rappel, précision et courbe ROC.",
                "l4t": "Réseaux de neurones",
                "l4": "Du perceptron et du XOR jusqu’aux CNN, LSTM et Transformers avec Keras.",
                "linkTitle": "Le lien avec mon projet",
                "link": "Ces notions servent directement dans la SAE Astraeus, où je m’occupe du modèle de prévision météo (un LSTM) du jeu WeatherGuessr."
            },
            "aspnet": {
                "tag": "🧪 Cours actuel · BUT3",
                "title": "API ASP.NET Core, qualité et tests",
                "desc": "Une API REST construite séance après séance : architecture SOLID, DTO, AutoMapper et tests, lancée et testée pour de vrai.",
                "github": "Le dépôt sur GitHub",
                "p1": "Le cours de qualité de développement suit un TD fil rouge : une API REST de gestion de produits en ASP.NET Core, enrichie séance après séance jusqu’à une architecture propre et testée.",
                "s1": "tests au vert",
                "s2": "commits sur 5 semaines",
                "s3": "interfaces séparées par rôle",
                "s4": "bugs trouvés en lançant l’API",
                "learnTitle": "Ce que j’y ai appris",
                "l1t": "Une architecture en couches",
                "l1": "Contrôleurs, dépôts et accès aux données séparés, reliés par injection de dépendances.",
                "l2t": "Les principes SOLID",
                "l2": "Des interfaces petites et ciblées, des dépendances vers des abstractions.",
                "l3t": "DTO et AutoMapper",
                "l3": "Ne jamais exposer les entités : des objets de transfert calculés directement par la base.",
                "l4t": "Tester pour de vrai",
                "l4": "Tests unitaires avec Moq, tests du mapping et test d’intégration sur PostgreSQL.",
                "nextTitle": "La suite",
                "next": "Un contrôleur générique pour factoriser le code, puis un client Blazor Server en MVVM qui consommera cette API."
            },
            "flask": {
                "tag": "🧠 Cours actuel · BUT3",
                "title": "Flask, données et IA",
                "desc": "Une app Flask reliée à SQLite, à InfluxDB puis à des réseaux de neurones : mes TP relancés, et leurs modèles à essayer ici.",
                "p1": "Le module de programmation avancée en Python : construire des applications web avec Flask, les relier à une base relationnelle puis à une base de séries temporelles, et y brancher des modèles d’intelligence artificielle.",
                "s1": "TP relancés pour récupérer leurs vraies sorties",
                "s2": "modèles de mon app qui tournent dans le navigateur",
                "s3": "requêtes SQL grâce au chargement groupé",
                "s4": "bugs trouvés en lançant le code",
                "learnTitle": "Ce que j’y ai appris",
                "l1t": "Structurer une app Flask",
                "l1": "Application factory, Blueprints, gabarits Jinja et API JSON.",
                "l2t": "Un ORM bien utilisé",
                "l2": "Modèles SQLAlchemy 2.0, relations, et le chargement des données sans requêtes en trop.",
                "l3t": "Séries temporelles",
                "l3": "InfluxDB et le langage Flux pour un tableau de bord météo, devises et cryptomonnaies.",
                "l4t": "Mettre un modèle en ligne",
                "l4": "Prétraiter une image, interroger un CNN Keras et renvoyer la prédiction, le tout dans Docker.",
                "nextTitle": "La suite",
                "next": "Le rendu final est une application Flask complète qui réunit base de données, envoi d’images et modèles d’IA."
            }
        },
        meta: {
            title: 'Matéo Bourdin - Étudiant en informatique | Portfolio',
            description: 'Matéo Bourdin, étudiant en 3e et dernière année de Bachelor (BUT) Informatique à l\'IUT d\'Annecy. Développeur full-stack (C#/.NET, Vue.js, Python) en recherche d\'un stage de 16 semaines dès le 19 janvier 2027.'
        },
        nav: {
            home: 'Accueil',
            about: 'À propos',
            experience: 'Expérience',
            education: 'Formation',
            journey: 'Parcours',
            arcade: 'Arcade',
            now: 'Cours actuels',
            butYears: 'Parcours BUT',
            projects: 'Projets',
            projectsCategoryWeb: 'Applications web',
            projectsCategoryGames: 'Jeux',
            projectsCategoryDesktop: 'Applications bureau',
            emulations: '🕹️ Émulations',
            emulationsCategoryTerminal: 'Jeux terminal',
            skills: 'Compétences',
            contact: 'Contact'
        },
        hero: {
            availability: '⚡ Disponible pour un stage de 16 semaines dès le 19 janvier 2027',
            greeting: 'Salut, je suis',
            title: 'Développeur & Étudiant en Informatique',
            description: 'Étudiant en 3e et dernière année de Bachelor (BUT) Informatique, parcours Réalisation d\'Applications, à l\'IUT d\'Annecy. Développeur full-stack (C#/.NET, Vue.js, Python) fort d\'une première expérience en studio de jeux vidéo, je m\'appuie sur un solide bagage en mathématiques et en data/IA, domaine dans lequel j\'aimerais poursuivre en master. Je recherche un stage de 16 semaines à partir du 19 janvier 2027.',
            contact: '📩 Me contacter',
            downloadCV: '📄 Télécharger mon CV',
            projects: '🚀 Voir mes projets'
        },
        about: {
            tag: '👨‍💻 À propos de moi',
            title: 'Qui suis-je ?'
        },
        journey: {
            tag: '🧭 Mon parcours',
            title: 'Parcours',
            description: 'Mon expérience professionnelle, ma formation et le détail de chaque année de BUT.'
        },
        home: {
            tag: '🧭 Découvrir',
            title: 'Par où commencer ?',
            more: 'Voir →',
            cards: {
                journey: { title: 'Parcours', text: 'Expérience, formation et le détail de mes trois années de BUT.' },
                projects: { title: 'Projets', text: 'Applications web, jeux et logiciels, classés par catégorie.' },
                now: { title: 'Cours actuels', text: 'Ce que j’apprends cette année, avec des extraits de mon code.' },
                skills: { title: 'Compétences', text: 'Langages, frameworks, outils et langues.' }
            }
        },
        stats: {
            education: 'Informatique à l\'IUT Annecy',
            projects: 'Projets développés',
            champion: 'Champion & 3e',
            sports: 'France de Polo et Saut d\'Obstacles',
            languages: '3',
            languagesText: 'Langues parlées',
            internship: 'Stage',
            seeking: 'Recherche active dès le 19 janvier 2027'
        },
        languages: {
            tag: '🌍 Langues',
            title: 'Compétences Linguistiques',
            french: 'Français',
            native: 'Langue maternelle',
            english: 'Anglais',
            advanced: 'C1 - Avancé',
            italian: 'Italien',
            intermediate: 'B2 - Intermédiaire supérieur'
        },
        experience: {
            tag: '💼 Mon parcours',
            title: 'Expérience Professionnelle',
            description: 'Mes expériences professionnelles en entreprise',
            lookingFor: 'Recherche active',
            featured: '⭐ En vedette',
            lappisoft: {
                dates: 'Avril – juin 2026',
                title: 'Développeur logiciel (Unity/C#) - Lappi Soft',
                description: 'Studio de jeux vidéo indépendant (Pers-Jussy) dirigé par Maxime Bernard. Conception et développement en autonomie du système Discovery Diary (journal découvrable in-game) pour le jeu The Inspector sous Unity : ~2 400 lignes réparties sur 12 scripts C#, Notification Manager, Big Notification synchronisée à l\'audio, outil éditeur PSB Importer, persistance via variables Lua et support de 5 langues.',
                perf: 'Gain de performance :',
                perfText: '2 → 84 FPS sur la scène de test',
                stack: 'Stack :',
                stackText: 'Unity 2019.4.41f1, C#, Pixel Crushers Dialogue System',
                details: 'Voir le détail'
            },
            intersport: {
                title: 'Vendeur - Intersport',
                description: 'Conseil personnalisé aux clients sur les équipements sportifs, gestion des stocks et mise en rayon. Développement de compétences en relation client et travail d\'équipe dans un environnement commercial dynamique.'
            },
            carrefour: {
                title: 'Employé Boulangerie - Carrefour Market',
                description: 'Préparation et mise en valeur des produits de boulangerie, contrôle qualité et respect des normes d\'hygiène. Gestion de la relation client et travail en équipe dans un contexte exigeant.'
            },
            internship: {
                title: 'Stage BUT3 Informatique',
                description: 'Je recherche activement un stage de 16 semaines à partir du 19 janvier 2027 en développement logiciel, développement web ou data/IA. Objectif : mettre en pratique mes compétences en C#/ASP.NET Core, Python, Vue 3, PostgreSQL et contribuer à des projets concrets en entreprise, en France comme à l\'étranger.',
                duration: 'Durée :',
                weeks: '16 semaines',
                start: 'Début :',
                date: '19 janvier 2027',
                domains: 'Domaines :',
                domainsText: 'Développement logiciel, développement web, data & IA'
            },
            magicalsky: {
                since: 'Févr. 2025 – mars 2026',
                type: 'Bénévolat Informatique',
                title: 'Game Designer - MagicalSky',
                description: 'Game designer sur le serveur Minecraft MagicalSky (magicalsky.fr). Création et configuration de mobs avec MythicMobs, développement d\'outils personnalisés avec MMOItems. Création de serveurs privés et plugins avec Paper. Modélisation 3D de mobs avec Blockbench, compétence acquise grâce à mon expérience CATIA à l\'ENIB. Force de proposition pour de nouvelles fonctionnalités et solutions techniques. Travail collaboratif au sein d\'une équipe de 13-14 personnes.',
                skills: 'Compétences :',
                skillsText: 'Java, MythicMobs, MMOItems, Paper, Blockbench, Travail d\'équipe',
                details: 'Voir le détail'
            }
        },
        now: {
            "tag": "🛠️ En ce moment",
            "title": "Ce sur quoi je travaille cette année",
            "description": "Les cours de 3e année que je suis en ce moment (semestre 5, septembre à décembre 2026), avec ce que j’y fais et des extraits de mon code. Mis à jour le 13 octobre 2026.",
            "status": "En cours",
            "next": "En ce moment",
            "c1": {
                "label": "Qualité de développement",
                "title": "Une API ASP.NET Core propre et testée",
                "intro": "TD fil rouge TPRevision : une API REST de gestion de produits (EF Core, PostgreSQL), refactorée selon les principes SOLID.",
                "b1": "Interfaces séparées par rôle (lecture, écriture, requêtes DTO)",
                "b2": "DTO et AutoMapper pour ne jamais exposer les entités",
                "b3": "Tests unitaires (MSTest, Moq) et tests d’intégration sur une vraie base PostgreSQL",
                "now": "client Blazor Server en MVVM qui consomme l’API",
                "link": "Voir les extraits de code"
            },
            "c2": {
                "label": "Programmation avancée (R5.A.05)",
                "title": "Flask, données et IA",
                "intro": "TP en groupe, déployés avec Docker Compose sur un serveur de l’IUT.",
                "b1": "Flask-SQLAlchemy sur la base de données Chinook",
                "b2": "Tableau de bord de séries temporelles avec InfluxDB",
                "b3": "Reconnaissance de chiffres manuscrits (MNIST) avec TensorFlow, servie par Flask",
                "now": "une application Flask complète à rendre (base de données, upload d’images, modèles d’IA)"
            },
            "c3": {
                "label": "SAE 5.01 — projet de groupe",
                "title": "Astraeus, plateforme éducative sur la météo",
                "intro": "Équipe Scrum de 4 : exploration 4D des phénomènes, quiz et WeatherGuessr, un jeu où le joueur affronte la prévision d’un modèle.",
                "b1": "Mon rôle : la partie IA et le traitement des données",
                "b2": "Notre propre modèle de prévision à base de réseaux de neurones, en commençant par un LSTM sur la température",
                "b3": "Prévision jusqu’à 3 jours, calculée pendant que le joueur devine",
                "now": "cahier des charges et conception"
            },
            "c4": {
                "label": "Modélisation mathématique",
                "title": "Les maths derrière le machine learning",
                "intro": "Les bases théoriques des modèles que j’utilise ailleurs, codées à la main en Python.",
                "b1": "Exploration de données avec NumPy et pandas",
                "b2": "Régression linéaire et descente de gradient implémentées de zéro",
                "b3": "ACP, classification, perceptron et XOR, puis CNN, LSTM et Transformers",
                "now": "réseaux récurrents et Transformers, en lien avec le LSTM d’Astraeus"
            },
            "c5": {
                "label": "Virtualisation et automatisation",
                "title": "Docker, CI/CD et Kubernetes",
                "intro": "18 exercices de pipelines GitLab CI/CD, tous publics sur GitLab.",
                "b1": "Images Docker construites et publiées dans le registre GitLab, puis testées ensemble (API + PostgreSQL) dans le pipeline",
                "b2": "Tests de bout en bout (Cypress), de charge (k6) et sur plusieurs versions en parallèle (Python 3.8 à 3.11, Node 16 à 20)",
                "b3": "Analyse de sécurité automatique (Bandit, Safety, npm audit), variables protégées et GitLab Pages",
                "now": "appliqué à ce portfolio : vérifications automatiques à chaque modification",
                "link": "Voir la CI du portfolio",
                "gitlab": "Voir mes 18 exercices sur GitLab"
            },
            "c6": {
                "label": "Création numérique et veille",
                "title": "3D, image et technologies émergentes",
                "intro": "Des cours plus créatifs, dont une partie en anglais.",
                "b1": "Blender : modélisation, textures et UV mapping d’un personnage",
                "b2": "Photoshop, cours en anglais : « Avatarize yourself », un avatar créé à partir de ma photo",
                "b3": "Veille technologique en groupe sur WebAssembly",
                "now": "retouche de l’avatar et synthèse de la veille"
            },
            "code": {
                "title": "Extraits de code",
                "note": "Extraits tels qu’ils sont dans mon code. Le dépôt complet du cours est public sur GitHub.",
                "e1": "Séparer les rôles : lecture, écriture et requêtes DTO",
                "e1why": "Chaque contrôleur ne dépend que de ce dont il a besoin (principe de ségrégation des interfaces).",
                "e2": "Entité → DTO avec AutoMapper",
                "e2why": "Le client reçoit des données prêtes à afficher, et l’état « en réapprovisionnement » est calculé côté serveur.",
                "e3": "Test d’intégration sur une vraie base PostgreSQL",
                "e3why": "Le test crée un produit via le contrôleur, le relit, et vérifie le DTO renvoyé, au format Given / When / Then.",
                "g1": "Qualité de développement (C#)",
                "g2": "Virtualisation et automatisation (GitLab CI/CD)",
                "e4": "Construire les images Docker puis tester l’API avec une vraie base",
                "e4why": "Un modèle de job réutilisé (.docker), deux images publiées dans le registre GitLab, puis un test d’intégration qui ne démarre qu’une fois le backend construit.",
                "e5": "Tester sur plusieurs versions de Python en parallèle",
                "e5why": "Une matrice lance la même suite de tests sur quatre versions de Python à la fois, et garde un rapport par version."
            },
            "repos": {
                "title": "Mon code en ligne",
                "github": "Profil GitHub",
                "portfolio": "Code source de ce portfolio",
                "r401": "R4.01 : web service ASP.NET Core et son client",
                "r404": "R4.04 : application de notation de films (MVVM, MSTest)",
                "r403": "R4.03 : application console .NET",
                "qdd": "Qualité de dev : dépôt complet (TPRevision)",
                "gitlab": "GitLab CI/CD : mes 18 exercices"
            }
        },
        butYears: {
            tag: "📚 Année par année",
            title: "Mon parcours en BUT",
            description: "Les matières, projets et travaux marquants de chaque année du Bachelor (BUT) Informatique à l’IUT d’Annecy",
            subjects: "Matières clés",
            projects: "Projets & réalisations",
            security: "Sécurité",
            securityText: "Audit de mes dépôts (octobre 2026) : des identifiants de développement, aujourd'hui inactifs, figurent encore dans l'historique de projets de 1re et 2e année. Je les laisse visibles comme trace honnête de mon apprentissage. Depuis la 3e année, aucun secret réel dans mes dépôts, et ce portfolio vérifie automatiquement l'absence de secrets dans tout son historique (gitleaks) à chaque modification.",
            current: "En cours",
            y1: {
                title: "1re année — Les fondamentaux",
                dates: "2024 – 2025",
                intro: "Programmation orientée objet en C#, premières interfaces graphiques et bases de données, et premiers projets en équipe avec Git.",
                s1: "Programmation orientée objet (C#)",
                s2: "Interfaces graphiques (WPF, XAML)",
                s3: "Bases de données relationnelles (SQL, PostgreSQL)",
                s4: "Conception UML",
                s5: "Gestion de version (Git)",
                p1: "Survival Island — jeu de combat naval en C# / WPF (SAE 1.01)",
                p2: "Cave à vin Nicolas — C# / WPF, PostgreSQL (SAE 2.01)",
            },
            y2: {
                title: "2e année — Full-stack et premier stage",
                dates: "2025 – 2026",
                intro: "Applications web complètes en équipe, bases de données avancées, réseaux et mobile, puis un stage de 8 semaines en studio de jeux vidéo. Major de promotion en mathématiques, 16,5/20 de moyenne au dernier semestre.",
                s1: "Algorithmique avancée en Python (récursivité, arbres)",
                s2: "Optimisation et bases de données avancées (JSONB, MongoDB)",
                s3: "Architecture réseau (sous-réseaux, VLAN, routage RIP/OSPF)",
                s4: "Développement mobile (Flutter) et clients lourds (WinUI 3, MVVM)",
                s5: "Langages formels et automates",
                s6: "Gestion de projet et économie (TCO, VAN, TIR)",
                p1: "CUBE Bikes — e-commerce ASP.NET Core / Vue 3 (SAE 3.01 / 4.01)",
                p2: "Clone Twitter/X — Laravel, Redis, WebSockets, Docker (R4.08)",
                p3: "Stage chez Lappi Soft — système Discovery Diary sous Unity",
                p4: "TD : API REST ASP.NET Core + EF Core et client WinUI 3 en MVVM, testés avec MSTest et Moq"
            },
            y3: {
                title: "3e année — Qualité, DevOps et IA",
                dates: "2026 – 2027",
                intro: "Dernière année, avec des cours dispensés en anglais à l’initiative de l’IUT et de ses étudiants : qualité logicielle, automatisation et premiers modèles d’IA, avant un stage de 16 semaines dès janvier 2027.",
                s1: "Qualité de développement (SOLID, tests, DTO)",
                s2: "Programmation avancée (Flask, SQLAlchemy, InfluxDB)",
                s3: "Virtualisation et automatisation (Docker, GitLab CI/CD, Kubernetes)",
                s4: "Modélisation mathématique (régression, descente de gradient, ACP)",
                s5: "Calcul parallèle (NumPy, Joblib, Numba)",
                s6: "Modélisation 3D et scripting (Blender, Python)",
                p1: "API ASP.NET Core : repository générique, DTO avec AutoMapper, refactoring SOLID",
                p2: "Tests unitaires (Moq) et d’intégration sur une vraie base PostgreSQL",
                p3: "Application Flask + TensorFlow (reconnaissance de chiffres MNIST) déployée sous Docker",
                p4: "Pipelines GitLab CI/CD : artefacts, règles, variables protégées, GitLab Pages",
                p5: "Régression linéaire et descente de gradient implémentées de zéro",
                p6: "Veille technologique en groupe sur WebAssembly"
            }
        },
        education: {
            tag: '🎓 Ma formation',
            title: 'Parcours Académique',
            description: 'Mon cursus et mes diplômes',
            current: 'En cours',
            but: {
                title: 'Bachelor (BUT) Informatique - 3e et dernière année (parcours RA)',
                description: 'Formation en informatique à l\'IUT d\'Annecy, parcours Réalisation d\'Applications : développement d\'applications, architecture logicielle et gestion de bases de données.',
                school: 'École :'
            },
            enib: {
                title: 'Année Préparatoire - ENIB',
                description: 'Année préparatoire intégrée à l\'École Nationale d\'Ingénieurs de Brest.',
                school: 'École :'
            },
            bac: {
                title: 'Baccalauréat avec mention',
                description: 'Baccalauréat général avec spécialités Mathématiques et NSI (Numérique et Sciences Informatiques).',
                mention: 'Mention Bien',
                school: 'Lycée :'
            },
            science: {
                title: 'Cordées de la réussite 2022',
                description: 'Lauréat (1re place) du concours Cordées de la réussite en classe de Première : analyse d\'un réseau de lycéens par la théorie des graphes, avec Python et Graphviz.',
                winner: '1re place',
                school: 'Lycée :'
            }
        },
        skills: {
            tag: '💡 Mes compétences',
            title: 'Technologies & Outils',
            description: 'Un large éventail de compétences acquises durant ma formation, mon stage et mes projets personnels',
            backend: 'Backend',
            frontend: 'Frontend & Mobile',
            databases: 'Données',
            tools: 'Outils & DevOps',
            system: 'Système',
            ai: 'Intelligence Artificielle',
            aiAssisted: 'Dév. assisté par IA',
            level: { advanced: 'confirmé', intermediate: 'intermédiaire', basic: 'notions', learning: 'en cours' }
        },
        tags: {
            jan2027: '19 janvier 2027',
            sept2024: 'Sept. 2024 - 2027',
            summer2024: 'Été 2024',
            summer2023: 'Été 2023',
            sinceDec2024: 'Depuis déc. 2024',
            oct2026: 'Oct. 2026',
            y2025_2026: '2025 – 2026',
            spring2026: 'Printemps 2026',
            personal: 'Personnel',
            ongoing: 'En développement',
            dec2024: 'Déc. 2024',
            spring2024: 'Printemps 2024',
            spring2025: 'Printemps 2025',
            academic: 'Académique',
            seasonal: 'Emploi saisonnier',
            internshipBut2: 'Stage BUT2',
            team2: 'Équipe de 2',
            team3: 'Équipe de 3',
            but2team5: 'BUT2 - Équipe de 5',
            r408team4: 'R408A1 - Équipe de 4'
        },
        projects: {
            tag: '🚀 Mes réalisations',
            title: 'Projets & Développements',
            description: 'Une sélection de mes projets académiques et personnels utilisant diverses technologies',
            filters: {
                title: 'Filtrer les projets :',
                all: 'Tous les projets',
                academic: 'Projets Académiques',
                personal: 'Projets Personnels'
            },
            techFilters: {
                all: 'Toutes technos',
                database: 'Bases de données'
            },
            learnMore: 'En savoir plus →',
            viewProject: 'Voir le projet →',
            viewSite: 'Vous êtes dessus ! →',
            fianchetto: {
                title: 'Fianchetto — analyse de parties d’échecs',
                description: 'Application web d’échecs qui tourne entièrement dans le navigateur : bots de 500 à 2500 Elo, import des parties Chess.com et Lichess, rapport d’analyse avec Stockfish (WebAssembly) — précision, 11 catégories de coups, commentaires — bilans sur plusieurs parties et problèmes tirés de ses propres erreurs.',
                context: 'Contexte :',
                contextText: 'Projet personnel, pour analyser mes parties Chess.com sans abonnement',
                tech: 'Technologies :',
                open: 'Ouvrir l’appli ↗'
            },
            portfolio: {
                title: 'Portfolio personnel bilingue',
                description: 'Site portfolio responsive et bilingue (FR/EN), lancé en décembre 2024 et toujours en évolution : HTML5, CSS3 et JavaScript vanilla, animations, système de traduction i18n, formulaire de contact via Formspree, vérifications automatiques à chaque modification (GitHub Actions) et déploiement sur GitHub Pages.',
                context: 'Contexte :',
                contextText: 'Projet personnel, vitrine professionnelle de mes compétences et de mes projets',
                tech: 'Technologies :'
            },
            zelda: {
                title: 'Zelda II: The Adventure of Link',
                description: 'Recréation complète du jeu classique Zelda 2 en Python avec graphismes ASCII colorés et séquences ANSI. Développement d\'un système RPG complet incluant combats side-scrolling, exploration de monde ouvert, rencontres aléatoires, NPCs interactifs et gestion d\'inventaire. Utilisation de termios pour la gestion des inputs non-bloquants et création d\'une IA simple pour les ennemis.',
                context: 'Contexte :',
                contextText: 'Projet de programmation avancée réalisé en année préparatoire à l\'ENIB',
                tech: 'Technologies :'
            },
            cubebikes: {
                title: 'CUBE Bikes - Plateforme E-commerce',
                description: 'Plateforme e-commerce full-stack pour une boutique de vélos : backend ASP.NET Core 8 / Entity Framework Core / PostgreSQL avec authentification JWT + Google OAuth, 2FA par TOTP, paiement Stripe Checkout et pattern Repository/Service ; frontend Vue 3 / Pinia / Tailwind CSS avec recherche à facettes, sélecteur de magasin sur carte Leaflet et disponibilité produit par taille et par magasin. Projet récurrent ayant évolué de la SAE 3.01 (Laravel/PostgreSQL) à la SAE 4.01 (ASP.NET Core/Vue 3). Mon rôle : le sélecteur de magasin et la disponibilité par magasin, côté API et côté interface.',
                context: 'Contexte :',
                contextText: 'Projet fil rouge sur plusieurs semestres - BUT Informatique',
                disclaimer: "Projet académique fictif : ce n'est pas le site officiel de la marque CUBE et il n'y a aucun lien avec elle.",
                tech: 'Technologies :'
            },
            twitterclone: {
                title: 'Clone Twitter/X',
                description: 'Clone de réseau social développé en équipe de 4 avec Laravel 13 / PHP 8.3, PostgreSQL, Redis et Livewire/Alpine.js, incluant des fonctionnalités temps réel via WebSockets (Laravel Reverb) et un assistant IA façon Grok basé sur l\'API Gemini, déployé avec Docker. Mon rôle : l\'envoi de médias (jusqu\'à 4 photos ou vidéos par tweet, aperçu, validation et stockage).',
                context: 'Contexte :',
                contextText: 'Projet de groupe R408A1 - BUT Informatique 2e année',
                tech: 'Technologies :'
            },
            sae201: {
                title: 'Cave à vin Nicolas - SAE 2.01',
                description: 'Application desktop de gestion de stock pour l\'enseigne Nicolas, développée en binôme en C# / WPF : recherche de vins, demandes d\'approvisionnement validées par le responsable, commandes fournisseurs et fiches clients, sur une base PostgreSQL.',
                context: 'Contexte :',
                contextText: 'Situation d\'Apprentissage et d\'Évaluation - BUT Informatique',
                techText: 'C#, .NET 8, WPF, PostgreSQL, UML',
                tech: 'Technologies :'
            },
            survival: {
                title: 'Survival Island',
                description: 'Jeu de combat naval développé à trois en C# / WPF : aux commandes d\'un navire, le joueur défend son île contre des vagues de bateaux ennemis, gagne de l\'expérience et améliore son île et son armement. Mon rôle : ennemis, modes de tir, classes de navires, objets récompense, son et musique.',
                context: 'Contexte :',
                contextText: 'SAE 1.01 - BUT Informatique 1re année',
                techText: 'C#, .NET 8, WPF, UML',
                tech: 'Technologies :'
            }
        },
        emulations: {
            tag: '🕹️ Jouable en ligne',
            title: 'Mini-jeux et émulations',
            description: 'Des mini-jeux développés pour ce portfolio et deux de mes projets rendus jouables : tout tourne dans le navigateur, sans rien installer',
            play: 'Jouer →',
            survival: {
                title: 'Survival Island',
                description: 'Ma SAE 1.01 en C# / WPF, portée en JavaScript pour le navigateur'
            },
            zelda: {
                title: 'Zelda II: The Adventure of Link',
                description: 'Jeu terminal Python, émulé via Pyodide (Python/WebAssembly)'
            }
        },
        contact: {
            title: '🚀 Travaillons ensemble !',
            subtitle: 'Je suis disponible pour un stage de 16 semaines à partir du 19 janvier 2027',
            emailBtn: 'Me contacter',
            email: '📧 Formulaire de contact'
        },
        legal: {
            "tag": "⚖️ Informations légales",
            "title": "Mentions légales et confidentialité",
            "description": "Qui édite ce site, qui l’héberge, et ce qu’il advient de vos données.",
            "updated": "Dernière mise à jour : 16 octobre 2026",
            "editorTitle": "Éditeur du site",
            "editorText": "Ce site est le portfolio personnel de Matéo Bourdin, étudiant en BUT Informatique à l’IUT d’Annecy. Il est édité à titre non professionnel.",
            "editorContact": "Contact : mateo.bourdin@etu.univ-smb.fr ou le formulaire de la page Contact.",
            "hostTitle": "Hébergeur",
            "hostText": "GitHub, Inc. (service GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.",
            "dataTitle": "Données personnelles",
            "dataIntro": "Ce site ne contient ni outil de statistiques, ni publicité, ni cookie de suivi. Les seules données personnelles traitées sont celles que vous envoyez via le formulaire de contact.",
            "formTitle": "Formulaire de contact",
            "formWhat": "Données collectées : votre nom, votre adresse e-mail, le sujet et le contenu de votre message.",
            "formWhy": "Finalité : uniquement vous répondre. Base légale : mon intérêt légitime à traiter les demandes qui me sont adressées.",
            "formWho": "Destinataires : moi seul. Le formulaire est acheminé par Formspree, Inc. (États-Unis), qui me transmet le message par e-mail.",
            "formHow": "Durée de conservation : les messages sont supprimés au plus tard 12 mois après notre dernier échange.",
            "rightsTitle": "Vos droits",
            "rightsText": "Vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, ou vous opposer à leur traitement, en écrivant à mateo.bourdin@etu.univ-smb.fr. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL.",
            "storageTitle": "Cookies et stockage local",
            "storageText": "Le site ne dépose aucun cookie. Il enregistre seulement dans votre navigateur (stockage local) la langue et le thème clair ou sombre que vous choisissez, ainsi que vos meilleurs scores et votre progression aux mini-jeux et aux quiz de révision des pages de cours. Ces informations ne quittent pas votre appareil et vous pouvez les effacer depuis les réglages de votre navigateur. La démo de Survival Island n’enregistre rien. L’application d’échecs Fianchetto, servie sur le même domaine, garde de la même façon dans votre navigateur vos parties, analyses, classements et réglages.",
            "thirdTitle": "Contenus tiers",
            "thirdText": "Les polices, les bibliothèques (dont Pyodide, qui exécute Python dans les démos), les fichiers des jeux (images, musiques, sons) et ceux des démos des cours sont hébergés sur ce site. Deux contenus externes ne se chargent que si vous cliquez dessus : la vidéo YouTube de la page Survival Island et la carte OpenStreetMap de la page Contact. Au clic, le service concerné reçoit votre adresse IP et le nom de ce site (sans l’adresse de la page consultée), et YouTube peut déposer des cookies. Les modèles d’IA des pages de cours s’exécutent dans votre navigateur : les dessins et photos que vous leur soumettez ne sont envoyés nulle part. Dans Fianchetto, le moteur Stockfish tourne aussi dans votre navigateur ; seules deux actions contactent un service externe : importer des parties (votre navigateur interroge les API publiques de Chess.com ou de Lichess avec le pseudo saisi) et charger un problème en ligne (API de Lichess). Ce service reçoit alors votre adresse IP et le pseudo demandé. Comme tout hébergeur, GitHub reçoit l’adresse IP des visiteurs pour faire fonctionner et sécuriser le service.",
            "policies": "Politiques de confidentialité des services cités :",
            "ipTitle": "Propriété intellectuelle et crédits",
            "ipText": "Les textes, le code et la mise en page de ce site sont de moi, sauf mention contraire. Survival Island (SAE 1.01) a été réalisé à trois : son code, ses images, ses musiques et ses sons proviennent du dépôt GitHub du projet (ForWarZz/Survival-Island). Zelda II: The Adventure of Link est un projet hommage non commercial ; The Legend of Zelda est une marque déposée de Nintendo. Les pages de cours reprennent uniquement mon propre travail (code, résultats, notes de révision) ; les supports des enseignants n’y sont pas publiés et les données des démonstrations d’API sont fictives. Fianchetto embarque Stockfish (GPL-3.0), chess.js (BSD-2-Clause), les pièces Cburnett (CC BY-SA 3.0) et des problèmes de la base Lichess (CC0) ; son code est publié sous GPL-3.0. Les démos utilisent aussi des jeux de données publics : la base Chinook (Luis Rocha, licence MIT), MNIST (Yann LeCun et Corinna Cortes, CC BY-SA 3.0), Fashion-MNIST (Zalando Research, licence MIT) et CIFAR-10 (Alex Krizhevsky). Les logos et marques cités appartiennent à leurs propriétaires."
        },
        games: {
            "back": "← Arcade",
            "source": "Voir le code source",
            "howTitle": "Comment c’est fait",
            "ski": {
                "short": "Slalom à ski entre les portes, en JavaScript (Canvas)",
                "title": "Descente à Combloux",
                "tag": "⛷️ Mini-jeu",
                "desc": "Un slalom entre les portes, sur la piste de Combloux où je skie depuis toujours. Passe dans les portes, évite les sapins : la vitesse augmente à chaque seconde.",
                "controls": "Commandes : flèches ← → (ou Q/A et D) pour tourner, Espace pour partir, P pour la pause. Sur mobile : garde le doigt à gauche ou à droite du skieur, ou utilise les boutons.",
                "how": "Canvas 2D et requestAnimationFrame, sans aucune librairie : environ 300 lignes de JavaScript. Les portes rétrécissent et se rapprochent au fil de la descente.",
                "score": "Portes",
                "best": "Record",
                "lives": "Vies",
                "left": "◀ Gauche",
                "right": "Droite ▶"
            },
            "naval": {
                "short": "Défense d’île par vagues, clin d’œil à Survival Island",
                "title": "Défends l’île",
                "tag": "🏝️ Mini-jeu",
                "desc": "Un clin d’œil à Survival Island, mon premier projet de BUT : cette fois, c’est l’île qui se défend. Les bateaux ennemis arrivent par vagues, de plus en plus nombreux et rapides.",
                "controls": "Commandes : vise avec la souris et clique pour tirer (maintiens pour un tir continu). Au clavier : flèches ← → pour viser, Espace pour tirer, P pour la pause. Sur mobile : touche l’endroit où tirer.",
                "how": "Canvas 2D sans librairie : vagues générées, collisions cercle/cercle, bateaux lourds à 3 points de vie, et l’île regagne un point de vie à chaque vague terminée.",
                "score": "Score",
                "best": "Record",
                "wave": "Vague",
                "hp": "Vie de l’île"
            },
            "bug": {
                "short": "Puzzles de code classés façon échecs : Elo, Rush, Survie, Bug du jour",
                "title": "Trouve le bug",
                "tag": "🐛 Mini-jeu",
                "desc": "46 bugs réels à débusquer en C#, Python, JavaScript, Vue, SQL et Docker, du débutant à l’expert. Un classement Elo qui s’adapte à ton niveau, des modes Rush, Survie et Bug du jour, des indices, des succès et des statistiques détaillées.",
                "controls": "Commandes : clique sur la ligne fautive ou tape son numéro (1 à 9), H pour un indice, Entrée pour continuer, Échap pour revenir aux modes.",
                "start": "Commencer",
                "intro": "20 secondes par extrait. Plus tu réponds vite, plus tu marques de points.",
                "score": "Score",
                "best": "Record",
                "again": "Rejouer",
                "how": "Le classement suit la formule Elo des échecs : chaque bug a sa propre difficulté, et ton score monte plus si tu résous un bug plus dur que ton niveau. Un indice divise le gain. Tout tourne en JavaScript sans librairie, et ta progression reste dans ton navigateur."
            }
        },
        arcade: {
            "open": "🕹️ Ouvrir l’Arcade",
            "tag": "🕹️ Arcade",
            "title": "Arcade",
            "desc": "Des jeux développés pour ce portfolio et un de mes projets émulé dans le navigateur. Tout est jouable au clavier, à la souris et au tactile, sans installation ni inscription.",
            "featured": "À la une",
            "featuredText": "Mon jeu le plus abouti : des puzzles de code classés comme aux échecs, avec un classement Elo, 5 modes de jeu, des succès et des statistiques.",
            "play": "Jouer",
            "others": "Les autres jeux",
            "skiText": "Slalom à ski sur la piste de Combloux : passe les portes, évite les sapins, la vitesse ne fait qu’augmenter.",
            "navalText": "Clin d’œil à Survival Island : le canon de l’île repousse des vagues de bateaux de plus en plus nombreuses.",
            "zeldaText": "Mon jeu terminal en Python, exécuté dans le navigateur grâce à Pyodide (Python compilé en WebAssembly).",
            "survivalText": "Ma SAE 1.01 (C# / WPF) traduite à l’identique en JavaScript : défends l’île contre les pirates, améliore ton navire et choisis ta classe de tir, comme dans l’original.",
            "techTitle": "Sous le capot",
            "tech1": "Aucune librairie pour les mini-jeux : JavaScript, Canvas 2D et requestAnimationFrame.",
            "tech2": "Zelda tourne avec Pyodide et xterm.js, hébergés sur ce site : aucune requête vers un service tiers.",
            "tech3": "Records et progression stockés uniquement dans ton navigateur, rien n’est envoyé.",
            "tech4": "Jouable au clavier, à la souris et au tactile, et respect du réglage « réduire les animations ».",
            "source": "Voir le code des jeux sur GitHub"
        },
        footer: {
            copyright: '© 2026 Matéo Bourdin - Étudiant en informatique | IUT Annecy',
            signature: 'Créé avec passion 🚀',
            legal: 'Mentions légales et confidentialité'
        },
        cvModal: {
            title: '📄 Choisissez la langue',
            subtitle: 'Sélectionnez la version de mon CV que vous souhaitez télécharger',
            french: {
                title: 'Version Française',
                subtitle: 'CV en français'
            },
            english: {
                title: 'English Version',
                subtitle: 'CV in English'
            },
            close: 'Fermer'
        }
    },
    en: {
        shots: {
            lappi: "The Discovery Diary notebook in The Inspector (Unity)",
            fianchetto: "Game review report in Fianchetto",
            cube: "CUBE Bikes store selector on a Leaflet map (demo data)",
            twitter: "Conceptual data model of the Twitter/X clone",
            sae201: "Domain class diagram of the wine cellar application",
            portfolio: "Portfolio home page",
            survival: "Survival Island gameplay screenshot",
            zelda: "Map of the text-mode Zelda game"
        },
        metaPages: {
            coursFlask: "Flask, data and AI | Matéo Bourdin",
            coursAspnet: "ASP.NET Core API, quality and testing | Matéo Bourdin",
            coursMaths: "Mathematical modelling and AI | Matéo Bourdin",
            coursDocker: "Docker, CI/CD and Kubernetes | Matéo Bourdin",
            coursAspnet: "ASP.NET Core API, quality and testing | Matéo Bourdin",
            coursMaths: "Mathematical modelling and AI | Matéo Bourdin",
            coursDocker: "Docker, CI/CD and Kubernetes | Matéo Bourdin",
            coursMaths: "Mathematical modelling and AI | Matéo Bourdin",
            coursDocker: "Docker, CI/CD and Kubernetes | Matéo Bourdin",
            coursDocker: "Docker, CI/CD and Kubernetes | Matéo Bourdin",
            journey: 'Background | Matéo Bourdin',
            projects: 'Projects | Matéo Bourdin',
            now: 'Current courses | Matéo Bourdin',
            skills: 'Skills | Matéo Bourdin',
            legal: 'Legal notice and privacy | Matéo Bourdin',
            arcade: 'Arcade | Matéo Bourdin',
            ski: 'Combloux Downhill | Matéo Bourdin',
            naval: 'Defend the Island | Matéo Bourdin',
            bug: 'Spot the Bug | Matéo Bourdin'
        },
        courses: {
            "back": "← All my courses",
            "detail": "Detailed page: deliverables, demos and revision →",
            "frNote": "Detailed write-ups and revision notes are in French: they are my own study notes.",
            "tabs": {
                "presentation": "Overview",
                "rendus": "Work and demos",
                "reviser": "Revise"
            },
            "docker": {
                "tag": "🐳 Current course · Year 3",
                "title": "Docker, CI/CD and Kubernetes",
                "desc": "From Docker images to complete GitLab pipelines: 18 public exercises, replayed and explained.",
                "gitlab": "My exercises on GitLab",
                "p1": "In this virtualisation module, I built 18 GitLab CI/CD pipelines, from “Hello World” to end-to-end tests. Each exercise is a public repository with its history and the result of its latest pipeline.",
                "s1": "public GitLab repositories",
                "s2": "green pipelines",
                "s3": "kinds of automated tests",
                "s4": "jobs in the latest pipelines",
                "learnTitle": "What I learned",
                "l1t": "Building images",
                "l1": "Writing lean Dockerfiles, ordering layers for caching and publishing to a registry with reliable tags.",
                "l2t": "Orchestrating a pipeline",
                "l2": "Stages, job dependencies, artifacts, cache, manual jobs, reusable templates and version matrices.",
                "l3t": "Testing at every level",
                "l3": "Linting, unit tests, integration against a real database, end-to-end in a browser, load tests and benchmarks.",
                "l4t": "Securing the chain",
                "l4": "Code and dependency scanning, protected and masked variables, credentials never written to logs.",
                "applyTitle": "Applied to this portfolio",
                "apply": "This site follows the same principles: on every change, GitHub Actions checks translations, HTML, links and leaked secrets before publishing.",
                "nextTitle": "Next in the module",
                "next": "Kubernetes comes in the next part of the course. This page will be updated as sessions go on."
            },
            "maths": {
                "tag": "📐 Current course · Year 3",
                "title": "Mathematical modelling and AI",
                "desc": "From statistics to neural networks: 8 lab sessions, their results, and models running in your browser.",
                "p1": "The module that links mathematics to artificial intelligence: from NumPy and data analysis to convolutional networks and Transformers. Every topic is worked on in a Python notebook, and my results are shown here.",
                "s1": "labs in Jupyter notebooks",
                "s2": "CNN on Fashion-MNIST",
                "s3": "CNN on CIFAR-10",
                "s4": "demos running in the browser",
                "learnTitle": "What I learned",
                "l1t": "Exploring data",
                "l1": "Cleaning, filtering and plotting with pandas, matplotlib and seaborn, and measuring what parallel computing really costs.",
                "l2t": "The maths behind models",
                "l2": "PCA through eigenvalues, regression through the normal equation and through gradient descent coded from scratch.",
                "l3t": "Classifying and evaluating",
                "l3": "Logistic regression, trees and forests, confusion matrix, recall, precision and ROC curve.",
                "l4t": "Neural networks",
                "l4": "From the perceptron and XOR to CNNs, LSTMs and Transformers with Keras.",
                "linkTitle": "How it connects to my project",
                "link": "These skills feed straight into the Astraeus project, where I build the weather forecasting model (an LSTM) for the WeatherGuessr game."
            },
            "aspnet": {
                "tag": "🧪 Current course · Year 3",
                "title": "ASP.NET Core API, quality and testing",
                "desc": "A REST API built session after session: SOLID architecture, DTOs, AutoMapper and tests, actually run and tested.",
                "github": "The repository on GitHub",
                "p1": "The development quality course follows one running lab: a product management REST API in ASP.NET Core, improved session after session into a clean, tested architecture.",
                "s1": "passing tests",
                "s2": "commits over 5 weeks",
                "s3": "interfaces split by role",
                "s4": "bugs found by running the API",
                "learnTitle": "What I learned",
                "l1t": "A layered architecture",
                "l1": "Controllers, repositories and data access kept apart, wired together through dependency injection.",
                "l2t": "SOLID principles",
                "l2": "Small, focused interfaces and dependencies on abstractions.",
                "l3t": "DTOs and AutoMapper",
                "l3": "Never expose entities: transfer objects computed directly by the database.",
                "l4t": "Testing for real",
                "l4": "Unit tests with Moq, mapping tests and an integration test against PostgreSQL.",
                "nextTitle": "What comes next",
                "next": "A generic controller to remove duplication, then a Blazor Server client in MVVM that will consume this API."
            },
            "flask": {
                "tag": "🧠 Current course · Year 3",
                "title": "Flask, data and AI",
                "desc": "A Flask app wired to SQLite, then InfluxDB, then neural networks: my labs re-run, and their models to try right here.",
                "p1": "The advanced Python programming module: building web apps with Flask, connecting them to a relational database and a time-series database, and plugging in artificial intelligence models.",
                "s1": "labs re-run to capture their real output",
                "s2": "models from my app running in your browser",
                "s3": "SQL queries thanks to batched loading",
                "s4": "bugs found by running the code",
                "learnTitle": "What I learned",
                "l1t": "Structuring a Flask app",
                "l1": "Application factory, Blueprints, Jinja templates and a JSON API.",
                "l2t": "Using an ORM well",
                "l2": "SQLAlchemy 2.0 models, relationships, and loading data without extra queries.",
                "l3t": "Time series",
                "l3": "InfluxDB and the Flux language for a weather, currency and crypto dashboard.",
                "l4t": "Putting a model online",
                "l4": "Preprocessing an image, querying a Keras CNN and returning the prediction, all inside Docker.",
                "nextTitle": "What comes next",
                "next": "The final deliverable is a complete Flask application combining a database, image uploads and AI models."
            }
        },
        meta: {
            title: 'Matéo Bourdin - Computer Science Student | Portfolio',
            description: 'Matéo Bourdin, final-year Bachelor\'s student in Computer Science (BUT) at IUT d\'Annecy. Full-stack developer (C#/.NET, Vue.js, Python) seeking a 16-week internship starting on 19 January 2027.'
        },
        nav: {
            home: 'Home',
            about: 'About',
            experience: 'Experience',
            education: 'Education',
            journey: 'Background',
            arcade: 'Arcade',
            now: 'Current courses',
            butYears: 'BUT years',
            projects: 'Projects',
            projectsCategoryWeb: 'Web apps',
            projectsCategoryGames: 'Games',
            projectsCategoryDesktop: 'Desktop apps',
            emulations: '🕹️ Emulations',
            emulationsCategoryTerminal: 'Terminal games',
            skills: 'Skills',
            contact: 'Contact'
        },
        hero: {
            availability: '⚡ Available for a 16-week internship from 19 January 2027',
            greeting: 'Hi, I\'m',
            title: 'Developer & Computer Science Student',
            description: 'In the third and final year of a Bachelor\'s degree in Computer Science (BUT Informatique, Application Development track) at IUT d\'Annecy. A full-stack developer (C#/.NET, Vue.js, Python) with first professional experience in a video game studio, I bring a strong background in maths and data/AI, the field I hope to pursue in a Master\'s. I am seeking a 16-week internship starting on 19 January 2027.',
            contact: '📩 Contact me',
            downloadCV: '📄 Download my CV',
            projects: '🚀 View my projects'
        },
        about: {
            tag: '👨‍💻 About me',
            title: 'Who am I?'
        },
        journey: {
            tag: '🧭 My background',
            title: 'Background',
            description: 'My work experience, my education and a breakdown of each year of my Bachelor (BUT).'
        },
        home: {
            tag: '🧭 Explore',
            title: 'Where to start?',
            more: 'See →',
            cards: {
                journey: { title: 'Background', text: 'Experience, education and a breakdown of my three BUT years.' },
                projects: { title: 'Projects', text: 'Web apps, games and software, sorted by category.' },
                now: { title: 'Current courses', text: 'What I’m learning this year, with excerpts of my code.' },
                skills: { title: 'Skills', text: 'Languages, frameworks, tools and spoken languages.' }
            }
        },
        stats: {
            education: 'Computer Science at IUT Annecy',
            projects: 'Developed projects',
            champion: 'Champion & 3rd',
            sports: 'French Polo and Show Jumping Championships',
            languages: '3',
            languagesText: 'Languages spoken',
            internship: 'Internship',
            seeking: 'Actively seeking from 19 January 2027'
        },
        languages: {
            tag: '🌍 Languages',
            title: 'Language Skills',
            french: 'French',
            native: 'Native speaker',
            english: 'English',
            advanced: 'C1 - Advanced',
            italian: 'Italian',
            intermediate: 'B2 - Upper intermediate'
        },
        experience: {
            tag: '💼 My journey',
            title: 'Professional Experience',
            description: 'My professional experiences in companies',
            lookingFor: 'Actively seeking',
            featured: '⭐ Featured',
            lappisoft: {
                dates: 'April – June 2026',
                title: 'Software Developer (Unity/C#) - Lappi Soft',
                description: 'Independent video game studio (Pers-Jussy) led by Maxime Bernard. Independently designed and developed the Discovery Diary system (an in-game journal the player fills while exploring) for the game The Inspector in Unity: ~2,400 lines across 12 C# scripts, a Notification Manager, audio-synced Big Notifications, a PSB Importer editor tool, persistence via Lua variables and support for 5 languages.',
                perf: 'Performance gain:',
                perfText: '2 → 84 FPS on the test scene',
                stack: 'Stack:',
                stackText: 'Unity 2019.4.41f1, C#, Pixel Crushers Dialogue System',
                details: 'View details'
            },
            intersport: {
                title: 'Sales Associate - Intersport',
                description: 'Personalised customer advice on sports equipment, inventory management and stocking. Development of customer relations and teamwork skills in a dynamic commercial environment.'
            },
            carrefour: {
                title: 'Bakery Employee - Carrefour Market',
                description: 'Preparation and presentation of bakery products, quality control and compliance with hygiene standards. Customer relationship management and teamwork in a demanding environment.'
            },
            internship: {
                title: '3rd-year Computer Science Internship',
                description: 'I am actively seeking a 16-week internship starting on 19 January 2027 in software development, web development or data/AI. Objective: to put into practice my skills in C#/ASP.NET Core, Python, Vue 3, PostgreSQL and contribute to concrete projects in a company, in France or abroad.',
                duration: 'Duration:',
                weeks: '16 weeks',
                start: 'Start:',
                date: '19 January 2027',
                domains: 'Areas:',
                domainsText: 'Software development, web development, data & AI'
            },
            magicalsky: {
                since: 'Feb. 2025 – Mar. 2026',
                type: 'IT Volunteering',
                title: 'Game Designer - MagicalSky',
                description: 'Game designer on the Minecraft server MagicalSky (magicalsky.fr). Creation and configuration of mobs with MythicMobs, development of custom tools with MMOItems. Creation of private servers and plugins with Paper. 3D mob modelling with Blockbench, a skill acquired through my CATIA experience at ENIB. Proactive in proposing new features and technical solutions. Collaborative work within a team of 13-14 people.',
                skills: 'Skills:',
                skillsText: 'Java, MythicMobs, MMOItems, Paper, Blockbench, Teamwork',
                details: 'View details'
            }
        },
        now: {
            "tag": "🛠️ Right now",
            "title": "What I’m working on this year",
            "description": "The 3rd-year courses I’m currently taking (semester 5, September to December 2026), what I do in each and excerpts of my code. Updated 13 October 2026.",
            "status": "In progress",
            "next": "Right now",
            "c1": {
                "label": "Software quality",
                "title": "A clean, tested ASP.NET Core API",
                "intro": "Running assignment TPRevision: a product-management REST API (EF Core, PostgreSQL), refactored along SOLID principles.",
                "b1": "Interfaces split by role (read, write, DTO queries)",
                "b2": "DTOs and AutoMapper so entities are never exposed",
                "b3": "Unit tests (MSTest, Moq) and integration tests against a real PostgreSQL database",
                "now": "a Blazor Server MVVM client consuming the API",
                "link": "See the code excerpts"
            },
            "c2": {
                "label": "Advanced programming (R5.A.05)",
                "title": "Flask, data and AI",
                "intro": "Group labs, deployed with Docker Compose on a university server.",
                "b1": "Flask-SQLAlchemy on the Chinook database",
                "b2": "Time-series dashboard with InfluxDB",
                "b3": "Handwritten digit recognition (MNIST) with TensorFlow, served by Flask",
                "now": "a complete Flask application to hand in (database, image upload, AI models)"
            },
            "c3": {
                "label": "SAE 5.01 — group project",
                "title": "Astraeus, an educational weather platform",
                "intro": "Scrum team of 4: 4D exploration of weather phenomena, quizzes and WeatherGuessr, a game where players compete against a model’s forecast.",
                "b1": "My role: the AI and data-processing part",
                "b2": "Our own neural-network forecasting model, starting with an LSTM on temperature",
                "b3": "Forecasts up to 3 days ahead, computed while the player is guessing",
                "now": "specifications and design"
            },
            "c4": {
                "label": "Mathematical modelling",
                "title": "The maths behind machine learning",
                "intro": "The theory behind the models I use elsewhere, coded by hand in Python.",
                "b1": "Data exploration with NumPy and pandas",
                "b2": "Linear regression and gradient descent implemented from scratch",
                "b3": "PCA, classification, the perceptron and XOR, then CNNs, LSTMs and Transformers",
                "now": "recurrent networks and Transformers, tied to the Astraeus LSTM"
            },
            "c5": {
                "label": "Virtualisation and automation",
                "title": "Docker, CI/CD and Kubernetes",
                "intro": "18 GitLab CI/CD pipeline exercises, all public on GitLab.",
                "b1": "Docker images built and pushed to the GitLab registry, then tested together (API + PostgreSQL) in the pipeline",
                "b2": "End-to-end (Cypress), load (k6) and multi-version tests in parallel (Python 3.8 to 3.11, Node 16 to 20)",
                "b3": "Automatic security scanning (Bandit, Safety, npm audit), protected variables and GitLab Pages",
                "now": "applied to this portfolio: automatic checks on every change",
                "link": "See the portfolio’s CI",
                "gitlab": "See my 18 exercises on GitLab"
            },
            "c6": {
                "label": "Digital creation and tech watch",
                "title": "3D, imaging and emerging tech",
                "intro": "More creative courses, partly taught in English.",
                "b1": "Blender: modelling, texturing and UV-mapping a character",
                "b2": "Photoshop, taught in English: “Avatarize yourself”, an avatar made from my own photo",
                "b3": "Group technology watch on WebAssembly",
                "now": "finishing the avatar and writing up the tech watch"
            },
            "code": {
                "title": "Code excerpts",
                "note": "Excerpts taken as-is from my code. The full course repository is public on GitHub.",
                "e1": "Separating roles: read, write and DTO queries",
                "e1why": "Each controller depends only on what it needs (interface segregation principle).",
                "e2": "Entity → DTO with AutoMapper",
                "e2why": "The client gets display-ready data, and the “restocking” flag is computed server-side.",
                "e3": "Integration test against a real PostgreSQL database",
                "e3why": "The test creates a product through the controller, reads it back and checks the returned DTO, in Given / When / Then form.",
                "g1": "Software quality (C#)",
                "g2": "Virtualisation and automation (GitLab CI/CD)",
                "e4": "Build the Docker images, then test the API against a real database",
                "e4why": "A reusable job template (.docker), two images pushed to the GitLab registry, then an integration test that only starts once the backend is built.",
                "e5": "Test on several Python versions in parallel",
                "e5why": "A matrix runs the same test suite on four Python versions at once and keeps one report per version."
            },
            "repos": {
                "title": "My code online",
                "github": "GitHub profile",
                "portfolio": "Source code of this portfolio",
                "r401": "R4.01: ASP.NET Core web service and its client",
                "r404": "R4.04: film-rating app (MVVM, MSTest)",
                "r403": "R4.03: .NET console application",
                "qdd": "Software quality: full repository (TPRevision)",
                "gitlab": "GitLab CI/CD: my 18 exercises"
            }
        },
        butYears: {
            tag: "📚 Year by year",
            title: "My Bachelor’s degree, year by year",
            description: "The courses, projects and key work of each year of my Bachelor’s degree in Computer Science (BUT) at IUT d’Annecy",
            subjects: "Key courses",
            projects: "Projects & achievements",
            security: "Security",
            securityText: "Audit of my repositories (October 2026): development credentials, now inactive, still appear in the history of some first- and second-year projects. I have left them visible as an honest record of my learning. Since my third year, my repositories contain no real secrets, and this portfolio automatically scans its full history for secrets (gitleaks) on every change.",
            current: "In progress",
            y1: {
                title: "1st year — The fundamentals",
                dates: "2024 – 2025",
                intro: "Object-oriented programming in C#, first user interfaces and databases, and first team projects with Git.",
                s1: "Object-oriented programming (C#)",
                s2: "User interfaces (WPF, XAML)",
                s3: "Relational databases (SQL, PostgreSQL)",
                s4: "UML design",
                s5: "Version control (Git)",
                p1: "Survival Island — naval combat game in C# / WPF (SAE 1.01)",
                p2: "Nicolas wine cellar — C# / WPF, PostgreSQL (SAE 2.01)",
            },
            y2: {
                title: "2nd year — Full-stack and first internship",
                dates: "2025 – 2026",
                intro: "Full web applications built in teams, advanced databases, networking and mobile, then an 8-week internship in a video game studio. Top of class in mathematics, 16.5/20 average in the last semester.",
                s1: "Advanced algorithms in Python (recursion, trees)",
                s2: "Database optimisation and advanced databases (JSONB, MongoDB)",
                s3: "Network architecture (subnetting, VLANs, RIP/OSPF routing)",
                s4: "Mobile development (Flutter) and desktop clients (WinUI 3, MVVM)",
                s5: "Formal languages and automata",
                s6: "Project management and economics (TCO, NPV, IRR)",
                p1: "CUBE Bikes — ASP.NET Core / Vue 3 e-commerce (SAE 3.01 / 4.01)",
                p2: "Twitter/X clone — Laravel, Redis, WebSockets, Docker (R4.08)",
                p3: "Internship at Lappi Soft — Discovery Diary system in Unity",
                p4: "Labs: ASP.NET Core + EF Core REST API and a WinUI 3 MVVM client, tested with MSTest and Moq"
            },
            y3: {
                title: "3rd year — Quality, DevOps and AI",
                dates: "2026 – 2027",
                intro: "Final year, with courses taught in English at the initiative of the IUT and its students: software quality, automation and first AI models, before a 16-week internship from January 2027.",
                s1: "Software quality (SOLID, testing, DTOs)",
                s2: "Advanced programming (Flask, SQLAlchemy, InfluxDB)",
                s3: "Virtualisation and automation (Docker, GitLab CI/CD, Kubernetes)",
                s4: "Mathematical modelling (regression, gradient descent, PCA)",
                s5: "Parallel computing (NumPy, Joblib, Numba)",
                s6: "3D modelling and scripting (Blender, Python)",
                p1: "ASP.NET Core API: generic repository, DTOs with AutoMapper, SOLID refactoring",
                p2: "Unit tests (Moq) and integration tests against a real PostgreSQL database",
                p3: "Flask + TensorFlow app (MNIST digit recognition) deployed with Docker",
                p4: "GitLab CI/CD pipelines: artifacts, rules, protected variables, GitLab Pages",
                p5: "Linear regression and gradient descent implemented from scratch",
                p6: "Group technology watch on WebAssembly"
            }
        },
        education: {
            tag: '🎓 My education',
            title: 'Academic Background',
            description: 'My studies and degrees',
            current: 'In progress',
            but: {
                title: 'Bachelor\'s degree in Computer Science (BUT) - 3rd and final year (Application Development track)',
                description: 'French national Bachelor\'s degree (3 years, 180 ECTS) at IUT Annecy, Application Development track: application development, software architecture and database management.',
                school: 'School:'
            },
            enib: {
                title: 'Engineering Prep Year - ENIB',
                description: 'Preparatory year at the National School of Engineers in Brest.',
                school: 'School:'
            },
            bac: {
                title: 'French Baccalauréat (high-school diploma)',
                description: 'General Baccalaureate with specialisations in Mathematics and NSI (Computer Science).',
                mention: 'With Distinction',
                school: 'High School:'
            },
            science: {
                title: 'Cordées de la réussite 2022',
                description: '1st place in the Cordées de la réussite competition (a French equal-opportunity programme) in 11th grade: graph-theory analysis of a network of high-school students, with Python and Graphviz.',
                winner: '1st place',
                school: 'High School:'
            }
        },
        skills: {
            tag: '💡 My skills',
            title: 'Technologies & Tools',
            description: 'A wide range of skills acquired during my education, my internship and personal projects',
            backend: 'Backend',
            frontend: 'Frontend & Mobile',
            databases: 'Data',
            tools: 'Tools & DevOps',
            system: 'System',
            ai: 'Artificial Intelligence',
            aiAssisted: 'AI-assisted development',
            level: { advanced: 'advanced', intermediate: 'intermediate', basic: 'basic', learning: 'in progress' }
        },
        tags: {
            jan2027: '19 January 2027',
            sept2024: 'Sept. 2024 - 2027',
            summer2024: 'Summer 2024',
            summer2023: 'Summer 2023',
            sinceDec2024: 'Since Dec. 2024',
            oct2026: 'Oct. 2026',
            y2025_2026: '2025 – 2026',
            spring2026: 'Spring 2026',
            personal: 'Personal',
            ongoing: 'In active development',
            dec2024: 'Dec. 2024',
            spring2024: 'Spring 2024',
            spring2025: 'Spring 2025',
            academic: 'Academic',
            seasonal: 'Seasonal job',
            internshipBut2: '2nd-year internship',
            team2: 'Team of 2',
            team3: 'Team of 3',
            but2team5: '2nd year - Team of 5',
            r408team4: 'R408A1 - Team of 4'
        },
        projects: {
            tag: '🚀 My achievements',
            title: 'Projects & Developments',
            description: 'A selection of my academic and personal projects using various technologies',
            filters: {
                title: 'Filter projects:',
                all: 'All projects',
                academic: 'Academic Projects',
                personal: 'Personal Projects'
            },
            techFilters: {
                all: 'All techs',
                database: 'Databases'
            },
            learnMore: 'Learn more →',
            viewProject: 'View project →',
            viewSite: 'You are on it! →',
            fianchetto: {
                title: 'Fianchetto — chess game review',
                description: 'A chess web app that runs entirely in the browser: bots from 500 to 2500 Elo, Chess.com and Lichess game import, a Stockfish (WebAssembly) review — accuracy, 11 move categories, comments — multi-game reports and puzzles built from your own mistakes.',
                context: 'Context:',
                contextText: 'Personal project, to review my Chess.com games without a subscription',
                tech: 'Technologies:',
                open: 'Open the app ↗'
            },
            portfolio: {
                title: 'Bilingual personal portfolio',
                description: 'Responsive, bilingual (FR/EN) portfolio website, started in December 2024 and still evolving: HTML5, CSS3 and vanilla JavaScript, animations, an i18n translation system, a contact form via Formspree, automated checks on every change (GitHub Actions) and deployment on GitHub Pages.',
                context: 'Context:',
                contextText: 'Personal project, a professional showcase of my skills and projects',
                tech: 'Technologies:'
            },
            zelda: {
                title: 'Zelda II: The Adventure of Link',
                description: 'Complete recreation of the classic Zelda 2 game in Python with colourful ASCII graphics and ANSI sequences. Development of a complete RPG system including side-scrolling combat, open world exploration, random encounters, interactive NPCs and inventory management. Use of termios for non-blocking input handling and creation of simple enemy AI.',
                context: 'Context:',
                contextText: 'Advanced programming project completed in preparatory year at ENIB',
                tech: 'Technologies:'
            },
            cubebikes: {
                title: 'CUBE Bikes - E-commerce Platform',
                description: 'Full-stack e-commerce platform for a bike shop: ASP.NET Core 8 / Entity Framework Core / PostgreSQL backend with JWT + Google OAuth authentication, TOTP 2FA, Stripe Checkout payment and Repository/Service pattern; Vue 3 / Pinia / Tailwind CSS frontend with faceted search, a Leaflet map store selector and per-size/per-store product availability. A recurring project that evolved from SAE 3.01 (Laravel/PostgreSQL) to SAE 4.01 (ASP.NET Core/Vue 3). My role: the store selector and per-store availability, on both the API and the interface.',
                context: 'Context:',
                contextText: 'Multi-semester flagship project - Computer Science BUT',
                disclaimer: "Fictional academic project: this is not the official CUBE website and it has no connection with the brand.",
                tech: 'Technologies:'
            },
            twitterclone: {
                title: 'Twitter/X Clone',
                description: 'Social network clone developed by a team of 4 with Laravel 13 / PHP 8.3, PostgreSQL, Redis and Livewire/Alpine.js, including real-time features via WebSockets (Laravel Reverb) and a Grok-like AI assistant powered by the Gemini API, deployed with Docker. My role: media uploads (up to 4 photos or videos per tweet, previews, validation and storage).',
                context: 'Context:',
                contextText: 'R408A1 group project - 2nd year Computer Science BUT',
                tech: 'Technologies:'
            },
            sae201: {
                title: 'Nicolas wine cellar - SAE 2.01',
                description: 'Stock management desktop application for the Nicolas wine retailer, built by a team of two in C# / WPF: wine search, restocking requests approved by the manager, supplier orders and customer records, on a PostgreSQL database.',
                context: 'Context:',
                contextText: 'Learning and Assessment Situation - Computer Science BUT',
                techText: 'C#, .NET 8, WPF, PostgreSQL, UML',
                tech: 'Technologies:'
            },
            survival: {
                title: 'Survival Island',
                description: 'Naval combat game built by a team of three in C# / WPF: at the helm of a ship, the player defends their island against waves of enemy ships, earns experience and upgrades the island and their weapons. My role: enemies, firing modes, ship classes, reward items, sound and music.',
                context: 'Context:',
                contextText: 'SAE 1.01 - 1st year Computer Science BUT',
                techText: 'C#, .NET 8, WPF, UML',
                tech: 'Technologies:'
            }
        },
        emulations: {
            tag: '🕹️ Playable online',
            title: 'Mini-games and emulations',
            description: 'Mini-games built for this portfolio and two of my projects made playable: everything runs in the browser, no install required',
            play: 'Play →',
            survival: {
                title: 'Survival Island',
                description: 'My C# / WPF first-year project, ported to JavaScript for the browser'
            },
            zelda: {
                title: 'Zelda II: The Adventure of Link',
                description: 'Python terminal game, emulated via Pyodide (Python/WebAssembly)'
            }
        },
        contact: {
            title: '🚀 Let\'s work together!',
            subtitle: 'I\'m available for a 16-week internship starting on 19 January 2027',
            emailBtn: 'Contact me',
            email: '📧 Contact form'
        },
        legal: {
            "tag": "⚖️ Legal information",
            "title": "Legal notice and privacy",
            "description": "Who publishes this site, who hosts it, and what happens to your data.",
            "updated": "Last updated: 16 October 2026",
            "editorTitle": "Publisher",
            "editorText": "This site is the personal portfolio of Matéo Bourdin, a Computer Science (BUT) student at IUT d’Annecy. It is published on a non-professional basis.",
            "editorContact": "Contact: mateo.bourdin@etu.univ-smb.fr or the form on the Contact page.",
            "hostTitle": "Host",
            "hostText": "GitHub, Inc. (GitHub Pages service), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States.",
            "dataTitle": "Personal data",
            "dataIntro": "This site has no analytics, no advertising and no tracking cookies. The only personal data processed is what you send through the contact form.",
            "formTitle": "Contact form",
            "formWhat": "Data collected: your name, email address, subject and message.",
            "formWhy": "Purpose: only to reply to you. Legal basis: my legitimate interest in handling the requests sent to me.",
            "formWho": "Recipients: me only. The form is relayed by Formspree, Inc. (United States), which forwards the message to me by email.",
            "formHow": "Retention: messages are deleted at the latest 12 months after our last exchange.",
            "rightsTitle": "Your rights",
            "rightsText": "You can request access to, correction or deletion of your data, or object to its processing, by writing to mateo.bourdin@etu.univ-smb.fr. If you believe your rights are not respected, you can lodge a complaint with the CNIL (French data protection authority).",
            "storageTitle": "Cookies and local storage",
            "storageText": "This site sets no cookies. It only stores in your browser (local storage) the language and the light or dark theme you choose, and your best scores and progress in the mini-games and the revision quizzes on the course pages. This information never leaves your device and you can clear it from your browser settings. The Survival Island demo stores nothing. The Fianchetto chess app, served on the same domain, likewise keeps your games, reviews, ratings and settings in your browser.",
            "thirdTitle": "Third-party content",
            "thirdText": "Fonts, libraries (including Pyodide, which runs Python in the demos), game files (images, music, sounds) and course demo files are hosted on this site. Two external contents only load if you click on them: the YouTube video on the Survival Island page and the OpenStreetMap map on the Contact page. When you click, that service receives your IP address and the name of this site (not the address of the page you are on), and YouTube may set cookies. The AI models on the course pages run in your browser: the drawings and photos you give them are not sent anywhere. In Fianchetto, the Stockfish engine also runs in your browser; only two actions contact an external service: importing games (your browser queries the public Chess.com or Lichess APIs with the username you enter) and loading an online puzzle (Lichess API). That service then receives your IP address and the requested username. Like any host, GitHub receives visitors’ IP addresses to run and secure the service.",
            "policies": "Privacy policies of the services mentioned:",
            "ipTitle": "Intellectual property and credits",
            "ipText": "The text, code and layout of this site are mine unless stated otherwise. Survival Island (first-year project SAE 1.01) was built by a team of three: its code, images, music and sounds come from the project's GitHub repository (ForWarZz/Survival-Island). Zelda II: The Adventure of Link is a non-commercial tribute project; The Legend of Zelda is a registered trademark of Nintendo. Course pages only show my own work (code, results, revision notes); teaching materials are not published and the API demo data is made up. Fianchetto bundles Stockfish (GPL-3.0), chess.js (BSD-2-Clause), the Cburnett pieces (CC BY-SA 3.0) and puzzles from the Lichess database (CC0); its code is released under GPL-3.0. The demos also use public datasets: the Chinook database (Luis Rocha, MIT licence), MNIST (Yann LeCun and Corinna Cortes, CC BY-SA 3.0), Fashion-MNIST (Zalando Research, MIT licence) and CIFAR-10 (Alex Krizhevsky). The logos and brands mentioned belong to their owners."
        },
        games: {
            "back": "← Arcade",
            "source": "View the source code",
            "howTitle": "How it’s made",
            "ski": {
                "short": "Ski slalom through the gates, in JavaScript (Canvas)",
                "title": "Combloux Downhill",
                "tag": "⛷️ Mini-game",
                "desc": "A slalom through the gates on the Combloux slope where I have always skied. Go through the gates and avoid the fir trees: speed increases every second.",
                "controls": "Controls: ← → arrows (or A/Q and D) to turn, Space to start, P to pause. On mobile: hold your finger left or right of the skier, or use the buttons.",
                "how": "2D Canvas and requestAnimationFrame, no library at all: about 300 lines of JavaScript. Gates get narrower and closer as you go down.",
                "score": "Gates",
                "best": "Best",
                "lives": "Lives",
                "left": "◀ Left",
                "right": "Right ▶"
            },
            "naval": {
                "short": "Wave-based island defence, a nod to Survival Island",
                "title": "Defend the Island",
                "tag": "🏝️ Mini-game",
                "desc": "A nod to Survival Island, my first BUT project: this time the island defends itself. Enemy boats arrive in waves, more and more numerous and fast.",
                "controls": "Controls: aim with the mouse and click to fire (hold for continuous fire). Keyboard: ← → arrows to aim, Space to fire, P to pause. On mobile: tap where you want to shoot.",
                "how": "2D Canvas with no library: generated waves, circle/circle collisions, heavy boats with 3 hit points, and the island regains one health point after each wave.",
                "score": "Score",
                "best": "Best",
                "wave": "Wave",
                "hp": "Island health"
            },
            "bug": {
                "short": "Chess-style rated code puzzles: Elo, Rush, Survival, Daily bug",
                "title": "Spot the Bug",
                "tag": "🐛 Mini-game",
                "desc": "46 real bugs to hunt down in C#, Python, JavaScript, Vue, SQL and Docker, from beginner to expert. An Elo rating that adapts to your level, Rush, Survival and Daily modes, hints, achievements and detailed statistics.",
                "controls": "Controls: click the faulty line or type its number (1 to 9), H for a hint, Enter to continue, Esc to go back to the modes.",
                "start": "Start",
                "intro": "20 seconds per snippet. The faster you answer, the more points you score.",
                "score": "Score",
                "best": "Best",
                "again": "Play again",
                "how": "The rating follows the chess Elo formula: each bug has its own difficulty, and your score rises more when you solve a bug above your level. A hint reduces the gain. Everything runs in plain JavaScript, and your progress stays in your browser."
            }
        },
        arcade: {
            "open": "🕹️ Open the Arcade",
            "tag": "🕹️ Arcade",
            "title": "Arcade",
            "desc": "Games built for this portfolio, plus one of my projects emulated in the browser. Everything plays with keyboard, mouse or touch, with no install and no sign-up.",
            "featured": "Featured",
            "featuredText": "My most complete game: chess-style rated code puzzles, with an Elo rating, 5 game modes, achievements and statistics.",
            "play": "Play",
            "others": "More games",
            "skiText": "Ski slalom on the Combloux slope: go through the gates, avoid the fir trees, and the speed keeps rising.",
            "navalText": "A nod to Survival Island: the island’s cannon fends off ever larger waves of boats.",
            "zeldaText": "My Python terminal game, running in the browser thanks to Pyodide (Python compiled to WebAssembly).",
            "survivalText": "My first-year C# / WPF project, translated faithfully to JavaScript: defend the island from pirates, upgrade your ship and pick a firing class.",
            "techTitle": "Under the hood",
            "tech1": "No library for the mini-games: JavaScript, 2D Canvas and requestAnimationFrame.",
            "tech2": "Zelda runs on Pyodide and xterm.js, hosted on this site: no request to any third-party service.",
            "tech3": "Records and progress are stored only in your browser, nothing is sent.",
            "tech4": "Playable with keyboard, mouse and touch, and respects the “reduce motion” setting.",
            "source": "See the games’ code on GitHub"
        },
        footer: {
            copyright: '© 2026 Matéo Bourdin - Computer Science Student | IUT Annecy',
            signature: 'Created with passion 🚀',
            legal: 'Legal notice and privacy'
        },
        cvModal: {
            title: '📄 Choose Language',
            subtitle: 'Select the version of my CV you want to download',
            french: {
                title: 'French Version',
                subtitle: 'CV in French'
            },
            english: {
                title: 'English Version',
                subtitle: 'CV in English'
            },
            close: 'Close'
        }
    }
};
