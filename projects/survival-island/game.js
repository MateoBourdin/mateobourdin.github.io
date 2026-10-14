/*
 * Survival Island — version navigateur de la SAE 1.01 (C# / WPF, BUT Informatique S1).
 * Code d'origine : https://github.com/ForWarZz/Survival-Island
 *
 * Traduction fidèle du code C# : mêmes classes (MoteurJeu, GestionCarte, GestionVagues,
 * GestionSons, Bateau, Joueur, Ennemi, Ile, Collision…), mêmes constantes, même interface
 * (MainWindow.xaml, DialogueAudio, DialogueChangerBateau), mêmes images et mêmes sons.
 * Seuls ajouts : la traduction anglaise et la correction de quelques bugs (voir CORRECTIFS).
 *
 * CORRECTIFS par rapport au dépôt :
 *  1. Joueur.NiveauSuivant comparait ModeBateau à "classique" alors que la constante vaut
 *     "CLASSIQUE" : le choix de classe n'apparaissait qu'au niveau 15 au lieu du niveau 5.
 *  2. Joueur.AfficherMenuClasse ajoutait un nouveau gestionnaire Click à chaque affichage :
 *     un seul clic pouvait appliquer plusieurs fois la classe (dégâts divisés plusieurs fois).
 *  3. DialogueAudio : le curseur « Son » n'était ni initialisé ni appliqué.
 */
