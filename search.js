// Recherche dans tout le portfolio (FR/EN).
// Index généré par scripts/build-search-index.js (search-index.json), chargé à la première ouverture.
// Raccourcis : Ctrl+K / ⌘K ou « / ». Navigation au clavier : ↑ ↓ Entrée, Échap pour fermer.
(() => {
    'use strict';
    const script = document.currentScript;
    const BASE = script ? script.src.replace(/[^/]*$/, '') : '/';
    const UI = {
        fr: { open: 'Rechercher', placeholder: 'Rechercher un projet, un cours, une techno…', close: 'Fermer', empty: 'Aucun résultat pour', hint: 'Tape au moins 2 lettres. Exemples :', loading: 'Chargement de l’index…', error: 'Impossible de charger l’index de recherche.', results: n => `${n} résultat${n > 1 ? 's' : ''}`, keys: '↑ ↓ pour choisir · Entrée pour ouvrir · Échap pour fermer', external: 'application', pdf: 'PDF' },
        en: { open: 'Search', placeholder: 'Search a project, a course, a technology…', close: 'Close', empty: 'No results for', hint: 'Type at least 2 letters. Examples:', loading: 'Loading the index…', error: 'Could not load the search index.', results: n => `${n} result${n > 1 ? 's' : ''}`, keys: '↑ ↓ to choose · Enter to open · Esc to close', external: 'app', pdf: 'PDF' }
    };
    const EXAMPLES = ['Fianchetto', 'Docker', 'Stockfish', 'Flask', 'Unity', 'ASP.NET', 'MNIST'];
    const lang = () => (document.documentElement.lang || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr';
    const t = k => UI[lang()][k];

    const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const shortTitle = s => String(s).replace(/\s*[|–-]\s*Matéo Bourdin\s*$/i, '').trim();

    // ---------- Index ----------
    let index = null, loading = null;
    function load() {
        if (!loading) loading = fetch(BASE + 'search-index.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }).then(j => {
            index = j.pages.map(p => {
                const secs = (p.s || []).map(s => ({ a: s.a, h: s.h, x: s.x, nh: norm(s.h.fr + ' ' + s.h.en), nx: norm(s.x.fr + ' ' + s.x.en) }));
                return Object.assign({}, p, { secs, nt: norm(p.t.fr + ' ' + p.t.en + ' ' + p.u.replace(/[/._-]/g, ' ')), nd: norm(p.d.fr + ' ' + p.d.en), nk: norm(p.k || '') });
            });
            return index;
        });
        return loading;
    }

    // ---------- Recherche ----------
    const wordsCache = new Map();
    const wordsOf = s => { let w = wordsCache.get(s); if (!w) { w = new Set(s.split(/[^a-z0-9.#+]+/).filter(x => x.length > 2)); wordsCache.set(s, w); } return w; };
    function near(a, b, max) { // distance d'édition ≤ max (Levenshtein bornée)
        if (Math.abs(a.length - b.length) > max) return false;
        let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
        for (let i = 1; i <= a.length; i++) {
            const row = [i]; let low = i;
            for (let j = 1; j <= b.length; j++) {
                row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                if (row[j] < low) low = row[j];
            }
            if (low > max) return false;
            prev = row;
        }
        return prev[b.length] <= max;
    }
    // 0 = absent, 1 = approché (faute de frappe), 2 = présent
    function hit(text, tok) {
        if (!text) return 0;
        if (text.includes(tok)) return 2;
        if (tok.length >= 5) {
            const max = tok.length >= 8 ? 2 : 1;
            for (const w of wordsOf(text)) if (near(w, tok, max) || (w.length > tok.length && near(w.slice(0, tok.length), tok, 1))) return 1;
        }
        return 0;
    }
    function search(q) {
        const toks = norm(q).split(/\s+/).filter(Boolean);
        if (!toks.length) return [];
        const out = [];
        for (const p of index) {
            let score = 0, ok = true;
            const secScore = new Map();
            for (const tok of toks) {
                let best = 0;
                const ht = hit(p.nt, tok), hk = hit(p.nk, tok), hd = hit(p.nd, tok);
                best = Math.max(ht * 6, hk * 4, hd * 2);
                for (const s of p.secs) {
                    const hh = hit(s.nh, tok), hx = hit(s.nx, tok);
                    const v = hh * 3 + hx;
                    if (v) { secScore.set(s, (secScore.get(s) || 0) + v); best = Math.max(best, v); }
                }
                if (!best) { ok = false; break; }
                score += best;
            }
            if (!ok) continue;
            const secs = [...secScore.entries()].filter(([s]) => s.a || s.h.fr).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([s]) => s);
            const mentions = [...secScore.values()].reduce((a, b) => a + b, 0);
            out.push({ p, secs, score: score + Math.min(mentions, 12) * 0.25 });
        }
        return out.sort((a, b) => b.score - a.score).slice(0, 12);
    }

    // Extrait autour du premier mot trouvé, avec surlignage
    function snippet(text, toks, len = 150) {
        if (!text) return '';
        const n = norm(text);
        let pos = -1;
        for (const tok of toks) { const i = n.indexOf(tok); if (i >= 0 && (pos < 0 || i < pos)) pos = i; }
        let start = pos < 0 ? 0 : Math.max(0, pos - 50);
        if (start > 0) { const sp = text.indexOf(' ', start); if (sp > 0 && sp - start < 20) start = sp + 1; }
        let s = text.slice(start, start + len);
        if (start + len < text.length) s = s.replace(/\s+\S*$/, '') + ' …';
        if (start > 0) s = '… ' + s;
        return mark(s, toks);
    }
    function mark(s, toks) {
        const n = norm(s); const marks = [];
        for (const tok of toks) { let i = n.indexOf(tok); while (i >= 0) { marks.push([i, i + tok.length]); i = n.indexOf(tok, i + tok.length); } }
        if (!marks.length) return esc(s);
        marks.sort((a, b) => a[0] - b[0]);
        let out = '', last = 0;
        for (const [a, b] of marks) { if (a < last) continue; out += esc(s.slice(last, a)) + '<mark>' + esc(s.slice(a, b)) + '</mark>'; last = b; }
        return out + esc(s.slice(last));
    }

    // ---------- Interface ----------
    let dlg, input, list, status, items = [], sel = -1, lastFocus = null;
    function build() {
        dlg = document.createElement('div');
        dlg.className = 'site-search';
        dlg.hidden = true;
        dlg.innerHTML = `<div class="site-search-backdrop" data-close></div>
            <div class="site-search-box" role="dialog" aria-modal="true" aria-labelledby="siteSearchLabel">
                <div class="site-search-bar">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                    <label id="siteSearchLabel" for="siteSearchInput" class="site-search-sr"></label>
                    <input id="siteSearchInput" type="search" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="siteSearchList" aria-autocomplete="list">
                    <button type="button" class="site-search-close" data-close><kbd>Esc</kbd></button>
                </div>
                <p class="site-search-status" aria-live="polite"></p>
                <ul class="site-search-list" id="siteSearchList" role="listbox"></ul>
                <p class="site-search-keys"></p>
            </div>`;
        document.body.appendChild(dlg);
        input = dlg.querySelector('input'); list = dlg.querySelector('ul'); status = dlg.querySelector('.site-search-status');
        dlg.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
        let timer;
        input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 60); });
        input.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!items.length) return;
                select((sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
            } else if (e.key === 'Enter' && sel >= 0) {
                e.preventDefault(); items[sel].click();
            }
        });
        dlg.addEventListener('keydown', e => {
            if (e.key === 'Escape') { e.preventDefault(); close(); }
            if (e.key === 'Tab') { // garder le focus dans la fenêtre
                const f = [...dlg.querySelectorAll('input, a, button')].filter(x => x.offsetParent);
                if (!f.length) return;
                const i = f.indexOf(document.activeElement);
                if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
                else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
            }
        });
    }
    function labels() {
        dlg.querySelector('#siteSearchLabel').textContent = t('open');
        input.placeholder = t('placeholder');
        dlg.querySelector('.site-search-close').setAttribute('aria-label', t('close'));
        dlg.querySelector('.site-search-keys').textContent = t('keys');
    }
    function select(i) {
        items.forEach((a, k) => a.setAttribute('aria-selected', String(k === i)));
        sel = i;
        if (items[i]) { items[i].scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', items[i].id); }
    }
    function hrefOf(p, a) {
        if (/^https?:/.test(p.u)) return p.u;
        return BASE + p.u + (a ? '#' + a : '');
    }
    function examples() {
        status.innerHTML = esc(t('hint')) + ' ' + EXAMPLES.map(x => `<button type="button" class="site-search-chip">${esc(x)}</button>`).join(' ');
        status.querySelectorAll('.site-search-chip').forEach(b => b.addEventListener('click', () => { input.value = b.textContent; run(); input.focus(); }));
        list.innerHTML = ''; items = []; sel = -1;
    }
    async function run() {
        const q = input.value.trim();
        if (q.length < 2) return examples();
        if (!index) {
            status.textContent = t('loading');
            try { await load(); } catch (e) { status.textContent = t('error'); return; }
            if (input.value.trim() !== q) return;
        }
        const res = search(q), L = lang(), toks = norm(q).split(/\s+/).filter(Boolean);
        status.textContent = res.length ? UI[L].results(res.length) : `${t('empty')} « ${q} »`;
        list.innerHTML = res.map((r, i) => {
            const p = r.p, title = shortTitle(p.t[L] || p.t.fr);
            const kind = p.u.endsWith('.pdf') ? t('pdf') : p.u === 'fianchetto/' ? t('external') : p.u.replace(/\.html$/, '').replace(/^projects\//, L === 'en' ? 'projects / ' : 'projets / ');
            const main = r.secs[0];
            const text = main ? (main.x[L] || main.x.fr) : (p.d[L] || p.d.fr);
            const subs = r.secs.filter(s => s.a && s.h.fr).map(s => `<a class="site-search-sub" href="${esc(hrefOf(p, s.a))}" tabindex="-1">↳ ${mark(s.h[L] || s.h.fr, toks)}</a>`).join('');
            return `<li role="presentation"><a class="site-search-item" role="option" id="ss-${i}" href="${esc(hrefOf(p, ''))}" aria-selected="false">
                <span class="site-search-title"><span>${mark(title, toks)}</span><small>${esc(kind)}</small></span>
                <span class="site-search-text">${snippet(text || (p.d[L] || p.d.fr), toks)}</span></a>${subs}</li>`;
        }).join('');
        items = [...list.querySelectorAll('.site-search-item')];
        items.forEach((a, i) => a.addEventListener('mousemove', () => sel !== i && select(i)));
        list.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            // même page : fermer la fenêtre pour laisser l'ancre agir
            const u = new URL(a.href, location.href);
            if (u.pathname === location.pathname) { close(false); if (u.hash && u.hash !== location.hash) { location.hash = u.hash; } }
        }));
        select(items.length ? 0 : -1);
    }
    function open(prefill) {
        if (!dlg) build();
        labels();
        lastFocus = document.activeElement;
        dlg.hidden = false;
        document.documentElement.classList.add('site-search-open');
        if (typeof prefill === 'string') input.value = prefill;
        input.focus(); input.select();
        run();
        load().catch(() => {});
    }
    function close(restore = true) {
        if (!dlg || dlg.hidden) return;
        dlg.hidden = true;
        document.documentElement.classList.remove('site-search-open');
        if (restore && lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Bouton dans le sélecteur de langue (présent sur toutes les pages)
    function addButton() {
        const host = document.querySelector('.lang-switcher, .language-switcher');
        if (!host || host.querySelector('.search-btn')) return;
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'search-btn';
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
        const setLabel = () => { b.setAttribute('aria-label', t('open')); b.title = t('open') + ' (Ctrl+K)'; };
        setLabel();
        new MutationObserver(setLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        b.addEventListener('click', () => open());
        host.insertBefore(b, host.firstChild);
    }

    document.addEventListener('keydown', e => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg && !dlg.hidden ? close() : open(); }
        else if (e.key === '/' && !typing && !e.altKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); open(); }
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton); else addButton();

    // Lien direct : ?q=fianchetto ouvre la recherche
    const q0 = new URLSearchParams(location.search).get('q');
    if (q0) (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => open(q0)) : open(q0));

    window.SiteSearch = { open, close };
})();
