// Sélecteur de style du site : Sobre (par défaut) et les styles à thème.
// Le choix est mémorisé dans le navigateur (clé « siteStyle ») et posé sur
// <html data-style="…"> ; le script en tête de chaque page l'applique avant
// l'affichage pour éviter un flash. Seul l'habillage change, jamais le contenu.
(function () {
    'use strict';
    var KEY = 'siteStyle';
    var ICONS = {
        sobre: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/>',
        espace: '<circle cx="12" cy="12" r="5.5"/><path d="M3.5 15.5c-2-2.5 3-6 8.5-7.8s10-1.8 9.2 1.3"/><path d="M20.5 8.5c2 2.5-3 6-8.5 7.8"/>',
        retro: '<rect x="2" y="7" width="20" height="11" rx="3"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1"/><circle cx="18" cy="14" r="1"/>',
        maths: '<path d="M4 2v18h18"/><path d="M6 16c3-11 6-11 8-4s4 4 6-4"/>'
    };
    // Styles disponibles (les suivants seront ajoutés au fur et à mesure)
    var STYLES = [
        { id: 'sobre', fr: 'Sobre', en: 'Plain' },
        { id: 'espace', fr: 'Mine spatiale', en: 'Space mining' }
    ];
    var ALLOWED = STYLES.map(function (s) { return s.id; });

    function lang() {
        try { return localStorage.getItem('preferredLanguage') === 'en' ? 'en' : 'fr'; } catch (e) { return 'fr'; }
    }
    function current() {
        var s = null;
        try { s = localStorage.getItem(KEY); } catch (e) {}
        return ALLOWED.indexOf(s) > 0 ? s : 'sobre';
    }
    function apply(id) {
        if (id === 'sobre') document.documentElement.removeAttribute('data-style');
        else document.documentElement.setAttribute('data-style', id);
        try { localStorage.setItem(KEY, id); } catch (e) {}
    }

    var group = null;
    function render() {
        if (!group) return;
        var cur = current(), L = lang();
        group.setAttribute('aria-label', L === 'en' ? 'Site style' : 'Style du site');
        group.textContent = '';
        STYLES.forEach(function (s) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'style-btn';
            b.setAttribute('aria-pressed', String(s.id === cur));
            b.setAttribute('aria-label', (L === 'en' ? 'Style: ' : 'Style : ') + s[L]);
            b.title = s[L];
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.setAttribute('aria-hidden', 'true');
            svg.innerHTML = ICONS[s.id]; // contenu statique de ce fichier, jamais une entrée utilisateur
            var label = document.createElement('span');
            label.className = 'style-label';
            label.textContent = s[L];
            b.append(svg, label);
            b.addEventListener('click', function () { apply(s.id); render(); });
            group.appendChild(b);
        });
    }

    // ---- Effets de clic (décoratifs, ne retardent jamais la navigation) ----
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    function burst(x, y) {
        var st = current();
        if (reduce.matches || st === 'sobre') return;
        if (st === 'espace') {
            var colors = ['#ffb547', '#4fd1e8', '#ffb547', '#ffd59a', '#4fd1e8', '#ffb547'];
            colors.forEach(function (c, i) {
                var a = (Math.PI * 2 * i) / colors.length + Math.random() * 0.6;
                var d = 38 + Math.random() * 30;
                var el = document.createElement('span');
                el.className = 'style-fx style-fx-shard';
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.setProperty('--c', c);
                el.style.setProperty('--dx', Math.round(Math.cos(a) * d) + 'px');
                el.style.setProperty('--dy', Math.round(Math.sin(a) * d) + 'px');
                document.body.appendChild(el);
                setTimeout(function () { el.remove(); }, 650);
            });
        }
    }

    function init() {
        group = document.createElement('div');
        group.className = 'style-switcher';
        group.setAttribute('role', 'group');
        // Le sélecteur se place dans la même barre que le choix de langue
        var bar = document.querySelector('nav .lang-switcher') || document.querySelector('.language-switcher');
        if (bar) bar.insertBefore(group, bar.firstChild);
        else {
            group.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:1000;background:var(--surface);padding:.35rem;border:0';
            document.body.appendChild(group);
        }
        apply(current());
        render();
        document.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('.lang-btn')) setTimeout(render, 0);
        });
        document.addEventListener('pointerdown', function (e) {
            var t = e.target.closest && e.target.closest('.btn, .project-link, .github-btn, .back-btn, .style-btn');
            if (t) burst(e.clientX, e.clientY);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