(() => {
    'use strict';

    // ---- Outils/Constante.cs ---------------------------------------------
    const K = {
        MUSIQUE_VOLUME: 0.2, EXPERIENCE_MODE_TRICHE: 10000,
        NOMBRE_CARREAUX_MER: 32, TAILLE_CARREAU: 128,
        JOUEUR_VIE_MAX: 100, AMELIO_VIE_MAX: 20,
        JOUEUR_VITESSE: 300, AMELIO_VITESSE_MAX: 550, AMELIO_VITESSE: 40,
        JOUEUR_DEGATS: 40, AMELIO_DEGATS: 5,
        JOUEUR_RECHARGEMENT_CANON: 1.0, TEMPS_REAPPARITION: 5,
        BATEAU_ACCELERATION: 200,
        JOUEUR_EXPERIENCE_MAX_N1: 100, MULTIPLICATEUR_NIVEAU: 1.5,
        LARGEUR_NAVIRE: 50, HAUTEUR_NAVIRE: 100,
        VITESSE_BOULET: 500, TAILLE_BOULET_INIT: 10,
        ILE_VIE_MAX: 1000, AMELIO_VIE_ILE: 1000, MARGE_ILE: 800,
        NOMBRE_ROCHERS_CARTE: 100, MULTIPLICATEUR_TAILLE_ROCHER: 0.5,
        VITESSE_ROTATION_BATEAU: 250, TOLERANCE_ANGLE_ROTATION: 5,
        BASE_COFFRE_VIE: 40 * 3, BASE_COFFRE_EXPERIENCE: 60,
        BASE_COFFRE_LARGEUR: 70, BASE_COFFRE_HAUTEUR: 50, BASE_COFFRE_PROBA_VIE: 0.5,
        BORNE_MIN_APPARITION_COFFRE: 0, BORNE_MAX_APPARITION_COFFRE: 5,
        MULTIPLICATEUR_TAILLE_COFFRE: 0.5, APPARITION_COFFRE_INTERVAL: 12, // TimeSpan.FromMinutes(0.2)
        HAUTEUR_BARRE_VIE: 10,
        RAYON_DETECTION_JOUEUR: 300, MARGE_APPARITION_ENNEMI: 500, TOLERANCE_CIBLE_ENNEMI: 100,
        DISTANCE_EVASION: 100,
        TEMPS_ENTRE_VAGUE: 20, VAGUE_MIN_ENNEMI: 1, VAGUE_MAX_ENNEMI: 8,
        VIE_BASE_ENNEMI: 100, MULTIPLICATEUR_VIE_ENNEMI: 2,
        DEGATS_BASE_ENNEMI: 10, RECOMPENSE_EXP_ENNEMI_TUE: 25,
        TEMPS_RECHARGEMENT_MIN_ENNEMI: 1.0, TEMPS_RECHARGEMENT_BASE_ENNEMI: 1.0,
        TEMPS_RECHARGEMENT_MULTIPLICATEUR_ENNEMI: 3.0,
        NB_MUSIQUE: 4, NB_SON: 5
    };
    const MONDE = K.NOMBRE_CARREAUX_MER * K.TAILLE_CARREAU; // 4096 px

    // Modes de tir (Constante.MODE_*) : nombre de boulets, angle total, rechargement,
    // puis selon le mode : bonus de dégâts, espacement, taille des boulets.
    const MODES = {
        QUATRE:     { img: 'quatre',     n: 4, angle: 360, reload: 1.1 },
        DOUBLE:     { img: 'double',     n: 2, angle: 0,   reload: 1.1, gap: 10 },
        POMPE:      { img: 'pompe',      n: 3, angle: 20,  reload: 1.1 },
        OCTOPUS:    { img: 'octo',       n: 8, angle: 360, reload: 1.3 },
        'QUATRO+':  { img: 'quatroplus', n: 4, angle: 360, reload: 0.8, bonus: 10, size: 30 },
        EVENTAILLE: { img: 'eventaille', n: 6, angle: 180, reload: 1.0 },
        TRIO:       { img: 'trio',       n: 3, angle: 0,   reload: 1.0, gap: 15, size: 15 },
        MEGA:       { img: 'mega',       n: 1, angle: 0,   reload: 1.8, bonus: 20, size: 60 },
        SNIPER:     { img: 'sniper',     n: 1, angle: 0,   reload: 3.0, bonus: 40, gap: 0 },
        MK30:       { img: 'mk30',       n: 5, angle: 35,  reload: 0.8, bonus: 20, size: 15 }
    };
    // Joueur.AfficherMenuClasse : boutons btnQuatre / btnPompe / btnDouble
    const MENU_CLASSE = {
        CLASSIQUE: { choix: ['QUATRE', 'POMPE', 'DOUBLE'], libelles: ['Quatre', 'Pompe', 'Double'] },
        QUATRE: { choix: ['OCTOPUS', 'QUATRO+', 'EVENTAILLE'] },
        DOUBLE: { choix: ['TRIO', 'MEGA', 'EVENTAILLE'] },
        POMPE: { choix: ['SNIPER', 'MK30', 'EVENTAILLE'] }
    };

    // ---- Textes de l'interface (FR d'origine + traduction EN) ---------------
    const TXT = {
        fr: {
            loading: 'Chargement…', menuParams: 'Paramètres', menuSon: 'Son...', menuBateau: 'Changer Bateau...', menuQuitter: 'Quitter',
            vagueActuelle: 'Vague actuelle :', piratesVie: 'Nombres de pirates en vie :', piratesCoules: 'Nombre de pirates coulés :',
            pv: 'PV', jouer: 'Jouer', retourJeu: 'Retour au jeu', parametres: 'Paramètres', retourBureau: 'Retour au bureau', pause: 'PAUSE',
            titreParams: 'PARAMETRES', reglagesAudio: 'Réglages audio', changerBateau: 'Changer de bateau', retour: 'Retour',
            ameliorations: 'Améliorations', fermer: 'Fermer', niveau: 'Niveau :', progression: 'Progression avant prochain niveau :', points: 'Points : ',
            vieBateau: 'Vie du bateau : ', degatsBateau: 'Dégats du bateau : ', vitesseBateau: 'Vitesse du bateau : ', vieIle: "Vie de l'île: ",
            finJeu: 'FIN DU JEU', vaguesSurvecues: 'Nombre de vagues survécues : ', bateauxCoules: 'Nombre de bateaux coulés : ', morts: 'Nombre de morts : ',
            rejouerQ: 'Voulez-vous rejouer ?', rejouer: 'Rejouer', choisirClasse: 'Choisissez votre classe:', ignorer: 'Ignore',
            mort: 'Vous êtes mort. Vous allez réapparaitre dans 5 secondes...',
            attente: 'Allez cherchez des trésors pour vous restaurer. Les ennemis arrivent dans {0} secondes !',
            enCours: "Les ennemis arrivent. Protégez l'île à tout prix !",
            fenAudio: 'Menu Audio', musique: 'Musique :', son: 'Son :', suivant: 'Suivant', appliquer: 'Appliquer',
            fenBateau: 'Menu Changer Bateau', fenFermer: 'Fermer le jeu', confirmerQuitter: 'Êtes vous sûr de vouloir quitter le jeu ?',
            ok: 'OK', annuler: 'Annuler'
        },
        en: {
            loading: 'Loading…', menuParams: 'Settings', menuSon: 'Sound...', menuBateau: 'Change Ship...', menuQuitter: 'Quit',
            vagueActuelle: 'Current wave:', piratesVie: 'Pirates alive:', piratesCoules: 'Pirates sunk:',
            pv: 'HP', jouer: 'Play', retourJeu: 'Back to game', parametres: 'Settings', retourBureau: 'Back to desktop', pause: 'PAUSE',
            titreParams: 'SETTINGS', reglagesAudio: 'Audio settings', changerBateau: 'Change ship', retour: 'Back',
            ameliorations: 'Upgrades', fermer: 'Close', niveau: 'Level:', progression: 'Progress to next level:', points: 'Points: ',
            vieBateau: 'Ship health: ', degatsBateau: 'Ship damage: ', vitesseBateau: 'Ship speed: ', vieIle: 'Island health: ',
            finJeu: 'GAME OVER', vaguesSurvecues: 'Waves survived: ', bateauxCoules: 'Ships sunk: ', morts: 'Deaths: ',
            rejouerQ: 'Do you want to play again?', rejouer: 'Play again', choisirClasse: 'Choose your class:', ignorer: 'Ignore',
            mort: 'You died. You will respawn in 5 seconds...',
            attente: 'Go find treasure to restore yourself. The enemies arrive in {0} seconds!',
            enCours: 'The enemies are coming. Protect the island at all costs!',
            fenAudio: 'Audio Menu', musique: 'Music:', son: 'Sound:', suivant: 'Next', appliquer: 'Apply',
            fenBateau: 'Change Ship Menu', fenFermer: 'Close the game', confirmerQuitter: 'Are you sure you want to quit the game?',
            ok: 'OK', annuler: 'Cancel'
        }
    };
    let lang = 'fr';
    const t = (k, ...a) => {
        let s = TXT[lang][k] ?? TXT.fr[k] ?? k;
        a.forEach((v, i) => { s = s.replace('{' + i + '}', v); });
        return s;
    };

    // ---- Outils ----------------------------------------------------------
    const rnd = Math.random;
    const randInt = (a, b) => a + Math.floor(rnd() * Math.max(0, b - a)); // Random.Next(a, b)
    const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);       // Calcul.DistanceAvec
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const BASE = (document.currentScript && document.currentScript.src)
        ? document.currentScript.src.replace(/game\.js(\?.*)?$/, '') : 'survival-island/';
    const IMG_BASE = BASE + 'img/';
    const SON_BASE = BASE + 'son/';

    // ---- Entites/Base/Collision.cs : rectangle orienté ---------------------
    class Collision {
        constructor(x, y, w, h, angle = 0) {
            const cx = x + w / 2, cy = y + h / 2;
            const r = angle * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
            const rot = (px, py) => {
                const dx = px - cx, dy = py - cy;
                return [cx + dx * c - dy * s, cy + dx * s + dy * c];
            };
            this.cx = cx; this.cy = cy;
            this.r = Math.hypot(w, h) / 2; // pré-test rapide (n'élimine que des cas sans contact)
            this.k = [rot(x, y), rot(x + w, y), rot(x + w, y + h), rot(x, y + h)];
            const xs = this.k.map(p => p[0]), ys = this.k.map(p => p[1]);
            this.minX = Math.min(...xs); this.maxX = Math.max(...xs);
            this.minY = Math.min(...ys); this.maxY = Math.max(...ys);
        }
        seg(i) { return [this.k[i], this.k[(i + 1) % 4]]; }
        static inter(a1, a2, b1, b2) { // LignesIntersectent
            const v1x = a2[0] - a1[0], v1y = a2[1] - a1[1];
            const v2x = b2[0] - b1[0], v2y = b2[1] - b1[1];
            const v3x = b1[0] - a1[0], v3y = b1[1] - a1[1];
            const den = v1x * v2y - v1y * v2x;
            if (den === 0) return false;
            const t1 = (v3x * v2y - v3y * v2x) / den;
            const t2 = (v3x * v1y - v3y * v1x) / den;
            return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
        }
        loin(o) { return dist(this.cx, this.cy, o.cx, o.cy) > this.r + o.r; }
        contient(p) { return p[0] >= this.minX && p[0] <= this.maxX && p[1] >= this.minY && p[1] <= this.maxY; } // PointDansCollision
        touche(o) { // EnCollisionAvec
            if (this.loin(o)) return false;
            for (let i = 0; i < 4; i++) {
                const a = this.seg(i);
                for (let j = 0; j < 4; j++) {
                    const b = o.seg(j);
                    if (Collision.inter(a[0], a[1], b[0], b[1])) return true;
                }
            }
            return o.k.some(p => this.contient(p)) || this.k.some(p => o.contient(p));
        }
        devant(o) { // CollisionDevantAvec : seul le segment avant est testé
            if (this.loin(o)) return false;
            const a = this.seg(2);
            for (let j = 0; j < 4; j++) {
                const b = o.seg(j);
                if (Collision.inter(a[0], a[1], b[0], b[1])) return true;
            }
            return false;
        }
    }

    // ---- Entités ---------------------------------------------------------
    class Entite { // EntiteBase (statique)
        constructor(x, y, w, h, angle = 0) {
            this.x = x; this.y = y; this.w = w; this.h = h; this.angle = angle;
            this.col = new Collision(x, y, w, h, angle);
            this.cache = false;
        }
        get cx() { return this.x + this.w / 2; }
        get cy() { return this.y + this.h / 2; }
    }

    class AvecVie extends Entite { // EntiteAvecVie (île, coffres)
        constructor(x, y, w, h, vieMax) {
            super(x, y, w, h);
            this.vie = this.vieMax = vieMax;
            this.barre = false;
        }
        degats(n) {
            this.vie = Math.max(0, this.vie - n);
            this.barre = true;
            return this.vie <= 0;
        }
    }

    class Bateau { // Entites/Navire/Bateau.cs
        constructor(jeu, img, couleur, vieMax, degats, vitesse, rechargement) {
            this.jeu = jeu; this.img = img; this.couleur = couleur;
            this.w = K.LARGEUR_NAVIRE; this.h = K.HAUTEUR_NAVIRE;
            this.x = 0; this.y = 0;
            this.vie = this.vieMax = vieMax;
            this.degatsTir = degats; this.vitesseMax = vitesse; this.vitesse = 0;
            this.rechargement = rechargement; this.dernierTir = 0;
            this.deplacement = false; this.canon = false;
            this.angle = 0; this.angleCible = 0; this.ox = 0; this.oy = 0;
            this.tailleBoulets = K.TAILLE_BOULET_INIT;
            this.nb = 1; this.angleBoulets = 0; this.espacement = 0;
            this.mode = 'CLASSIQUE';
            this.mort = false; this.barre = false;
        }
        get cx() { return this.x + this.w / 2; }
        get cy() { return this.y + this.h / 2; }
        collision(x = this.x, y = this.y) { return new Collision(x, y, this.w, this.h, this.angle); }

        deplacer(dt) {
            if (!this.deplacement && this.vitesse === 0) return;
            this.vitesse = this.deplacement
                ? Math.min(this.vitesse + K.BATEAU_ACCELERATION * dt, this.vitesseMax)
                : Math.max(this.vitesse - K.BATEAU_ACCELERATION * dt, 0);
            const nx = this.x + this.vitesse * this.ox * dt;
            const ny = this.y + this.vitesse * this.oy * dt;
            if (this.peutAllerVers(nx, ny)) {
                this.x = clamp(nx, 0, MONDE - this.w);
                this.y = clamp(ny, 0, MONDE - this.h);
            } else {
                this.vitesse = 0;
            }
        }
        orienterVers(px, py) { // ChangerOrientation
            this.angleCible = Math.atan2(py - this.cy, px - this.cx) * 180 / Math.PI - 90;
        }
        miseAJourRotation(dt) {
            let diff = (this.angleCible - this.angle + 360) % 360;
            if (diff > 180) diff -= 360;
            const delta = K.VITESSE_ROTATION_BATEAU * dt;
            if (Math.abs(diff) <= K.TOLERANCE_ANGLE_ROTATION) this.angle = this.angleCible;
            else if (Math.abs(diff) > delta) this.angle += Math.sign(diff) * delta;
            else this.angle = this.angleCible;
            const a = (this.angle + 90) * Math.PI / 180;
            this.ox = Math.cos(a); this.oy = Math.sin(a);
        }
        tirer() { // TirerBoulet
            if (this.dernierTir > 0) return;
            this.dernierTir = this.rechargement;
            this.quandTir();
            const esp = Math.trunc(this.angleBoulets / this.nb); // division entière comme en C#
            const ao = Math.atan2(this.oy, this.ox);
            const ex = this.espacement > 0 ? -Math.sin(ao) * this.espacement : 0;
            const ey = this.espacement > 0 ? Math.cos(ao) * this.espacement : 0;
            const s = this.tailleBoulets;
            for (let i = 0; i < this.nb; i++) {
                const a = ao + (i - this.nb / 2) * (esp * Math.PI / 180);
                this.jeu.boulets.push({
                    x: this.cx - s / 2 + i * ex, y: this.cy - s / 2 + i * ey, s,
                    dx: Math.cos(a), dy: Math.sin(a), tireur: this, couleur: this.couleur
                });
            }
        }
        quandTir() {}
    }

    class Joueur extends Bateau { // Entites/Joueur.cs
        constructor(jeu, img) {
            super(jeu, img, 'black', K.JOUEUR_VIE_MAX, K.JOUEUR_DEGATS, K.JOUEUR_VITESSE, K.JOUEUR_RECHARGEMENT_CANON);
            this.niveau = 1; this.xp = 0; this.xpMax = K.JOUEUR_EXPERIENCE_MAX_N1;
            this.points = 0; this.nouveauNiveau = false; this.triche = false;
            this.niveauClasse = 0;
            this.coules = 0; this.morts = 0; this.reapparition = 0;
        }
        peutAllerVers(nx, ny) {
            const c = new Collision(nx, ny, this.w, this.h, this.angle);
            const j = this.jeu;
            if (c.devant(j.ile.col)) return false;
            for (const o of j.rochers) if (c.devant(o.col)) return false;
            for (const o of j.coffres) if (c.devant(o.col)) return false;
            for (const e of j.ennemis) if (c.devant(e.collision())) return false;
            return true;
        }
        quandTir() { Sons.joueSon(); }
        ajouterExperience(n) {
            this.xp += n;
            if (this.xp >= this.xpMax) this.niveauSuivant();
        }
        niveauSuivant() {
            this.nouveauNiveau = true;
            this.points++;
            this.niveau++;
            // Correctif 1 : comparaison avec la vraie constante "CLASSIQUE"
            if (this.niveau >= 5 && this.mode === 'CLASSIQUE') this.jeu.ui.afficherMenuClasse();
            else if (this.niveau >= 15 && this.mode !== 'CLASSIQUE') this.jeu.ui.afficherMenuClasse();
            this.xp = 0;
            this.xpMax = Math.trunc(this.xpMax * K.MULTIPLICATEUR_NIVEAU);
        }
        choisirClasse(nom) { // ChoisirClasse
            if (nom !== 'IGNORER') {
                const permis = (this.niveau >= 5 && this.mode === 'CLASSIQUE') ||
                    (this.niveau >= 15 && MENU_CLASSE[this.mode] && this.mode !== 'CLASSIQUE');
                if (permis) {
                    const m = MODES[nom];
                    this.mode = nom;
                    this.nb = m.n; this.angleBoulets = m.angle; this.rechargement = m.reload;
                    this.degatsTir = Math.trunc(this.degatsTir / m.n) * 2 + (m.bonus || 0);
                    if ('gap' in m) this.espacement = m.gap;
                    if (m.size) this.tailleBoulets = m.size;
                    this.niveauClasse++;
                }
            }
        }
        ajouterVie(n) { this.vie = Math.min(this.vieMax, this.vie + n); }
    }

    class Ennemi extends Bateau { // Entites/Ennemi.cs
        constructor(jeu, vie, degats, vitesse, rechargement) {
            super(jeu, jeu.img.ennemi, 'red', vie, degats, vitesse, rechargement);
            this.joueurDansRayon = false;
            this.caches = [];
            this.orientationEnCours = false; this.orientationFinaleEnCours = false;
        }
        definirCible(px, py, fx, fy) {
            this.cible = [px, py]; this.cibleActuelle = [px, py]; this.finale = [fx, fy];
        }
        deplacer(dt) {
            this.verifierJoueur();
            if (this.joueurDansRayon) {
                this.orienterVers(...this.cibleActuelle);
                this.canon = true;
                this.orientationFinaleEnCours = false;
            } else if (dist(this.cx, this.cy, ...this.cible) <= K.TOLERANCE_CIBLE_ENNEMI) {
                this.canon = true;
            } else if (this.angleCible === this.angle && !this.orientationFinaleEnCours) {
                this.orienterVers(...this.finale);
                this.orientationFinaleEnCours = true;
            } else if (!this.orientationEnCours) {
                this.orienterVers(...this.cibleActuelle);
                this.orientationEnCours = true;
            } else {
                super.deplacer(dt);
            }
            for (let i = this.caches.length - 1; i >= 0; i--) { // ReapparaitreObstaclesCaches
                const o = this.caches[i];
                if (dist(this.x, this.y, o.x, o.y) > K.DISTANCE_EVASION) { o.cache = false; this.caches.splice(i, 1); }
            }
        }
        verifierJoueur() { // VerifierJoueursDansRayon
            const j = this.jeu.joueur;
            if (j.mort) {
                this.joueurDansRayon = false;
                this.cibleActuelle = this.cible;
                this.orienterVers(...this.finale);
                return;
            }
            this.joueurDansRayon = dist(this.cx, this.cy, j.cx, j.cy) <= K.RAYON_DETECTION_JOUEUR;
            this.cibleActuelle = this.joueurDansRayon ? [j.cx, j.cy] : this.cible;
        }
        peutAllerVers(nx, ny) {
            const c = new Collision(nx, ny, this.w, this.h, this.angle);
            const j = this.jeu;
            if (c.devant(j.ile.col)) return false;
            if (c.touche(j.joueur.collision())) return false;
            for (const o of [...j.rochers, ...j.coffres]) {
                if (c.devant(o.col)) { // CacherEntite : l'ennemi passe, l'obstacle est masqué
                    if (!o.cache) { o.cache = true; this.caches.push(o); }
                    return true;
                }
            }
            return true;
        }
    }

    // ---- GestionSons.cs : musiques MusiqueFond1-4 et sons son1-5 ---------------
    const Sons = {
        musiques: [], sons: [], indiceMusique: 0, indiceSon: 0, volumeSon: 1, demarre: false,
        init() {
            for (let i = 1; i <= K.NB_MUSIQUE; i++) {
                const a = new Audio(); a.preload = 'none'; a.src = SON_BASE + 'musique_' + i + '.mp3';
                a.volume = K.MUSIQUE_VOLUME; a.loop = true; // MediaEnded → Relance
                this.musiques.push(a);
            }
            for (let i = 1; i <= K.NB_SON; i++) {
                const a = new Audio(); a.preload = 'auto'; a.src = SON_BASE + 'son_' + i + '.mp3';
                this.sons.push(a);
            }
        },
        // Le navigateur n'autorise la musique qu'après une première interaction.
        demarrer() {
            if (this.demarre) return;
            this.demarre = true;
            this.musiques[this.indiceMusique].play().catch(() => { this.demarre = false; });
        },
        jouer(a) { try { a.pause(); a.currentTime = 0; a.volume = this.volumeSon; a.play().catch(() => {}); } catch (e) { /* lecture impossible */ } },
        joueSon() { this.jouer(this.sons[this.indiceSon]); },
        sonSuivant() { this.indiceSon = (this.indiceSon + 1) % this.sons.length; this.joueSon(); },
        musiqueSuivante() {
            const m = this.musiques[this.indiceMusique];
            const vol = m.volume; m.pause(); m.currentTime = 0;
            this.indiceMusique = (this.indiceMusique + 1) % this.musiques.length;
            const n = this.musiques[this.indiceMusique];
            n.volume = vol; n.play().catch(() => {});
            this.demarre = true;
        },
        get volumeMusique() { return this.musiques[this.indiceMusique].volume; },
        set volumeMusique(v) { this.musiques[this.indiceMusique].volume = v; }
    };

    // ---- GestionImages.cs ------------------------------------------------
    function chargerImages() {
        const noms = ['bateau_1', 'bateau_2', 'bateau_3', 'bateau_4', 'bateau_ennemi', 'ile', 'ile_cassee',
            'mer', 'tresor', 'rocher_1', 'rocher_2', 'rocher_3', 'logo', ...Object.values(MODES).map(m => m.img)];
        const img = {};
        return Promise.all(noms.map(n => new Promise((ok, ko) => {
            const im = new Image();
            im.onload = () => ok(); im.onerror = () => ko(new Error(n));
            im.src = IMG_BASE + n + '.webp';
            img[n] = im;
        }))).then(() => {
            img.ennemi = img.bateau_ennemi;
            img.joueurs = [img.bateau_1, img.bateau_2, img.bateau_3, img.bateau_4];
            img.rochers = [img.rocher_1, img.rocher_2, img.rocher_3];
            return img;
        });
    }

    // ---- MoteurJeu.cs ------------------------------------------------------
    class MoteurJeu {
        constructor(stage, img) {
            this.stage = stage; this.img = img;
            this.canvas = stage.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.mer = this.ctx.createPattern(img.mer, 'repeat');
            this.numBateau = 0;
            this.jeuLance = false; this.estPause = false;
            this.boulets = []; this.coffres = []; this.ennemis = []; this.rochers = []; this.ile = null;
            this.joueur = new Joueur(this, img.joueurs[0]);
            this.cam = { x: 0, y: 0 };
            this.vague = null;
            this.ui = new Fenetre(this);
            this.taille();
            new ResizeObserver(() => this.taille()).observe(stage);
            this.dernier = performance.now();
            requestAnimationFrame(ts => this.boucle(ts));
        }

        taille() {
            const r = this.canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.vw = r.width; this.vh = r.height; this.dpr = dpr;
            this.canvas.width = Math.round(r.width * dpr); this.canvas.height = Math.round(r.height * dpr);
            if (this.jeuLance) this.deplaceCamera();
        }

        peutJouer() { return this.jeuLance && !this.estPause; }

        initJeu() { // InitJeu
            this.jeuLance = true;
            this.ile = new AvecVie(MONDE / 2 - 256, MONDE / 2 - 256, 512, 512, K.ILE_VIE_MAX); // GestionCarte.InitIle
            this.ile.rayonEnnemi = (512 + K.MARGE_ILE) / 2; // CercleEnnemi
            this.vague = { num: 0, secondes: K.TEMPS_ENTRE_VAGUE, enCours: false, acc: 0, actif: true };
            this.rochers = [];
            for (let i = 0; i < K.NOMBRE_ROCHERS_CARTE; i++) { // InitRochers
                const im = this.img.rochers[randInt(0, 3)];
                const a = randInt(0, 361);
                const m = K.MULTIPLICATEUR_TAILLE_ROCHER + rnd();
                const w = im.width * m, h = im.height * m;
                const p = this.positionAleatoire(w, h, a);
                const r = new Entite(p[0], p[1], w, h, a); r.img = im;
                this.rochers.push(r);
            }
            const p = this.positionAleatoire(K.LARGEUR_NAVIRE, K.HAUTEUR_NAVIRE, 0); // InitJoueur
            this.joueur.x = p[0]; this.joueur.y = p[1];
            this.deplaceCamera();
            this.accCoffre = 0;
            this.ui.afficherHUD(true);
            this.ui.statut(t('attente', this.vague.secondes));
        }

        // GestionCarte.GenererPositionAleatoire
        positionAleatoire(w, h, angle = 0, marge = 0) {
            for (let essai = 0; essai < 5000; essai++) {
                let x, y;
                if (marge > 0) {
                    switch (randInt(0, 4)) {
                        case 0: x = randInt(0, marge); y = randInt(0, MONDE - h); break;
                        case 1: x = randInt(MONDE - marge, MONDE - w); y = randInt(0, MONDE - h); break;
                        case 2: x = randInt(0, MONDE - w); y = randInt(0, marge); break;
                        default: x = randInt(0, MONDE - w); y = randInt(MONDE - marge, MONDE - h);
                    }
                } else { x = randInt(0, MONDE - w); y = randInt(0, MONDE - h); }
                const c = new Collision(x, y, w, h, angle);
                if (dist(c.cx, c.cy, this.ile.cx, this.ile.cy) < K.MARGE_ILE) continue;
                if (this.rochers.some(o => o.col.touche(c))) continue;
                if (this.coffres.some(o => o.col.touche(c))) continue;
                if (this.ennemis.some(e => e.collision().touche(c))) continue;
                return [x, y];
            }
            return [randInt(0, MONDE - w), randInt(0, MONDE - h)];
        }

        deplaceCamera() { // Joueur.DeplaceCameraVers
            const j = this.joueur;
            this.cam.x = clamp(j.x - this.vw / 2 + j.w / 2, 0, Math.max(0, MONDE - this.vw));
            this.cam.y = clamp(j.y - this.vh / 2 + j.h / 2, 0, Math.max(0, MONDE - this.vh));
        }

        // ---- GestionVagues.cs ----
        lancerVague() { // LancerVague (tick du minuteur d'une seconde)
            const v = this.vague;
            v.secondes--;
            this.ui.statut(t('attente', v.secondes));
            if (v.secondes <= 0) {
                this.ui.statut(t('enCours'));
                v.num++;
                this.ajouterVague();
                v.actif = false; v.enCours = true;
                v.secondes = K.TEMPS_ENTRE_VAGUE;
            }
        }
        ajouterVague() {
            const n = this.vague.num;
            const nombre = Math.min(K.VAGUE_MIN_ENNEMI + n, K.VAGUE_MAX_ENNEMI);
            const vie = K.VIE_BASE_ENNEMI + n * K.MULTIPLICATEUR_VIE_ENNEMI;
            const degats = K.DEGATS_BASE_ENNEMI + n;
            const recharge = Math.max(K.TEMPS_RECHARGEMENT_MIN_ENNEMI,
                K.TEMPS_RECHARGEMENT_BASE_ENNEMI - n * K.TEMPS_RECHARGEMENT_MULTIPLICATEUR_ENNEMI);
            for (let i = 0; i < nombre; i++) { // AjouterEnnemis
                const e = new Ennemi(this, vie, degats, K.JOUEUR_VITESSE, recharge);
                const p = this.positionAleatoire(e.w, e.h, 0, K.MARGE_APPARITION_ENNEMI);
                e.x = p[0]; e.y = p[1];
                this.ennemis.push(e);
                let dx = this.ile.cx - e.cx, dy = this.ile.cy - e.cy; // CalculPointCibleIle
                const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
                e.definirCible(this.ile.cx - dx * this.ile.rayonEnnemi, this.ile.cy - dy * this.ile.rayonEnnemi, this.ile.cx, this.ile.cy);
                e.deplacement = true;
            }
        }
        majVague() { // GestionVagues.MettreAJour
            if (!this.vague.enCours) return;
            if (this.ennemis.length === 0) {
                this.vague.enCours = false;
                this.vague.actif = true; this.vague.acc = 0; // MinuteurVague.Start()
            }
        }

        genererBonus() { // GenererBonus
            const q = randInt(K.BORNE_MIN_APPARITION_COFFRE, K.BORNE_MAX_APPARITION_COFFRE);
            const n = Math.min(q, K.BORNE_MAX_APPARITION_COFFRE - this.coffres.length);
            for (let i = 0; i < n; i++) {
                const m = K.MULTIPLICATEUR_TAILLE_COFFRE + rnd();
                const w = Math.trunc(K.BASE_COFFRE_LARGEUR * m), h = Math.trunc(K.BASE_COFFRE_HAUTEUR * m);
                const p = this.positionAleatoire(w, h, 0);
                const xp = Math.trunc(K.BASE_COFFRE_EXPERIENCE * m);
                const soin = rnd() < K.BASE_COFFRE_PROBA_VIE ? Math.trunc(K.BASE_COFFRE_VIE * m) : 0;
                const c = new AvecVie(p[0], p[1], w, h, K.BASE_COFFRE_VIE);
                c.xp = xp; c.soin = soin;
                this.coffres.push(c);
            }
        }

        // ---- Boucle : CompositionTarget.Rendering → requestAnimationFrame ----
        boucle(ts) {
            // Le temps écoulé est limité pour ne pas « sauter » après un onglet en arrière-plan.
            const dt = Math.min(0.1, (ts - this.dernier) / 1000);
            this.dernier = ts;
            if (this.peutJouer()) this.jeu(dt);
            this.dessiner();
            requestAnimationFrame(t2 => this.boucle(t2));
        }

        jeu(dt) { // MoteurJeu.Jeu
            const j = this.joueur;
            if (!j.mort) {
                const ax = j.x, ay = j.y;
                j.deplacer(dt);
                if (ax !== j.x || ay !== j.y) this.deplaceCamera();
            }
            j.miseAJourRotation(dt);

            for (const e of this.ennemis) {
                e.deplacer(dt);
                e.miseAJourRotation(dt);
                e.verifierJoueur();
                if (e.canon) e.tirer();
                if (e.dernierTir > 0) e.dernierTir -= dt;
            }

            this.deplacerBoulets(dt);
            this.collisionsBoulets();

            if (j.canon && !j.mort) j.tirer();
            if (j.dernierTir > 0) j.dernierTir -= dt;

            if (j.triche) j.ajouterExperience(K.EXPERIENCE_MODE_TRICHE);

            // DispatcherTimer → minuteurs en temps de jeu (arrêtés pendant la pause, comme l'original)
            if (this.vague.actif) {
                this.vague.acc += dt;
                while (this.vague.acc >= 1 && this.vague.actif) { this.vague.acc -= 1; this.lancerVague(); }
            }
            this.accCoffre += dt;
            if (this.accCoffre >= K.APPARITION_COFFRE_INTERVAL) { this.accCoffre -= K.APPARITION_COFFRE_INTERVAL; this.genererBonus(); }
            if (j.mort) {
                j.reapparition -= dt;
                if (j.reapparition <= 0) this.reapparition();
            }
            this.ui.majHUD();
        }

        deplacerBoulets(dt) {
            for (let i = this.boulets.length - 1; i >= 0; i--) {
                const b = this.boulets[i];
                b.x += b.dx * K.VITESSE_BOULET * dt;
                b.y += b.dy * K.VITESSE_BOULET * dt;
                if (b.x < 0 || b.y < 0 || b.x > MONDE + b.s || b.y > MONDE + b.s) this.boulets.splice(i, 1);
            }
        }

        collisionsBoulets() { // CheckBouletsCollisions
            const j = this.joueur, aSupprimer = new Set();
            for (let i = this.boulets.length - 1; i >= 0; i--) {
                const b = this.boulets[i];
                const c = new Collision(b.x, b.y, b.s, b.s);
                const parJoueur = b.tireur instanceof Joueur;
                if (this.rochers.some(o => c.touche(o.col))) aSupprimer.add(b);
                if (c.touche(this.ile.col)) {
                    if (!parJoueur && this.ile.degats(b.tireur.degatsTir)) this.terminerJeu();
                    aSupprimer.add(b);
                    continue;
                }
                for (let k = this.coffres.length - 1; k >= 0; k--) {
                    const o = this.coffres[k];
                    if (c.touche(o.col)) {
                        if (o.degats(j.degatsTir)) {
                            if (parJoueur) { j.ajouterExperience(o.xp); j.ajouterVie(o.soin); }
                            this.coffres.splice(k, 1);
                        }
                        aSupprimer.add(b);
                        break;
                    }
                }
                if (!j.mort && !parJoueur && j.collision().touche(c)) {
                    j.vie = Math.max(0, j.vie - b.tireur.degatsTir);
                    if (j.vie <= 0) this.joueurCoule();
                    aSupprimer.add(b);
                    continue;
                }
                for (let k = this.ennemis.length - 1; k >= 0; k--) {
                    const e = this.ennemis[k];
                    if (parJoueur && e.collision().touche(c)) {
                        e.vie = Math.max(0, e.vie - j.degatsTir); e.barre = true;
                        if (e.vie <= 0) {
                            this.ennemis.splice(k, 1);
                            this.majVague();
                            j.coules++;
                            j.ajouterExperience(K.RECOMPENSE_EXP_ENNEMI_TUE);
                        }
                        aSupprimer.add(b);
                        break;
                    }
                }
            }
            if (aSupprimer.size) this.boulets = this.boulets.filter(b => !aSupprimer.has(b));
        }

        joueurCoule() { // Joueur.PlusDeVie
            const j = this.joueur;
            j.mort = true; j.morts++; j.reapparition = K.TEMPS_REAPPARITION;
            this.ui.reapparition(true);
        }
        reapparition() { // Joueur.Reapparition
            const j = this.joueur;
            const p = this.positionAleatoire(j.w, j.h);
            j.vie = j.vieMax; j.mort = false;
            this.ui.reapparition(false);
            j.x = p[0]; j.y = p[1];
            this.deplaceCamera();
        }

        terminerJeu() { // TerminerJeu
            this.estPause = true;
            this.ui.afficherHUD(false);
            this.ui.menuFin(this.joueur.morts, this.joueur.coules, this.vague.num - 1);
        }

        pause() { // Pause (bascule)
            this.estPause = !this.estPause;
            this.ui.afficherHUD(!this.estPause);
        }

        rejouer() { // Rejouer
            const img = this.joueur.img;
            this.boulets = []; this.coffres = []; this.ennemis = [];
            this.joueur = new Joueur(this, img);
            this.ui.reapparition(false);
            this.initJeu();
            this.estPause = false;
        }

        // ---- Rendu (Canvas WPF → Canvas 2D) ----
        dessiner() {
            const c = this.ctx, d = this.dpr, cam = this.cam;
            c.setTransform(d, 0, 0, d, -cam.x * d, -cam.y * d);
            c.fillStyle = this.mer;
            c.fillRect(cam.x, cam.y, this.vw, this.vh);
            if (!this.jeuLance) return;

            const vis = (x, y, w, h) => x + w > cam.x - 80 && y + h > cam.y - 80 && x < cam.x + this.vw + 80 && y < cam.y + this.vh + 80;
            const ile = this.ile;
            c.drawImage(ile.vie <= ile.vieMax / 4 ? this.img.ile_cassee : this.img.ile, ile.x, ile.y, ile.w, ile.h);

            for (const r of this.rochers) {
                if (r.cache || !vis(r.x, r.y, r.w, r.h)) continue;
                c.save(); c.translate(r.cx, r.cy); c.rotate(r.angle * Math.PI / 180);
                c.drawImage(r.img, -r.w / 2, -r.h / 2, r.w, r.h); c.restore();
            }
            const bateau = b => {
                c.save(); c.translate(b.cx, b.cy); c.rotate(b.angle * Math.PI / 180);
                c.drawImage(b.img, -b.w / 2, -b.h / 2, b.w, b.h); c.restore();
            };
            if (!this.joueur.mort) bateau(this.joueur);
            for (const o of this.coffres) {
                if (o.cache || !vis(o.x, o.y, o.w, o.h)) continue;
                c.drawImage(this.img.tresor, o.x, o.y, o.w, o.h);
                if (o.barre) this.barre(o.x + o.w / 4, o.y + o.h, o.w / 2, o.vie / o.vieMax);
            }
            for (const e of this.ennemis) {
                if (!vis(e.x, e.y, e.w, e.h)) continue;
                bateau(e);
                if (e.barre) this.barre(e.x + e.w / 4, e.y + e.h, e.w / 2, e.vie / e.vieMax);
            }
            for (const b of this.boulets) {
                if (!vis(b.x, b.y, b.s, b.s)) continue;
                c.fillStyle = b.couleur; c.beginPath(); c.arc(b.x + b.s / 2, b.y + b.s / 2, b.s / 2, 0, Math.PI * 2); c.fill();
            }
        }
        barre(x, y, w, ratio) { // ProgressBar WPF par défaut
            const c = this.ctx;
            c.fillStyle = '#e6e6e6'; c.fillRect(x, y, w, K.HAUTEUR_BARRE_VIE);
            c.fillStyle = '#06b025'; c.fillRect(x, y, w * clamp(ratio, 0, 1), K.HAUTEUR_BARRE_VIE);
            c.strokeStyle = '#bcbcbc'; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, K.HAUTEUR_BARRE_VIE - 1);
        }
    }

    // ---- MainWindow.xaml + dialogues ----------------------------------------
    class Fenetre {
        constructor(m) {
            this.m = m;
            this.menuActif = false;
            const st = m.stage;
            st.insertAdjacentHTML('beforeend', `
<div class="si-menubar">
  <div class="si-menuitem"><button type="button" class="si-mb" data-act="menuParams" data-t="menuParams" aria-haspopup="true" aria-expanded="false"></button>
    <div class="si-dropdown" hidden><button type="button" data-act="audio" data-t="menuSon"></button><button type="button" data-act="bateau" data-t="menuBateau"></button></div></div>
  <button type="button" class="si-mb" data-act="quitter" data-t="menuQuitter"></button>
</div>
<div class="si-statut si-stencil" id="txtStatusVague" hidden></div>
<div class="si-vagueinfo si-stencil" id="spVagueInfo" hidden>
  <div><span data-t="vagueActuelle"></span> <span id="txtVagueActuelle">0</span></div>
  <div><span data-t="piratesVie"></span> <span id="txtNbPiratesVie">0</span></div>
</div>
<div class="si-joueurstats si-stencil" id="spJoueurStats" hidden><span data-t="piratesCoules"></span> <span id="txtNbPiratesCoule">0</span></div>
<div class="si-hudjoueur" id="hudJoueur" hidden>
  <div class="si-pb si-pb-ile"><div></div></div><div class="si-pbtxt" id="txtVieIle"></div>
  <div class="si-pb si-pb-joueur"><div></div></div><div class="si-pbtxt" id="txtVieJoueur"></div>
</div>
<div class="si-gridamelio" id="gridBoutonAmelio" hidden>
  <button type="button" class="si-btnamelio" id="btnAmeliorations" data-act="amelio"></button>
  <span class="si-ellipse" id="ellipseNouveauNiveau" hidden></span>
</div>
<div class="si-amelio" id="spAmelio" hidden>
  <div class="si-amelio-tete"><div data-t="ameliorations"></div><div class="si-amelio-niv"><span data-t="niveau"></span> <span id="txtNiveau"></span></div></div>
  <div class="si-amelio-xp">
    <div class="si-amelio-xpcol"><div data-t="progression"></div><div class="si-pb si-pb-xp"><div></div></div><div id="txtXPAmelio" class="si-small"></div></div>
    <span class="si-tiny" data-t="points"></span><span class="si-pastille" id="txtPointAmelio"></span>
  </div>
  <div class="si-amelio-ligne"><span data-t="vieBateau"></span><b id="txtVieJoueurAmelio"></b><button type="button" class="si-rond" data-act="amVie">+</button></div>
  <div class="si-amelio-ligne"><span data-t="degatsBateau"></span><b id="txtDegatsJoueurAmelio"></b><button type="button" class="si-rond" data-act="amDegats">+</button></div>
  <div class="si-amelio-ligne"><span data-t="vitesseBateau"></span><b id="txtVitesseJoueurAmelio"></b><button type="button" class="si-rond" data-act="amVitesse" id="btnVitesseBateauAmelio">+</button></div>
  <div class="si-amelio-ligne"><span data-t="vieIle"></span><b id="txtVieIleAmelio"></b><button type="button" class="si-rond" data-act="amIle">+</button></div>
</div>
<div class="si-ecran" id="menuAccueil">
  <div class="si-pile">
    <img class="si-logo" src="${IMG_BASE}logo.webp" alt="Survival Island" width="370" height="371">
    <div class="si-pause si-stencil" id="txtPause" hidden data-t="pause"></div>
    <button type="button" class="si-bouton si-stencil" id="btnJouer" data-act="jouer"></button>
    <button type="button" class="si-bouton si-stencil" data-act="ouvrirParams" data-t="parametres" style="margin-top:20px"></button>
    <button type="button" class="si-bouton si-stencil" data-act="quitter" data-t="retourBureau" style="margin-top:60px"></button>
  </div>
</div>
<div class="si-ecran" id="spParametres" hidden>
  <div class="si-panneau">
    <div class="si-entete si-stencil" data-t="titreParams"></div>
    <button type="button" class="si-bouton" data-act="audio" data-t="reglagesAudio" style="margin-top:30px"></button>
    <button type="button" class="si-bouton" data-act="bateau" data-t="changerBateau" style="margin-top:20px"></button>
    <button type="button" class="si-bouton" data-act="retourParams" data-t="retour" style="margin-top:60px"></button>
  </div>
</div>
<div class="si-ecran" id="spMenuFin" hidden>
  <div class="si-panneau si-fin">
    <div class="si-entete si-entete-fin si-stencil" data-t="finJeu"></div>
    <div class="si-fin-ligne si-stencil"><span data-t="vaguesSurvecues"></span><span id="txtNbVagues"></span></div>
    <div class="si-fin-ligne si-stencil"><span data-t="bateauxCoules"></span><span id="txtNbCoules"></span></div>
    <div class="si-fin-ligne si-stencil" style="margin-bottom:50px"><span data-t="morts"></span><span id="txtNbMorts"></span></div>
    <div class="si-stencil si-fin-q" data-t="rejouerQ"></div>
    <button type="button" class="si-bouton si-bouton-petit" data-act="rejouer" data-t="rejouer"></button>
  </div>
</div>
<div class="si-menuclasse" id="menuClasse" hidden>
  <div class="si-classe-titre" data-t="choisirClasse"></div>
  <div class="si-classe-images"><img id="imgModeDeTir1" alt=""><img id="imgModeDeTir2" alt=""><img id="imgModeDeTir3" alt=""><span class="si-classe-vide"></span></div>
  <div class="si-classe-boutons"><button type="button" class="si-wpf" id="btnQuatre"></button><button type="button" class="si-wpf" id="btnPompe"></button><button type="button" class="si-wpf" id="btnDouble"></button><button type="button" class="si-wpf" id="btnIgnore" data-t="ignorer"></button></div>
</div>
<div class="si-reapparition" id="gridReapparition" hidden><span class="si-stencil" data-t="mort"></span></div>
<div class="si-modal" id="siModal" hidden></div>`);
            this.$ = s => st.querySelector(s);
            st.addEventListener('click', e => this.clic(e));
            ['btnQuatre', 'btnPompe', 'btnDouble', 'btnIgnore'].forEach(id => {
                this.$('#' + id).addEventListener('click', () => this.choisirClasse(id));
            });
            document.addEventListener('click', e => {
                if (!e.target.closest('.si-menuitem')) this.fermerMenuDeroulant();
            });
            this.textes();
        }

        textes() {
            this.m.stage.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
            this.$('#btnJouer').textContent = t(this.m.jeuLance ? 'retourJeu' : 'jouer');
            this.$('#btnAmeliorations').textContent = t(this.menuActif ? 'fermer' : 'ameliorations');
            if (this.m.vague) this.statut(this.m.vague.enCours ? t('enCours') : t('attente', this.m.vague.secondes));
            if (this.dialogue) this.dialogue();
            if (!this.$('#menuClasse').hidden) this.remplirMenuClasse();
            this.majHUD();
        }

        statut(s) { this.$('#txtStatusVague').textContent = s; }

        afficherHUD(on) { // AfficherHUD
            const v = (id, b) => { this.$(id).hidden = !b; };
            v('#hudJoueur', on); v('#gridBoutonAmelio', on); v('#spJoueurStats', on); v('#spVagueInfo', on); v('#txtStatusVague', on);
            v('#spAmelio', on && this.menuActif);
            if (on) this.majHUD();
        }

        majHUD() {
            const m = this.m, j = m.joueur, ile = m.ile;
            if (!ile) return;
            const set = (id, val) => { const el = this.$(id); const s = String(val); if (el.textContent !== s) el.textContent = s; };
            this.$('.si-pb-ile div').style.width = (100 * ile.vie / ile.vieMax) + '%';
            this.$('.si-pb-joueur div').style.width = (100 * j.vie / j.vieMax) + '%';
            this.$('.si-pb-xp div').style.width = (100 * Math.min(j.xp, j.xpMax) / j.xpMax) + '%';
            set('#txtVieIle', `${ile.vie}/${ile.vieMax} ${t('pv')}`);
            set('#txtVieJoueur', `${j.vie}/${j.vieMax} ${t('pv')}`);
            set('#txtVagueActuelle', m.vague.num);
            set('#txtNbPiratesVie', m.vague.num === 0 && !m.vague.enCours ? 0 : m.ennemis.length);
            set('#txtNbPiratesCoule', j.coules);
            set('#txtPointAmelio', j.points);
            set('#txtXPAmelio', `${j.xp}/${j.xpMax} XP`);
            set('#txtVieJoueurAmelio', j.vieMax);
            set('#txtDegatsJoueurAmelio', j.degatsTir);
            set('#txtVitesseJoueurAmelio', j.vitesseMax);
            set('#txtVieIleAmelio', ile.vieMax);
            set('#txtNiveau', j.niveau);
            this.$('#ellipseNouveauNiveau').hidden = !(j.nouveauNiveau && !this.menuActif);
            this.$('#btnVitesseBateauAmelio').style.visibility = j.vitesseMax >= K.AMELIO_VITESSE_MAX ? 'hidden' : '';
        }

        reapparition(on) { this.$('#gridReapparition').hidden = !on; }

        menuFin(morts, coules, vagues) {
            this.$('#txtNbMorts').textContent = morts;
            this.$('#txtNbCoules').textContent = coules;
            this.$('#txtNbVagues').textContent = vagues;
            this.$('#spMenuFin').hidden = false;
        }

        // Joueur.AfficherMenuClasse
        afficherMenuClasse() {
            if (!MENU_CLASSE[this.m.joueur.mode]) return;
            this.remplirMenuClasse();
            this.$('#menuClasse').hidden = false;
        }
        remplirMenuClasse() {
            const def = MENU_CLASSE[this.m.joueur.mode];
            if (!def) return;
            ['btnQuatre', 'btnPompe', 'btnDouble'].forEach((id, i) => {
                const b = this.$('#' + id);
                b.dataset.classe = def.choix[i];
                b.textContent = def.libelles ? def.libelles[i] : def.choix[i];
                this.$('#imgModeDeTir' + (i + 1)).src = IMG_BASE + MODES[def.choix[i]].img + '.webp';
            });
        }
        choisirClasse(id) { // un seul gestionnaire par bouton (correctif 2)
            const nom = id === 'btnIgnore' ? 'IGNORER' : this.$('#' + id).dataset.classe;
            this.m.joueur.choisirClasse(nom);
            this.$('#menuClasse').hidden = true;
            this.majHUD();
        }

        fermerMenuDeroulant() {
            const dd = this.$('.si-dropdown');
            dd.hidden = true;
            this.$('[data-act="menuParams"]').setAttribute('aria-expanded', 'false');
        }

        clic(e) {
            const b = e.target.closest('[data-act]');
            if (!b) return;
            const m = this.m;
            switch (b.dataset.act) {
                case 'menuParams': {
                    const dd = this.$('.si-dropdown');
                    dd.hidden = !dd.hidden;
                    b.setAttribute('aria-expanded', String(!dd.hidden));
                    break;
                }
                case 'jouer': // btnJouer_Click
                    this.$('#menuAccueil').hidden = true;
                    if (m.jeuLance) {
                        this.$('#txtPause').hidden = true;
                        m.pause();
                    } else {
                        m.initJeu();
                        this.$('#btnJouer').textContent = t('jouer');
                    }
                    m.canvas.focus({ preventScroll: true });
                    break;
                case 'ouvrirParams': this.$('#menuAccueil').hidden = true; this.$('#spParametres').hidden = false; break;
                case 'retourParams': this.$('#spParametres').hidden = true; this.$('#menuAccueil').hidden = false; break;
                case 'audio': this.fermerMenuDeroulant(); this.dialogueAudio(); break;
                case 'bateau': this.fermerMenuDeroulant(); this.dialogueBateau(); break;
                case 'quitter': this.fermerMenuDeroulant(); this.confirmerQuitter(); break;
                case 'amelio': // btnAmeliorations_Click
                    m.joueur.nouveauNiveau = false;
                    this.menuActif = !this.menuActif;
                    this.$('#spAmelio').hidden = !this.menuActif;
                    this.$('#btnAmeliorations').textContent = t(this.menuActif ? 'fermer' : 'ameliorations');
                    this.majHUD();
                    break;
                case 'amVie': if (m.joueur.points > 0) { m.joueur.vieMax += K.AMELIO_VIE_MAX; m.joueur.points--; } this.majHUD(); break;
                case 'amDegats': if (m.joueur.points > 0) { m.joueur.degatsTir += K.AMELIO_DEGATS; m.joueur.points--; } this.majHUD(); break;
                case 'amVitesse':
                    if (m.joueur.points > 0) { m.joueur.vitesseMax = Math.round((m.joueur.vitesseMax + K.AMELIO_VITESSE) * 10) / 10; m.joueur.points--; }
                    this.majHUD(); break;
                case 'amIle':
                    if (m.joueur.points > 0) { m.ile.vieMax += K.AMELIO_VIE_ILE; m.ile.vie += K.AMELIO_VIE_ILE; m.joueur.points--; }
                    this.majHUD(); break;
                case 'rejouer': this.$('#spMenuFin').hidden = true; m.rejouer(); break;
            }
        }

        // Escape → menu pause (Fenetre_KeyDown)
        ouvrirPause() {
            this.$('#menuAccueil').hidden = false;
            this.$('#menuAccueil').classList.add('si-ecran-pause');
            this.$('#txtPause').hidden = false;
            this.$('#btnJouer').textContent = t('retourJeu');
            this.m.pause();
        }

        // ---- Fenêtres de dialogue (Window.ShowDialog) ----
        fenetre(titre, contenu, largeur) {
            const md = this.$('#siModal');
            md.hidden = false;
            md.innerHTML = `<div class="si-win" role="dialog" aria-modal="true" aria-label="${titre}" style="width:${largeur}px">
                <div class="si-win-titre"><span>${titre}</span><button type="button" class="si-win-x" aria-label="${t('annuler')}">✕</button></div>
                <div class="si-win-corps">${contenu}</div></div>`;
            md.querySelector('.si-win-x').addEventListener('click', () => this.fermerFenetre());
            return md;
        }
        fermerFenetre() {
            const md = this.$('#siModal');
            md.hidden = true; md.innerHTML = ''; this.dialogue = null;
        }

        dialogueAudio() { // DialogueAudio
            const ouvrir = () => {
                const md = this.fenetre(t('fenAudio'), `
                    <div class="si-audio">
                      <label>${t('musique')}<input type="range" min="0" max="1" step="0.01" id="SlideMusique"></label><button type="button" class="si-wpf si-wpf-mini" id="btnMusique">${t('suivant')}</button>
                      <label>${t('son')}<input type="range" min="0" max="1" step="0.01" id="SlideSon"></label><button type="button" class="si-wpf si-wpf-mini" id="btnSon">${t('suivant')}</button>
                    </div>
                    <button type="button" class="si-wpf si-wpf-valider" id="btnAppliquer">${t('appliquer')}</button>`, 400);
                const sm = md.querySelector('#SlideMusique'), ss = md.querySelector('#SlideSon');
                sm.value = Sons.volumeMusique;
                ss.value = Sons.volumeSon; // correctif 3
                md.querySelector('#btnMusique').addEventListener('click', () => Sons.musiqueSuivante());
                md.querySelector('#btnSon').addEventListener('click', () => Sons.sonSuivant());
                md.querySelector('#btnAppliquer').addEventListener('click', () => {
                    Sons.volumeMusique = +sm.value;
                    Sons.volumeSon = +ss.value;
                    this.fermerFenetre();
                });
            };
            this.dialogue = ouvrir;
            ouvrir();
        }

        dialogueBateau() { // DialogueChangerBateau
            let num = this.m.numBateau;
            const ouvrir = () => {
                const md = this.fenetre(t('fenBateau'), `
                    <div class="si-choixbateau">
                      <button type="button" class="si-wpf si-fleche" id="btnGauche" aria-label="&lt;">&lt;</button>
                      <img id="imgBateau" src="" alt="" width="66" height="113">
                      <button type="button" class="si-wpf si-fleche" id="btnDroite" aria-label="&gt;">&gt;</button>
                    </div>
                    <button type="button" class="si-wpf si-wpf-valider" id="btnValider">${t('appliquer')}</button>`, 800);
                const img = md.querySelector('#imgBateau');
                const maj = () => { img.src = IMG_BASE + 'bateau_' + (num + 1) + '.webp'; };
                maj();
                md.querySelector('#btnDroite').addEventListener('click', () => { num = (num + 1) % 4; maj(); });
                md.querySelector('#btnGauche').addEventListener('click', () => { num = (num + 3) % 4; maj(); });
                md.querySelector('#btnValider').addEventListener('click', () => {
                    this.m.joueur.img = this.m.img.joueurs[num];
                    this.m.numBateau = num;
                    this.fermerFenetre();
                });
            };
            this.dialogue = ouvrir;
            ouvrir();
        }

        confirmerQuitter() { // FermerJeu → MessageBox OK/Annuler
            const ouvrir = () => {
                const md = this.fenetre(t('fenFermer'), `<p class="si-msg">${t('confirmerQuitter')}</p>
                    <div class="si-msg-boutons"><button type="button" class="si-wpf" id="btnOk">${t('ok')}</button><button type="button" class="si-wpf" id="btnAnnuler">${t('annuler')}</button></div>`, 360);
                md.querySelector('#btnOk').addEventListener('click', () => { window.location.href = this.m.stage.dataset.quitter || 'sae101.html'; });
                md.querySelector('#btnAnnuler').addEventListener('click', () => this.fermerFenetre());
            };
            this.dialogue = ouvrir;
            ouvrir();
        }
    }

    // ---- Entrées (Fenetre_KeyDown/KeyUp, Mouse…) ---------------------------
    function brancherEntrees(m) {
        const st = m.stage, cv = m.canvas;
        // Comme en WPF, un clic sur un bouton ou une fenêtre n'atteint pas la fenêtre de jeu.
        const surInterface = e => !!e.target.closest('button, input, label, .si-win, .si-menubar, .si-amelio, .si-menuclasse, .si-modal');
        const posMonde = e => {
            const r = cv.getBoundingClientRect();
            return [m.cam.x + e.clientX - r.left, m.cam.y + e.clientY - r.top]; // e.GetPosition(carte)
        };
        st.addEventListener('contextmenu', e => e.preventDefault());
        st.addEventListener('pointerdown', () => Sons.demarrer(), { capture: true });
        st.addEventListener('mousedown', e => {
            if (surInterface(e) || !m.peutJouer()) return;
            if (e.button === 0) m.joueur.canon = true;   // Fenetre_MouseLeftButtonDown
            if (e.button === 2) m.joueur.deplacement = true; // Fenetre_MouseRightButtonDown
            e.preventDefault();
        });
        window.addEventListener('mouseup', e => {
            if (!m.peutJouer()) return;
            if (e.button === 0) m.joueur.canon = false;
            if (e.button === 2) m.joueur.deplacement = false;
        });
        st.addEventListener('mousemove', e => { // Fenetre_MouseMove
            if (m.peutJouer()) m.joueur.orienterVers(...posMonde(e));
        });
        window.addEventListener('keydown', e => {
            if (e.target.closest && e.target.closest('input, textarea, select')) return;
            if (!m.peutJouer() || !m.stage.isConnected) return;
            const k = e.key.toLowerCase();
            if (k === 'z') { m.joueur.deplacement = true; e.preventDefault(); }
            if (k === 'g') m.joueur.triche = true; // mode triche du jeu d'origine
            if (k === 'escape') { m.ui.ouvrirPause(); e.preventDefault(); }
        });
        window.addEventListener('keyup', e => {
            if (m.peutJouer() && e.key.toLowerCase() === 'z') m.joueur.deplacement = false;
        });
    }

    // ---- Démarrage ---------------------------------------------------------
    const SI = {
        moteur: null,
        setLang(l) { lang = TXT[l] ? l : 'fr'; if (this.moteur) this.moteur.ui.textes(); },
        start(stage) {
            stage.insertAdjacentHTML('beforeend', '<div class="si-chargement" id="siBoot">' + t('loading') + '</div>');
            Sons.init();
            chargerImages().then(img => {
                stage.querySelector('#siBoot').remove();
                this.moteur = new MoteurJeu(stage, img);
                brancherEntrees(this.moteur);
            }).catch(err => {
                stage.querySelector('#siBoot').textContent = 'Erreur de chargement : ' + err.message;
            });
        }
    };
    window.SurvivalIsland = SI;
})();
