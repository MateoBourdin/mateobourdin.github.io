// Mini moteur d'inférence pour les CNN Keras du TP4 (R5.A.05).
// Les poids viennent directement des fichiers .h5 de mon dépôt : BatchNorm fusionné dans la convolution,
// noyaux quantifiés en int8 par canal de sortie (même classe prédite que le modèle d'origine sur 97,6 à 100 % des images testées).
(function (root) {
    'use strict';
    const ACT = {
        relu: x => (x > 0 ? x : 0),
        elu: x => (x > 0 ? x : Math.expm1(x)),
        linear: x => x
    };

    function load(spec, buf) {
        const layers = spec.layers.map(L => {
            if (!('k' in L)) return L;
            const n = (L.t === 'conv' ? L.ks * L.ks * L.cin : L.cin) * L.out;
            const q = new Int8Array(buf, L.k, n), s = new Float32Array(buf, L.s, L.out), b = new Float32Array(buf, L.b, L.out);
            const k = new Float32Array(n);
            for (let i = 0; i < n; i++) k[i] = q[i] * s[i % L.out];
            return Object.assign({}, L, { W: k, B: Float32Array.from(b) });
        });
        return { layers, input: spec.input };
    }

    function conv(x, H, W, C, L) {
        const ks = L.ks, O = L.out, p = L.pad === 'same' ? (ks - 1) >> 1 : 0;
        const oh = H + 2 * p - ks + 1, ow = W + 2 * p - ks + 1, y = new Float32Array(oh * ow * O), K = L.W, B = L.B;
        const f = L.act === 'linear' || L.act === 'softmax' ? null : ACT[L.act];
        const acc = new Float32Array(O);
        for (let oy = 0; oy < oh; oy++) for (let ox = 0; ox < ow; ox++) {
            acc.set(B);
            for (let ky = 0; ky < ks; ky++) {
                const iy = oy + ky - p; if (iy < 0 || iy >= H) continue;
                for (let kx = 0; kx < ks; kx++) {
                    const ix = ox + kx - p; if (ix < 0 || ix >= W) continue;
                    const xo = (iy * W + ix) * C, ko = (ky * ks + kx) * C * O;
                    for (let c = 0; c < C; c++) {
                        const v = x[xo + c]; if (v === 0) continue;
                        const kr = ko + c * O;
                        for (let o = 0; o < O; o++) acc[o] += v * K[kr + o];
                    }
                }
            }
            const yo = (oy * ow + ox) * O;
            if (f) for (let o = 0; o < O; o++) y[yo + o] = f(acc[o]); else y.set(acc, yo);
        }
        return [y, oh, ow, O];
    }

    function pool(x, H, W, C) {
        const oh = H >> 1, ow = W >> 1, y = new Float32Array(oh * ow * C);
        for (let oy = 0; oy < oh; oy++) for (let ox = 0; ox < ow; ox++) for (let c = 0; c < C; c++) {
            const a = ((2 * oy) * W + 2 * ox) * C + c, b = a + W * C;
            y[(oy * ow + ox) * C + c] = Math.max(x[a], x[a + C], x[b], x[b + C]);
        }
        return [y, oh, ow, C];
    }

    function dense(x, L) {
        const I = L.cin, O = L.out, y = Float32Array.from(L.B), K = L.W;
        for (let i = 0; i < I; i++) { const v = x[i]; if (v === 0) continue; const r = i * O; for (let o = 0; o < O; o++) y[o] += v * K[r + o]; }
        if (L.act !== 'linear' && L.act !== 'softmax') for (let o = 0; o < O; o++) y[o] = ACT[L.act](y[o]);
        return y;
    }

    function softmax(v) {
        const m = Math.max(...v), e = Array.from(v, x => Math.exp(x - m)), s = e.reduce((a, b) => a + b, 0);
        return e.map(x => x / s);
    }

    // x : Float32Array H*W*C (canaux en dernier, valeurs 0..1). Renvoie la sortie brute de la dernière couche.
    function predict(model, x) {
        let [H, W, C] = model.input, cur = x;
        for (const L of model.layers) {
            if (L.t === 'conv') [cur, H, W, C] = conv(cur, H, W, C, L);
            else if (L.t === 'pool') [cur, H, W, C] = pool(cur, H, W, C);
            else if (L.t === 'flat') { /* NHWC déjà aplati dans l'ordre de Keras */ }
            else cur = dense(cur, L);
        }
        // logits : avant softmax ; out : ce que renvoie model.predict() en Keras (softmax seulement si la dernière couche l'a)
        const last = model.layers[model.layers.length - 1], logits = Array.from(cur), probs = softmax(logits);
        return { logits, probs, out: last.act === 'softmax' ? probs : logits, hasSoftmax: last.act === 'softmax' };
    }

    const api = { load, predict, softmax };
    if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FlaskNN = api;
})(this);
