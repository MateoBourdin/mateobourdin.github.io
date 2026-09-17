const translations = {
    fr: {
        meta: {
            title: 'Mateo - Étudiant Développeur | Portfolio',
            description: 'Mateo, étudiant en 3ème année de BUT Informatique (parcours RA) à l\'IUT Annecy. Développeur passionné recherchant un stage de 16 semaines à partir du 19 janvier 2027.'
        },
        nav: {
            home: 'Accueil',
            about: 'À propos',
            experience: 'Expérience',
            education: 'Formation',
            projects: 'Projets',
            skills: 'Compétences',
            contact: 'Contact'
        },
        hero: {
            availability: '⚡ Disponible pour un stage de 16 semaines dès le 19 janvier 2027',
            greeting: 'Salut, je suis',
            title: 'Développeur & Étudiant en Informatique',
            description: 'Étudiant en 3ème année de BUT Informatique (parcours Réalisation d\'Applications) à l\'IUT d\'Annecy, passionné par le développement web, les bases de données et la création d\'applications conviviales. Fort d\'un stage de BUT2 chez Lappi Soft, je recherche un stage de 16 semaines à partir du 19 janvier 2027 pour mettre en pratique mes compétences et apprendre au sein d\'une équipe dynamique.',
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
            champion: 'Champion & 3ème',
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
                dates: 'Avril - Juin 2026',
                title: 'Stage Développeur Unity - Lappi Soft',
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
                description: 'Je recherche activement un stage de 16 semaines à partir du 19 janvier 2027 en développement logiciel, développement web ou administration de bases de données. Objectif : mettre en pratique mes compétences en C#/ASP.NET Core, Vue 3, PHP/Laravel, PostgreSQL et contribuer à des projets concrets en entreprise, en France comme à l\'étranger.',
                duration: 'Durée :',
                weeks: '16 semaines',
                start: 'Début :',
                date: '19 janvier 2027',
                domains: 'Domaines :',
                domainsText: 'Développement Web, Bases de données, Développement logiciel'
            },
            magicalsky: {
                since: 'Depuis Fév. 2025',
                type: 'Bénévolat Informatique',
                title: 'Game Designer - MagicalSky',
                description: 'Game designer sur le serveur Minecraft MagicalSky (magicalsky.fr). Création et configuration de mobs avec MythicMobs, développement d\'outils personnalisés avec MMOItems. Création de serveurs privés et plugins avec Paper. Modélisation 3D de mobs avec Blockbench, compétence acquise grâce à mon expérience CATIA à l\'ENIB. Force de proposition pour de nouvelles fonctionnalités et solutions techniques. Travail collaboratif au sein d\'une équipe de 13-14 personnes.',
                skills: 'Compétences :',
                skillsText: 'Java, MythicMobs, MMOItems, Paper, Blockbench, Travail d\'équipe',
                details: 'Voir le détail'
            }
        },
        education: {
            tag: '🎓 Ma formation',
            title: 'Parcours Académique',
            description: 'Mon cursus et mes diplômes',
            current: 'En cours',
            but: {
                title: 'BUT Informatique - 3ème année (parcours RA)',
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
                title: 'Concours de Sciences',
                description: 'Lauréat du concours de sciences en classe de Première, démontrant des compétences exceptionnelles en sciences expérimentales et résolution de problèmes.',
                winner: '1ère place',
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
            aiAssisted: 'Dév. assisté par IA'
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
                title: 'Portfolio Personnel - Cas d\'Étude BUT2/BUT3',
                description: 'Développement d\'un site portfolio responsive et bilingue (FR/EN) initié en BUT2 et maintenu à jour depuis. Utilisation de HTML5, CSS3 et JavaScript vanilla pour créer une interface moderne avec animations, système de traduction i18n, formulaire de contact sécurisé via Formspree, et déploiement automatisé sur GitHub Pages. Ce projet démontre mes compétences en développement web front-end et design UX/UI.',
                context: 'Contexte :',
                contextText: 'Projet universitaire visant à créer une vitrine professionnelle de mes compétences et projets',
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
                contextText: 'Projet de groupe R408A1 - BUT Informatique 3ème année',
                tech: 'Technologies :'
            },
            winecellar: {
                title: 'Gestion de Cave à Vin',
                description: 'Application desktop WPF en C# avec architecture MVVM pour la gestion d\'une cave à vin. Conception de diagrammes UML, base de données PostgreSQL et API REST pour la communication client-serveur.',
                tech: 'Technologies :'
            },
            spacebattle: {
                title: 'Space Battle',
                description: 'Jeu en C# développé en équipe utilisant la programmation orientée objet et les principes de conception d\'interface utilisateur. Implémentation du rendu graphique, de la gestion audio et travail collaboratif avec Git.',
                tech: 'Technologies :'
            },
            sae201: {
                title: 'Application C# - SAE201',
                description: 'Projet académique développé en C# avec Visual Studio dans le cadre de la SAE201. Application desktop utilisant les concepts de programmation orientée objet et les bonnes pratiques de développement logiciel. Le projet met en œuvre les compétences acquises en développement d\'applications et en conception logicielle.',
                context: 'Contexte :',
                contextText: 'Situation d\'Apprentissage et d\'Évaluation - BUT Informatique',
                tech: 'Technologies :'
            },
            survival: {
                title: 'Survival Island',
                description: 'Jeu de défense d\'île développé en C# où le joueur doit protéger son île contre des vagues d\'ennemis. Le joueur reste au centre de l\'écran et doit gérer sa vie, ses dégâts et sa vitesse de tir. Système de vagues progressives avec génération aléatoire d\'ennemis qui se rapprochent de l\'île. Développement collaboratif avec gestion de version Git.',
                context: 'Contexte :',
                contextText: 'Projet de développement de jeux en équipe - BUT Informatique 2ème année',
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
            copyright: '© 2026 Mateo - Étudiant Développeur | IUT Annecy',
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
            title: 'Mateo - Student Developer | Portfolio',
            description: 'Mateo, 3rd-year Computer Science student (Application Development track) at IUT Annecy. Passionate developer seeking a 16-week internship starting January 19, 2027.'
        },
        nav: {
            home: 'Home',
            about: 'About',
            experience: 'Experience',
            education: 'Education',
            projects: 'Projects',
            skills: 'Skills',
            contact: 'Contact'
        },
        hero: {
            availability: '⚡ Available for a 16-week internship from January 19, 2027',
            greeting: 'Hi, I\'m',
            title: 'Developer & Computer Science Student',
            description: '3rd-year Computer Science student (Application Development track) at IUT Annecy, passionate about web development, databases and creating user-friendly applications. Having completed a BUT2 internship at Lappi Soft, I\'m looking for a 16-week internship starting January 19, 2027 to apply my skills and learn within a dynamic team.',
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
            seeking: 'Actively seeking from January 19, 2027'
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
                dates: 'April - June 2026',
                title: 'Unity Developer Internship - Lappi Soft',
                description: 'Independent video game studio (Pers-Jussy) led by Maxime Bernard. Designed and developed, independently, the Discovery Diary system (an in-game discoverable journal) for the game The Inspector in Unity: ~2,400 lines across 12 C# scripts, Notification Manager, Big Notification synced to audio, PSB Importer editor tool, persistence via Lua variables, and support for 5 languages.',
                perf: 'Performance gain:',
                perfText: '2 → 84 FPS on the test scene',
                stack: 'Stack:',
                stackText: 'Unity 2019.4.41f1, C#, Pixel Crushers Dialogue System',
                details: 'View details'
            },
            intersport: {
                title: 'Sales Associate - Intersport',
                description: 'Personalized customer advice on sports equipment, inventory management and stocking. Development of customer relations and teamwork skills in a dynamic commercial environment.'
            },
            carrefour: {
                title: 'Bakery Employee - Carrefour Market',
                description: 'Preparation and presentation of bakery products, quality control and compliance with hygiene standards. Customer relationship management and teamwork in a demanding environment.'
            },
            internship: {
                title: 'BUT3 Computer Science Internship',
                description: 'I am actively seeking a 16-week internship starting January 19, 2027 in software development, web development, or database administration. Objective: to put into practice my skills in C#/ASP.NET Core, Vue 3, PHP/Laravel, PostgreSQL and contribute to concrete projects in a company, in France or abroad.',
                duration: 'Duration:',
                weeks: '16 weeks',
                start: 'Start:',
                date: 'January 19, 2027',
                domains: 'Areas:',
                domainsText: 'Web Development, Databases, Software Development'
            },
            magicalsky: {
                since: 'Since Feb. 2025',
                type: 'IT Volunteering',
                title: 'Game Designer - MagicalSky',
                description: 'Game designer on the Minecraft server MagicalSky (magicalsky.fr). Creation and configuration of mobs with MythicMobs, development of custom tools with MMOItems. Creation of private servers and plugins with Paper. 3D mob modeling with Blockbench, a skill acquired through my CATIA experience at ENIB. Proactive in proposing new features and technical solutions. Collaborative work within a team of 13-14 people.',
                skills: 'Skills:',
                skillsText: 'Java, MythicMobs, MMOItems, Paper, Blockbench, Teamwork',
                details: 'View details'
            }
        },
        education: {
            tag: '🎓 My education',
            title: 'Academic Background',
            description: 'My studies and degrees',
            current: 'In progress',
            but: {
                title: 'B.U.T. Computer Science - 3rd Year (Application Development track)',
                description: 'Computer Science degree at IUT Annecy, Application Development track: application development, software architecture and database management.',
                school: 'School:'
            },
            enib: {
                title: 'Engineering Prep Year - ENIB',
                description: 'Preparatory year at the National School of Engineers in Brest.',
                school: 'School:'
            },
            bac: {
                title: 'French Baccalaureate with honors',
                description: 'General Baccalaureate with specializations in Mathematics and NSI (Computer Science).',
                mention: 'With Merit',
                school: 'High School:'
            },
            science: {
                title: 'Science Competition',
                description: 'Winner of the science competition in 11th grade, demonstrating exceptional skills in experimental sciences and problem solving.',
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
            aiAssisted: 'AI-assisted development'
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
                title: 'Personal Portfolio - BUT2/BUT3 Case Study',
                description: 'Development of a responsive and bilingual (FR/EN) portfolio website started in BUT2 and kept up to date since. Using HTML5, CSS3 and vanilla JavaScript to create a modern interface with animations, i18n translation system, secure contact form via Formspree, and automated deployment on GitHub Pages. This project demonstrates my front-end web development and UX/UI design skills.',
                context: 'Context:',
                contextText: 'University project aimed at creating a professional showcase of my skills and projects',
                tech: 'Technologies:'
            },
            zelda: {
                title: 'Zelda II: The Adventure of Link',
                description: 'Complete recreation of the classic Zelda 2 game in Python with colorful ASCII graphics and ANSI sequences. Development of a complete RPG system including side-scrolling combat, open world exploration, random encounters, interactive NPCs and inventory management. Use of termios for non-blocking input handling and creation of simple enemy AI.',
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
                contextText: 'R408A1 group project - 3rd year Computer Science BUT',
                tech: 'Technologies:'
            },
            winecellar: {
                title: 'Wine Cellar Management',
                description: 'WPF desktop application in C# with MVVM architecture for managing a wine cellar. UML diagram design, PostgreSQL database and REST API for client-server communication.',
                tech: 'Technologies:'
            },
            spacebattle: {
                title: 'Space Battle',
                description: 'C# game developed as a team using object-oriented programming and user interface design principles. Implementation of graphics rendering, audio management, and collaborative development with Git.',
                tech: 'Technologies:'
            },
            sae201: {
                title: 'C# Application - SAE201',
                description: 'Academic project developed in C# with Visual Studio as part of SAE201. Desktop application using object-oriented programming concepts and software development best practices. The project implements skills acquired in application development and software design.',
                context: 'Context:',
                contextText: 'Learning and Assessment Situation - Computer Science BUT',
                tech: 'Technologies:'
            },
            survival: {
                title: 'Survival Island',
                description: 'Island defense game developed in C# where the player must protect their island against waves of enemies. The player stays at the center of the screen and must manage their health, damage, and firing speed. Progressive wave system with random enemy generation approaching the island. Collaborative development with Git version control.',
                context: 'Context:',
                contextText: 'Team game development project - 2nd year Computer Science BUT',
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
            subtitle: 'I\'m available for a 16-week internship starting January 19, 2027',
            emailBtn: 'Contact me',
            email: '📧 Contact form'
        },
        footer: {
            copyright: '© 2026 Mateo - Student Developer | IUT Annecy',
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
