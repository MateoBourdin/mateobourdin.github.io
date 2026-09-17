#!/usr/bin/env node
/**
 * Verifies that every data-i18n="..." key referenced in an HTML page
 * resolves to an actual string in every language of that page's own
 * translations object. Catches the class of bug where a page references
 * a key that was never added (or added to only one language), which
 * silently renders as "undefined" instead of failing loudly.
 *
 * Most pages on this site each carry their own inline `const translations
 * = {...}` script rather than sharing one file, so this checks each page
 * against whichever translations object that same page defines or loads.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function listHtmlFiles(dir, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            listHtmlFiles(full, out);
        } else if (entry.name.endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

// The <script> block that declares `const translations = {...}` on most
// pages also contains ordinary page-init code (DOM lookups, event
// listeners) mixed into the same block. Rather than trying to carve out
// just the object literal, we run the whole block with permissive no-op
// stubs for the browser globals it touches, so that code executes
// harmlessly and we can read back `translations` afterwards.
function makeStub() {
    const fn = function stub() { return makeStub(); };
    return new Proxy(fn, {
        get(target, prop) {
            if (prop === Symbol.toPrimitive || prop === 'then' || prop === 'toJSON') return undefined;
            if (prop === 'toString') return () => '';
            return makeStub();
        },
        apply() { return makeStub(); },
    });
}

function evalTranslations(jsSource) {
    const fn = new Function(
        'document', 'window', 'localStorage', 'navigator',
        jsSource + '\nreturn typeof translations !== "undefined" ? translations : undefined;'
    );
    return fn(makeStub(), makeStub(), makeStub(), makeStub());
}

function findTranslationsForFile(file, text) {
    // Case 1: the page defines its own inline `const translations = {...}`
    // inside one of its <script> blocks.
    const scriptBlocks = [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
    for (const [, body] of scriptBlocks) {
        if (/const\s+translations\s*=\s*\{/.test(body)) {
            return evalTranslations(body);
        }
    }

    // Case 2: the page loads the shared translations.js file.
    if (/<script src="(?:\.\.\/)?translations\.js">/.test(text)) {
        const shared = fs.readFileSync(path.join(ROOT, 'translations.js'), 'utf8');
        return evalTranslations(shared);
    }

    return null;
}

function resolveKey(tree, keyPath) {
    let node = tree;
    for (const part of keyPath.split('.')) {
        if (node == null || typeof node !== 'object' || !(part in node)) {
            return undefined;
        }
        node = node[part];
    }
    return node;
}

function main() {
    const htmlFiles = listHtmlFiles(ROOT, []);
    const keyPattern = /data-i18n="([^"]+)"/g;
    const failures = [];
    let checkedKeys = 0;
    let checkedFiles = 0;

    for (const file of htmlFiles) {
        const text = fs.readFileSync(file, 'utf8');
        const keysInFile = [...text.matchAll(keyPattern)].map((m) => m[1]);
        if (keysInFile.length === 0) continue;

        const translations = findTranslationsForFile(file, text);
        if (!translations) {
            failures.push(`${path.relative(ROOT, file)}: uses data-i18n but no translations object (inline or shared) could be found`);
            continue;
        }

        const languages = Object.keys(translations);
        if (languages.length === 0) {
            failures.push(`${path.relative(ROOT, file)}: translations object has no languages`);
            continue;
        }

        checkedFiles++;
        for (const key of keysInFile) {
            checkedKeys++;
            for (const lang of languages) {
                const value = resolveKey(translations[lang], key);
                if (value === undefined) {
                    failures.push(`${path.relative(ROOT, file)}: data-i18n="${key}" is missing from translations.${lang}`);
                } else if (typeof value === 'object') {
                    failures.push(`${path.relative(ROOT, file)}: data-i18n="${key}" resolves to an object in translations.${lang}, not a string (incomplete key path)`);
                }
            }
        }
    }

    console.log(`Checked ${checkedKeys} data-i18n references across ${checkedFiles} HTML files.`);

    if (failures.length > 0) {
        console.error('\ni18n check FAILED:\n');
        for (const f of failures) console.error('  - ' + f);
        process.exit(1);
    }

    console.log('All data-i18n keys resolve in every language. OK.');
}

main();
