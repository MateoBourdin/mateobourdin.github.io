#!/usr/bin/env node
/**
 * Builds search-index.json, the index used by search.js (site search).
 *
 * For every HTML page it records the title, the description and one entry
 * per section (an h2/h3, linked to the closest id so results can jump
 * straight to it), in French and in English. French is the text written in
 * the page; English comes from the page's translations (inline or
 * translations.js) for every element carrying data-i18n. Elements without
 * data-i18n (technology names, code identifiers) count for both languages.
 *
 *   node scripts/build-search-index.js          rebuild the file
 *   node scripts/build-search-index.js --check  fail if it is out of date (CI)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'search-index.json');

// Pages outside the HTML files: the live app and the CVs.
const EXTRA = [
    {
        u: 'fianchetto/',
        t: { fr: 'Fianchetto — l’application', en: 'Fianchetto — the app' },
        d: { fr: 'Application web d’échecs : jouer contre des bots, analyser ses parties Chess.com et Lichess avec Stockfish, problèmes.', en: 'Chess web app: play bots, review your Chess.com and Lichess games with Stockfish, puzzles.' },
        k: 'fianchetto echecs chess stockfish lichess chess.com bots analyse review puzzles problemes application app',
    },
    {
        u: 'CV/Mateo_Bourdin_CV_FR.pdf',
        t: { fr: 'CV (PDF, français)', en: 'Résumé (PDF, French)' },
        d: { fr: 'Mon CV à télécharger.', en: 'My résumé to download.' },
        k: 'cv curriculum resume telecharger download pdf stage internship',
    },
    {
        u: 'CV/Mateo_Bourdin_CV_EN.pdf',
        t: { fr: 'CV (PDF, anglais)', en: 'Résumé (PDF, English)' },
        d: { fr: 'Mon CV en anglais à télécharger.', en: 'My English résumé to download.' },
        k: 'cv curriculum resume telecharger download pdf english anglais stage internship',
    },
];

function listHtml(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (['node_modules', '.git', 'vendor', 'games', 'fonts', 'img', 'scripts'].includes(e.name)) continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) listHtml(full, out);
        else if (e.name.endsWith('.html')) out.push(full);
    }
    return out.sort();
}

// Same approach as check-i18n.js: run the script that declares
// `translations` with no-op stubs for the browser globals it touches.
function makeStub() {
    const fn = function stub() { return makeStub(); };
    return new Proxy(fn, {
        get(t, p) {
            if (p === Symbol.toPrimitive || p === 'then' || p === 'toJSON') return undefined;
            if (p === 'toString') return () => '';
            return makeStub();
        },
        apply() { return makeStub(); },
    });
}
function evalTranslations(src) {
    const fn = new Function('document', 'window', 'localStorage', 'navigator',
        src + '\nreturn typeof translations !== "undefined" ? translations : undefined;');
    return fn(makeStub(), makeStub(), makeStub(), makeStub());
}
let shared = null;
function translationsFor(html) {
    for (const [, body] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
        if (/const\s+translations\s*=\s*\{/.test(body)) return evalTranslations(body);
    }
    if (/<script src="(?:\.\.\/)?translations\.js">/.test(html)) {
        if (!shared) shared = evalTranslations(fs.readFileSync(path.join(ROOT, 'translations.js'), 'utf8'));
        return shared;
    }
    return null;
}
const resolve = (tree, key) => key.split('.').reduce((n, k) => (n && typeof n === 'object' ? n[k] : undefined), tree);

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', laquo: '«', raquo: '»', hellip: '…', mdash: '—', ndash: '–', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', times: '×', rarr: '→', larr: '←', middot: '·' };
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e] ?? m));
const stripTags = s => decode(String(s).replace(/<[^>]*>/g, ' '));
const clean = s => s.replace(/\s+/g, ' ').trim();
const attr = (a, name) => { const m = a.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`)); return m ? decode(m[1]) : null; };

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'template', 'pre', 'canvas', 'iframe', 'select', 'textarea', 'button']);
const BLOCK_SKIP_CLASS = /\b(language-switcher|lang-switcher|burger-menu|skip-link|cours-fr-note|ascii-art|code-preview|game-preview)\b/;

function indexPage(file) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const html = fs.readFileSync(file, 'utf8');
    const tr = translationsFor(html) || {};
    const en = tr.en || {};

    const title = clean(stripTags((html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]));
    const desc = clean(attr((html.match(/<meta\s+name="description"[^>]*>/) || [''])[0], 'content') || '');
    const pageKey = (html.match(/<body[^>]*data-page="([^"]+)"/) || [])[1];
    const enTitle = (pageKey && en.metaPages && en.metaPages[pageKey]) || null;

    const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1];
    const sections = [];
    let cur = { a: '', h: { fr: '', en: '' }, x: { fr: [], en: [] } };
    sections.push(cur);
    const stack = [];            // {tag, i18n, skip, id}
    let heading = null;          // collecting heading text
    const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^>]*?)?)\s*(\/?)>|([^<]+)/g;
    let m;
    const inSkip = () => stack.some(s => s.skip);
    const inI18n = () => stack.some(s => s.i18n);
    const anchor = () => { for (let i = stack.length - 1; i >= 0; i--) if (stack[i].id) return stack[i].id; return ''; };
    const push = (lang, text) => { const t = clean(text); if (t) (heading ? heading[lang] : cur.x[lang]).push(t); };

    while ((m = re.exec(body))) {
        if (m[0].startsWith('<!--')) continue;
        if (m[5] !== undefined) {           // text
            if (inSkip()) continue;
            const t = decode(m[5]);
            push('fr', t);
            if (!inI18n()) push('en', t);
            continue;
        }
        const close = m[1] === '/', tag = m[2].toLowerCase(), a = m[3] || '';
        if (close) {
            const i = stack.map(s => s.tag).lastIndexOf(tag);
            if (i >= 0) {
                const popped = stack.splice(i);
                if (heading && popped.some(s => s.heading)) {
                    const hfr = clean(heading.fr.join(' ')), hen = clean(heading.en.join(' '));
                    cur = { a: heading.a, h: { fr: hfr, en: hen || hfr }, x: { fr: [], en: [] } };
                    sections.push(cur);
                    heading = null;
                }
            }
            continue;
        }
        if (VOID.has(tag) || m[4] === '/') continue;
        const cls = attr(a, 'class') || '';
        const key = attr(a, 'data-i18n');
        const node = { tag, id: attr(a, 'id'), i18n: !!key, skip: SKIP.has(tag) || BLOCK_SKIP_CLASS.test(cls), heading: false };
        if (['header', 'footer'].includes(tag)) node.skip = true;
        if (/^h[1-3]$/.test(tag) && !inSkip() && !heading) {
            node.heading = true;
            heading = { a: node.id || anchor(), fr: [], en: [] };
        }
        stack.push(node);
        if (key && !inSkip()) {
            const v = resolve(en, key);
            if (typeof v === 'string') push('en', stripTags(v));
        }
    }

    const join = arr => clean(arr.join(' '));
    const secs = sections
        .map(s => ({ a: s.a, h: s.h, x: { fr: join(s.x.fr), en: join(s.x.en) || join(s.x.fr) } }))
        .filter(s => s.h.fr || s.x.fr);
    const h1 = secs.find(s => s.h.fr) || {};
    return {
        u: rel,
        t: { fr: title, en: enTitle || (h1.h && h1.h.en) || title },
        d: { fr: desc, en: (pageKey === 'home' && en.meta && en.meta.description) || '' },
        s: secs,
    };
}

const pages = listHtml(ROOT).map(indexPage);
const index = { v: 1, pages: [...pages, ...EXTRA] };
const json = JSON.stringify(index);

if (process.argv.includes('--check')) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (current !== json) {
        console.error('search-index.json is out of date: run `node scripts/build-search-index.js` and commit the result.');
        process.exit(1);
    }
    console.log(`search-index.json is up to date (${index.pages.length} entries). OK.`);
} else {
    fs.writeFileSync(OUT, json);
    console.log(`Wrote search-index.json: ${index.pages.length} entries, ${(json.length / 1024).toFixed(0)} KB.`);
}
