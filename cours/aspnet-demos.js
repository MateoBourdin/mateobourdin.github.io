// Explorateur de l'API TPRevision : réponses réelles enregistrées en lançant l'API (dotnet run) sur un jeu de données de démonstration.
(() => {
    'use strict';
    const POST_400 = '{"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1","title":"One or more validation errors occurred.","status":400,"errors":{"MarqueNavigation":["The MarqueNavigation field is required."],"TypeProduitNavigation":["The TypeProduitNavigation field is required."]}}';
    const POST_BODY = '{\n  "nomProduit": "Pixel 11",\n  "description": "Smartphone Google",\n  "nomPhoto": "pixel11.jpg",\n  "uriPhoto": "/img/pixel11.jpg",\n  "idMarque": 2,\n  "idTypeProduit": 1,\n  "stockReel": 9, "stockMin": 4, "stockMax": 20\n}';
    const CALLS = [
        { v: 'get', path: '/Product/GetAll', key: 'Product_GetAll', code: 200, note: 'Liste de ProduitDto : la marque et le type sont des noms, pas des identifiants (projection AutoMapper <code>ProjectTo</code>).' },
        { v: 'get', path: '/Product/GetById/2', key: 'Product_GetById_2', code: 200, note: 'ProduitDetailDto : <code>enReappro</code> est calculé côté serveur (stock 3 &lt; minimum 5).' },
        { v: 'get', path: '/Product/GetById/1', key: 'Product_GetById_1', code: 200, note: 'Stock 12 ≥ minimum 5 : <code>enReappro</code> vaut false.' },
        { v: 'get', path: '/Product/GetById/99', key: 'Product_GetById_99', code: 404, note: 'Identifiant inconnu : le contrôleur renvoie <code>NotFound()</code>.' },
        { v: 'get', path: '/Product/GetById/6', key: 'Product_GetById_6', code: 500, note: 'Produit dont le stock réel est NULL : la comparaison <code>stockReel &lt; stockMin</code> traduite en SQL renvoie NULL, qui ne rentre pas dans le booléen <code>EnReappro</code>. Le test unitaire du mapping passe pourtant (il ne passe pas par la base).' },
        { v: 'get', path: '/Product/GetAllWithDetails', key: 'Product_GetAllWithDetails', code: 200, note: 'Les entités brutes avec <code>Include</code> : navigations et listes imbriquées. C’est précisément ce que les DTO évitent d’exposer.' },
        { v: 'post', path: '/Product/AddProduct', body: POST_BODY, raw: POST_400, code: 400, note: 'L’entité <code>Produit</code> sert de modèle d’entrée : ses propriétés de navigation non nullables deviennent obligatoires. Un DTO d’entrée (ex. <code>ProduitCreateDto</code>) réglerait le problème.' },
        { v: 'get', path: '/api/marque/GetAll', key: 'api_marque_GetAll', code: 200, note: 'MarqueDto avec le nombre de produits (<code>NbProduits</code> calculé par le mapping).' },
        { v: 'get', path: '/api/marque/GetById/42', key: 'api_marque_GetById_42', code: 404, note: 'Réponse 404 au format ProblemDetails (RFC 9110).' },
        { v: 'get', path: '/TypeProduit/GetById/2', key: 'TypeProduit_GetById_2', code: 200, note: 'Même structure de contrôleur pour les types de produits.' }
    ];
    const pretty = s => { try { return JSON.stringify(JSON.parse(s), null, 2); } catch (e) { return s.split('\n').slice(0, 4).join('\n') + '\n   …'; } };
    const reason = { 200: 'OK', 400: 'Bad Request', 404: 'Not Found', 500: 'Internal Server Error' };
    document.addEventListener('DOMContentLoaded', () => {
        const list = document.getElementById('apiList'), out = document.getElementById('apiOut');
        if (!list) return;
        const show = (c, btn) => {
            list.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
            const body = c.raw || (window.ASPNET_API || {})[c.key] || '';
            let txt = pretty(body);
            if (c.key === 'Product_GetAllWithDetails' && txt.length > 2600) txt = txt.slice(0, 2600) + '\n  … (réponse tronquée pour l’affichage)';
            out.innerHTML = `<div class="http s${String(c.code)[0]}">HTTP ${c.code} ${reason[c.code]}</div><p class="cours-source">${c.note}</p>`;
            if (c.body) out.appendChild(window.Cours.codeBlock(c.body, 'json', `${c.v.toUpperCase()} ${c.path} · corps de la requête`));
            if (txt.trim()) out.appendChild(window.Cours.codeBlock(txt, c.code === 500 ? 'sh' : 'json', 'réponse'));
        };
        CALLS.forEach((c, i) => {
            const b = document.createElement('button'); b.type = 'button';
            b.innerHTML = `<span class="verb ${c.v}">${c.v.toUpperCase()}</span><span>${c.path}</span>`;
            b.addEventListener('click', () => show(c, b));
            list.appendChild(b);
            if (!i) show(c, b);
        });
    });
})();
