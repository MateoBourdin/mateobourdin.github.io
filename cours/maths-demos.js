// Démos interactives du cours de Modélisation mathématique : le code des TD réécrit en JavaScript,
// exécuté dans le navigateur (aucune bibliothèque externe).
(() => {
    'use strict';
    const D = () => window.MATHS_DATA;
    const $ = s => document.querySelector(s);
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#888';
    const PAL = ['#6c7bd9', '#e8833a', '#3f8f74', '#d64570', '#8a74d6'];
    const fmt = (v, d = 3) => Number(v).toFixed(d);

    // ---------- Petit moteur de graphiques (Canvas 2D, net sur écrans haute densité) ----------
    function plot(cv, o) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = cv.clientWidth || cv.width, H = cv.clientHeight || cv.height;
        cv.width = W * dpr; cv.height = H * dpr;
        const c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        const m = { l: 52, r: 14, t: 14, b: 38 };
        const X = v => m.l + (v - o.xmin) / (o.xmax - o.xmin) * (W - m.l - m.r);
        const Y = v => H - m.b - (v - o.ymin) / (o.ymax - o.ymin) * (H - m.t - m.b);
        const text = css('--text-light');
        c.font = '11px Inter, system-ui, sans-serif';
        c.strokeStyle = css('--primary-lighter'); c.fillStyle = text; c.lineWidth = 1;
        const ticks = (a, b, n = 5) => { const s = (b - a) / n; return Array.from({ length: n + 1 }, (_, i) => a + i * s); };
        const lab = v => Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'k' : Math.abs(v) < 10 && v % 1 ? v.toFixed(Math.abs(v) < 1 ? 2 : 1) : Math.round(v);
        c.textAlign = 'right'; c.textBaseline = 'middle';
        ticks(o.ymin, o.ymax).forEach(v => { c.beginPath(); c.moveTo(m.l, Y(v)); c.lineTo(W - m.r, Y(v)); c.stroke(); c.fillText(lab(v), m.l - 6, Y(v)); });
        c.textAlign = 'center'; c.textBaseline = 'top';
        ticks(o.xmin, o.xmax).forEach(v => c.fillText(lab(v), X(v), H - m.b + 6));
        if (o.xlabel) c.fillText(o.xlabel, (m.l + W - m.r) / 2, H - 15);
        if (o.ylabel) { c.save(); c.translate(12, (m.t + H - m.b) / 2); c.rotate(-Math.PI / 2); c.fillText(o.ylabel, 0, 0); c.restore(); }
        return {
            c, X, Y, W, H, m,
            points(xs, ys, color, r = 4, alpha = 1) { c.globalAlpha = alpha; c.fillStyle = color; xs.forEach((x, i) => { c.beginPath(); c.arc(X(x), Y(ys[i]), r, 0, 7); c.fill(); }); c.globalAlpha = 1; },
            line(xs, ys, color, w = 2, dash) { c.strokeStyle = color; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); xs.forEach((x, i) => (i ? c.lineTo(X(x), Y(ys[i])) : c.moveTo(X(x), Y(ys[i])))); c.stroke(); c.setLineDash([]); },
            bars(xs, ys, color, w) { c.fillStyle = color; xs.forEach((x, i) => c.fillRect(X(x) - w / 2, Y(ys[i]), w, Y(o.ymin) - Y(ys[i]))); }
        };
    }
    const range = (a, b) => { let lo = Math.min(...a), hi = Math.max(...a); if (b !== undefined) { lo = Math.min(lo, ...b); hi = Math.max(hi, ...b); } const p = (hi - lo) * 0.08 || 1; return [lo - p, hi + p]; };

    // ================= TD4 : descente de gradient (code de gradient_descent traduit) =================
    function initGD() {
        const box = $('#demo-gd'); if (!box) return;
        const lrIn = $('#gdLr'), itIn = $('#gdIt'), varIn = $('#gdVar'), out = $('#gdOut');
        let anim = null;
        function run(animate) {
            if (anim) cancelAnimationFrame(anim);
            const x = D().rain[varIn.value], y = D().rain.rain;
            const lr = +lrIn.value, nIt = +itIn.value;
            $('#gdLrV').textContent = lr; $('#gdItV').textContent = nIt;
            const mn = Math.min(...x), mx = Math.max(...x), xn = x.map(v => (v - mn) / (mx - mn)), n = x.length;
            const mse = (a, b) => xn.reduce((s, xi, i) => s + (a * xi + b - y[i]) ** 2, 0) / n;
            let a = 0, b = 0; const L = [];
            for (let it = 0; it < nIt; it++) {
                let da = 0, db = 0;
                for (let i = 0; i < n; i++) { const e = a * xn[i] + b - y[i]; da += e * xn[i]; db += e; }
                a -= lr * (2 / n) * da; b -= lr * (2 / n) * db;
                L.push([it, a, b, mse(a, b)]);
                if (!isFinite(a)) break;
            }
            let stab = null;
            for (let i = 1; i < L.length; i++) if (Math.abs(L[i][3] - L[i - 1][3]) < 0.01) { stab = L[i][0]; break; }
            // moindres carrés exacts (référence)
            const xm = x.reduce((s, v) => s + v, 0) / n, ym = y.reduce((s, v) => s + v, 0) / n;
            const slope = x.reduce((s, v, i) => s + (v - xm) * (y[i] - ym), 0) / x.reduce((s, v) => s + (v - xm) ** 2, 0);
            const inter = ym - slope * xm;
            const mseOpt = x.reduce((s, v, i) => s + (slope * v + inter - y[i]) ** 2, 0) / n;
            const draw = k => {
                const [, ak, bk] = L[Math.min(k, L.length - 1)];
                const p1 = plot($('#gdFit'), { xmin: range(x)[0], xmax: range(x)[1], ymin: -2, ymax: 45, xlabel: varIn.value === 'temp' ? 'Température' : 'Humidité', ylabel: 'Pluie' });
                p1.points(x, y, PAL[0], 4.5);
                const xs = [Math.min(...x), Math.max(...x)];
                p1.line(xs, xs.map(v => ak * (v - mn) / (mx - mn) + bk), PAL[1], 2.5);
                p1.line(xs, xs.map(v => slope * v + inter), css('--text-light'), 1, [5, 4]);
                const ms = L.slice(0, k + 1).map(r => r[3]).filter(isFinite);
                const hi = Math.min(Math.max(...L.map(r => r[3]).filter(isFinite)), mseOpt * 3);
                const p2 = plot($('#gdMse'), { xmin: 0, xmax: nIt, ymin: Math.floor(mseOpt - 1), ymax: Math.max(hi, mseOpt + 2), xlabel: 'Itération', ylabel: 'MSE' });
                p2.line(ms.map((_, i) => i), ms.map(v => Math.min(v, Math.max(hi, mseOpt + 2))), PAL[3], 2);
                if (stab !== null && k >= stab) p2.line([stab, stab], [Math.floor(mseOpt - 1), Math.max(hi, mseOpt + 2)], css('--text'), 1, [4, 4]);
                const last = L[Math.min(k, L.length - 1)];
                out.innerHTML = isFinite(last[3])
                    ? `itération ${last[0] + 1} · a = <b>${fmt(last[1], 4)}</b> · b = <b>${fmt(last[2], 4)}</b> · MSE = <b>${fmt(last[3], 4)}</b>${stab !== null ? ` · stabilisation (ε = 0,01) à l’itération <b>${stab}</b>` : ''}<br><span class="cours-source">Optimum des moindres carrés : MSE = ${fmt(mseOpt, 4)} (pointillés). Pas trop grand ⇒ divergence, trop petit ⇒ convergence lente.</span>`
                    : '<b>Divergence</b> : le pas d’apprentissage est trop grand, les coefficients explosent.';
            };
            if (!animate) return draw(L.length - 1);
            let k = 0;
            const step = () => { draw(k); k += Math.max(1, Math.round(nIt / 120)); if (k < L.length) anim = requestAnimationFrame(step); else draw(L.length - 1); };
            step();
        }
        [lrIn, itIn, varIn].forEach(el => el.addEventListener('input', () => run(false)));
        $('#gdRun').addEventListener('click', () => run(true));
        window.addEventListener('resize', () => run(false));
        run(false);
    }

    // ================= TD3 : ACP (StandardScaler + PCA) =================
    function jacobi(A) { // valeurs et vecteurs propres d'une matrice symétrique
        const n = A.length, a = A.map(r => r.slice()), V = a.map((_, i) => a.map((_, j) => +(i === j)));
        for (let sweep = 0; sweep < 60; sweep++) {
            let off = 0;
            for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2;
            if (off < 1e-18) break;
            for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
                if (Math.abs(a[p][q]) < 1e-15) continue;
                const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
                const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
                for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
                for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
                for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
            }
        }
        const idx = a.map((_, i) => i).sort((i, j) => a[j][j] - a[i][i]);
        return { values: idx.map(i => a[i][i]), vectors: idx.map(i => V.map(r => r[i])) };
    }
    function pca(X) {
        const n = X.length, d = X[0].length;
        const mean = Array.from({ length: d }, (_, j) => X.reduce((s, r) => s + r[j], 0) / n);
        const sd = Array.from({ length: d }, (_, j) => Math.sqrt(X.reduce((s, r) => s + (r[j] - mean[j]) ** 2, 0) / n));
        const Z = X.map(r => r.map((v, j) => (v - mean[j]) / sd[j]));
        const C = Array.from({ length: d }, (_, i) => Array.from({ length: d }, (_, j) => Z.reduce((s, r) => s + r[i] * r[j], 0) / (n - 1)));
        const { values, vectors } = jacobi(C);
        const tot = values.reduce((s, v) => s + v, 0);
        const scores = Z.map(r => vectors.slice(0, 2).map(v => v.reduce((s, w, j) => s + w * r[j], 0)));
        return { ratio: values.map(v => v / tot), vectors, scores };
    }
    function initPCA() {
        const box = $('#demo-pca'); if (!box) return;
        const sel = $('#pcaSet');
        const run = () => {
            const ds = D()[sel.value];
            const r = pca(ds.X);
            const pct = r.ratio.map(v => v * 100), cum = pct.reduce((a, v) => (a.push((a[a.length - 1] || 0) + v), a), []);
            const n90 = cum.findIndex(v => v >= 90) + 1;
            const p1 = plot($('#pcaScree'), { xmin: 0.4, xmax: pct.length + 0.6, ymin: 0, ymax: 100, xlabel: 'Composante principale', ylabel: 'Variance expliquée (%)' });
            p1.bars(pct.map((_, i) => i + 1), pct, PAL[0] + 'aa', Math.max(6, (p1.W - 80) / pct.length * 0.6));
            p1.line(cum.map((_, i) => i + 1), cum, PAL[3], 2);
            p1.points(cum.map((_, i) => i + 1), cum, PAL[3], 3);
            p1.line([0.4, pct.length + 0.6], [90, 90], css('--text-light'), 1, [5, 4]);
            const xs = r.scores.map(s => s[0]), ys = r.scores.map(s => s[1]);
            const classes = [...new Set(ds.y)];
            const p2 = plot($('#pcaScatter'), { xmin: range(xs)[0], xmax: range(xs)[1], ymin: range(ys)[0], ymax: range(ys)[1], xlabel: `PC1 (${pct[0].toFixed(1)} %)`, ylabel: `PC2 (${pct[1].toFixed(1)} %)` });
            classes.forEach((cl, k) => {
                const idx = ds.y.map((v, i) => (v === cl ? i : -1)).filter(i => i >= 0);
                p2.points(idx.map(i => xs[i]), idx.map(i => ys[i]), PAL[k], 3.5, 0.85);
            });
            const top = (k) => r.vectors[k].map((w, j) => [ds.cols[j], w]).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 4).map(([c, w]) => `${c} (${w.toFixed(2)})`).join(', ');
            $('#pcaOut').innerHTML = `Variance expliquée : ${pct.slice(0, 5).map(v => v.toFixed(2) + ' %').join(' · ')}${pct.length > 5 ? ' …' : ''}<br><b>${n90}</b> composante${n90 > 1 ? 's' : ''} pour atteindre 90 % · légende : ${classes.map((c, k) => `<span style="color:${PAL[k]}">●</span> ${c}`).join(' ')}<br>Variables qui pèsent le plus sur PC1 : ${top(0)}<br>sur PC2 : ${top(1)}`;
        };
        sel.addEventListener('change', run);
        window.addEventListener('resize', run);
        run();
    }

    // ================= TD3 : compression d'image par ACP =================
    function initImgPCA() {
        const box = $('#demo-img'); if (!box) return;
        const kIn = $('#imgK'), src = $('#imgSrc'), file = $('#imgFile');
        let G = null, w = 0, h = 0, eig = null, mean = null;
        const load = url => new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.src = url; });
        async function prepare(im) {
            const maxW = 160;
            w = Math.min(maxW, im.naturalWidth); h = Math.round(im.naturalHeight * w / im.naturalWidth);
            if (h > 200) { h = 200; w = Math.round(im.naturalWidth * h / im.naturalHeight); }
            const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
            const c = cv.getContext('2d'); c.drawImage(im, 0, 0, w, h);
            const px = c.getImageData(0, 0, w, h).data;
            G = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => { const i = (y * w + x) * 4; return 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]; }));
            // PCA comme sklearn : les lignes sont les individus, les colonnes les variables (centrées)
            mean = Array.from({ length: w }, (_, j) => G.reduce((s, r) => s + r[j], 0) / h);
            const C = Array.from({ length: w }, () => new Float64Array(w));
            for (const r of G) { const z = r.map((v, j) => v - mean[j]); for (let i = 0; i < w; i++) { const zi = z[i]; if (!zi) continue; const Ci = C[i]; for (let j = i; j < w; j++) Ci[j] += zi * z[j]; } }
            const A = Array.from({ length: w }, (_, i) => Array.from({ length: w }, (_, j) => (j >= i ? C[i][j] : C[j][i]) / (h - 1)));
            eig = jacobi(A);
            kIn.max = Math.min(w, h);
            draw();
        }
        function draw() {
            if (!eig) return;
            const k = Math.min(+kIn.value, +kIn.max);
            $('#imgKV').textContent = k;
            const tot = eig.values.reduce((s, v) => s + Math.max(v, 0), 0);
            const kept = eig.values.slice(0, k).reduce((s, v) => s + Math.max(v, 0), 0);
            const V = eig.vectors.slice(0, k);
            const show = (id, M) => {
                const cv = $(id); cv.width = w; cv.height = h;
                const c = cv.getContext('2d'), img = c.createImageData(w, h);
                M.forEach((r, y) => r.forEach((v, x) => { const i = (y * w + x) * 4, g = Math.max(0, Math.min(255, v)); img.data[i] = img.data[i + 1] = img.data[i + 2] = g; img.data[i + 3] = 255; }));
                c.putImageData(img, 0, 0);
            };
            show('#imgOrig', G);
            const R = G.map(r => {
                const z = r.map((v, j) => v - mean[j]);
                const t = V.map(v => v.reduce((s, wj, j) => s + wj * z[j], 0));
                return mean.map((m, j) => m + V.reduce((s, v, q) => s + t[q] * v[j], 0));
            });
            show('#imgRec', R);
            const stored = k * (h + w) + w, raw = h * w;
            $('#imgOut').innerHTML = `${k} composante${k > 1 ? 's' : ''} sur ${Math.min(w, h)} · variance expliquée <b>${(100 * kept / tot).toFixed(2)} %</b> · ${stored.toLocaleString('fr-FR')} nombres stockés au lieu de ${raw.toLocaleString('fr-FR')} (${(100 * stored / raw).toFixed(0)} %)`;
        }
        kIn.addEventListener('input', draw);
        src.addEventListener('change', async () => prepare(await load(src.value)));
        file.addEventListener('change', async () => { const f = file.files[0]; if (!f) return; const url = URL.createObjectURL(f); await prepare(await load(url)); URL.revokeObjectURL(url); });
        load(src.value).then(prepare);
    }

    // ================= TD5 : perceptron et réseau 2-n-1 =================
    function initPerceptron() {
        const box = $('#demo-perc'); if (!box) return;
        const X = [[0, 0], [0, 1], [1, 0], [1, 1]];
        const gates = { OR: [0, 1, 1, 1], AND: [0, 0, 0, 1], XOR: [0, 1, 1, 0], NAND: [1, 1, 1, 0] };
        const step = v => (v > 0 ? 1 : 0); // np.where(x > 0, 1, 0)
        function trainPerc(Y) { // ta fonction train() : poids [0, 0.1], biais 5, pas 0,1, 1000 époques
            let w = [0, 0.1], b = 5;
            for (let e = 0; e < 1000; e++) for (let i = 0; i < 4; i++) {
                const err = Y[i] - step(X[i][0] * w[0] + X[i][1] * w[1] + b);
                w = [w[0] + 0.1 * err * X[i][0], w[1] + 0.1 * err * X[i][1]]; b += 0.1 * err;
            }
            return { f: (x1, x2) => step(x1 * w[0] + x2 * w[1] + b), txt: `poids = [${fmt(w[0], 1)}, ${fmt(w[1], 1)}], biais = ${fmt(b, 2)}` };
        }
        function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
        function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()); }
        function trainMLP(Y, hidden, seed) { // réseau 2-hidden-1, sigmoïde, rétropropagation, lr 0,5, 10 000 époques
            const r = rng(seed), sig = z => 1 / (1 + Math.exp(-z));
            let W1 = [0, 1].map(() => Array.from({ length: hidden }, () => gauss(r))), b1 = Array(hidden).fill(0);
            let W2 = Array.from({ length: hidden }, () => gauss(r)), b2 = 0;
            const fwd = x => { const H = b1.map((bb, j) => sig(x[0] * W1[0][j] + x[1] * W1[1][j] + bb)); return [H, sig(H.reduce((s, hj, j) => s + hj * W2[j], b2))]; };
            for (let e = 0; e < 10000; e++) {
                const gW1 = [Array(hidden).fill(0), Array(hidden).fill(0)], gb1 = Array(hidden).fill(0), gW2 = Array(hidden).fill(0); let gb2 = 0;
                X.forEach((x, i) => {
                    const [H, o] = fwd(x);
                    const eo = (o - Y[i]) * o * (1 - o);
                    H.forEach((hj, j) => { const eh = eo * W2[j] * hj * (1 - hj); gW2[j] += hj * eo; gW1[0][j] += x[0] * eh; gW1[1][j] += x[1] * eh; gb1[j] += eh; });
                    gb2 += eo;
                });
                W2 = W2.map((v, j) => v - 0.5 * gW2[j]); b2 -= 0.5 * gb2;
                W1 = W1.map((row, k) => row.map((v, j) => v - 0.5 * gW1[k][j])); b1 = b1.map((v, j) => v - 0.5 * gb1[j]);
            }
            return { f: (x1, x2) => fwd([x1, x2])[1], txt: `réseau 2-${hidden}-1 entraîné (10 000 époques)` };
        }
        function draw(model, Y, soft) {
            const cv = $('#percCanvas'), dpr = Math.min(window.devicePixelRatio || 1, 2), S = cv.clientWidth || 260;
            cv.width = S * dpr; cv.height = S * dpr;
            const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
            const N = 60, pad = 24, cell = (S - 2 * pad) / N;
            for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
                const x1 = -0.25 + 1.5 * (i + 0.5) / N, x2 = -0.25 + 1.5 * (1 - (j + 0.5) / N);
                const v = model.f(x1, x2);
                c.fillStyle = `rgba(${v > 0.5 ? '108,123,217' : '232,131,58'},${soft ? 0.12 + 0.5 * Math.abs(v - 0.5) : 0.28})`;
                c.fillRect(pad + i * cell, pad + j * cell, cell + 0.5, cell + 0.5);
            }
            X.forEach((x, k) => {
                const px = pad + (x[0] + 0.25) / 1.5 * (S - 2 * pad), py = pad + (1 - (x[1] + 0.25) / 1.5) * (S - 2 * pad);
                c.beginPath(); c.arc(px, py, 9, 0, 7); c.fillStyle = Y[k] ? '#6c7bd9' : '#e8833a'; c.fill();
                c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke();
                c.fillStyle = css('--text'); c.font = '11px Inter, sans-serif'; c.textAlign = 'center';
                c.fillText(`(${x[0]},${x[1]})`, px, py + (x[1] ? -16 : 22));
            });
        }
        const run = () => {
            const g = document.querySelector('input[name="percGate"]:checked').value;
            const kind = document.querySelector('input[name="percModel"]:checked').value;
            const Y = gates[g];
            const model = kind === 'perc' ? trainPerc(Y) : trainMLP(Y, kind === 'mlp2' ? 2 : 4, 1 + (+$('#percSeed').value || 0));
            draw(model, Y, kind !== 'perc');
            const rows = X.map((x, k) => { const o = model.f(x[0], x[1]); const p = o > 0.5 ? 1 : 0; return `(${x[0]}, ${x[1]}) → ${kind === 'perc' ? p : fmt(o, 3) + ' → ' + p}  attendu ${Y[k]} ${p === Y[k] ? '<span class="ok">✓</span>' : '<span class="ko">✗</span>'}`; });
            const ok = X.every((x, k) => (model.f(x[0], x[1]) > 0.5 ? 1 : 0) === Y[k]);
            $('#percOut').innerHTML = `${model.txt}\n${rows.join('\n')}\n${ok ? '<span class="ok">Les 4 cas sont bien classés.</span>' : '<span class="ko">Échec : ' + (kind === 'perc' && g === 'XOR' ? 'XOR n’est pas linéairement séparable, une seule droite ne peut pas le résoudre.' : 'réseau bloqué dans un minimum local, change la graine ou passe à 4 neurones.') + '</span>'}`;
        };
        box.querySelectorAll('input').forEach(i => i.addEventListener('change', run));
        $('#percRun').addEventListener('click', run);
        window.addEventListener('resize', run);
        run();
    }

    // ================= TD4/5 : régression logistique, seuil et matrice de confusion =================
    function initLogit() {
        const box = $('#demo-logit'); if (!box) return;
        const L = D().logit, th = $('#logitTh');
        const roc = () => { const pts = []; const ts = [...new Set([1.01, ...L.p, -0.01])].sort((a, b) => b - a); ts.forEach(t => { let tp = 0, fp = 0, P = 0, N = 0; L.p.forEach((p, i) => { if (L.y[i]) { P++; if (p >= t) tp++; } else { N++; if (p >= t) fp++; } }); pts.push([fp / N, tp / P]); }); return pts; };
        const R = roc();
        let auc = 0; for (let i = 1; i < R.length; i++) auc += (R[i][0] - R[i - 1][0]) * (R[i][1] + R[i - 1][1]) / 2;
        const run = () => {
            const t = +th.value; $('#logitThV').textContent = t.toFixed(2);
            let tp = 0, tn = 0, fp = 0, fn = 0;
            L.p.forEach((p, i) => { const pr = p >= t ? 1 : 0; if (pr && L.y[i]) tp++; else if (pr) fp++; else if (L.y[i]) fn++; else tn++; });
            const acc = (tp + tn) / L.p.length, rec = tp / (tp + fn || 1), prec = tp / (tp + fp || 1), f1 = 2 * prec * rec / (prec + rec || 1);
            $('#logitCm').innerHTML = `<table class="cours-table" style="display:table;max-width:360px"><thead><tr><th></th><th>prédit 0</th><th>prédit 1</th></tr></thead><tbody><tr><th>réel 0</th><td><b>${tn}</b> VN</td><td><b>${fp}</b> FP</td></tr><tr><th>réel 1</th><td><b>${fn}</b> FN</td><td><b>${tp}</b> VP</td></tr></tbody></table>`;
            $('#logitOut').innerHTML = `Exactitude <b>${fmt(acc, 3)}</b> · Rappel <b>${fmt(rec, 3)}</b> · Précision <b>${fmt(prec, 3)}</b> · F1 <b>${fmt(f1, 3)}</b> · AUC <b>${fmt(auc, 3)}</b>`;
            const p1 = plot($('#logitScatter'), { xmin: 0, xmax: 10, ymin: 0, ymax: 10, xlabel: 'x1 (heures de travail)', ylabel: 'x2 (heures de sommeil)' });
            const idx0 = [], idx1 = [];
            L.p.forEach((p, i) => ((p >= t) ? idx1 : idx0).push(i));
            p1.points(idx0.map(i => L.x1[i]), idx0.map(i => L.x2[i]), '#e8833a', 4, 0.9);
            p1.points(idx1.map(i => L.x1[i]), idx1.map(i => L.x2[i]), '#6c7bd9', 4, 0.9);
            L.p.forEach((p, i) => { if ((p >= t ? 1 : 0) !== L.y[i]) { p1.c.strokeStyle = '#dc2626'; p1.c.lineWidth = 2; p1.c.beginPath(); p1.c.arc(p1.X(L.x1[i]), p1.Y(L.x2[i]), 8, 0, 7); p1.c.stroke(); } });
            p1.line([0, 10], [10, 0], css('--text-light'), 1, [5, 4]);
            const p2 = plot($('#logitRoc'), { xmin: 0, xmax: 1, ymin: 0, ymax: 1, xlabel: 'Taux de faux positifs', ylabel: 'Taux de vrais positifs' });
            p2.line([0, 1], [0, 1], css('--text-light'), 1, [5, 4]);
            p2.line(R.map(r => r[0]), R.map(r => r[1]), PAL[0], 2.5);
            p2.points([fp / (fp + tn || 1)], [rec], PAL[3], 6);
        };
        th.addEventListener('input', run);
        window.addEventListener('resize', run);
        run();
    }

    // ================= TD6 : CNN Fashion-MNIST (inférence en JavaScript) =================
    const CLASSES = ['T-shirt/haut', 'Pantalon', 'Pull', 'Robe', 'Manteau', 'Sandale', 'Chemise', 'Basket', 'Sac', 'Bottine'];
    function initCNN() {
        const box = $('#demo-cnn'); if (!box) return;
        let net = null, samples = null, labels = null;
        const f16 = h => { const s = (h & 0x8000) ? -1 : 1, e = (h >> 10) & 0x1f, f = h & 0x3ff; return e === 0 ? s * 2 ** -14 * (f / 1024) : e === 31 ? (f ? NaN : s * Infinity) : s * 2 ** (e - 15) * (1 + f / 1024); };
        async function load() {
            const [wb, sb] = await Promise.all([fetch('cours/maths/td6-weights.bin').then(r => r.arrayBuffer()), fetch('cours/maths/td6-samples.bin').then(r => r.arrayBuffer())]);
            const u16 = new Uint16Array(wb), all = Float32Array.from(u16, f16);
            const take = (() => { let o = 0; return n => { const a = all.subarray(o, o + n); o += n; return a; }; })();
            net = { k: take(3 * 3 * 1 * 32), kb: take(32), d1: take(5408 * 32), d1b: take(32), d2: take(32 * 10), d2b: take(10) };
            const s = new Uint8Array(sb); labels = s.subarray(0, 200); samples = s.subarray(200);
        }
        function predict(img) { // img : Float32Array(784) dans [0, 1]
            const conv = new Float32Array(26 * 26 * 32);
            for (let y = 0; y < 26; y++) for (let x = 0; x < 26; x++) for (let f = 0; f < 32; f++) {
                let s = net.kb[f];
                for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) s += img[(y + dy) * 28 + x + dx] * net.k[(dy * 3 + dx) * 32 + f];
                conv[(y * 26 + x) * 32 + f] = s > 0 ? s : 0; // ReLU
            }
            const pool = new Float32Array(13 * 13 * 32); // MaxPooling 2x2, puis Flatten dans l'ordre (h, w, c) de Keras
            for (let y = 0; y < 13; y++) for (let x = 0; x < 13; x++) for (let f = 0; f < 32; f++) {
                let m = -Infinity;
                for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) m = Math.max(m, conv[((2 * y + dy) * 26 + 2 * x + dx) * 32 + f]);
                pool[(y * 13 + x) * 32 + f] = m;
            }
            const h = new Float32Array(32);
            for (let j = 0; j < 32; j++) { let s = net.d1b[j]; for (let i = 0; i < 5408; i++) s += pool[i] * net.d1[i * 32 + j]; h[j] = s > 0 ? s : 0; }
            const z = Array.from({ length: 10 }, (_, j) => { let s = net.d2b[j]; for (let i = 0; i < 32; i++) s += h[i] * net.d2[i * 10 + j]; return s; });
            const mx = Math.max(...z), e = z.map(v => Math.exp(v - mx)), t = e.reduce((a, b) => a + b, 0);
            return e.map(v => v / t);
        }
        function showProbs(p, truth) {
            const best = p.indexOf(Math.max(...p));
            $('#cnnOut').innerHTML = `<div class="cnn-pred">Prédiction : <b>${CLASSES[best]}</b> (${(100 * p[best]).toFixed(1)} %)${truth !== undefined ? ` · vraie classe : <b>${CLASSES[truth]}</b> ${best === truth ? '<span class="ok">✓</span>' : '<span class="ko">✗</span>'}` : ''}</div>` +
                p.map((v, i) => `<div class="cnn-bar${i === best ? ' best' : ''}"><span>${CLASSES[i]}</span><i style="width:${Math.max(0.5, 100 * v)}%"></i><b>${(100 * v).toFixed(1)} %</b></div>`).join('');
        }
        function drawTo(cv, px) {
            const c = cv.getContext('2d'), im = c.createImageData(28, 28);
            for (let i = 0; i < 784; i++) { const v = px[i]; im.data[i * 4] = v; im.data[i * 4 + 1] = v; im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
            c.putImageData(im, 0, 0);
        }
        async function start() {
            $('#cnnLoad').disabled = true; $('#cnnLoad').textContent = 'Chargement du modèle…';
            await load();
            $('#cnnLoad').hidden = true; $('#cnnUi').hidden = false;
            const grid = $('#cnnGrid'); grid.innerHTML = '';
            let correct = 0;
            for (let k = 0; k < 200; k++) {
                const px = samples.subarray(k * 784, (k + 1) * 784);
                const img = Float32Array.from(px, v => v / 255);
                const p = predict(img), best = p.indexOf(Math.max(...p));
                if (best === labels[k]) correct++;
                if (k < 48) {
                    const b = document.createElement('button'); b.type = 'button'; b.className = 'cnn-thumb' + (best === labels[k] ? '' : ' wrong');
                    b.setAttribute('aria-label', `Image ${k + 1} : ${CLASSES[labels[k]]}`);
                    const cv = document.createElement('canvas'); cv.width = 28; cv.height = 28; drawTo(cv, px); b.appendChild(cv);
                    b.addEventListener('click', () => { drawTo($('#cnnBig'), px); showProbs(p, labels[k]); grid.querySelectorAll('.on').forEach(x => x.classList.remove('on')); b.classList.add('on'); });
                    grid.appendChild(b);
                }
            }
            $('#cnnAcc').textContent = `${correct} / 200 images de test bien classées ici (${(correct / 2).toFixed(1)} %).`;
            grid.firstChild.click();
            initDraw();
        }
        function initDraw() {
            const cv = $('#cnnDraw'), c = cv.getContext('2d');
            const clear = () => { c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height); };
            clear();
            let down = false;
            const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
            const dot = e => { const [x, y] = pos(e); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 13, 0, 7); c.fill(); };
            cv.addEventListener('pointerdown', e => { down = true; cv.setPointerCapture(e.pointerId); dot(e); e.preventDefault(); });
            cv.addEventListener('pointermove', e => { if (down) dot(e); });
            cv.addEventListener('pointerup', () => { down = false; classify(); });
            $('#cnnClear').addEventListener('click', () => { clear(); });
            function classify() {
                const t = document.createElement('canvas'); t.width = 28; t.height = 28;
                const tc = t.getContext('2d'); tc.imageSmoothingQuality = 'high'; tc.drawImage(cv, 0, 0, 28, 28);
                const d = tc.getImageData(0, 0, 28, 28).data, px = new Uint8Array(784);
                for (let i = 0; i < 784; i++) px[i] = d[i * 4];
                drawTo($('#cnnBig'), px);
                showProbs(predict(Float32Array.from(px, v => v / 255)));
            }
        }
        $('#cnnLoad').addEventListener('click', start);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const ready = () => { initGD(); initPCA(); initPerceptron(); initLogit(); initImgPCA(); initCNN(); };
        // les graphiques ont besoin de leur taille réelle : on attend que l'onglet soit visible
        let done = false;
        const go = () => { if (done || document.getElementById('tab-rendus').hidden) return; done = true; ready(); };
        document.addEventListener('cours:tab', go);
        setTimeout(go, 0);
    });
})();
