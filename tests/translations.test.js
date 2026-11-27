// Les traductions françaises et anglaises doivent avoir exactement les mêmes clés, sans texte vide.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { evalTranslations } = require('../scripts/build-search-index.js');

const tr = evalTranslations(fs.readFileSync(path.join(__dirname, '..', 'translations.js'), 'utf8'));

function keys(o, prefix = '') {
    return Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, prefix + k + '.') : [prefix + k]));
}
const get = (o, k) => k.split('.').reduce((n, p) => n[p], o);

test('mêmes clés en français et en anglais', () => {
    const fr = new Set(keys(tr.fr)), en = new Set(keys(tr.en));
    assert.deepEqual([...fr].filter(k => !en.has(k)), [], 'clés absentes en anglais');
    assert.deepEqual([...en].filter(k => !fr.has(k)), [], 'clés absentes en français');
});

test('aucun texte vide', () => {
    for (const lang of ['fr', 'en']) {
        const vides = keys(tr[lang]).filter(k => typeof get(tr[lang], k) === 'string' && !get(tr[lang], k).trim());
        assert.deepEqual(vides, [], `textes vides en ${lang}`);
    }
});

test('la date de mise à jour des mentions légales est la même dans les deux langues', () => {
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const fr = tr.fr.legal.updated.match(/(\d+) (\S+) (\d{4})/), en = tr.en.legal.updated.match(/(\d+) (\S+) (\d{4})/);
    assert.ok(fr && en);
    assert.deepEqual([fr[1], mois.indexOf(fr[2]), fr[3]], [en[1], months.indexOf(en[2]), en[3]]);
});
