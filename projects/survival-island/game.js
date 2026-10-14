/*
 * Survival Island — portage web de la SAE 1.01 (C# / WPF, BUT Informatique S1).
 * https://github.com/ForWarZz/Survival-Island
 *
 * Ce fichier reprend la structure et les règles du code C# d'origine :
 * MoteurJeu (boucle à temps delta), GestionCarte (génération aléatoire validée),
 * GestionVagues (minuteur de 20 s, vagues croissantes), Bateau / Joueur / Ennemi,
 * Collision (rectangles orientés, test du segment avant), mêmes constantes.
 * Le rendu WPF (Canvas + Image + RotateTransform) devient un Canvas 2D HTML.
 */
(() => {
    'use strict';

    // ---- Constante.cs ----------------------------------------------------
    const K = {
        NOMBRE_CARREAUX_MER: 32,
        TAILLE_CARREAU: 128,
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
        MULTIPLICATEUR_TAILLE_COFFRE: 0.5, APPARITION_COFFRE_INTERVAL: 12,
        HAUTEUR_BARRE_VIE: 10,
        RAYON_DETECTION_JOUEUR: 300, MARGE_APPARITION_ENNEMI: 500, TOLERANCE_CIBLE_ENNEMI: 100,
        DISTANCE_EVASION: 100,
        TEMPS_ENTRE_VAGUE: 20, VAGUE_MIN_ENNEMI: 1, VAGUE_MAX_ENNEMI: 8,
        VIE_BASE_ENNEMI: 100, MULTIPLICATEUR_VIE_ENNEMI: 2,
        DEGATS_BASE_ENNEMI: 10, RECOMPENSE_EXP_ENNEMI_TUE: 25,
        TEMPS_RECHARGEMENT_MIN_ENNEMI: 1.0, TEMPS_RECHARGEMENT_BASE_ENNEMI: 1.0,
        TEMPS_RECHARGEMENT_MULTIPLICATEUR_ENNEMI: 3.0
    };
    const MONDE = K.NOMBRE_CARREAUX_MER * K.TAILLE_CARREAU; // 4096 px

    // Modes de tir : [nombre de boulets, angle total, rechargement, bonus (dégâts ou espacement), taille]
    // Les champs et la façon de les appliquer suivent Joueur.ChoisirClasse().
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
    const ARBRE = {
        CLASSIQUE: ['QUATRE', 'POMPE', 'DOUBLE'],
        QUATRE: ['OCTOPUS', 'QUATRO+', 'EVENTAILLE'],
        DOUBLE: ['TRIO', 'MEGA', 'EVENTAILLE'],
        POMPE: ['SNIPER', 'MK30', 'EVENTAILLE']
    };

    // ---- Textes ----------------------------------------------------------
    const TXT = {
        fr: {
            loading: 'Chargement des sprites…', play: 'Jouer', resume: 'Reprendre', restart: 'Recommencer',
            menu: 'Menu principal', boat: 'Choisis ton bateau', sound: 'Son', on: 'activé', off: 'coupé',
            paused: 'Pause', boatHp: 'Bateau', islandHp: 'Île', wave: 'Vague', alive: 'Pirates en vie',
            sunk: 'Coulés', upgrades: 'Améliorations', close: 'Fermer', level: 'Niveau', points: 'Points',
            upLife: 'Vie max du bateau', upDmg: 'Dégâts', upSpeed: 'Vitesse', upIsland: "Vie de l'île",
            classTitle: 'Nouvelle classe de tir !', classSub: 'Choisis comment ton canon évolue.',
            ignore: 'Ignorer pour l’instant', respawn: 'Ton bateau a coulé ! Réapparition dans {0}\u00a0s',
            over: "L'île est tombée…", deaths: 'Morts', survived: 'Vagues survécues', best: 'Record',
            newBest: 'Nouveau record !', autoFire: 'Tir auto', fullscreen: 'Plein écran',
            waitMsg: 'Va chercher des trésors pour te soigner. Les ennemis arrivent dans {0}\u00a0s\u00a0!',
            goMsg: "Les ennemis arrivent. Protège l'île à tout prix\u00a0!",
            bestWave: 'Record : vague {0}', bestNone: 'Pas encore de record',
            help: 'Souris : viser · Clic gauche : tirer · Z ou clic droit : avancer · E : améliorations · Échap : pause',
            helpTouch: 'Doigt maintenu : viser et avancer · Bouton Tir auto : tirer en continu',
            modes: {
                QUATRE: '4 boulets en croix', POMPE: '3 boulets resserrés', DOUBLE: '2 boulets parallèles',
                OCTOPUS: '8 boulets tout autour', 'QUATRO+': '4 gros boulets, +10 dégâts, tir rapide',
                EVENTAILLE: '6 boulets en éventail', TRIO: '3 boulets parallèles', MEGA: '1 boulet géant, +20 dégâts',
                SNIPER: '1 boulet, +40 dégâts, recharge lente', MK30: '5 boulets, +20 dégâts, tir rapide'
            }
        },
        en: {
            loading: 'Loading sprites…', play: 'Play', resume: 'Resume', restart: 'Restart',
            menu: 'Main menu', boat: 'Pick your ship', sound: 'Sound', on: 'on', off: 'off',
            paused: 'Paused', boatHp: 'Ship', islandHp: 'Island', wave: 'Wave', alive: 'Pirates alive',
            sunk: 'Sunk', upgrades: 'Upgrades', close: 'Close', level: 'Level', points: 'Points',
            upLife: 'Ship max HP', upDmg: 'Damage', upSpeed: 'Speed', upIsland: 'Island HP',
            classTitle: 'New firing class!', classSub: 'Choose how your cannon evolves.',
            ignore: 'Not now', respawn: 'Your ship sank! Respawning in {0} s',
            over: 'The island has fallen…', deaths: 'Deaths', survived: 'Waves survived', best: 'Best',
            newBest: 'New record!', autoFire: 'Auto fire', fullscreen: 'Fullscreen',
            waitMsg: 'Go grab treasure to heal up. Enemies arrive in {0} s!',
            goMsg: 'The enemies are here. Protect the island at all costs!',
            bestWave: 'Best: wave {0}', bestNone: 'No record yet',
            help: 'Mouse: aim · Left click: fire · Z or right click: sail · E: upgrades · Esc: pause',
            helpTouch: 'Hold a finger: aim and sail · Auto fire button: keep firing',
            modes: {
                QUATRE: '4 balls in a cross', POMPE: '3 tight balls', DOUBLE: '2 parallel balls',
                OCTOPUS: '8 balls all around', 'QUATRO+': '4 big balls, +10 damage, fast reload',
                EVENTAILLE: '6 balls in a fan', TRIO: '3 parallel balls', MEGA: '1 giant ball, +20 damage',
                SNIPER: '1 ball, +40 damage, slow reload', MK30: '5 balls, +20 damage, fast reload'
            }
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
    const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
    };

    // ---- Collision.cs : rectangle orienté --------------------------------
    class Collision {
        constructor(x, y, w, h, angle = 0) {
            const cx = x + w / 2, cy = y + h / 2;
            const r = angle * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
            const rot = (px, py) => {
                const dx = px - cx, dy = py - cy;
                return [cx + dx * c - dy * s, cy + dx * s + dy * c];
            };
            this.cx = cx; this.cy = cy;
            this.r = Math.hypot(w, h) / 2;
            this.k = [rot(x, y), rot(x + w, y), rot(x + w, y + h), rot(x, y + h)];
            const xs = this.k.map(p => p[0]), ys = this.k.map(p => p[1]);
            this.minX = Math.min(...xs); this.maxX = Math.max(...xs);
            this.minY = Math.min(...ys); this.maxY = Math.max(...ys);
        }
        seg(i) { return [this.k[i], this.k[(i + 1) % 4]]; }
        static inter(a1, a2, b1, b2) {
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
        contient(p) { return p[0] >= this.minX && p[0] <= this.maxX && p[1] >= this.minY && p[1] <= this.maxY; }
        // EnCollisionAvec : segments qui se croisent ou coin contenu
        touche(o) {
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
        // CollisionDevantAvec : seul le segment avant (la proue) est testé
        devant(o) {
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
    class Entite {
        constructor(x, y, w, h, angle = 0) {
            this.x = x; this.y = y; this.w = w; this.h = h; this.angle = angle;
            this.col = new Collision(x, y, w, h, angle); // entités statiques : collision figée
            this.cache = false;
        }
        get cx() { return this.x + this.w / 2; }
        get cy() { return this.y + this.h / 2; }
    }

    class AvecVie extends Entite {
        constructor(x, y, w, h, vieMax) {
            super(x, y, w, h);
            this.vie = this.vieMax = vieMax;
            this.barre = false;
        }
        degats(n) { // InfligerDegats → true si détruit
            this.vie = Math.max(0, this.vie - n);
            this.barre = true;
            return this.vie <= 0;
        }
    }

    class Bateau {
        constructor(jeu, img, couleur, vieMax, degats, vitesse, rechargement) {
            this.jeu = jeu; this.img = img; this.couleur = couleur;
            this.w = K.LARGEUR_NAVIRE; this.h = K.HAUTEUR_NAVIRE;
            this.x = 0; this.y = 0;
            this.vie = this.vieMax = vieMax;
            this.degatsTir = degats; this.vitesseMax = vitesse; this.vitesse = 0;
            this.rechargement = rechargement; this.dernierTir = 0;
            this.deplacement = false; this.canon = false;
            this.angle = 0; this.angleCible = 0; this.ox = 0; this.oy = 1;
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
        orienterVers(px, py) {
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
        tirer() { // Bateau.TirerBoulet()
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

    class Joueur extends Bateau {
        constructor(jeu, img) {
            super(jeu, img, '#111', K.JOUEUR_VIE_MAX, K.JOUEUR_DEGATS, K.JOUEUR_VITESSE, K.JOUEUR_RECHARGEMENT_CANON);
            this.niveau = 1; this.xp = 0; this.xpMax = K.JOUEUR_EXPERIENCE_MAX_N1;
            this.points = 0; this.nouveauNiveau = false;
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
        quandTir() { Son.tir(); }
        ajouterExperience(n) {
            this.xp += n;
            if (this.xp >= this.xpMax) this.niveauSuivant();
            this.jeu.ui.majTout();
        }
        niveauSuivant() {
            this.nouveauNiveau = true;
            this.points++;
            this.niveau++;
            this.xp = 0;
            this.xpMax = Math.trunc(this.xpMax * K.MULTIPLICATEUR_NIVEAU);
            Son.niveau();
            // Classe de tir : niveau 5 depuis CLASSIQUE, niveau 15 pour la 2e évolution.
            if ((this.mode === 'CLASSIQUE' && this.niveau >= 5) || (this.classe === 1 && this.niveau >= 15))
                this.jeu.ui.ouvrirClasses();
        }
        choisirClasse(nom) {
            const m = MODES[nom];
            this.mode = nom;
            this.nb = m.n; this.angleBoulets = m.angle; this.rechargement = m.reload;
            this.degatsTir = Math.trunc(this.degatsTir / m.n) * 2 + (m.bonus || 0);
            if ('gap' in m) this.espacement = m.gap;
            if (m.size) this.tailleBoulets = m.size;
            this.classe = (this.classe || 0) + 1;
        }
        ajouterVie(n) { this.vie = Math.min(this.vieMax, this.vie + n); }
    }

    class Ennemi extends Bateau {
        constructor(jeu, vie, degats, vitesse, rechargement) {
            super(jeu, jeu.img.ennemi, '#d62828', vie, degats, vitesse, rechargement);
            this.joueurDansRayon = false;
            this.caches = [];
            this.orientationEnCours = false; this.orientationFinaleEnCours = false;
        }
        definirCible(px, py, fx, fy) {
            this.cible = [px, py]; this.cibleActuelle = [px, py]; this.finale = [fx, fy];
        }
        deplacer(dt) { // Ennemi.Deplacer()
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
            // Les obstacles traversés réapparaissent quand le pirate s'est éloigné
            for (let i = this.caches.length - 1; i >= 0; i--) {
                const o = this.caches[i];
                if (dist(this.x, this.y, o.x, o.y) > K.DISTANCE_EVASION) { o.cache = false; this.caches.splice(i, 1); }
            }
        }
        verifierJoueur() {
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
            if (!j.joueur.mort && c.touche(j.joueur.collision())) return false;
            for (const o of [...j.rochers, ...j.coffres]) {
                if (c.devant(o.col)) { // le pirate passe « par-dessus » et masque l'obstacle
                    if (!o.cache) { o.cache = true; this.caches.push(o); }
                    return true;
                }
            }
            return true;
        }
    }

    // ---- Sons (WebAudio, générés) ------------------------------------------
    const Son = {
        ctx: null, actif: store.get('si-sound') !== 'off', dernier: 0,
        init() {
            if (this.ctx || !this.actif) return;
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) this.ctx = new AC();
        },
        bruit(duree, freq, vol) {
            if (!this.actif || !this.ctx) return;
            const c = this.ctx, n = Math.floor(c.sampleRate * duree);
            const buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
            for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5);
            const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
            src.buffer = buf; f.type = 'lowpass'; f.frequency.value = freq; g.gain.value = vol;
            src.connect(f).connect(g).connect(c.destination); src.start();
        },
        ton(notes, type = 'triangle', vol = 0.08) {
            if (!this.actif || !this.ctx) return;
            const c = this.ctx;
            notes.forEach((fr, i) => {
                const o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + i * 0.08;
                o.type = type; o.frequency.value = fr;
                g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
                o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + 0.2);
            });
        },
        tir() { const now = performance.now(); if (now - this.dernier < 60) return; this.dernier = now; this.bruit(0.25, 900, 0.35); },
        coule() { this.bruit(0.7, 400, 0.5); },
        coffre() { this.ton([660, 880]); },
        niveau() { this.ton([523, 659, 784, 1046], 'square', 0.05); },
        alerte() { this.ton([220, 196], 'sawtooth', 0.05); }
    };

    // ---- Moteur ----------------------------------------------------------
    const IMG_BASE = (document.currentScript && document.currentScript.src)
        ? document.currentScript.src.replace(/game\.js(\?.*)?$/, 'img/') : 'survival-island/img/';

    function chargerImages() {
        const noms = ['bateau_1', 'bateau_2', 'bateau_3', 'bateau_4', 'bateau_ennemi', 'ile', 'ile_cassee',
            'mer', 'tresor', 'rocher_1', 'rocher_2', 'rocher_3', ...Object.values(MODES).map(m => m.img)];
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

    class Jeu {
        constructor(stage, img) {
            this.stage = stage; this.img = img;
            this.canvas = stage.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.mer = this.ctx.createPattern(img.mer, 'repeat');
            this.numBateau = Math.min(3, Math.max(0, parseInt(store.get('si-boat') || '0', 10) || 0));
            this.etat = 'menu'; // menu | jeu | pause | fin
            this.pointeur = null; this.cam = { x: (MONDE - 1600) / 2, y: (MONDE - 900) / 2 };
            this.minicarte = true; this.tirAuto = false; this.toucheAvance = false; this.toucheTir = false;
            this.ui = new UI(this);
            this.taille();
            this.nouvellePartie(true);
            new ResizeObserver(() => this.taille()).observe(stage);
            this.dernier = performance.now();
            requestAnimationFrame(ts => this.boucle(ts));
        }

        taille() {
            const r = this.canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.cw = r.width; this.ch = r.height; this.dpr = dpr;
            this.canvas.width = Math.round(r.width * dpr); this.canvas.height = Math.round(r.height * dpr);
            // Surface de mer visible constante (~1600×900 px du monde), quel que soit l'écran
            this.echelle = Math.sqrt((r.width * r.height) / (1600 * 900)) || 1;
            this.vw = r.width / this.echelle; this.vh = r.height / this.echelle;
        }

        // MoteurJeu.InitJeu()
        nouvellePartie(decor = false) {
            this.boulets = []; this.coffres = []; this.ennemis = []; this.rochers = [];
            const ile = new AvecVie(MONDE / 2 - 256, MONDE / 2 - 256, 512, 512, K.ILE_VIE_MAX);
            ile.rayonEnnemi = (512 + K.MARGE_ILE) / 2;
            this.ile = ile;
            this.joueur = new Joueur(this, this.img.joueurs[this.numBateau]);
            this.vague = { num: 0, secondes: K.TEMPS_ENTRE_VAGUE, enCours: false, acc: 0 };
            this.accCoffre = 0;
            for (let i = 0; i < K.NOMBRE_ROCHERS_CARTE; i++) {
                const im = this.img.rochers[randInt(0, 3)];
                const m = K.MULTIPLICATEUR_TAILLE_ROCHER + rnd();
                const w = im.width * m, h = im.height * m, a = randInt(0, 361);
                const p = this.positionAleatoire(w, h, a);
                const r = new Entite(p[0], p[1], w, h, a); r.img = im;
                this.rochers.push(r);
            }
            const p = this.positionAleatoire(K.LARGEUR_NAVIRE, K.HAUTEUR_NAVIRE);
            this.joueur.x = p[0]; this.joueur.y = p[1];
            this.centrerCamera();
            if (!decor) { this.etat = 'jeu'; this.messageVague(); }
            this.ui.majTout();
        }

        // GestionCarte.GenererPositionAleatoire()
        positionAleatoire(w, h, angle = 0, marge = 0) {
            for (let essai = 0; essai < 2000; essai++) {
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

        centrerCamera() {
            const j = this.joueur;
            this.cam.x = clamp(j.cx - this.vw / 2, 0, Math.max(0, MONDE - this.vw));
            this.cam.y = clamp(j.cy - this.vh / 2, 0, Math.max(0, MONDE - this.vh));
        }

        // ---- GestionVagues ----
        messageVague() {
            this.ui.statut(this.vague.enCours ? t('goMsg') : t('waitMsg', this.vague.secondes), this.vague.enCours);
        }
        tickVague() {
            const v = this.vague;
            v.secondes--;
            if (v.secondes <= 0) {
                v.num++;
                v.enCours = true;
                v.secondes = K.TEMPS_ENTRE_VAGUE;
                this.lancerVague();
                Son.alerte();
            }
            this.messageVague();
            this.ui.majTout();
        }
        lancerVague() { // GestionVagues.AjouterVague()
            const n = this.vague.num;
            const nombre = Math.min(K.VAGUE_MIN_ENNEMI + n, K.VAGUE_MAX_ENNEMI);
            const vie = K.VIE_BASE_ENNEMI + n * K.MULTIPLICATEUR_VIE_ENNEMI;
            const degats = K.DEGATS_BASE_ENNEMI + n;
            const recharge = Math.max(K.TEMPS_RECHARGEMENT_MIN_ENNEMI,
                K.TEMPS_RECHARGEMENT_BASE_ENNEMI - n * K.TEMPS_RECHARGEMENT_MULTIPLICATEUR_ENNEMI);
            for (let i = 0; i < nombre; i++) {
                const e = new Ennemi(this, vie, degats, K.JOUEUR_VITESSE, recharge);
                const p = this.positionAleatoire(e.w, e.h, 0, K.MARGE_APPARITION_ENNEMI);
                e.x = p[0]; e.y = p[1];
                this.ennemis.push(e);
                // Point d'arrivée : intersection du cercle autour de l'île avec la droite pirate → île
                let dx = this.ile.cx - e.cx, dy = this.ile.cy - e.cy;
                const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
                e.definirCible(this.ile.cx - dx * this.ile.rayonEnnemi, this.ile.cy - dy * this.ile.rayonEnnemi, this.ile.cx, this.ile.cy);
                e.deplacement = true;
            }
        }

        // MoteurJeu.GenererBonus()
        genererCoffres() {
            const q = randInt(K.BORNE_MIN_APPARITION_COFFRE, K.BORNE_MAX_APPARITION_COFFRE);
            const n = Math.min(q, K.BORNE_MAX_APPARITION_COFFRE - this.coffres.length);
            for (let i = 0; i < n; i++) {
                const m = K.MULTIPLICATEUR_TAILLE_COFFRE + rnd();
                const w = Math.trunc(K.BASE_COFFRE_LARGEUR * m), h = Math.trunc(K.BASE_COFFRE_HAUTEUR * m);
                const p = this.positionAleatoire(w, h);
                const c = new AvecVie(p[0], p[1], w, h, K.BASE_COFFRE_VIE);
                c.xp = Math.trunc(K.BASE_COFFRE_EXPERIENCE * m);
                c.soin = rnd() < K.BASE_COFFRE_PROBA_VIE ? Math.trunc(K.BASE_COFFRE_VIE * m) : 0;
                this.coffres.push(c);
            }
        }

        // ---- Boucle (MoteurJeu.Jeu) ----
        boucle(ts) {
            const dt = Math.min(0.05, (ts - this.dernier) / 1000);
            this.dernier = ts;
            if (this.etat === 'jeu') this.maj(dt);
            this.dessiner();
            requestAnimationFrame(t2 => this.boucle(t2));
        }

        maj(dt) {
            const j = this.joueur;
            if (this.pointeur && !j.mort) {
                j.orienterVers(this.cam.x + this.pointeur[0] / this.echelle, this.cam.y + this.pointeur[1] / this.echelle);
            }
            j.deplacement = this.toucheAvance || this.pointeurAvance;
            j.canon = this.toucheTir || this.pointeurTir || this.tirAuto;

            if (!j.mort) { j.deplacer(dt); j.miseAJourRotation(dt); this.centrerCamera(); }

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

            // Minuteurs (DispatcherTimer → accumulateurs en temps de jeu)
            if (!this.vague.enCours) {
                this.vague.acc += dt;
                while (this.vague.acc >= 1 && this.etat === 'jeu') { this.vague.acc -= 1; this.tickVague(); }
            }
            this.accCoffre += dt;
            if (this.accCoffre >= K.APPARITION_COFFRE_INTERVAL) { this.accCoffre -= K.APPARITION_COFFRE_INTERVAL; this.genererCoffres(); }

            if (j.mort) {
                j.reapparition -= dt;
                this.ui.reapparition(Math.ceil(j.reapparition));
                if (j.reapparition <= 0) {
                    const p = this.positionAleatoire(j.w, j.h);
                    j.x = p[0]; j.y = p[1]; j.vie = j.vieMax; j.mort = false; j.vitesse = 0;
                    this.ui.reapparition(0);
                    this.centrerCamera();
                    this.ui.majTout();
                }
            }
        }

        deplacerBoulets(dt) {
            for (let i = this.boulets.length - 1; i >= 0; i--) {
                const b = this.boulets[i];
                b.x += b.dx * K.VITESSE_BOULET * dt;
                b.y += b.dy * K.VITESSE_BOULET * dt;
                if (b.x < 0 || b.y < 0 || b.x > MONDE + b.s || b.y > MONDE + b.s) this.boulets.splice(i, 1);
            }
        }

        collisionsBoulets() { // MoteurJeu.CheckBouletsCollisions()
            const j = this.joueur, morts = new Set();
            for (const b of this.boulets) {
                const c = new Collision(b.x, b.y, b.s, b.s);
                const parJoueur = b.tireur === j;
                if (this.rochers.some(o => c.touche(o.col))) { morts.add(b); continue; }
                if (c.touche(this.ile.col)) {
                    if (!parJoueur) this.toucherIle(b.tireur.degatsTir);
                    morts.add(b); continue;
                }
                const ic = this.coffres.findIndex(o => c.touche(o.col));
                if (ic >= 0) {
                    const o = this.coffres[ic];
                    if (o.degats(j.degatsTir)) {
                        if (parJoueur) { j.ajouterExperience(o.xp); j.ajouterVie(o.soin); Son.coffre(); }
                        this.coffres.splice(ic, 1);
                    }
                    morts.add(b); continue;
                }
                if (!parJoueur && !j.mort && j.collision().touche(c)) {
                    j.vie = Math.max(0, j.vie - b.tireur.degatsTir);
                    if (j.vie <= 0) this.joueurCoule();
                    morts.add(b); this.ui.majTout(); continue;
                }
                if (parJoueur) {
                    const ie = this.ennemis.findIndex(e => e.collision().touche(c));
                    if (ie >= 0) {
                        const e = this.ennemis[ie];
                        e.vie = Math.max(0, e.vie - j.degatsTir); e.barre = true;
                        if (e.vie <= 0) {
                            e.caches.forEach(o => { o.cache = false; });
                            this.ennemis.splice(ie, 1);
                            j.coules++;
                            Son.coule();
                            j.ajouterExperience(K.RECOMPENSE_EXP_ENNEMI_TUE);
                            if (this.ennemis.length === 0 && this.vague.enCours) {
                                this.vague.enCours = false; this.vague.acc = 0; this.messageVague();
                            }
                        }
                        morts.add(b);
                    }
                }
            }
            if (morts.size) this.boulets = this.boulets.filter(b => !morts.has(b));
        }

        toucherIle(n) {
            if (this.ile.degats(n)) this.terminer();
            this.ui.majTout();
        }
        joueurCoule() {
            const j = this.joueur;
            j.mort = true; j.morts++; j.reapparition = K.TEMPS_REAPPARITION; j.vitesse = 0;
            Son.coule();
            this.ui.reapparition(K.TEMPS_REAPPARITION);
        }
        terminer() { // MoteurJeu.TerminerJeu()
            this.etat = 'fin';
            const survecues = Math.max(0, this.vague.num - 1);
            const record = parseInt(store.get('best-survival') || '0', 10) || 0;
            const nouveau = survecues > record;
            if (nouveau) store.set('best-survival', String(survecues));
            this.ui.fin(this.joueur.morts, this.joueur.coules, survecues, nouveau);
        }

        pause(on) {
            if (on && this.etat === 'jeu') { this.etat = 'pause'; this.pointeurAvance = this.pointeurTir = this.toucheAvance = this.toucheTir = false; this.ui.menu('pause'); }
            else if (!on && this.etat === 'pause') { this.etat = 'jeu'; this.ui.menu(null); }
        }

        // ---- Rendu ----
        dessiner() {
            const c = this.ctx, s = this.echelle * this.dpr, cam = this.cam;
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.clearRect(0, 0, this.canvas.width, this.canvas.height);
            c.setTransform(s, 0, 0, s, -cam.x * s, -cam.y * s);
            c.fillStyle = this.mer;
            c.fillRect(cam.x, cam.y, this.vw, this.vh);

            const vis = (x, y, w, h) => x + w > cam.x - 60 && y + h > cam.y - 60 && x < cam.x + this.vw + 60 && y < cam.y + this.vh + 60;
            const ile = this.ile;
            c.drawImage(ile.vie <= ile.vieMax / 4 ? this.img.ile_cassee : this.img.ile, ile.x, ile.y, ile.w, ile.h);

            for (const r of this.rochers) {
                if (r.cache || !vis(r.x, r.y, r.w, r.h)) continue;
                c.save(); c.translate(r.cx, r.cy); c.rotate(r.angle * Math.PI / 180);
                c.drawImage(r.img, -r.w / 2, -r.h / 2, r.w, r.h); c.restore();
            }
            for (const o of this.coffres) {
                if (o.cache || !vis(o.x, o.y, o.w, o.h)) continue;
                c.drawImage(this.img.tresor, o.x, o.y, o.w, o.h);
                if (o.barre) this.barre(o.x + o.w / 4, o.y + o.h, o.w / 2, o.vie / o.vieMax);
            }
            const bateau = b => {
                c.save(); c.translate(b.cx, b.cy); c.rotate(b.angle * Math.PI / 180);
                c.drawImage(b.img, -b.w / 2, -b.h / 2, b.w, b.h); c.restore();
            };
            for (const e of this.ennemis) {
                if (!vis(e.x, e.y, e.w, e.h)) continue;
                bateau(e);
                if (e.barre) this.barre(e.x + e.w / 4, e.y + e.h, e.w / 2, e.vie / e.vieMax);
            }
            if (!this.joueur.mort) bateau(this.joueur);
            for (const b of this.boulets) {
                if (!vis(b.x, b.y, b.s, b.s)) continue;
                c.fillStyle = b.couleur; c.beginPath(); c.arc(b.x + b.s / 2, b.y + b.s / 2, b.s / 2, 0, Math.PI * 2); c.fill();
            }
            if (this.etat !== 'menu' && this.minicarte) this.dessinerMinicarte();
        }
        barre(x, y, w, ratio) { // ProgressBar WPF sous l'entité
            const c = this.ctx;
            c.fillStyle = '#e6e6e6'; c.fillRect(x, y, w, K.HAUTEUR_BARRE_VIE);
            c.fillStyle = '#06b025'; c.fillRect(x, y, w * clamp(ratio, 0, 1), K.HAUTEUR_BARRE_VIE);
            c.strokeStyle = '#bcbcbc'; c.lineWidth = 1; c.strokeRect(x, y, w, K.HAUTEUR_BARRE_VIE);
        }
        dessinerMinicarte() {
            const c = this.ctx, d = this.dpr, taille = Math.min(150, this.cw * 0.22), m = 12;
            const x0 = (this.cw - taille - m) * d, y0 = (this.ch - taille - m) * d, k = taille * d / MONDE;
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.fillStyle = 'rgba(20, 60, 90, .55)'; c.fillRect(x0, y0, taille * d, taille * d);
            c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = d; c.strokeRect(x0, y0, taille * d, taille * d);
            const pt = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x0 + x * k, y0 + y * k, r * d, 0, Math.PI * 2); c.fill(); };
            c.fillStyle = '#7bc96f'; c.fillRect(x0 + this.ile.x * k, y0 + this.ile.y * k, this.ile.w * k, this.ile.h * k);
            this.coffres.forEach(o => pt(o.cx, o.cy, 2.2, '#ffb703'));
            this.ennemis.forEach(e => pt(e.cx, e.cy, 2.6, '#ff4d4d'));
            if (!this.joueur.mort) pt(this.joueur.cx, this.joueur.cy, 3, '#ffffff');
            c.strokeStyle = 'rgba(255,255,255,.55)';
            c.strokeRect(x0 + this.cam.x * k, y0 + this.cam.y * k, this.vw * k, this.vh * k);
        }
    }

    // ---- Interface (MainWindow.xaml) ---------------------------------------
    class UI {
        constructor(jeu) {
            this.jeu = jeu;
            const st = jeu.stage;
            this.$ = sel => st.querySelector(sel);
            st.insertAdjacentHTML('beforeend', `
<div class="si-hud" hidden>
  <div class="si-bars">
    <div class="si-bar si-bar-boat"><span class="si-bar-label" data-t="boatHp"></span><div class="si-bar-track"><div class="si-bar-fill"></div></div><span class="si-bar-val" id="siBoatVal"></span></div>
    <div class="si-bar si-bar-island"><span class="si-bar-label" data-t="islandHp"></span><div class="si-bar-track"><div class="si-bar-fill"></div></div><span class="si-bar-val" id="siIslandVal"></span></div>
  </div>
  <div class="si-wave"><div><span data-t="wave"></span> <b id="siWave">0</b></div><div><span data-t="alive"></span> <b id="siAlive">0</b></div><div><span data-t="sunk"></span> <b id="siSunk">0</b></div></div>
  <div class="si-status" id="siStatus"></div>
  <div class="si-tools">
    <button type="button" class="si-btn si-btn-small" id="siUpBtn"><span data-t="upgrades"></span><i class="si-dot" hidden></i></button>
    <button type="button" class="si-btn si-btn-small si-autofire" id="siAuto" aria-pressed="false" data-t="autoFire"></button>
    <button type="button" class="si-btn si-btn-small" id="siPauseBtn" aria-label="Pause">❚❚</button>
    <button type="button" class="si-btn si-btn-small" id="siFsBtn" aria-label="">⛶</button>
  </div>
  <div class="si-upgrades" id="siUp" hidden>
    <div class="si-up-head"><span><span data-t="level"></span> <b id="siLvl">1</b></span><span><span data-t="points"></span> <b id="siPts">0</b></span></div>
    <div class="si-xp"><div class="si-xp-fill"></div><span id="siXp"></span></div>
    <div class="si-up-row"><span data-t="upLife"></span><b id="siUpLife"></b><button type="button" class="si-plus" data-up="vie" aria-label="+">+</button></div>
    <div class="si-up-row"><span data-t="upDmg"></span><b id="siUpDmg"></b><button type="button" class="si-plus" data-up="degats" aria-label="+">+</button></div>
    <div class="si-up-row"><span data-t="upSpeed"></span><b id="siUpSpeed"></b><button type="button" class="si-plus" data-up="vitesse" aria-label="+">+</button></div>
    <div class="si-up-row"><span data-t="upIsland"></span><b id="siUpIsland"></b><button type="button" class="si-plus" data-up="ile" aria-label="+">+</button></div>
  </div>
  <div class="si-respawn" id="siRespawn" hidden></div>
</div>
<div class="si-overlay" id="siOverlay"></div>`);
            this.hudEl = this.$('.si-hud');
            this.overlay = this.$('#siOverlay');
            this.$('#siUpBtn').addEventListener('click', () => this.basculerAmelio());
            this.$('#siPauseBtn').addEventListener('click', () => jeu.pause(true));
            this.$('#siFsBtn').addEventListener('click', () => this.pleinEcran());
            this.$('#siAuto').addEventListener('click', () => {
                jeu.tirAuto = !jeu.tirAuto;
                this.$('#siAuto').setAttribute('aria-pressed', String(jeu.tirAuto));
            });
            this.$('#siUp').addEventListener('click', e => {
                const b = e.target.closest('[data-up]');
                if (b) this.ameliorer(b.dataset.up);
            });
            this.messageStatut = '';
            this.vagueActive = false;
            this.menu('accueil');
        }

        textes() {
            this.jeu.stage.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
            this.$('#siUpBtn [data-t]').textContent = t(this.$('#siUp').hidden ? 'upgrades' : 'close');
            this.$('#siFsBtn').setAttribute('aria-label', t('fullscreen'));
            this.$('#siFsBtn').title = t('fullscreen');
            if (this.jeu.etat !== 'menu') this.jeu.messageVague();
            if (this.vueMenu) this.menu(this.vueMenu, this.donneesMenu);
            this.majTout();
        }

        statut(msg, enCours) {
            const el = this.$('#siStatus');
            el.textContent = msg; el.classList.toggle('si-status-go', !!enCours);
        }

        majTout() {
            const j = this.jeu.joueur, ile = this.jeu.ile;
            if (!j) return;
            const set = (id, v) => { const el = this.$(id); if (el && el.textContent !== String(v)) el.textContent = v; };
            this.$('.si-bar-boat .si-bar-fill').style.width = (100 * j.vie / j.vieMax) + '%';
            this.$('.si-bar-island .si-bar-fill').style.width = (100 * ile.vie / ile.vieMax) + '%';
            set('#siBoatVal', `${j.vie}/${j.vieMax}`);
            set('#siIslandVal', `${ile.vie}/${ile.vieMax}`);
            set('#siWave', this.jeu.vague.num);
            set('#siAlive', this.jeu.ennemis.length);
            set('#siSunk', j.coules);
            set('#siLvl', j.niveau); set('#siPts', j.points);
            set('#siXp', `${j.xp}/${j.xpMax} XP`);
            this.$('.si-xp-fill').style.width = (100 * j.xp / j.xpMax) + '%';
            set('#siUpLife', j.vieMax); set('#siUpDmg', j.degatsTir); set('#siUpSpeed', Math.round(j.vitesseMax));
            set('#siUpIsland', ile.vieMax);
            this.$('[data-up="vitesse"]').hidden = j.vitesseMax >= K.AMELIO_VITESSE_MAX;
            this.$('#siUp').querySelectorAll('.si-plus').forEach(b => { b.disabled = j.points <= 0; });
            this.$('.si-dot').hidden = !(j.nouveauNiveau && this.$('#siUp').hidden);
        }

        basculerAmelio() {
            const p = this.$('#siUp');
            p.hidden = !p.hidden;
            this.jeu.joueur.nouveauNiveau = false;
            this.$('#siUpBtn [data-t]').textContent = t(p.hidden ? 'upgrades' : 'close');
            this.majTout();
        }

        ameliorer(type) { // Joueur.AmelioVie/Degats/Vitesse, Ile.AmelioVie
            const j = this.jeu.joueur, ile = this.jeu.ile;
            if (j.points <= 0) return;
            if (type === 'vie') j.vieMax += K.AMELIO_VIE_MAX;
            else if (type === 'degats') j.degatsTir += K.AMELIO_DEGATS;
            else if (type === 'vitesse') { if (j.vitesseMax >= K.AMELIO_VITESSE_MAX) return; j.vitesseMax = Math.round((j.vitesseMax + K.AMELIO_VITESSE) * 10) / 10; }
            else if (type === 'ile') { ile.vieMax += K.AMELIO_VIE_ILE; ile.vie += K.AMELIO_VIE_ILE; }
            j.points--;
            Son.ton([700]);
            this.majTout();
        }

        reapparition(s) {
            const el = this.$('#siRespawn');
            el.hidden = s <= 0;
            if (s > 0) el.textContent = t('respawn', s);
        }

        ouvrirClasses() {
            const j = this.jeu.joueur, choix = ARBRE[j.mode];
            if (!choix) return;
            if (this.jeu.etat === 'jeu') this.jeu.etat = 'choix'; // la partie attend le choix
            this.menu('classe', choix);
        }

        pleinEcran() {
            const st = this.jeu.stage;
            if (document.fullscreenElement) document.exitFullscreen();
            else if (st.requestFullscreen) st.requestFullscreen().catch(() => {});
        }

        record() {
            const r = parseInt(store.get('best-survival') || '0', 10) || 0;
            return r > 0 ? t('bestWave', r) : t('bestNone');
        }

        menu(vue, donnees) {
            this.vueMenu = vue; this.donneesMenu = donnees;
            const o = this.overlay, jeu = this.jeu;
            this.hudEl.hidden = vue === 'accueil' || vue === 'chargement';
            if (!vue) { o.hidden = true; o.innerHTML = ''; return; }
            o.hidden = false;
            o.className = 'si-overlay' + (vue === 'classe' ? ' si-overlay-light' : '');
            const bateaux = () => `<p class="si-label">${t('boat')}</p><div class="si-boats">${[0, 1, 2, 3].map(i =>
                `<button type="button" class="si-boat${i === jeu.numBateau ? ' is-on' : ''}" data-boat="${i}" aria-label="${t('boat')} ${i + 1}" aria-pressed="${i === jeu.numBateau}"><img src="${IMG_BASE}bateau_${i + 1}.webp" alt=""></button>`).join('')}</div>`;
            const son = `<button type="button" class="si-link" data-act="son">${t('sound')} : ${Son.actif ? t('on') : t('off')}</button>`;
            const tactile = matchMedia('(pointer: coarse)').matches;
            if (vue === 'chargement') {
                o.innerHTML = `<div class="si-card"><img class="si-logo" src="${IMG_BASE}logo.webp" alt="Survival Island"><p>${t('loading')}</p></div>`;
            } else if (vue === 'accueil') {
                o.innerHTML = `<div class="si-card"><img class="si-logo" src="${IMG_BASE}logo.webp" alt="Survival Island" width="160" height="160">
                    <button type="button" class="si-btn si-btn-big" data-act="jouer">${t('play')}</button>
                    ${bateaux()}<p class="si-help">${tactile ? t('helpTouch') : t('help')}</p>
                    <p class="si-best">${this.record()}</p>${son}</div>`;
            } else if (vue === 'pause') {
                o.innerHTML = `<div class="si-card"><div class="si-title" role="heading" aria-level="3">${t('paused')}</div>
                    <button type="button" class="si-btn si-btn-big" data-act="reprendre">${t('resume')}</button>
                    <button type="button" class="si-btn" data-act="recommencer">${t('restart')}</button>
                    <button type="button" class="si-btn" data-act="menu">${t('menu')}</button>
                    <p class="si-help">${tactile ? t('helpTouch') : t('help')}</p>${son}</div>`;
            } else if (vue === 'fin') {
                const d = donnees;
                o.innerHTML = `<div class="si-card"><div class="si-title" role="heading" aria-level="3">${t('over')}</div>
                    ${d.nouveau ? `<p class="si-new">${t('newBest')}</p>` : ''}
                    <div class="si-stats"><div><b>${d.survecues}</b><span>${t('survived')}</span></div><div><b>${d.coules}</b><span>${t('sunk')}</span></div><div><b>${d.morts}</b><span>${t('deaths')}</span></div></div>
                    <button type="button" class="si-btn si-btn-big" data-act="recommencer">${t('restart')}</button>
                    ${bateaux()}<p class="si-best">${this.record()}</p></div>`;
            } else if (vue === 'classe') {
                o.innerHTML = `<div class="si-card si-card-wide"><div class="si-title" role="heading" aria-level="3">${t('classTitle')}</div><p>${t('classSub')}</p>
                    <div class="si-classes">${donnees.map(n => `<button type="button" class="si-class" data-classe="${n}">
                        <img src="${IMG_BASE}${MODES[n].img}.webp" alt=""><b>${n}</b><span>${TXT[lang].modes[n]}</span></button>`).join('')}</div>
                    <button type="button" class="si-link" data-act="ignorer">${t('ignore')}</button></div>`;
            }
            o.onclick = e => {
                const b = e.target.closest('button'); if (!b) return;
                Son.init();
                if (b.dataset.boat) {
                    jeu.numBateau = +b.dataset.boat; store.set('si-boat', String(jeu.numBateau));
                    jeu.joueur.img = jeu.img.joueurs[jeu.numBateau];
                    this.menu(vue, donnees); return;
                }
                if (b.dataset.classe) {
                    jeu.joueur.choisirClasse(b.dataset.classe);
                    if (jeu.etat === 'choix') jeu.etat = 'jeu';
                    this.menu(null); this.majTout(); return;
                }
                switch (b.dataset.act) {
                    case 'jouer': case 'recommencer':
                        this.menu(null); this.$('#siUp').hidden = true; this.$('#siUpBtn [data-t]').textContent = t('upgrades');
                        this.reapparition(0); jeu.nouvellePartie(); jeu.canvas.focus(); break;
                    case 'reprendre': jeu.pause(false); jeu.canvas.focus(); break;
                    case 'menu': this.reapparition(0); jeu.nouvellePartie(true); jeu.etat = 'menu'; this.menu('accueil'); break;
                    case 'ignorer': if (jeu.etat === 'choix') jeu.etat = 'jeu'; this.menu(null); break;
                    case 'son': Son.actif = !Son.actif; store.set('si-sound', Son.actif ? 'on' : 'off'); Son.init(); this.menu(vue, donnees); break;
                }
            };
        }

        fin(morts, coules, survecues, nouveau) {
            this.reapparition(0);
            this.menu('fin', { morts, coules, survecues, nouveau });
        }
    }

    // ---- Entrées -----------------------------------------------------------
    function brancherEntrees(jeu) {
        const cv = jeu.canvas;
        const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        cv.addEventListener('contextmenu', e => e.preventDefault());
        const souris = e => { jeu.pointeurTir = !!(e.buttons & 1); jeu.pointeurAvance = !!(e.buttons & 2); };
        cv.addEventListener('pointerdown', e => {
            if (jeu.etat !== 'jeu') return;
            Son.init();
            cv.focus({ preventScroll: true });
            try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignoré */ }
            jeu.pointeur = pos(e);
            if (e.pointerType === 'mouse') souris(e);
            else { jeu.pointeurAvance = true; jeu.stage.classList.add('si-touch'); }
            e.preventDefault();
        });
        cv.addEventListener('pointermove', e => {
            if (e.pointerType === 'mouse') { jeu.pointeur = pos(e); if (jeu.etat === 'jeu') souris(e); }
            else if (jeu.pointeurAvance) jeu.pointeur = pos(e);
        });
        const fin = e => { if (e.pointerType === 'mouse' && e.type === 'pointerup') souris(e); else { jeu.pointeurTir = false; jeu.pointeurAvance = false; } };
        cv.addEventListener('pointerup', fin);
        cv.addEventListener('pointercancel', fin);
        cv.addEventListener('lostpointercapture', e => { if (e.pointerType !== 'mouse') jeu.pointeurAvance = false; });

        const avance = ['z', 'w', 'arrowup'];
        window.addEventListener('keydown', e => {
            if (e.target.closest && e.target.closest('input, textarea, select')) return;
            const k = e.key.toLowerCase();
            if (jeu.etat === 'pause' && (k === 'escape' || k === 'p')) { jeu.pause(false); e.preventDefault(); return; }
            if (jeu.etat !== 'jeu') return;
            if (avance.includes(k)) { jeu.toucheAvance = true; e.preventDefault(); }
            else if (k === ' ') { jeu.toucheTir = true; e.preventDefault(); }
            else if (k === 'escape' || k === 'p') { jeu.pause(true); e.preventDefault(); }
            else if (k === 'e') jeu.ui.basculerAmelio();
            else if (k === 'm') jeu.minicarte = !jeu.minicarte;
            else if (['1', '2', '3', '4'].includes(k)) jeu.ui.ameliorer(['vie', 'degats', 'vitesse', 'ile'][+k - 1]);
        });
        window.addEventListener('keyup', e => {
            const k = e.key.toLowerCase();
            if (avance.includes(k)) jeu.toucheAvance = false;
            if (k === ' ') jeu.toucheTir = false;
        });
        window.addEventListener('blur', () => jeu.pause(true));
        document.addEventListener('visibilitychange', () => { if (document.hidden) jeu.pause(true); });
    }

    // ---- Démarrage ---------------------------------------------------------
    const SI = {
        jeu: null,
        setLang(l) { lang = TXT[l] ? l : 'fr'; if (this.jeu) this.jeu.ui.textes(); },
        start(stage) {
            stage.insertAdjacentHTML('beforeend', '<div class="si-overlay" id="siBoot"><div class="si-card"><p>' + t('loading') + '</p></div></div>');
            chargerImages().then(img => {
                stage.querySelector('#siBoot').remove();
                this.jeu = new Jeu(stage, img);
                brancherEntrees(this.jeu);
                this.jeu.ui.textes();
            }).catch(err => {
                stage.querySelector('#siBoot .si-card').textContent = 'Erreur de chargement : ' + err.message;
            });
        }
    };
    window.SurvivalIsland = SI;
})();
