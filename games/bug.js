// Trouve le bug — moteur de jeu.
// Modes inspirés des puzzles d'échecs en ligne : classé (classement Elo adaptatif),
// Rush (3 min, 3 erreurs), Survie (une erreur et c'est fini), Bug du jour, Entraînement.
// Tout est stocké dans ce navigateur (stockage local) ; rien n'est envoyé.
(() => {
    const app = document.getElementById('bugApp');
    if (!app) return;

    // ---------------------------------------------------------------- textes
    const TXT = {
        fr: {
            rating: 'Classement', peak: 'Record', tierNames: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'],
            stats: 'Statistiques', menu: 'Modes', sound: 'Son', on: 'activé', off: 'coupé',
            modes: {
                rated: ['Classé', 'Des bugs adaptés à ton niveau. Ton classement monte ou descend à chaque énigme.'],
                rush: ['Rush', '3 minutes, 3 erreurs maximum. Les bugs sont de plus en plus durs.'],
                survival: ['Survie', '30 secondes par bug et une seule erreur permise. Jusqu’où iras-tu ?'],
                daily: ['Bug du jour', 'Le même bug pour tout le monde aujourd’hui. Un seul essai.'],
                practice: ['Entraînement', 'Choisis le niveau et le langage. Indices et solution à volonté, sans classement.']
            },
            play: 'Jouer', best: 'Record', dailyDone: 'Déjà joué aujourd’hui', dailyStreak: 'jours d’affilée',
            levels: 'Niveaux', langs: 'Langages', all: 'Tous', noMatch: 'Aucun bug ne correspond à ces filtres.',
            puzzle: 'Bug', puzzleRating: 'Difficulté', hidden: 'cachée', clickLine: 'Clique sur la ligne fautive (ou tape son numéro).',
            hint: 'Indice', hint1: 'Thème : ', hint2: 'J’ai grisé la moitié des lignes innocentes.', noMoreHints: 'Plus d’indice disponible.',
            hintCost: 'Un indice réduit le gain de classement.', giveUp: 'Voir la solution', skip: 'Passer',
            correct: ['Bien vu !', 'Exact !', 'Bug trouvé !', 'Impeccable !'], wrong: 'Raté.', timeout: 'Temps écoulé.', revealed: 'Solution affichée.',
            fixLabel: 'Correction', next: 'Bug suivant →', backMenu: 'Retour aux modes', finish: 'Voir le résultat',
            strikes: 'Erreurs', time: 'Temps', solved: 'trouvés', streakLabel: 'Série',
            resultTitle: { rush: 'Fin du Rush', survival: 'Fin de la survie', daily: 'Bug du jour' },
            score: 'Score', newRecord: 'Nouveau record !', replay: 'Rejouer', share: 'Copier le résultat', copied: 'Copié !',
            dailyOk: 'Trouvé en', dailyKo: 'Raté', comeBack: 'Reviens demain pour un nouveau bug.',
            allDone: 'Tu as trouvé tous les bugs de la banque, chapeau !',
            statsTitle: 'Tes statistiques', played: 'Bugs joués', solvedTotal: 'Bugs trouvés', accuracy: 'Réussite', bestStreak: 'Meilleure série',
            byLang: 'Réussite par langage', byTheme: 'Thèmes à travailler', history: 'Évolution du classement', badges: 'Succès',
            notEnough: 'Joue quelques bugs classés pour voir ta courbe.', reset: 'Réinitialiser mes stats', resetConfirm: 'Clique encore pour confirmer',
            unlocked: 'Succès débloqué', locked: 'À débloquer', kbd: 'Raccourcis : 1-9 pour choisir une ligne, H pour un indice, Entrée pour continuer, Échap pour revenir aux modes.'
        },
        en: {
            rating: 'Rating', peak: 'Peak', tierNames: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            stats: 'Statistics', menu: 'Modes', sound: 'Sound', on: 'on', off: 'off',
            modes: {
                rated: ['Rated', 'Bugs matched to your level. Your rating goes up or down with every puzzle.'],
                rush: ['Rush', '3 minutes, 3 mistakes max. The bugs get harder and harder.'],
                survival: ['Survival', '30 seconds per bug and a single mistake allowed. How far can you go?'],
                daily: ['Daily bug', 'The same bug for everyone today. One attempt.'],
                practice: ['Practice', 'Pick the level and language. Unlimited hints and solutions, no rating.']
            },
            play: 'Play', best: 'Best', dailyDone: 'Already played today', dailyStreak: 'days in a row',
            levels: 'Levels', langs: 'Languages', all: 'All', noMatch: 'No bug matches these filters.',
            puzzle: 'Bug', puzzleRating: 'Difficulty', hidden: 'hidden', clickLine: 'Click the faulty line (or type its number).',
            hint: 'Hint', hint1: 'Theme: ', hint2: 'I greyed out half of the innocent lines.', noMoreHints: 'No more hints.',
            hintCost: 'A hint reduces the rating gain.', giveUp: 'Show solution', skip: 'Skip',
            correct: ['Well spotted!', 'Correct!', 'Bug found!', 'Spot on!'], wrong: 'Missed.', timeout: 'Time’s up.', revealed: 'Solution shown.',
            fixLabel: 'Fix', next: 'Next bug →', backMenu: 'Back to modes', finish: 'See the result',
            strikes: 'Mistakes', time: 'Time', solved: 'found', streakLabel: 'Streak',
            resultTitle: { rush: 'Rush over', survival: 'Survival over', daily: 'Daily bug' },
            score: 'Score', newRecord: 'New record!', replay: 'Play again', share: 'Copy result', copied: 'Copied!',
            dailyOk: 'Found in', dailyKo: 'Missed', comeBack: 'Come back tomorrow for a new bug.',
            allDone: 'You found every bug in the bank, well done!',
            statsTitle: 'Your statistics', played: 'Bugs played', solvedTotal: 'Bugs found', accuracy: 'Accuracy', bestStreak: 'Best streak',
            byLang: 'Accuracy by language', byTheme: 'Themes to work on', history: 'Rating history', badges: 'Achievements',
            notEnough: 'Play a few rated bugs to see your curve.', reset: 'Reset my stats', resetConfirm: 'Click again to confirm',
            unlocked: 'Achievement unlocked', locked: 'Locked', kbd: 'Shortcuts: 1-9 to pick a line, H for a hint, Enter to continue, Esc to go back to modes.'
        }
    };
    const L = () => TXT[Game.lang()];
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const tr = obj => obj[Game.lang()] || obj.fr;

    // ---------------------------------------------------------------- données
    const PUZZLES = BUG_PUZZLES;
    const family = p => p.lang.split(' ')[0];
    const FAMILIES = [...new Set(PUZZLES.map(family))];
    const TIERS = [[0, 1000], [1000, 1400], [1400, 1800], [1800, 9999]];
    const tierOf = r => TIERS.findIndex(([a, b]) => r >= a && r < b);

    // ---------------------------------------------------------------- profil
    const KEY = 'bugProfile-v1';
    const fresh = () => ({
        v: 1, rating: 1200, peak: 1200, history: [1200], played: 0, solved: 0, ratedStreak: 0, bestStreak: 0,
        byFamily: {}, byTheme: {}, solvedIds: [], noHint: 0, rushBest: 0, survivalBest: 0, fastest: null,
        daily: { last: null, streak: 0, best: 0, results: {} }, badges: {}, sound: false, recent: []
    });
    let P = (() => {
        try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.v === 1) return Object.assign(fresh(), raw); } catch (e) { /* ignore */ }
        return fresh();
    })();
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { /* storage unavailable */ } };
    // Keep the generic "best score" (used by the Arcade page) in sync.
    const syncBest = () => { Game.saveBest('bug', Math.round(P.peak)); Game.saveBest('bug-rush', P.rushBest); };

    // ---------------------------------------------------------------- succès
    const BADGES = [
        { id: 'first', icon: '🐛', fr: ['Premier bug', 'Trouver ton premier bug'], en: ['First bug', 'Find your first bug'], ok: () => P.solved >= 1 },
        { id: 'hunter', icon: '🔎', fr: ['Chasseur', 'Trouver 25 bugs'], en: ['Hunter', 'Find 25 bugs'], ok: () => P.solved >= 25 },
        { id: 'exterminator', icon: '🧯', fr: ['Exterminateur', 'Trouver 100 bugs'], en: ['Exterminator', 'Find 100 bugs'], ok: () => P.solved >= 100 },
        { id: 'streak5', icon: '🔥', fr: ['En feu', '5 bugs classés d’affilée'], en: ['On fire', '5 rated bugs in a row'], ok: () => P.bestStreak >= 5 },
        { id: 'adv', icon: '📈', fr: ['Avancé', 'Atteindre 1400 de classement'], en: ['Advanced', 'Reach a 1400 rating'], ok: () => P.peak >= 1400 },
        { id: 'expert', icon: '🏆', fr: ['Expert', 'Atteindre 1800 de classement'], en: ['Expert', 'Reach an 1800 rating'], ok: () => P.peak >= 1800 },
        { id: 'rush10', icon: '⚡', fr: ['Sprinteur', '10 bugs dans un Rush'], en: ['Sprinter', '10 bugs in one Rush'], ok: () => P.rushBest >= 10 },
        { id: 'rush20', icon: '🚀', fr: ['Supersonique', '20 bugs dans un Rush'], en: ['Supersonic', '20 bugs in one Rush'], ok: () => P.rushBest >= 20 },
        { id: 'survivor', icon: '🛡️', fr: ['Survivant', '15 bugs en Survie'], en: ['Survivor', '15 bugs in Survival'], ok: () => P.survivalBest >= 15 },
        { id: 'polyglot', icon: '🌍', fr: ['Polyglotte', 'Un bug trouvé dans chaque langage'], en: ['Polyglot', 'A bug found in every language'], ok: () => FAMILIES.every(f => (P.byFamily[f] || {}).ok > 0) },
        { id: 'nohint', icon: '🎯', fr: ['Sans filet', '20 bugs trouvés sans indice'], en: ['No safety net', '20 bugs found without hints'], ok: () => P.noHint >= 20 },
        { id: 'lynx', icon: '👁️', fr: ['Œil de lynx', 'Trouver un bug en moins de 4 secondes'], en: ['Eagle eye', 'Find a bug in under 4 seconds'], ok: () => P.fastest !== null && P.fastest < 4 },
        { id: 'guardian', icon: '🔐', fr: ['Gardien', 'Trouver tous les bugs de sécurité'], en: ['Guardian', 'Find every security bug'], ok: () => PUZZLES.filter(p => p.theme === 'security').every(p => P.solvedIds.includes(p.id)) },
        { id: 'daily3', icon: '📅', fr: ['Régulier', 'Bug du jour 3 jours d’affilée'], en: ['Regular', 'Daily bug 3 days in a row'], ok: () => P.daily.best >= 3 }
    ];
    let toasts = [];
    function checkBadges() {
        for (const b of BADGES) {
            if (!P.badges[b.id] && b.ok()) { P.badges[b.id] = Date.now(); toasts.push(b); }
        }
        save();
        flushToasts();
    }
    function flushToasts() {
        const host = document.getElementById('bugToasts');
        while (toasts.length) {
            const b = toasts.shift();
            const el = document.createElement('div');
            el.className = 'bug-toast';
            el.innerHTML = `<span class="bug-toast-icon">${b.icon}</span><span><small>${esc(L().unlocked)}</small><b>${esc(tr(b)[0])}</b></span>`;
            host.appendChild(el);
            beep('badge');
            setTimeout(() => el.classList.add('out'), 3200);
            setTimeout(() => el.remove(), 3700);
        }
    }

    // ---------------------------------------------------------------- son
    let audio = null;
    function beep(kind) {
        if (!P.sound) return;
        try {
            audio = audio || new (window.AudioContext || window.webkitAudioContext)();
            const notes = { ok: [660, 880], ko: [220, 160], badge: [523, 659, 784], tick: [1000] }[kind] || [440];
            notes.forEach((f, i) => {
                const o = audio.createOscillator(), g = audio.createGain();
                o.type = kind === 'ko' ? 'sawtooth' : 'sine';
                o.frequency.value = f;
                const t0 = audio.currentTime + i * 0.09;
                g.gain.setValueAtTime(0.0001, t0);
                g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
                g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
                o.connect(g).connect(audio.destination);
                o.start(t0); o.stop(t0 + 0.18);
            });
        } catch (e) { /* no audio */ }
    }

    // ---------------------------------------------------------------- utilitaires
    const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayNumber = key => Math.floor(Date.parse(key + 'T12:00:00') / 86400000);
    function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
    const dailyPuzzle = () => PUZZLES[hash('bug-' + todayKey()) % PUZZLES.length];
    function pickNear(target, exclude) {
        const pool = PUZZLES.filter(p => !exclude.includes(p.id));
        if (!pool.length) return null;
        pool.sort((a, b) => Math.abs(a.rating - target) - Math.abs(b.rating - target));
        const near = pool.slice(0, Math.min(4, pool.length));
        return near[Math.floor(Math.random() * near.length)];
    }
    const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    // ---------------------------------------------------------------- état de partie
    const practice = { tiers: [0, 1, 2, 3], fams: [] };
    let screen = 'menu';
    let run = null;   // partie en cours (mode, file d'énigmes, score…)
    let cur = null;   // énigme affichée
    let clock = null;
    let resetArmed = false;

    function startMode(mode) {
        run = { mode, score: 0, strikes: 0, used: [], target: 650, start: performance.now(), timeLeft: mode === 'rush' ? 180 : null, over: false, record: false };
        if (mode === 'daily') {
            if (P.daily.results[todayKey()]) { screen = 'result'; run.over = true; render(); return; }
        }
        nextPuzzle();
    }

    function nextPuzzle() {
        let p = null;
        const m = run.mode;
        if (m === 'rated') {
            p = pickNear(P.rating, P.recent.slice(-12));
        } else if (m === 'rush' || m === 'survival') {
            p = pickNear(run.target, run.used);
        } else if (m === 'daily') {
            p = dailyPuzzle();
        } else if (m === 'practice') {
            const pool = PUZZLES.filter(q => practice.tiers.includes(tierOf(q.rating)) && (!practice.fams.length || practice.fams.includes(family(q))) && !run.used.slice(-8).includes(q.id));
            const all = PUZZLES.filter(q => practice.tiers.includes(tierOf(q.rating)) && (!practice.fams.length || practice.fams.includes(family(q))));
            const src = pool.length ? pool : all;
            p = src.length ? src[Math.floor(Math.random() * src.length)] : null;
        }
        if (!p) { finishRun(true); return; }
        run.used.push(p.id);
        cur = { p, answered: false, picked: null, ok: false, hints: 0, dimmed: [], started: performance.now(), delta: null, timeLeft: m === 'survival' ? 30 : null, revealed: false };
        screen = 'play';
        render();
        startClock();
    }

    function startClock() {
        clearInterval(clock);
        clock = setInterval(() => {
            if (screen !== 'play' || document.hidden) return;
            const now = performance.now();
            if (run.mode === 'rush' && !run.over) {
                run.timeLeft = Math.max(0, 180 - (now - run.start) / 1000);
                if (run.timeLeft <= 0) { if (!cur.answered) answer(-1, true); finishRun(); return; }
            }
            if (run.mode === 'survival' && !cur.answered) {
                cur.timeLeft = Math.max(0, 30 - (now - cur.started) / 1000);
                if (cur.timeLeft <= 0) { answer(-1, true); return; }
            }
            updateClock();
        }, 200);
    }

    function updateClock() {
        const el = document.getElementById('bugClock');
        if (!el || !cur) return;
        let v;
        if (run.mode === 'rush') v = fmtTime(run.timeLeft);
        else if (run.mode === 'survival') v = `${Math.ceil(cur.timeLeft)} s`;
        else v = fmtTime(((cur.answered ? cur.solvedAt : performance.now()) - cur.started) / 1000);
        el.textContent = v;
        const bar = document.getElementById('bugBar');
        if (bar) {
            const frac = run.mode === 'rush' ? run.timeLeft / 180 : run.mode === 'survival' ? cur.timeLeft / 30 : 1;
            bar.style.width = `${frac * 100}%`;
            bar.classList.toggle('low', frac < 0.2);
        }
    }

    function answer(i, timeout = false) {
        if (!cur || cur.answered) return;
        cur.answered = true;
        cur.picked = i;
        cur.solvedAt = performance.now();
        const secs = (cur.solvedAt - cur.started) / 1000;
        const p = cur.p;
        cur.ok = i === p.bug;
        cur.timeout = timeout;
        const fam = family(p);
        // Statistiques globales (le mode Entraînement n'influence pas le classement).
        P.played++;
        P.byFamily[fam] = P.byFamily[fam] || { ok: 0, n: 0 };
        P.byTheme[p.theme] = P.byTheme[p.theme] || { ok: 0, n: 0 };
        P.byFamily[fam].n++; P.byTheme[p.theme].n++;
        if (cur.ok) {
            P.solved++;
            P.byFamily[fam].ok++; P.byTheme[p.theme].ok++;
            if (!P.solvedIds.includes(p.id)) P.solvedIds.push(p.id);
            if (cur.hints === 0) { P.noHint++; if (P.fastest === null || secs < P.fastest) P.fastest = Math.round(secs * 10) / 10; }
            beep('ok');
        } else beep('ko');

        const m = run.mode;
        if (m === 'rated') {
            const E = 1 / (1 + Math.pow(10, (p.rating - P.rating) / 400));
            const S = cur.ok ? [1, 0.5, 0.25][Math.min(cur.hints, 2)] : 0;
            const K = P.history.length < 20 ? 40 : 24;
            const delta = Math.round(K * (S - E));
            P.rating = Math.max(100, P.rating + delta);
            P.peak = Math.max(P.peak, P.rating);
            P.history.push(P.rating);
            if (P.history.length > 200) P.history.shift();
            cur.delta = delta;
            P.recent.push(p.id);
            if (P.recent.length > 30) P.recent.shift();
            if (cur.ok && cur.hints === 0) { P.ratedStreak++; P.bestStreak = Math.max(P.bestStreak, P.ratedStreak); } else P.ratedStreak = 0;
        } else if (m === 'rush') {
            if (cur.ok) { run.score++; run.target += 55; } else run.strikes++;
        } else if (m === 'survival') {
            if (cur.ok) { run.score++; run.target += 60; } else run.over = true;
        } else if (m === 'daily') {
            const key = todayKey();
            P.daily.results[key] = { ok: cur.ok, secs: Math.round(secs), id: p.id, hints: cur.hints };
            if (cur.ok) {
                const prev = P.daily.last;
                P.daily.streak = prev && dayNumber(key) - dayNumber(prev) === 1 ? P.daily.streak + 1 : 1;
                P.daily.last = key;
                P.daily.best = Math.max(P.daily.best, P.daily.streak);
            } else { P.daily.streak = 0; }
            run.score = cur.ok ? 1 : 0;
        }
        syncBest();
        checkBadges();
        render();
        // En Rush, on enchaîne automatiquement pour garder le rythme.
        if (m === 'rush') {
            const done = run.strikes >= 3 || run.timeLeft <= 0;
            setTimeout(() => { if (screen === 'play' && run && run.mode === 'rush' && cur && cur.answered) { if (done) finishRun(); else nextPuzzle(); } }, cur.ok ? 700 : 1600);
        }
    }

    function useHint() {
        if (!cur || cur.answered || !['rated', 'practice', 'daily'].includes(run.mode)) return;
        if (cur.hints >= 2) return;
        cur.hints++;
        if (cur.hints === 2) {
            const innocent = cur.p.code.map((l, i) => i).filter(i => i !== cur.p.bug && cur.p.code[i].trim());
            innocent.sort(() => Math.random() - 0.5);
            cur.dimmed = innocent.slice(0, Math.ceil(innocent.length / 2));
        }
        render();
    }

    function reveal() {
        if (!cur || cur.answered) return;
        cur.revealed = true;
        answer(-1);
    }

    function finishRun(exhausted = false) {
        clearInterval(clock);
        if (!run) return;
        run.over = true;
        run.exhausted = exhausted;
        if (run.mode === 'rush' && run.score > P.rushBest) { P.rushBest = run.score; run.record = true; }
        if (run.mode === 'survival' && run.score > P.survivalBest) { P.survivalBest = run.score; run.record = true; }
        syncBest();
        checkBadges();
        if (run.mode === 'rated' || run.mode === 'practice') { screen = 'menu'; } else screen = 'result';
        render();
    }

    function canContinue() {
        if (!run || !cur || !cur.answered) return false;
        return run.mode === 'rated' || run.mode === 'practice' || (run.mode === 'survival' && !run.over);
    }

    // ---------------------------------------------------------------- rendu
    function header() {
        const tier = L().tierNames[tierOf(P.rating)];
        return `<div class="bug-profile">
            <div class="bug-rating"><span class="bug-rating-label">${esc(L().rating)}</span><b>${P.rating}</b><span class="bug-tier">${esc(tier)}</span></div>
            <div class="bug-profile-actions">
                <button type="button" class="bug-chip ${screen === 'menu' ? 'is-on' : ''}" data-act="menu">${esc(L().menu)}</button>
                <button type="button" class="bug-chip ${screen === 'stats' ? 'is-on' : ''}" data-act="stats">📊 ${esc(L().stats)}</button>
                <button type="button" class="bug-chip" data-act="sound" aria-pressed="${P.sound}">${P.sound ? '🔊' : '🔇'} ${esc(L().sound)}</button>
            </div>
        </div>`;
    }

    function renderMenu() {
        const today = P.daily.results[todayKey()];
        const card = (mode, icon, extra = '') => {
            const [name, desc] = L().modes[mode];
            return `<button type="button" class="bug-mode bug-mode-${mode}" data-mode="${mode}">
                <span class="bug-mode-icon">${icon}</span>
                <span class="bug-mode-name">${esc(name)}</span>
                <span class="bug-mode-desc">${esc(desc)}</span>
                ${extra ? `<span class="bug-mode-extra">${extra}</span>` : ''}
            </button>`;
        };
        const tierChips = L().tierNames.map((n, i) => `<button type="button" class="bug-chip ${practice.tiers.includes(i) ? 'is-on' : ''}" data-tier="${i}">${esc(n)}</button>`).join('');
        const famChips = [`<button type="button" class="bug-chip ${!practice.fams.length ? 'is-on' : ''}" data-fam="">${esc(L().all)}</button>`]
            .concat(FAMILIES.map(f => `<button type="button" class="bug-chip ${practice.fams.includes(f) ? 'is-on' : ''}" data-fam="${esc(f)}">${esc(f)}</button>`)).join('');
        const nPractice = PUZZLES.filter(q => practice.tiers.includes(tierOf(q.rating)) && (!practice.fams.length || practice.fams.includes(family(q)))).length;
        return `<div class="bug-modes">
            ${card('rated', '♟️', `${esc(L().peak)} : ${P.peak}`)}
            ${card('rush', '⚡', `${esc(L().best)} : ${P.rushBest}`)}
            ${card('survival', '🛡️', `${esc(L().best)} : ${P.survivalBest}`)}
            ${card('daily', '📅', today ? `${esc(L().dailyDone)} ${today.ok ? '✅' : '❌'}` : `🔥 ${P.daily.streak} ${esc(L().dailyStreak)}`)}
        </div>
        <div class="bug-practice">
            <div class="bug-practice-head"><span class="bug-mode-icon">🎓</span><div><b>${esc(L().modes.practice[0])}</b><p>${esc(L().modes.practice[1])}</p></div></div>
            <div class="bug-filter"><span>${esc(L().levels)}</span>${tierChips}</div>
            <div class="bug-filter"><span>${esc(L().langs)}</span>${famChips}</div>
            <button type="button" class="btn btn-primary" data-mode="practice" ${nPractice ? '' : 'disabled'}>${esc(L().play)} (${nPractice})</button>
            ${nPractice ? '' : `<p class="bug-muted">${esc(L().noMatch)}</p>`}
        </div>
        <p class="bug-muted bug-kbd">${esc(L().kbd)}</p>`;
    }

    function renderPlay() {
        const p = cur.p, m = run.mode, l = L();
        const showRating = cur.answered || m === 'practice';
        let top = `<span class="bug-mode-tag">${esc(l.modes[m][0])}</span><span class="bug-lang">${esc(p.lang)}</span>`;
        top += `<span>${esc(l.puzzleRating)} <b>${showRating ? p.rating : '?'}</b></span>`;
        if (m === 'rush') top += `<span>${esc(l.score)} <b>${run.score}</b></span><span>${esc(l.strikes)} <b class="bug-strikes">${'✖'.repeat(run.strikes)}${'·'.repeat(3 - run.strikes)}</b></span>`;
        if (m === 'survival') top += `<span>${esc(l.score)} <b>${run.score}</b></span>`;
        if (m === 'rated') top += `<span>${esc(l.streakLabel)} <b>🔥 ${P.ratedStreak}</b></span>`;
        top += `<span class="bug-clock" id="bugClock"></span>`;

        const lines = p.code.map((line, i) => {
            let cls = 'bug-line';
            if (cur.dimmed.includes(i) && !cur.answered) cls += ' is-dim';
            if (cur.answered && i === p.bug) cls += ' is-bug';
            if (cur.answered && i === cur.picked && i !== p.bug) cls += ' is-wrong';
            return `<button type="button" class="${cls}" data-line="${i}" ${cur.answered ? 'disabled' : ''} aria-label="${i + 1}"><span class="bug-num">${i + 1}</span><code>${esc(line || ' ')}</code></button>`;
        }).join('');

        let hintBox = '';
        if (!cur.answered && cur.hints > 0) {
            hintBox = `<p class="bug-hint-box">💡 ${esc(l.hint1)}<b>${esc(tr(BUG_THEMES[p.theme]))}</b>${cur.hints > 1 ? ` · ${esc(l.hint2)}` : ''}</p>`;
        }
        const hintsAllowed = ['rated', 'practice', 'daily'].includes(m);
        let actions = '';
        if (!cur.answered) {
            actions = `<div class="bug-actions">
                ${hintsAllowed ? `<button type="button" class="btn btn-secondary" data-act="hint" ${cur.hints >= 2 ? 'disabled' : ''}>💡 ${esc(l.hint)} (${2 - cur.hints})</button>` : ''}
                ${m === 'practice' ? `<button type="button" class="btn btn-secondary" data-act="reveal">${esc(l.giveUp)}</button>` : ''}
            </div>${m === 'rated' && cur.hints === 0 ? `<p class="bug-muted">${esc(l.hintCost)}</p>` : ''}`;
        }

        let feedback = '';
        if (cur.answered) {
            const verdict = cur.ok ? l.correct[(P.solved + p.rating) % l.correct.length] : cur.revealed ? l.revealed : cur.timeout ? l.timeout : l.wrong;
            const delta = cur.delta !== null ? `<span class="bug-delta ${cur.delta >= 0 ? 'up' : 'down'}">${cur.delta >= 0 ? '+' : ''}${cur.delta}</span>` : '';
            let btns = '';
            if (canContinue()) btns += `<button type="button" class="btn btn-primary" data-act="next">${esc(l.next)}</button>`;
            if (m === 'survival' && run.over) btns += `<button type="button" class="btn btn-primary" data-act="finish">${esc(l.finish)}</button>`;
            if (m === 'daily') btns += `<button type="button" class="btn btn-primary" data-act="finish">${esc(l.finish)}</button>`;
            if (m !== 'rush') btns += `<button type="button" class="btn btn-secondary" data-act="menu">${esc(l.backMenu)}</button>`;
            feedback = `<div class="bug-feedback" aria-live="polite">
                <p class="bug-verdict ${cur.ok ? 'ok' : 'ko'}">${esc(verdict)} ${delta}</p>
                <p class="bug-explain">${esc(tr(p))}</p>
                <div class="bug-diff"><span class="bug-diff-label">${esc(l.fixLabel)}</span>
                    <code class="minus">− ${esc(p.code[p.bug].trim())}</code>
                    <code class="plus">+ ${esc(p.fix.trim())}</code>
                </div>
                <div class="bug-actions">${btns}</div>
            </div>`;
        }
        return `<div class="bug-play">
            <div class="bug-top">${top}</div>
            <div class="bug-timer"><div id="bugBar"></div></div>
            <p class="bug-muted">${esc(l.clickLine)}</p>
            <div class="bug-code" role="group">${lines}</div>
            ${hintBox}${actions}${feedback}
        </div>`;
    }

    function renderResult() {
        const l = L(), m = run.mode;
        if (m === 'daily') {
            const res = P.daily.results[todayKey()];
            const p = PUZZLES.find(q => q.id === (res && res.id)) || dailyPuzzle();
            const line = res ? (res.ok ? `✅ ${l.dailyOk} ${res.secs} s${res.hints ? ` (💡×${res.hints})` : ''}` : `❌ ${l.dailyKo}`) : '';
            return `<div class="bug-result">
                <span class="bug-result-icon">📅</span>
                <h3>${esc(l.resultTitle.daily)} · ${esc(todayKey())}</h3>
                <p class="bug-final">${esc(line)}</p>
                <p>🔥 ${P.daily.streak} ${esc(l.dailyStreak)} · ${esc(l.best)} ${P.daily.best}</p>
                <p class="bug-muted">${esc(p.lang)} · ${esc(tr(BUG_THEMES[p.theme]))} · ${esc(l.puzzleRating)} ${p.rating}</p>
                <p class="bug-muted">${esc(l.comeBack)}</p>
                <div class="bug-actions center">
                    <button type="button" class="btn btn-primary" data-act="share">📋 ${esc(l.share)}</button>
                    <button type="button" class="btn btn-secondary" data-act="menu">${esc(l.backMenu)}</button>
                </div>
            </div>`;
        }
        const best = m === 'rush' ? P.rushBest : P.survivalBest;
        return `<div class="bug-result">
            <span class="bug-result-icon">${m === 'rush' ? '⚡' : '🛡️'}</span>
            <h3>${esc(l.resultTitle[m])}</h3>
            <p class="bug-final">${run.score} ${esc(l.solved)}</p>
            ${run.record ? `<p class="bug-record">🏅 ${esc(l.newRecord)}</p>` : ''}
            ${run.exhausted ? `<p class="bug-record">${esc(l.allDone)}</p>` : ''}
            <p class="bug-muted">${esc(l.best)} : ${best}</p>
            <div class="bug-actions center">
                <button type="button" class="btn btn-primary" data-mode="${m}">${esc(l.replay)}</button>
                <button type="button" class="btn btn-secondary" data-act="menu">${esc(l.backMenu)}</button>
            </div>
        </div>`;
    }

    function chartSvg() {
        const h = P.history.slice(-60);
        if (h.length < 3) return `<p class="bug-muted">${esc(L().notEnough)}</p>`;
        const W = 600, H = 160, pad = 24;
        const min = Math.min(...h) - 20, max = Math.max(...h) + 20;
        const x = i => pad + i * (W - 2 * pad) / (h.length - 1);
        const y = v => H - pad - (v - min) * (H - 2 * pad) / (max - min);
        const pts = h.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
        const area = `${pad},${H - pad} ${pts} ${x(h.length - 1).toFixed(1)},${H - pad}`;
        return `<svg class="bug-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L().history)}">
            <polygon points="${area}" class="area"/>
            <polyline points="${pts}" class="line"/>
            <circle cx="${x(h.length - 1)}" cy="${y(h[h.length - 1])}" r="4" class="dot"/>
            <text x="${pad}" y="14" class="lbl">${Math.round(max - 20)}</text>
            <text x="${pad}" y="${H - 6}" class="lbl">${Math.round(min + 20)}</text>
        </svg>`;
    }

    function renderStats() {
        const l = L();
        const acc = P.played ? Math.round(P.solved / P.played * 100) : 0;
        const bars = FAMILIES.map(f => {
            const s = P.byFamily[f] || { ok: 0, n: 0 };
            const pct = s.n ? Math.round(s.ok / s.n * 100) : 0;
            return `<div class="bug-bar-row"><span>${esc(f)}</span><div class="bug-bar"><div style="width:${pct}%"></div></div><b>${s.n ? pct + ' %' : '–'}</b><small>${s.ok}/${s.n}</small></div>`;
        }).join('');
        const themes = Object.entries(P.byTheme).filter(([, s]) => s.n >= 2)
            .map(([k, s]) => [k, s.ok / s.n, s]).filter(([, r]) => r < 1).sort((a, b) => a[1] - b[1]).slice(0, 4)
            .map(([k, r, s]) => `<li>${esc(tr(BUG_THEMES[k]))} <b>${Math.round(r * 100)} %</b> <small>(${s.ok}/${s.n})</small></li>`).join('');
        const badges = BADGES.map(b => {
            const got = !!P.badges[b.id];
            return `<div class="bug-badge ${got ? 'got' : ''}" title="${esc(tr(b)[1])}"><span>${got ? b.icon : '🔒'}</span><b>${esc(tr(b)[0])}</b><small>${esc(tr(b)[1])}</small></div>`;
        }).join('');
        const tile = (label, value) => `<div class="bug-tile"><b>${value}</b><span>${esc(label)}</span></div>`;
        return `<div class="bug-stats">
            <h3>${esc(l.statsTitle)}</h3>
            <div class="bug-tiles">
                ${tile(l.rating, P.rating)}${tile(l.peak, P.peak)}${tile(l.solvedTotal, P.solved)}${tile(l.accuracy, acc + ' %')}
                ${tile(l.bestStreak, P.bestStreak)}${tile(L().modes.rush[0], P.rushBest)}${tile(L().modes.survival[0], P.survivalBest)}${tile(L().modes.daily[0], '🔥 ' + P.daily.best)}
            </div>
            <h4>${esc(l.history)}</h4>${chartSvg()}
            <h4>${esc(l.byLang)}</h4><div class="bug-bars">${bars}</div>
            ${themes ? `<h4>${esc(l.byTheme)}</h4><ul class="bug-themes">${themes}</ul>` : ''}
            <h4>${esc(l.badges)} (${Object.keys(P.badges).length}/${BADGES.length})</h4><div class="bug-badges">${badges}</div>
            <button type="button" class="bug-reset" data-act="reset">${esc(resetArmed ? l.resetConfirm : l.reset)}</button>
        </div>`;
    }

    function render() {
        let body = '';
        if (screen === 'menu') body = renderMenu();
        else if (screen === 'play') body = renderPlay();
        else if (screen === 'result') body = renderResult();
        else if (screen === 'stats') body = renderStats();
        app.innerHTML = header() + `<div class="bug-screen bug-screen-${screen}">${body}</div>`;
        if (screen === 'play') {
            updateClock();
            const focusTarget = cur.answered ? app.querySelector('[data-act="next"], [data-act="finish"]') : null;
            if (focusTarget) focusTarget.focus({ preventScroll: true });
        }
    }

    // ---------------------------------------------------------------- interactions
    app.addEventListener('click', e => {
        const el = e.target.closest('button');
        if (!el || el.disabled) return;
        if (el.dataset.line !== undefined) { answer(Number(el.dataset.line)); return; }
        if (el.dataset.mode) { startMode(el.dataset.mode); return; }
        if (el.dataset.tier !== undefined) {
            const t = Number(el.dataset.tier);
            practice.tiers = practice.tiers.includes(t) ? practice.tiers.filter(x => x !== t) : practice.tiers.concat(t);
            render(); return;
        }
        if (el.dataset.fam !== undefined) {
            const f = el.dataset.fam;
            practice.fams = !f ? [] : practice.fams.includes(f) ? practice.fams.filter(x => x !== f) : practice.fams.concat(f);
            render(); return;
        }
        const act = el.dataset.act;
        if (act === 'menu') { clearInterval(clock); screen = 'menu'; resetArmed = false; render(); }
        if (act === 'stats') { clearInterval(clock); screen = 'stats'; resetArmed = false; render(); }
        if (act === 'sound') { P.sound = !P.sound; save(); beep('ok'); render(); }
        if (act === 'hint') useHint();
        if (act === 'reveal') reveal();
        if (act === 'next') nextPuzzle();
        if (act === 'finish') finishRun();
        if (act === 'share') share(el);
        if (act === 'reset') {
            if (!resetArmed) { resetArmed = true; render(); return; }
            const sound = P.sound;
            P = fresh(); P.sound = sound; save(); resetArmed = false; render();
        }
    });

    function share(btn) {
        const res = P.daily.results[todayKey()];
        if (!res) return;
        const lang = Game.lang();
        const text = lang === 'en'
            ? `Spot the Bug · Daily ${todayKey()} ${res.ok ? `✅ ${res.secs} s` : '❌'}${res.hints ? ` 💡×${res.hints}` : ''} · 🔥${P.daily.streak}\nhttps://mateobourdin.github.io/jeu-bug.html`
            : `Trouve le bug · Bug du jour ${todayKey()} ${res.ok ? `✅ ${res.secs} s` : '❌'}${res.hints ? ` 💡×${res.hints}` : ''} · 🔥${P.daily.streak}\nhttps://mateobourdin.github.io/jeu-bug.html`;
        const done = () => { btn.textContent = '✔ ' + L().copied; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => { window.prompt('', text); });
        else window.prompt('', text);
    }

    document.addEventListener('keydown', e => {
        if (e.target.closest('input, textarea, select')) return;
        if (screen === 'play' && cur) {
            if (!cur.answered && /^[1-9]$/.test(e.key)) {
                const i = Number(e.key) - 1;
                if (i < cur.p.code.length) { answer(i); e.preventDefault(); }
            }
            if (e.key.toLowerCase() === 'h') useHint();
            if (e.key === 'Enter' && cur.answered && !e.target.closest('button')) {
                if (canContinue()) nextPuzzle(); else if (run.mode !== 'rush') finishRun();
            }
        }
        if (e.key === 'Escape' && screen !== 'menu') { clearInterval(clock); screen = 'menu'; render(); }
    });

    Game.onLangChange(render);
    document.addEventListener('visibilitychange', () => {
        // En Survie, on ne pénalise pas un onglet masqué : le chrono repart à zéro au retour.
        if (!document.hidden && screen === 'play' && run && run.mode === 'survival' && cur && !cur.answered) cur.started = performance.now() - (30 - cur.timeLeft) * 1000;
    });

    render();
})();
