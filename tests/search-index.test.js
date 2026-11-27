// Tests du générateur d'index de recherche (scripts/build-search-index.js).
// Lancement : node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const idx = require('../scripts/build-search-index.js');

test('decode : entités nommées, décimales et hexadécimales', () => {
    assert.equal(idx.decode('a &amp; b'), 'a & b');
    assert.equal(idx.decode('l&#39;IUT'), "l'IUT");
    assert.equal(idx.decode('l&#x2019;IUT'), 'l’IUT');
    assert.equal(idx.decode('caf&eacute; &rarr; th&eacute;'), 'café → thé');
    assert.equal(idx.decode('&inconnue;'), '&inconnue;', 'une entité inconnue reste telle quelle');
});

test('stripTags et clean : retirent les balises et normalisent les espaces', () => {
    assert.equal(idx.clean(idx.stripTags('<p>Bonjour <b>Matéo</b></p>')), 'Bonjour Matéo');
    assert.equal(idx.clean('  a \n\t b  '), 'a b');
    assert.equal(idx.clean(idx.stripTags('3 < 4 et <i>5</i>')), '3 < 4 et 5', 'un « < » isolé n’est pas pris pour une balise');
});

test('attr : lit un attribut et décode sa valeur', () => {
    assert.equal(idx.attr(' class="btn" data-i18n="hero.title"', 'data-i18n'), 'hero.title');
    assert.equal(idx.attr(' alt="Caf&eacute;"', 'alt'), 'Café');
    assert.equal(idx.attr(' class="btn"', 'id'), null);
});

test('evalTranslations : exécute translations.js dans un bac à sable', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'translations.js'), 'utf8');
    const tr = idx.evalTranslations(src);
    assert.ok(tr.fr && tr.en, 'les deux langues existent');
    assert.equal(typeof tr.fr.hero.description, 'string');
});

test('indexPage : titres, sections, texte anglais et parties ignorées', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'idx-'));
    const file = path.join(dir, 'page.html');
    fs.writeFileSync(file, `<!doctype html><html><head><title>Ma page | Matéo</title>
<meta name="description" content="Une description"></head>
<body data-page="test">
<header><nav>Menu à ignorer</nav></header>
<main>
<h1 id="haut">Titre principal</h1>
<p>Premier paragraphe.</p>
<h2 id="projets"><span data-i18n="x.title">Projets</span></h2>
<p data-i18n="x.text">Texte en français</p>
<script>var ignore = 1;</script>
</main>
<footer>Pied de page ignoré</footer>
<script>const translations = { fr: {}, en: { x: { title: 'Projects', text: 'English text' } } };</script>
</body></html>`);
    const page = idx.indexPage(file);
    assert.equal(page.t.fr, 'Ma page | Matéo');
    assert.equal(page.d.fr, 'Une description');
    const titres = page.s.map(s => s.h.fr);
    assert.deepEqual(titres, ['Titre principal', 'Projets']);
    const projets = page.s.find(s => s.a === 'projets');
    assert.equal(projets.h.en, 'Projects');
    assert.equal(projets.x.fr, 'Texte en français');
    assert.equal(projets.x.en, 'English text');
    const tout = JSON.stringify(page);
    assert.ok(!tout.includes('Menu à ignorer') && !tout.includes('ignore = 1') && !tout.includes('Pied de page'));
    fs.rmSync(dir, { recursive: true, force: true });
});

test('listHtml : ignore les dossiers techniques et trie les chemins', () => {
    const files = idx.listHtml(path.join(__dirname, '..')).map(f => path.relative(path.join(__dirname, '..'), f).split(path.sep).join('/'));
    assert.ok(files.includes('index.html'));
    assert.ok(files.every(f => !/^(vendor|games|fonts|img|scripts|tests|revisions)\//.test(f)));
    assert.deepEqual(files, [...files].sort((a, b) => (a < b ? -1 : Number(a > b))));
});

test('main : --check confirme un index à jour, et la régénération donne le même fichier', () => {
    const out = path.join(__dirname, '..', 'search-index.json');
    const avant = fs.readFileSync(out, 'utf8');
    const logs = [];
    const log = console.log;
    console.log = m => logs.push(String(m));
    try {
        idx.main(['--check']);
        idx.main([]);
    } finally {
        console.log = log;
    }
    assert.match(logs[0], /up to date/);
    assert.match(logs[1], /Wrote search-index\.json/);
    assert.equal(fs.readFileSync(out, 'utf8'), avant, 'l’index régénéré est identique');
});

test('translationsFor : reconnaît translations.js chargé avec defer ou async', () => {
    for (const tag of ['<script src="translations.js"></script>', '<script src="translations.js" defer></script>', '<script src="../translations.js" async></script>']) {
        const tr = idx.translationsFor('<html><body>' + tag + '</body></html>');
        assert.ok(tr && tr.en && tr.fr, tag);
    }
    assert.equal(idx.translationsFor('<html><body><p>rien</p></body></html>'), null);
});
