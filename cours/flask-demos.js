// Démos R5.A.05 : TP2 (Flask-SQLAlchemy sur Chinook), TP3 (requêtes Flux du dashboard InfluxDB), TP4 (modèles Keras de mon app).
(() => {
    'use strict';
    const $ = s => document.querySelector(s);
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const code = (txt, lang, title) => window.Cours.codeBlock(txt, lang, title);

    // ================= TP2 : les routes de mon app, rejouées sur la vraie base Chinook =================
    const SQL = {
        artists: 'SELECT artists."ArtistId" AS "artists_ArtistId", artists."Name" AS "artists_Name"\nFROM artists ORDER BY artists."Name"',
        albums: 'SELECT albums."AlbumId" AS "albums_AlbumId", albums."Title" AS "albums_Title", albums."ArtistId" AS "albums_ArtistId"\nFROM albums ORDER BY albums."Title"',
        join: 'SELECT DISTINCT artists."ArtistId" AS "artists_ArtistId", artists."Name" AS "artists_Name"\nFROM artists JOIN albums ON artists."ArtistId" = albums."ArtistId" ORDER BY artists."Name"',
        selectin: 'SELECT albums."ArtistId", albums."AlbumId", albums."Title"\nFROM albums\nWHERE albums."ArtistId" IN (?, ?, ?, … 204 identifiants)',
        lazy: 'SELECT albums."AlbumId" AS "albums_AlbumId", albums."Title" AS "albums_Title", albums."ArtistId" AS "albums_ArtistId"\nFROM albums\nWHERE ? = albums."ArtistId"          -- une fois PAR artiste',
        joined: 'SELECT DISTINCT artists."ArtistId" AS "artists_ArtistId", artists."Name" AS "artists_Name",\n       albums_1."AlbumId" AS "albums_1_AlbumId", albums_1."Title" AS "albums_1_Title", albums_1."ArtistId" AS "albums_1_ArtistId"\nFROM artists JOIN albums ON artists."ArtistId" = albums."ArtistId"\n     LEFT OUTER JOIN albums AS albums_1 ON artists."ArtistId" = albums_1."ArtistId"\nORDER BY artists."Name"'
    };
    function initTP2() {
        const nav = $('#tp2Routes'); if (!nav || !window.FLASK_CHINOOK) return;
        const { artists, albums } = window.FLASK_CHINOOK;
        const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
        const albumsOf = new Map(); albums.forEach(a => { if (!albumsOf.has(a[2])) albumsOf.set(a[2], []); albumsOf.get(a[2]).push(a); });
        const frame = $('#tp2Frame'), url = $('#tp2Url'), sqlBox = $('#tp2Sql'), strat = $('#tp2Strategy');
        const page = (heading, count, label, body) => `<h1>${esc(heading)}</h1><p class="count">${count} ${label}</p>${body}`;
        const ROUTES = {
            '/': () => [page('Chinook Database', 0, 'records', '<p>Choose a route to view artists, albums, or artists with albums.</p>'), null, 0],
            '/artists': () => {
                const rows = artists.slice().sort((a, b) => byName(a[1], b[1]));
                return [page('Artists', rows.length, 'artists', '<ul class="records">' + rows.map(a => `<li><span class="artist-name">${esc(a[1])}</span> <span>(ID: ${a[0]})</span></li>`).join('') + '</ul>'), [SQL.artists], 1];
            },
            '/albums': () => {
                const rows = albums.slice().sort((a, b) => byName(a[1], b[1]));
                return [page('Albums', rows.length, 'albums', '<ul class="records">' + rows.map(a => `<li><span class="artist-name">${esc(a[1])}</span> <span>(Artist ID: ${a[2]})</span></li>`).join('') + '</ul>'), [SQL.albums], 1];
            },
            '/artists-with-albums': () => {
                const rows = artists.filter(a => albumsOf.has(a[0])).sort((a, b) => byName(a[1], b[1]));
                const html = page('Artists with Albums', rows.length, 'artists', '<ul class="records">' + rows.map(a => `<li><span class="artist-name">${esc(a[1])}</span><ul class="album-list">${albumsOf.get(a[0]).map(b => `<li>${esc(b[1])}</li>`).join('')}</ul></li>`).join('') + '</ul>');
                const s = strat.value;
                const sql = s === 'lazy' ? [SQL.join, SQL.lazy] : s === 'joined' ? [SQL.joined] : [SQL.join, SQL.selectin];
                return [html, sql, s === 'lazy' ? 205 : s === 'joined' ? 1 : 2];
            },
            '/heatindex': () => ['<h1>Not Found</h1><p>The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.</p>', null, 0, 404]
        };
        let current = '/';
        const show = path => {
            current = path;
            nav.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === path)));
            const [html, sql, n, status] = ROUTES[path]();
            url.innerHTML = `<span class="http s${status === 404 ? 4 : 2}">${status || 200}</span> GET ${esc(path)}`;
            frame.innerHTML = html; frame.scrollTop = 0;
            $('#tp2StratRow').hidden = path !== '/artists-with-albums';
            sqlBox.innerHTML = '';
            if (sql) {
                const p = document.createElement('p'); p.className = 'cours-source';
                p.innerHTML = `<b>${n}</b> requête${n > 1 ? 's' : ''} SQL envoyée${n > 1 ? 's' : ''} à SQLite pour cette page (relevé avec <code>SQLALCHEMY_ECHO</code>) :`;
                sqlBox.appendChild(p);
                sql.forEach((q, i) => sqlBox.appendChild(code(q, 'sql', sql.length > 1 ? `requête ${i + 1}${q === SQL.lazy ? ' (× 204)' : ''}` : 'SQL généré')));
            } else if (path === '/heatindex') {
                sqlBox.innerHTML = '<p class="cours-source">Le gabarit <code>heatindex.html</code> existe, mais aucune route <code>/heatindex</code> n’est déclarée dans <code>routes.py</code> : Flask répond 404.</p>';
            }
        };
        Object.keys(ROUTES).forEach(p => {
            const b = document.createElement('button'); b.type = 'button'; b.dataset.path = p;
            b.innerHTML = `<span class="verb get">GET</span><span>${esc(p)}</span>`;
            b.addEventListener('click', () => show(p)); nav.appendChild(b);
        });
        strat.addEventListener('change', () => show(current));
        show('/artists-with-albums');
    }

    // ================= TP3 : les requêtes Flux que construit mon dashboard =================
    function initTP3() {
        const f = $('#tp3Form'); if (!f) return;
        const QUOTES = ['EUR', 'GBP', 'JPY', 'CHF', 'CAD'], SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT'];
        const box = (name, list, on) => list.map(v => `<label><input type="checkbox" name="${name}" value="${v}"${on.includes(v) ? ' checked' : ''}> ${v}</label>`).join('');
        $('#tp3Quotes').innerHTML = box('quotes', QUOTES, ['EUR', 'GBP', 'CHF']);
        $('#tp3Symbols').innerHTML = box('symbols', SYMBOLS, ['BTCUSDT', 'ETHUSDT']);
        const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const run = () => {
            const location = $('#tp3Loc').value, base = $('#tp3Base').value;
            const quotes = [...f.querySelectorAll('[name=quotes]:checked')].map(x => x.value);
            const symbols = [...f.querySelectorAll('[name=symbols]:checked')].map(x => x.value);
            const params = new URLSearchParams([['location', location], ['base', base], ...quotes.map(q => ['quotes', q]), ...symbols.map(s => ['symbols', s])]);
            // Ce que fait index() : request.args.get("quotes", "").split(",")  -> seulement la PREMIÈRE valeur
            const got = (k, fallback) => { const v = params.get(k) || ''; const l = v.split(',').map(x => x.trim()).filter(Boolean); return l.length ? l : fallback; };
            const q2 = got('quotes', QUOTES), s2 = got('symbols', SYMBOLS);
            $('#tp3Url').textContent = '/?' + params.toString();
            $('#tp3Read').innerHTML = `<code>request.args.get("quotes")</code> → <b>${esc(JSON.stringify(params.get('quotes')))}</b>, donc <code>forex_quotes</code> = <b>${esc(JSON.stringify(q2))}</b>` +
                ` · <code>crypto_symbols</code> = <b>${esc(JSON.stringify(s2))}</b>` +
                (quotes.length > 1 || symbols.length > 1 ? ' <span class="ko">(les autres cases cochées sont ignorées)</span>' : '');
            const weather = `from(bucket: "weather")\n  |> range(start: -7d)\n  |> filter(fn: (r) => r._measurement == "weather_current")\n  |> filter(fn: (r) => r.location == "${location}")\n  |> filter(fn: (r) => r._field == "temperature_2m" or r._field == "apparent_temperature")\n  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)`;
            const forex = `from(bucket: "forex")\n  |> range(start: -7d)\n  |> filter(fn: (r) => r._measurement == "forex")\n  |> filter(fn: (r) => r.base == "${base}")\n    |> filter(fn: (r) => r.quote =~ /^${q2.map(reEsc).join('|')}$/)\n  |> filter(fn: (r) => r._field == "rate")\n  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)`;
            const crypto = `from(bucket: "crypto")\n  |> range(start: -7d)\n  |> filter(fn: (r) => r._measurement == "crypto")\n  |> filter(fn: (r) => r._field == "price")\n  |> filter(fn: (r) => r.symbol =~ /^${s2.map(reEsc).join('|')}$/)\n  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)`;
            const out = $('#tp3Out'); out.innerHTML = '';
            out.appendChild(code(weather, 'flux', 'panneau « Weather current »'));
            out.appendChild(code(forex, 'flux', 'panneau « Forex current prices »'));
            out.appendChild(code(crypto, 'flux', 'panneau « Crypto current prices »'));
            $('#tp3Inject').hidden = !/["\\]/.test(location);
        };
        f.addEventListener('input', run); f.addEventListener('submit', e => { e.preventDefault(); run(); });
        $('#tp3Evil').addEventListener('click', () => { $('#tp3Loc').value = 'annecy") |> drop(columns: ["location'; run(); });
        run();
    }

    // ================= TP4 : mon app de classification d'images, dans le navigateur =================
    const MODELS = {
        mnist: { display: 'MNIST', type: 'grayscale_28', size: '0,3 Mo', labels: '0123456789'.split(''), samples: 'samples-mnist.bin', w: 28, ch: 1, invertSample: true },
        fashion_mnist: { display: 'Fashion-MNIST', type: 'grayscale_28', size: '0,1 Mo', labels: ['T-shirt / haut', 'Pantalon', 'Pull', 'Robe', 'Manteau', 'Sandale', 'Chemise', 'Basket', 'Sac', 'Bottine'], samples: 'samples-fashion.bin', w: 28, ch: 1, invertSample: true },
        cifar10: { display: 'CIFAR-10', type: 'rgb_32', size: '1,3 Mo', labels: ['avion', 'automobile', 'oiseau', 'chat', 'cerf', 'chien', 'grenouille', 'cheval', 'bateau', 'camion'], samples: 'samples-cifar.bin', w: 32, ch: 3 },
        cifar100: { display: 'CIFAR-100', type: 'rgb_32', size: '6,8 Mo', labels: 'apple aquarium_fish baby bear beaver bed bee beetle bicycle bottle bowl boy bridge bus butterfly camel can castle caterpillar cattle chair chimpanzee clock cloud cockroach couch crab crocodile cup dinosaur dolphin elephant flatfish forest fox girl hamster house kangaroo keyboard lamp lawn_mower leopard lion lizard lobster man maple_tree motorcycle mountain mouse mushroom oak_tree orange orchid otter palm_tree pear pickup_truck pine_tree plain plate poppy porcupine possum rabbit raccoon ray road rocket rose sea seal shark shrew skunk skyscraper snail snake spider squirrel streetcar sunflower sweet_pepper table tank telephone television tiger tractor train trout tulip turtle wardrobe whale willow_tree wolf woman worm'.split(' ').map(s => s.replace(/_/g, ' ')), samples: 'samples-cifar.bin', w: 32, ch: 3, sampleLabels: ['avion', 'automobile', 'oiseau', 'chat', 'cerf', 'chien', 'grenouille', 'cheval', 'bateau', 'camion'] }
    };
    const cache = {}, sampleCache = {};
    const fetchBuf = u => fetch(u).then(r => { if (!r.ok) throw new Error(u + ' : ' + r.status); return r.arrayBuffer(); });
    async function getModel(name) {
        if (!cache[name]) cache[name] = Promise.all([fetch(`cours/flask/${name}.json`).then(r => r.json()), fetchBuf(`cours/flask/${name}.bin`)]).then(([s, b]) => window.FlaskNN.load(s, b));
        return cache[name];
    }
    const L24 = (r, g, b) => (r * 19595 + g * 38470 + b * 7471 + 0x8000) >> 16; // conversion « L » de Pillow

    // Prétraitement de exo.py : convert("L") -> invert -> resize((28,28), NEAREST) -> /255
    function preExo28(cv) {
        const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, x = new Float32Array(784), sx = cv.width / 28, sy = cv.height / 28;
        for (let y = 0; y < 28; y++) for (let i = 0; i < 28; i++) {
            const px = Math.min(cv.width - 1, Math.floor((i + 0.5) * sx)), py = Math.min(cv.height - 1, Math.floor((y + 0.5) * sy)), o = (py * cv.width + px) * 4;
            x[y * 28 + i] = (255 - L24(d[o], d[o + 1], d[o + 2])) / 255;
        }
        return x;
    }
    // Prétraitement « façon MNIST » : recadrer sur le tracé, réduire à 20 px par moyenne, centrer par centre de masse dans 28×28
    function preMnistLike(cv) {
        const W = cv.width, H = cv.height, d = cv.getContext('2d').getImageData(0, 0, W, H).data, g = new Float32Array(W * H);
        let x0 = W, y0 = H, x1 = -1, y1 = -1;
        for (let i = 0; i < W * H; i++) { const v = (255 - L24(d[4 * i], d[4 * i + 1], d[4 * i + 2])) / 255; g[i] = v; if (v > 0.1) { const x = i % W, y = (i / W) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
        const out = new Float32Array(784); if (x1 < 0) return out;
        const bw = x1 - x0 + 1, bh = y1 - y0 + 1, f = Math.max(bw, bh) / 20, tw = Math.max(1, Math.round(bw / f)), th = Math.max(1, Math.round(bh / f)), s = new Float32Array(tw * th);
        for (let ty = 0; ty < th; ty++) for (let tx = 0; tx < tw; tx++) {
            const ax = x0 + Math.floor(tx * f), bx = Math.min(x1 + 1, x0 + Math.max(Math.floor((tx + 1) * f), Math.floor(tx * f) + 1));
            const ay = y0 + Math.floor(ty * f), by = Math.min(y1 + 1, y0 + Math.max(Math.floor((ty + 1) * f), Math.floor(ty * f) + 1));
            let sum = 0, n = 0; for (let y = ay; y < by; y++) for (let x = ax; x < bx; x++) { sum += g[y * W + x]; n++; }
            s[ty * tw + tx] = n ? sum / n : 0;
        }
        let m = 0, cx = 0, cy = 0; for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) { const v = s[y * tw + x]; m += v; cx += v * x; cy += v * y; }
        const ox = Math.round(14 - (m ? cx / m : tw / 2)), oy = Math.round(14 - (m ? cy / m : th / 2));
        for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) { const X = x + ox, Y = y + oy; if (X >= 0 && X < 28 && Y >= 0 && Y < 28) out[Y * 28 + X] = Math.min(1, s[y * tw + x]); }
        return out;
    }
    // Prétraitement de exo.py pour CIFAR : convert("RGB") -> resize((32,32), BILINEAR) -> /255
    function preRgb32(cv) {
        const t = document.createElement('canvas'); t.width = t.height = 32;
        const c = t.getContext('2d'); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(cv, 0, 0, 32, 32);
        const d = c.getImageData(0, 0, 32, 32).data, x = new Float32Array(32 * 32 * 3);
        for (let i = 0; i < 1024; i++) { x[3 * i] = d[4 * i] / 255; x[3 * i + 1] = d[4 * i + 1] / 255; x[3 * i + 2] = d[4 * i + 2] / 255; }
        return x;
    }
    function drawInput(target, x, w, ch) {
        const c = target.getContext('2d'), img = c.createImageData(w, w);
        for (let i = 0; i < w * w; i++) {
            const v = ch === 1 ? [x[i], x[i], x[i]] : [x[3 * i], x[3 * i + 1], x[3 * i + 2]];
            img.data[4 * i] = v[0] * 255; img.data[4 * i + 1] = v[1] * 255; img.data[4 * i + 2] = v[2] * 255; img.data[4 * i + 3] = 255;
        }
        target.width = target.height = w; c.putImageData(img, 0, 0);
    }

    function initTP4() {
        const root = $('#tp4App'); if (!root || !window.FlaskNN) return;
        const cv = $('#tp4Canvas'), ctx = cv.getContext('2d'), sel = $('#tp4Model'), pre = $('#tp4Pre'), out = $('#tp4Out'), grid = $('#tp4Samples');
        let name = 'mnist', busy = false;
        const clear = () => { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, cv.width, cv.height); };
        clear();
        // Tracé (comme draw.html : trait noir de 18 px sur fond blanc)
        ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'black';
        let drawing = false, last = null;
        const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
        cv.addEventListener('pointerdown', e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.arc(last[0], last[1], 9, 0, 7); ctx.fillStyle = 'black'; ctx.fill(); });
        cv.addEventListener('pointermove', e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; });
        const stop = () => { if (drawing) { drawing = false; predict(); } };
        cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop); cv.addEventListener('pointerleave', stop);
        $('#tp4Clear').addEventListener('click', () => { clear(); out.innerHTML = '<p class="cours-source">Result: -</p>'; $('#tp4In').getContext('2d').clearRect(0, 0, 40, 40); });
        $('#tp4Predict').addEventListener('click', () => predict());
        $('#tp4File').addEventListener('change', e => {
            const f = e.target.files[0]; if (!f) return;
            const img = new Image(); img.onload = () => {
                clear(); const s = Math.min(cv.width / img.width, cv.height / img.height), w = img.width * s, h = img.height * s;
                ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h); URL.revokeObjectURL(img.src); predict();
            }; img.src = URL.createObjectURL(f);
        });
        pre.addEventListener('change', () => predict());

        async function loadSamples() {
            const want = name, m = MODELS[name], key = m.samples;
            grid.innerHTML = '';
            if (!sampleCache[key]) sampleCache[key] = fetchBuf('cours/flask/' + key).then(b => new Uint8Array(b));
            const u8 = await sampleCache[key];
            if (want !== name) return;
            const n = m.w === 28 ? 40 : 50, sz = m.w * m.w * m.ch, labels = m.sampleLabels || m.labels;
            grid.innerHTML = '';
            for (let k = 0; k < n; k++) {
                const px = u8.subarray(n + k * sz, n + (k + 1) * sz), b = document.createElement('button'); b.type = 'button'; b.className = 'tp4-thumb';
                b.title = 'Image de test : ' + labels[u8[k]];
                const c = document.createElement('canvas'); c.width = c.height = m.w; const cc = c.getContext('2d'), im = cc.createImageData(m.w, m.w);
                for (let i = 0; i < m.w * m.w; i++) {
                    const v = m.ch === 1 ? (m.invertSample ? 255 - px[i] : px[i]) : null;
                    im.data[4 * i] = m.ch === 1 ? v : px[3 * i]; im.data[4 * i + 1] = m.ch === 1 ? v : px[3 * i + 1]; im.data[4 * i + 2] = m.ch === 1 ? v : px[3 * i + 2]; im.data[4 * i + 3] = 255;
                }
                cc.putImageData(im, 0, 0); b.appendChild(c);
                b.addEventListener('click', () => {
                    clear(); ctx.imageSmoothingEnabled = m.ch === 3; ctx.drawImage(c, 0, 0, cv.width, cv.height); ctx.imageSmoothingEnabled = true;
                    grid.querySelectorAll('.on').forEach(x => x.classList.remove('on')); b.classList.add('on'); predict(labels[u8[k]]);
                });
                grid.appendChild(b);
            }
        }

        let pending = null;
        async function predict(truth) {
            if (busy) { pending = { truth }; return; }
            busy = true;
            const m = MODELS[name];
            out.innerHTML = `<p class="cours-source">${cache[name] ? 'Calcul…' : `Chargement du modèle ${m.display} (${m.size})…`}</p>`;
            try {
                const model = await getModel(name);
                await new Promise(r => setTimeout(r, 30));
                const x = m.type === 'rgb_32' ? preRgb32(cv) : (name === 'mnist' && pre.value === 'mnist') ? preMnistLike(cv) : preExo28(cv);
                drawInput($('#tp4In'), x, m.w, m.ch);
                const t = performance.now(), r = window.FlaskNN.predict(model, x), ms = performance.now() - t;
                const cls = r.out.indexOf(Math.max(...r.out)), conf = r.out[cls];
                const json = `{\n  "class": ${cls},\n  "confidence": ${conf}\n}`;
                const top = r.probs.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0]).slice(0, 5);
                out.innerHTML = `<p class="tp4-result">Result: ${cls} (conf ${Math.round(conf * 100)}%)</p>` +
                    (r.hasSoftmax ? '' : `<p class="cours-box piege tp4-warn"><b>Bug reproduit :</b> ce modèle n’a pas de softmax en sortie, donc <code>np.max(preds)</code> est un logit, pas une probabilité. Avec softmax, la confiance serait de <b>${(100 * r.probs[cls]).toFixed(1)} %</b>.</p>`) +
                    `<div class="tp4-json"></div>` +
                    `<div class="cnn-pred">Classe ${cls} = <b>${esc(m.labels[cls])}</b>${truth ? ` · image de test étiquetée <b>${esc(truth)}</b>` : ''}</div>` +
                    top.map(([p, i]) => `<div class="cnn-bar${i === cls ? ' best' : ''}"><span>${esc(m.labels[i])}</span><i style="width:${Math.max(0.5, 100 * p)}%"></i><b>${(100 * p).toFixed(1)} %</b></div>`).join('') +
                    `<p class="cours-source">Calcul fait par ton navigateur en ${Math.round(ms)} ms.</p>`;
                out.querySelector('.tp4-json').appendChild(code(json, 'json', `POST /predict/${name} · réponse`));
            } catch (e) {
                out.innerHTML = `<p class="cours-source">Erreur : ${esc(e.message)}</p>`;
            }
            busy = false;
            if (pending) { const t = pending.truth; pending = null; predict(t); }
        }

        const setModel = n => {
            name = n; sel.value = n; const m = MODELS[n];
            $('#tp4Title').textContent = m.display;
            $('#tp4PreRow').hidden = n !== 'mnist'; if (n !== 'mnist') pre.value = 'exo';
            $('#tp4DrawHint').textContent = n === 'mnist' ? 'Dessine un chiffre, choisis une image de test ou envoie une photo.' : n === 'fashion_mnist' ? 'Choisis une image de test ou envoie la photo d’un vêtement sur fond blanc.' : 'Choisis une image de test ou envoie une photo (elle sera réduite à 32 × 32 pixels).';
            clear(); out.innerHTML = '<p class="cours-source">Result: -</p>'; loadSamples();
        };
        sel.addEventListener('change', () => setModel(sel.value));
        setModel('mnist');
    }

    document.addEventListener('DOMContentLoaded', () => { initTP2(); initTP3(); initTP4(); });
})();
