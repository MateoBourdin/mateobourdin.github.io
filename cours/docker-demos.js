// Démos du cours Docker / CI : le code des exercices exécuté pour de vrai dans le navigateur.
(() => {
    'use strict';
    const F = () => window.COURS_FILES || {};
    const $ = s => document.querySelector(s);
    const out = (el, html) => { el.innerHTML = html; el.scrollTop = el.scrollHeight; };
    const e = s => window.Cours.esc(s);

    // ---- ex10 : sketch.pde (arbre fractal) traduit de Processing vers Canvas 2D ------------
    function hsb(h, s, b) { // colorMode(HSB, 360, 100, 100)
        s /= 100; b /= 100;
        const k = n => (n + h / 60) % 6;
        const f = n => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
        return `rgb(${Math.round(f(5) * 255)},${Math.round(f(3) * 255)},${Math.round(f(1) * 255)})`;
    }
    const map = (v, a, b, c, d) => c + (d - c) * ((v - a) / (b - a));
    function initTree() {
        const cv = $('#ex10Canvas');
        if (!cv) return;
        const ctx = cv.getContext('2d');
        const W = 800, H = 500;
        let mouseX = W * 0.45;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            cv.width = W * dpr; cv.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw();
        };
        function branch(len, depth) {
            ctx.strokeStyle = hsb(map(depth, 0, 11, 30, 160), 70, 100);
            ctx.lineWidth = map(len, 2, 140, 1, 8);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
            ctx.translate(0, -len);
            if (len > 4) {
                ctx.save(); ctx.rotate(angle); branch(len * 0.67, depth + 1); ctx.restore();
                ctx.save(); ctx.rotate(-angle); branch(len * 0.67, depth + 1); ctx.restore();
            }
        }
        let angle = 0;
        function draw() {
            ctx.save();
            ctx.fillStyle = hsb(230, 30, 8);
            ctx.fillRect(0, 0, W, H);
            angle = map(mouseX, 0, W, 0, Math.PI / 2);
            ctx.translate(W / 2, H);
            ctx.lineCap = 'round';
            branch(140, 0);
            ctx.restore();
        }
        const move = ev => {
            const r = cv.getBoundingClientRect();
            mouseX = Math.max(0, Math.min(W, (ev.clientX - r.left) * W / r.width));
            draw();
        };
        cv.addEventListener('pointermove', move);
        cv.addEventListener('pointerdown', move);
        resize();
    }

    // ---- Lanceur de tests JavaScript (API Jest minimale : test, describe, expect) --------
    function makeModule(src, req) {
        const module = { exports: {} };
        new Function('module', 'exports', 'require', src)(module, module.exports, req);
        return module.exports;
    }
    function runJest(project, testFile, deps) {
        const files = F()[project];
        const results = [];
        let prefix = [];
        const expect = actual => ({
            toBe(exp) { if (!Object.is(actual, exp)) throw new Error(`expect(received).toBe(expected)\n\n    Expected: ${JSON.stringify(exp)}\n    Received: ${JSON.stringify(actual)}`); },
            toThrow() { let thrown = false; try { actual(); } catch (err) { thrown = true; } if (!thrown) throw new Error('expect(received).toThrow()\n\n    Received function did not throw'); }
        });
        const req = name => {
            const path = deps[name];
            if (!path) throw new Error('Module introuvable : ' + name);
            return makeModule(files[path], req);
        };
        const t0 = performance.now();
        const test = (name, fn) => {
            const s = performance.now();
            try { fn(); results.push({ name: [...prefix, name], ok: true, ms: performance.now() - s }); }
            catch (err) { results.push({ name: [...prefix, name], ok: false, err: err.message }); }
        };
        const describe = (name, fn) => { prefix.push(name); fn(); prefix.pop(); };
        new Function('test', 'it', 'describe', 'expect', 'require', files[testFile])(test, test, describe, expect, req);
        const pass = results.filter(r => r.ok).length;
        let txt = `<span class="${pass === results.length ? 'ok' : 'ko'}">${pass === results.length ? 'PASS' : 'FAIL'}</span> ${e(testFile)}\n`;
        let last = '';
        results.forEach(r => {
            const group = r.name.slice(0, -1).join(' › ');
            if (group && group !== last) { txt += `  ${e(group)}\n`; last = group; }
            txt += `${group ? '    ' : '  '}${r.ok ? '<span class="ok">✓</span>' : '<span class="ko">✕</span>'} ${e(r.name[r.name.length - 1])} <span class="dim">(${Math.max(0, r.ms || 0).toFixed(1)} ms)</span>\n`;
            if (!r.ok) txt += `<span class="ko">      ${e(r.err)}</span>\n`;
        });
        txt += `\nTests:       ${pass === results.length ? '<span class="ok">' + pass + ' passed</span>' : '<span class="ko">' + (results.length - pass) + ' failed</span>, ' + pass + ' passed'}, ${results.length} total\nTime:        ${((performance.now() - t0) / 1000).toFixed(3)} s <span class="dim">(dans ce navigateur)</span>`;
        return txt;
    }

    // ---- Lanceur Python via Pyodide (mini-runner compatible avec pytest.raises) --------
    let pyodideP = null;
    function loadPy() {
        if (pyodideP) return pyodideP;
        pyodideP = new Promise((ok, ko) => {
            const s = document.createElement('script');
            s.src = 'vendor/pyodide/pyodide.js';
            s.onload = () => window.loadPyodide({ indexURL: 'vendor/pyodide/' }).then(ok, ko);
            s.onerror = () => ko(new Error('Pyodide indisponible'));
            document.head.appendChild(s);
        });
        return pyodideP;
    }
    const PY_RUNNER = `
import sys, types, time, importlib, traceback, contextlib, io
class _Raises:
    def __init__(self, exc): self.exc = exc
    def __enter__(self): return self
    def __exit__(self, t, v, tb):
        if t is None: raise AssertionError("DID NOT RAISE " + self.exc.__name__)
        return issubclass(t, self.exc)
pytest = types.ModuleType("pytest"); pytest.raises = _Raises
sys.modules["pytest"] = pytest
sys.path.insert(0, "/ex16")
for m in ("calc", "test_calc"): sys.modules.pop(m, None)
mod = importlib.import_module("test_calc")
lines, ok = [], 0
names = [n for n in dir(mod) if n.startswith("test_")]
names.sort(key=lambda n: mod.__dict__[n].__code__.co_firstlineno)
t0 = time.perf_counter()
for i, n in enumerate(names):
    pct = int(100 * (i + 1) / len(names))
    try:
        getattr(mod, n)(); ok += 1
        lines.append(f"python/test_calc.py::{n} PASSED [{pct:3d}%]")
    except Exception as e:
        lines.append(f"python/test_calc.py::{n} FAILED [{pct:3d}%]  {type(e).__name__}: {e}")
lines.append(f"\\n{ok} passed, {len(names) - ok} failed in {time.perf_counter() - t0:.3f}s (Python {sys.version.split()[0]}, Pyodide)")
"\\n".join(lines)
`;
    async function runPy(btn, term) {
        btn.disabled = true;
        out(term, '<span class="dim">Chargement de Python (Pyodide, WebAssembly)… quelques secondes la première fois.</span>');
        try {
            const py = await loadPy();
            const f = F().ex16;
            py.FS.mkdirTree('/ex16');
            py.FS.writeFile('/ex16/calc.py', f['python/calc.py']);
            py.FS.writeFile('/ex16/test_calc.py', f['python/test_calc.py']);
            const res = py.runPython(PY_RUNNER);
            out(term, e(res).replace(/PASSED/g, '<span class="ok">PASSED</span>').replace(/FAILED/g, '<span class="ko">FAILED</span>'));
        } catch (err) {
            out(term, '<span class="ko">' + e(err.message) + '</span>');
        }
        btn.disabled = false;
    }

    // ---- Scénario Cypress (home.cy.js) rejoué sur l'appli de l'exercice ---------------------
    function initE2E() {
        const frame = $('#e2eFrame'), btn = $('#e2eRun'), term = $('#e2eTerm');
        if (!frame || !btn) return;
        const html = F().endtoendtesting['app/index.html'];
        const visit = () => new Promise(r => { frame.onload = () => r(); frame.srcdoc = html; });
        visit();
        const wait = ms => new Promise(r => setTimeout(r, ms));
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const log = [];
            const show = () => out(term, log.join('\n'));
            const step = async (txt, fn) => {
                log.push(`    <span class="dim">${e(txt)}</span>`); show(); await wait(350);
                const ok = fn();
                log[log.length - 1] = `    ${ok ? '<span class="ok">✓</span>' : '<span class="ko">✕</span>'} ${e(txt)}`; show();
                if (!ok) throw new Error(txt);
            };
            const doc = () => frame.contentDocument;
            log.push('  Page d\'accueil');
            let pass = 0;
            const t0 = performance.now();
            try {
                log.push('  <b>it("affiche le titre")</b>');
                await visit();
                await step('cy.visit("/")', () => true);
                await step('cy.get("#title").should("contain.text", "Bienvenue")', () => doc().querySelector('#title').textContent.includes('Bienvenue'));
                pass++;
                log.push('  <b>it("affiche un message au clic sur le bouton")</b>');
                await visit();
                await step('cy.visit("/")', () => true);
                await step('cy.get("#message").should("be.empty")', () => doc().querySelector('#message').textContent === '');
                await step('cy.get("#greet").click()', () => { doc().querySelector('#greet').click(); return true; });
                await step('cy.get("#message").should("contain.text", "Bonjour !")', () => doc().querySelector('#message').textContent.includes('Bonjour !'));
                pass++;
            } catch (err) { /* l'étape en échec est déjà marquée */ }
            log.push(`\n  <span class="${pass === 2 ? 'ok' : 'ko'}">${pass} passing</span> <span class="dim">(${Math.round(performance.now() - t0)} ms, dans ce navigateur)</span>`);
            show();
            btn.disabled = false;
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTree();
        initE2E();
        const jsBtn = $('#jestRun'), jsTerm = $('#jestTerm');
        if (jsBtn) jsBtn.addEventListener('click', () => {
            const which = document.querySelector('input[name="jestProj"]:checked').value;
            try {
                out(jsTerm, which === 'ex11'
                    ? runJest('ex11', 'test/index.test.js', { '../src/index': 'src/index.js' })
                    : runJest('ex16', 'node/calc.test.js', { './calc': 'node/calc.js' }));
            } catch (err) { out(jsTerm, '<span class="ko">' + e(err.message) + '</span>'); }
        });
        const pyBtn = $('#pyRun');
        if (pyBtn) pyBtn.addEventListener('click', () => runPy(pyBtn, $('#pyTerm')));
    });
})();
