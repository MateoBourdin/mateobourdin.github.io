const translations = {
    fr: {
        meta: {
            title: 'Matéo Bourdin - Étudiant en informatique | Portfolio',
            description: 'Matéo Bourdin, étudiant en 3e et dernière année de Bachelor (BUT) Informatique à l\'IUT d\'Annecy. Développeur full-stack (C#/.NET, Vue.js, Python) en recherche d\'un stage de 16 semaines dès le 19 janvier 2027.'
        },
        nav: {
            home: 'Accueil',
            about: 'À propos',
            experience: 'Expérience',
            education: 'Formation',
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
                since: 'Depuis févr. 2025',
                type: 'Bénévolat Informatique',
                title: 'Game Designer - MagicalSky',
                description: 'Game designer sur le serveur Minecraft MagicalSky (magicalsky.fr). Création et configuration de mobs avec MythicMobs, développement d\'outils personnalisés avec MMOItems. Création de serveurs privés et plugins avec Paper. Modélisation 3D de mobs avec Blockbench, compétence acquise grâce à mon expérience CATIA à l\'ENIB. Force de proposition pour de nouvelles fonctionnalités et solutions techniques. Travail collaboratif au sein d\'une équipe de 13-14 personnes.',
                skills: 'Compétences :',
                skillsText: 'Java, MythicMobs, MMOItems, Paper, Blockbench, Travail d\'équipe',
                details: 'Voir le détail'
            }
        },
        butYears: {
            tag: "📚 Année par année",
            title: "Mon parcours en BUT",
            description: "Les matières, projets et travaux marquants de chaque année du Bachelor (BUT) Informatique à l’IUT d’Annecy",
            subjects: "Matières clés",
            projects: "Projets & réalisations",
            current: "En cours",
            y1: {
                title: "1re année — Les fondamentaux",
                dates: "2024 – 2025",
                intro: "Programmation orientée objet en C#, premières interfaces graphiques et bases de données, et premiers projets en équipe avec Git.",
                s1: "Programmation orientée objet (C#)",
                s2: "Interfaces graphiques (WPF, MVVM)",
                s3: "Bases de données relationnelles (SQL, PostgreSQL)",
                s4: "Conception UML",
                s5: "Gestion de version (Git)",
                p1: "Survival Island — jeu de défense en C# (SAE 1.01)",
                p2: "Cave à vin Nicolas — C# / WPF, PostgreSQL (SAE 2.01)",
            },
            y2: {
                title: "2e année — Full-stack et premier stage",
                dates: "2025 – 2026",
                intro: "Applications web complètes en équipe, bases de données avancées, réseaux et mobile, puis un stage de 8 semaines en studio de jeux vidéo. Major de promotion en mathématiques, 16,5/20 de moyenne au dernier semestre.",
                s1: "Algorithmique avancée en Python (récursivité, arbres)",
                s2: "Optimisation et bases de données avancées (JSONB, MongoDB)",
                s3: "Architecture réseau (sous-réseaux, VLAN, routage RIP/OSPF)",
                s4: "Développement mobile (Flutter)",
                s5: "Langages formels et automates",
                s6: "Gestion de projet et économie (TCO, VAN, TIR)",
                p1: "CUBE Bikes — e-commerce ASP.NET Core / Vue 3 (SAE 3.01 / 4.01)",
                p2: "Clone Twitter/X — Laravel, Redis, WebSockets, Docker (R4.08)",
                p3: "Stage chez Lappi Soft — système Discovery Diary sous Unity"
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
            but2team4: 'BUT2 - Équipe de 4',
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
                description: 'Plateforme e-commerce full-stack pour une boutique de vélos : backend ASP.NET Core 8 / Entity Framework Core / PostgreSQL avec authentification JWT + Google OAuth, 2FA par TOTP, paiement Stripe Checkout et pattern Repository/Service ; frontend Vue 3 / Pinia / Tailwind CSS avec recherche à facettes, sélecteur de magasin sur carte Leaflet et disponibilité produit par taille et par magasin. Projet récurrent ayant évolué de la SAE 3.01 (Laravel/PostgreSQL) à la SAE 4.01 (ASP.NET Core/Vue 3).',
                context: 'Contexte :',
                contextText: 'Projet fil rouge sur plusieurs semestres - BUT Informatique',
                tech: 'Technologies :'
            },
            twitterclone: {
                title: 'Clone Twitter/X',
                description: 'Clone de réseau social développé en équipe de 4 avec Laravel 13 / PHP 8.3, PostgreSQL, Redis et Livewire/Alpine.js, incluant des fonctionnalités temps réel via WebSockets (Laravel Reverb) et un assistant IA façon Grok basé sur l\'API Gemini, déployé avec Docker. Mon rôle : frontend et gestion des médias (upload photo/vidéo, infinite scroll, édition de profil, fonctionnalités temps réel).',
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
                description: 'Jeu de défense d\'île développé en C# où le joueur doit protéger son île contre des vagues d\'ennemis. Le joueur reste au centre de l\'écran et doit gérer sa vie, ses dégâts et sa vitesse de tir. Système de vagues progressives avec génération aléatoire d\'ennemis qui se rapprochent de l\'île. Développement collaboratif avec gestion de version Git.',
                context: 'Contexte :',
                contextText: 'Projet de développement de jeux en équipe - BUT Informatique 1re année',
                tech: 'Technologies :'
            }
        },
        emulations: {
            tag: '🕹️ Jouable en ligne',
            title: 'Émulations disponibles',
            description: 'Certains projets tournent directement dans le navigateur, sans rien installer',
            play: 'Jouer →',
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
        footer: {
            copyright: '© 2026 Matéo Bourdin - Étudiant en informatique | IUT Annecy',
            signature: 'Créé avec passion 🚀'
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
        meta: {
            title: 'Matéo Bourdin - Computer Science Student | Portfolio',
            description: 'Matéo Bourdin, final-year Bachelor\'s student in Computer Science (BUT) at IUT d\'Annecy. Full-stack developer (C#/.NET, Vue.js, Python) seeking a 16-week internship starting on 19 January 2027.'
        },
        nav: {
            home: 'Home',
            about: 'About',
            experience: 'Experience',
            education: 'Education',
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
                since: 'Since Feb. 2025',
                type: 'IT Volunteering',
                title: 'Game Designer - MagicalSky',
                description: 'Game designer on the Minecraft server MagicalSky (magicalsky.fr). Creation and configuration of mobs with MythicMobs, development of custom tools with MMOItems. Creation of private servers and plugins with Paper. 3D mob modelling with Blockbench, a skill acquired through my CATIA experience at ENIB. Proactive in proposing new features and technical solutions. Collaborative work within a team of 13-14 people.',
                skills: 'Skills:',
                skillsText: 'Java, MythicMobs, MMOItems, Paper, Blockbench, Teamwork',
                details: 'View details'
            }
        },
        butYears: {
            tag: "📚 Year by year",
            title: "My Bachelor’s degree, year by year",
            description: "The courses, projects and key work of each year of my Bachelor’s degree in Computer Science (BUT) at IUT d’Annecy",
            subjects: "Key courses",
            projects: "Projects & achievements",
            current: "In progress",
            y1: {
                title: "1st year — The fundamentals",
                dates: "2024 – 2025",
                intro: "Object-oriented programming in C#, first user interfaces and databases, and first team projects with Git.",
                s1: "Object-oriented programming (C#)",
                s2: "User interfaces (WPF, MVVM)",
                s3: "Relational databases (SQL, PostgreSQL)",
                s4: "UML design",
                s5: "Version control (Git)",
                p1: "Survival Island — defence game in C# (SAE 1.01)",
                p2: "Nicolas wine cellar — C# / WPF, PostgreSQL (SAE 2.01)",
            },
            y2: {
                title: "2nd year — Full-stack and first internship",
                dates: "2025 – 2026",
                intro: "Full web applications built in teams, advanced databases, networking and mobile, then an 8-week internship in a video game studio. Top of class in mathematics, 16.5/20 average in the last semester.",
                s1: "Advanced algorithms in Python (recursion, trees)",
                s2: "Database optimisation and advanced databases (JSONB, MongoDB)",
                s3: "Network architecture (subnetting, VLANs, RIP/OSPF routing)",
                s4: "Mobile development (Flutter)",
                s5: "Formal languages and automata",
                s6: "Project management and economics (TCO, NPV, IRR)",
                p1: "CUBE Bikes — ASP.NET Core / Vue 3 e-commerce (SAE 3.01 / 4.01)",
                p2: "Twitter/X clone — Laravel, Redis, WebSockets, Docker (R4.08)",
                p3: "Internship at Lappi Soft — Discovery Diary system in Unity"
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
            but2team4: '2nd year - Team of 4',
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
                description: 'Full-stack e-commerce platform for a bike shop: ASP.NET Core 8 / Entity Framework Core / PostgreSQL backend with JWT + Google OAuth authentication, TOTP 2FA, Stripe Checkout payment and Repository/Service pattern; Vue 3 / Pinia / Tailwind CSS frontend with faceted search, a Leaflet map store selector and per-size/per-store product availability. A recurring project that evolved from SAE 3.01 (Laravel/PostgreSQL) to SAE 4.01 (ASP.NET Core/Vue 3).',
                context: 'Context:',
                contextText: 'Multi-semester flagship project - Computer Science BUT',
                tech: 'Technologies:'
            },
            twitterclone: {
                title: 'Twitter/X Clone',
                description: 'Social network clone developed by a team of 4 with Laravel 13 / PHP 8.3, PostgreSQL, Redis and Livewire/Alpine.js, including real-time features via WebSockets (Laravel Reverb) and a Grok-like AI assistant powered by the Gemini API, deployed with Docker. My role: frontend and media management (photo/video upload, infinite scroll, profile editing, real-time features).',
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
                description: 'Island defence game developed in C# where the player must protect their island against waves of enemies. The player stays at the centre of the screen and must manage their health, damage, and firing speed. Progressive wave system with random enemy generation approaching the island. Collaborative development with Git version control.',
                context: 'Context:',
                contextText: 'Team game development project - 1st year Computer Science BUT',
                tech: 'Technologies:'
            }
        },
        emulations: {
            tag: '🕹️ Playable online',
            title: 'Available Emulations',
            description: 'Some projects run directly in the browser, no install required',
            play: 'Play →',
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
        footer: {
            copyright: '© 2026 Matéo Bourdin - Computer Science Student | IUT Annecy',
            signature: 'Created with passion 🚀'
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
