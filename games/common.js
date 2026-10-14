// Shared helpers for the mini-games (no third-party code, nothing sent anywhere).
const Game = {
    lang() {
        return document.documentElement.lang === 'en' ? 'en' : 'fr';
    },
    onLangChange(cb) {
        document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setTimeout(cb, 0)));
    },
    t(dict, key) {
        return (dict[Game.lang()] || dict.fr)[key];
    },
    // Best score kept only in this browser (local storage), never sent.
    best(id) {
        try { return Number(localStorage.getItem('best-' + id)) || 0; } catch (e) { return 0; }
    },
    saveBest(id, value) {
        try {
            if (value > Game.best(id)) { localStorage.setItem('best-' + id, String(value)); return true; }
        } catch (e) { /* storage unavailable: just don't keep the record */ }
        return false;
    },
    // Crisp canvas on high-density screens, drawing in fixed logical units.
    setupCanvas(canvas, w, h) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return ctx;
    },
    // Pointer position converted to the canvas' logical units.
    pointer(canvas, e, w, h) {
        const r = canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height };
    },
    colors() {
        const cs = getComputedStyle(document.documentElement);
        const v = n => cs.getPropertyValue(n).trim();
        return { primary: v('--primary'), primaryDark: v('--primary-dark'), lighter: v('--primary-lighter'), text: v('--text'), muted: v('--text-light'), surface: v('--surface'), green: v('--accent-green') };
    },
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};
