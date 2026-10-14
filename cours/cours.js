// Pages de cours : onglets, coloration du code, explorateur de fichiers, pipelines, quiz et cartes.
(() => {
    'use strict';

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
    };
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
    const fr = () => (document.documentElement.lang || 'fr') !== 'en';

    // ---- Onglets (synchronisés avec l'ancre de l'URL) -------------------------------
    function initTabs() {
        const tabs = [...document.querySelectorAll('.cours-tab')];
        if (!tabs.length) return;
        const show = (id, focus) => {
            const tab = tabs.find(t => t.dataset.tab === id) || tabs[0];
            tabs.forEach(t => {
                const on = t === tab;
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
            if (focus) tab.focus();
            document.dispatchEvent(new CustomEvent('cours:tab', { detail: tab.dataset.tab }));
        };
        tabs.forEach((t, i) => {
            t.addEventListener('click', () => {
                history.replaceState(null, '', '#' + t.dataset.tab);
                show(t.dataset.tab);
                const bar = document.querySelector('.cours-tabs-bar');
                const hh = (document.getElementById('header') || {}).offsetHeight || 0;
                if (bar && bar.getBoundingClientRect().top <= hh + 2) window.scrollTo({ top: bar.offsetTop - hh });
            });
            t.addEventListener('keydown', e => {
                const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                if (!d) return;
                const n = tabs[(i + d + tabs.length) % tabs.length];
                history.replaceState(null, '', '#' + n.dataset.tab);
                show(n.dataset.tab, true);
            });
        });
        const fromHash = () => {
            const h = location.hash.slice(1);
            if (!h) return show(tabs[0].dataset.tab);
            const tab = tabs.find(t => t.dataset.tab === h);
            if (tab) return show(h);
            const el = document.getElementById(h); // ancre interne : ouvrir l'onglet qui la contient
            const panel = el && el.closest('.cours-panel');
            if (panel) {
                show(panel.id.replace(/^tab-/, ''));
                if (el.tagName === 'DETAILS') el.open = true;
                requestAnimationFrame(() => el.scrollIntoView());
            } else show(tabs[0].dataset.tab);
        };
        window.addEventListener('hashchange', fromHash);
        fromHash();
        document.querySelectorAll('.cours-goto').forEach(a => a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            if (!document.getElementById(id) && !tabs.some(t => t.dataset.tab === id)) return;
            e.preventDefault();
            history.replaceState(null, '', '#' + id);
            fromHash();
        }));
    }

    // ---- Coloration syntaxique (un seul passage, sans dépendance) ---------------------
    const KW = {
        cs: 'abstract as async await base bool break case catch class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach get goto if implicit in init int interface internal is lock long namespace new null object operator out override params partial private protected public readonly record ref return sealed set short static string struct switch this throw true try typeof uint ulong using var virtual void volatile where while yield',
        py: 'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield self',
        js: 'async await break case catch class const continue default delete do else export extends false finally for from function if import in instanceof let new null of return super switch this throw true try typeof undefined var void while yield require module exports',
        yaml: 'true false null',
        docker: 'FROM RUN CMD COPY ADD WORKDIR EXPOSE ENV ARG ENTRYPOINT USER VOLUME LABEL HEALTHCHECK AS',
        sh: 'if then else fi for in do done echo export cd sleep docker npm npx pip python python3 node curl seq break',
        sql: 'SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE PRIMARY KEY FOREIGN REFERENCES NOT NULL INTEGER JOIN ON AND OR AS GROUP BY ORDER LIMIT COUNT CONSTRAINT INDEX',
        php: 'echo function return if else php',
        processing: 'void float int if else return true false',
        json: 'true false null'
    };
    const KWSET = {};
    Object.keys(KW).forEach(l => { KWSET[l] = new Set(KW[l].split(' ').map(w => l === 'sql' || l === 'docker' ? w.toUpperCase() : w)); });
    function highlight(src, lang) {
        lang = lang === 'csharp' ? 'cs' : lang === 'python' ? 'py' : lang === 'javascript' ? 'js' : lang === 'bash' ? 'sh' : lang === 'yml' ? 'yaml' : lang;
        const hash = ['py', 'yaml', 'sh', 'docker'].includes(lang);
        const slash = ['cs', 'js', 'php', 'processing'].includes(lang);
        const dash = lang === 'sql';
        const parts = [];
        const re = new RegExp([
            slash ? '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/' : null,
            hash ? '#[^\\n]*' : null,
            dash ? '--[^\\n]*' : null,
            '"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`',
            '\\$\\{?[A-Za-z_][A-Za-z0-9_]*\\}?',
            '\\b\\d+(?:\\.\\d+)?\\b',
            '[A-Za-z_][A-Za-z0-9_]*',
            '[\\s\\S]'
        ].filter(Boolean).join('|'), 'g');
        const kw = KWSET[lang] || new Set();
        let m;
        while ((m = re.exec(src))) {
            const t = m[0];
            const next = src.slice(re.lastIndex).match(/^\s*(\(|:)/);
            let cls = null;
            if ((slash && (t.startsWith('//') || t.startsWith('/*'))) || (hash && t.startsWith('#')) || (dash && t.startsWith('--'))) cls = 'c';
            else if (/^["'`]/.test(t)) cls = 's';
            else if (t[0] === '$') cls = (lang === 'sh' || lang === 'yaml' || lang === 'docker') ? 'v' : null;
            else if (/^\d/.test(t)) cls = 'n';
            else if (/^[A-Za-z_]/.test(t)) {
                const key = (lang === 'sql' || lang === 'docker') ? t.toUpperCase() : t;
                if (kw.has(key) && (lang !== 'docker' || t === t.toUpperCase())) cls = 'k';
                else if (lang === 'yaml' && next && next[1] === ':' && /^\s*$/.test(src.slice(src.lastIndexOf('\n', m.index) + 1, m.index).replace(/-/g, ' '))) cls = 'f';
                else if (next && next[1] === '(' && lang !== 'yaml') cls = 'f';
                else if (/^[A-Z][a-z]/.test(t) && ['cs', 'js', 'py'].includes(lang)) cls = 't';
            }
            parts.push(cls ? `<span class="tk-${cls}">${esc(t)}</span>` : esc(t));
        }
        return parts.join('');
    }
    function codeBlock(code, lang, title) {
        const wrap = document.createElement('div');
        wrap.className = 'cours-code';
        wrap.innerHTML = `<div class="cours-code-head"><span>${esc(title || lang || '')}</span><button type="button" class="cours-copy">${fr() ? 'Copier' : 'Copy'}</button></div><pre><code></code></pre>`;
        wrap.querySelector('code').innerHTML = highlight(code.replace(/\s+$/, ''), lang);
        wrap.querySelector('.cours-copy').addEventListener('click', e => {
            const b = e.currentTarget;
            const done = () => { b.textContent = fr() ? 'Copié ✓' : 'Copied ✓'; setTimeout(() => { b.textContent = fr() ? 'Copier' : 'Copy'; }, 1400); };
            if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, () => {}); else done();
        });
        return wrap;
    }
    function initCode(root = document) {
        // <pre class="cours-src" data-lang="yaml" data-title="...">texte brut</pre>
        root.querySelectorAll('pre.cours-src').forEach(pre => {
            const block = codeBlock(pre.textContent.replace(/^\n/, ''), pre.dataset.lang, pre.dataset.title);
            pre.replaceWith(block);
        });
    }

    // ---- Explorateur de fichiers : <div class="cours-files" data-files="cle"></div> --------
    function langOf(name) {
        const n = name.toLowerCase();
        if (n.endsWith('.yml') || n.endsWith('.yaml')) return 'yaml';
        if (n === 'dockerfile' || n.endsWith('/dockerfile')) return 'docker';
        if (n.endsWith('.py')) return 'py';
        if (n.endsWith('.js') || n.endsWith('.json')) return n.endsWith('.json') ? 'json' : 'js';
        if (n.endsWith('.cs')) return 'cs';
        if (n.endsWith('.php')) return 'php';
        if (n.endsWith('.pde')) return 'processing';
        if (n.endsWith('.sql')) return 'sql';
        if (n.endsWith('.html')) return 'html';
        if (n.endsWith('.txt')) return 'txt';
        return 'sh';
    }
    function initFiles(root = document) {
        root.querySelectorAll('.cours-files[data-files]').forEach(box => {
            const files = (window.COURS_FILES || {})[box.dataset.files];
            if (!files) return;
            const names = Object.keys(files);
            box.innerHTML = '<div class="cours-files-tabs" role="tablist"></div><div class="cours-files-view"></div>';
            const bar = box.firstChild, view = box.lastChild;
            const open = name => {
                bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.f === name)));
                view.innerHTML = '';
                view.appendChild(codeBlock(files[name], langOf(name), name));
            };
            names.forEach(n => {
                const b = document.createElement('button');
                b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.f = n; b.textContent = n;
                b.addEventListener('click', () => open(n));
                bar.appendChild(b);
            });
            open(names[0]);
        });
    }

    // ---- Pipelines façon GitLab : <div class="cours-pipeline" data-pipeline="cle"></div> ----
    function fmt(s) { return s >= 60 ? `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, '0')} s` : `${Math.round(s)} s`; }
    function renderPipeline(el, stages, states) {
        el.innerHTML = stages.map((st, si) => `<div class="cours-stage"><div class="cours-stage-name">${esc(st.name)}</div>${st.jobs.map((j, ji) => {
            const s = states ? states[si][ji] : j.status;
            return `<div class="cours-job" data-st="${s}"><i aria-hidden="true"></i><span>${esc(j.name)}</span><small>${s === 'success' || s === 'failed' ? fmt(j.duration) : s === 'manual' ? (fr() ? 'manuel' : 'manual') : ''}</small></div>`;
        }).join('')}</div>`).join('');
    }
    function initPipelines(root = document) {
        root.querySelectorAll('[data-pipeline]').forEach(el => {
            const p = (window.COURS_PIPELINES || {})[el.dataset.pipeline];
            if (!p) return;
            renderPipeline(el, p.stages);
            const btn = el.parentElement.querySelector('[data-replay="' + el.dataset.pipeline + '"]');
            if (!btn) return;
            btn.addEventListener('click', () => {
                btn.disabled = true;
                const states = p.stages.map(st => st.jobs.map(() => 'pending'));
                const scale = 0.12; // 1 s réelle ≈ 0,12 s à l'écran
                let t = 0;
                const runStage = si => {
                    if (si >= p.stages.length) { btn.disabled = false; return; }
                    const jobs = p.stages[si].jobs;
                    jobs.forEach((j, ji) => { states[si][ji] = j.status === 'manual' ? 'manual' : 'running'; });
                    renderPipeline(el, p.stages, states);
                    let left = jobs.filter(j => j.status !== 'manual').length;
                    if (!left) return runStage(si + 1);
                    jobs.forEach((j, ji) => {
                        if (j.status === 'manual') return;
                        setTimeout(() => {
                            states[si][ji] = j.status;
                            renderPipeline(el, p.stages, states);
                            if (--left === 0) setTimeout(() => runStage(si + 1), 150);
                        }, Math.max(300, j.duration * 1000 * scale));
                    });
                };
                renderPipeline(el, p.stages, states);
                setTimeout(() => runStage(0), 250 + t);
            });
        });
    }

    // ---- Quiz : <div class="cours-quiz" data-quiz="cle"></div> ----------------------------
    function initQuiz(root = document) {
        root.querySelectorAll('.cours-quiz[data-quiz]').forEach(box => {
            const all = (window.COURS_QUIZ || {})[box.dataset.quiz];
            if (!all) return;
            const key = 'quiz-' + box.dataset.quiz;
            let list, i, score, wrong;
            const start = subset => {
                list = shuffle(subset || all).map(q => {
                    const order = shuffle(q.c.map((c, k) => k));
                    return { ...q, order };
                });
                i = 0; score = 0; wrong = [];
                draw();
            };
            const draw = () => {
                if (i >= list.length) return end();
                const q = list[i];
                box.innerHTML = `<div class="cq-top"><span>Question ${i + 1} / ${list.length}</span><span>Score : ${score}</span></div>
                    <div class="cq-bar"><div style="width:${100 * i / list.length}%"></div></div>
                    <div class="cq-q">${q.q}</div>
                    <div class="cq-choices">${q.order.map(k => `<button type="button" class="cq-choice" data-k="${k}">${q.c[k]}</button>`).join('')}</div>
                    <div class="cq-feedback" aria-live="polite"></div>`;
                box.querySelectorAll('.cq-choice').forEach(b => b.addEventListener('click', () => answer(+b.dataset.k)));
            };
            const answer = k => {
                const q = list[i];
                const ok = k === q.a;
                if (ok) score++; else wrong.push(q);
                box.querySelectorAll('.cq-choice').forEach(b => {
                    b.disabled = true;
                    if (+b.dataset.k === q.a) b.classList.add('good');
                    else if (+b.dataset.k === k) b.classList.add('bad');
                });
                box.querySelector('.cq-feedback').innerHTML = `<div class="cq-why"><b>${ok ? 'Bonne réponse.' : 'Pas tout à fait.'}</b> ${q.w}</div>
                    <div class="cq-nav"><button type="button" class="cours-btn cq-next">${i + 1 < list.length ? 'Question suivante →' : 'Voir mon score'}</button></div>`;
                const nx = box.querySelector('.cq-next');
                nx.addEventListener('click', () => { i++; draw(); });
                nx.focus({ preventScroll: true });
            };
            const end = () => {
                const pct = Math.round(100 * score / list.length);
                const best = Math.max(pct, parseInt(store.get(key) || '0', 10) || 0);
                if (list.length === all.length) store.set(key, String(best));
                box.innerHTML = `<div class="cq-end"><b class="big">${score} / ${list.length}</b><p>${pct >= 80 ? 'Solide, c’est maîtrisé.' : pct >= 50 ? 'Pas mal : relis les points ratés.' : 'À retravailler : repasse par la fiche.'} · Meilleur score complet : ${best} %</p>
                    <div class="cq-nav" style="justify-content:center"><button type="button" class="cours-btn cq-again">Recommencer</button>${wrong.length ? '<button type="button" class="cours-btn ghost cq-wrong">Refaire mes erreurs (' + wrong.length + ')</button>' : ''}</div></div>`;
                box.querySelector('.cq-again').addEventListener('click', () => start());
                const w = box.querySelector('.cq-wrong');
                if (w) { const ws = wrong.slice(); w.addEventListener('click', () => start(ws)); }
            };
            const intro = () => {
                const best = parseInt(store.get(key) || '0', 10) || 0;
                box.innerHTML = `<div class="cq-end"><p><b>${all.length} questions</b>, ordre et réponses mélangés à chaque fois, explication après chaque réponse.${best ? ' Ton meilleur score : ' + best + ' %.' : ''}</p>
                    <div class="cq-nav" style="justify-content:center"><button type="button" class="cours-btn cq-go">Commencer le quiz</button></div></div>`;
                box.querySelector('.cq-go').addEventListener('click', () => start());
            };
            intro();
        });
    }

    // ---- Cartes mémo : <div class="cours-cards" data-cards="cle"></div> --------------------
    function initCards(root = document) {
        root.querySelectorAll('.cours-cards[data-cards]').forEach(box => {
            const all = (window.COURS_CARDS || {})[box.dataset.cards];
            if (!all) return;
            let list = shuffle(all), i = 0;
            const draw = () => {
                const c = list[i];
                box.innerHTML = `<div class="cq-top"><span>Carte ${i + 1} / ${list.length}</span><span>Touchez la carte pour la retourner</span></div>
                    <div class="cc-card" tabindex="0" role="button" aria-label="Retourner la carte"><div class="cc-inner"><div class="cc-face">${c[0]}</div><div class="cc-face cc-back">${c[1]}</div></div></div>
                    <div class="cq-nav"><button type="button" class="cours-btn ghost cc-prev">← Précédente</button><button type="button" class="cours-btn cc-next">Suivante →</button><button type="button" class="cours-btn ghost cc-mix">Mélanger</button></div>`;
                const card = box.querySelector('.cc-card');
                const flip = () => card.classList.toggle('flip');
                card.addEventListener('click', flip);
                card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
                box.querySelector('.cc-prev').addEventListener('click', () => { i = (i - 1 + list.length) % list.length; draw(); });
                box.querySelector('.cc-next').addEventListener('click', () => { i = (i + 1) % list.length; draw(); });
                box.querySelector('.cc-mix').addEventListener('click', () => { list = shuffle(all); i = 0; draw(); });
            };
            draw();
        });
    }

    window.Cours = { highlight, codeBlock, initCode, initFiles, initPipelines, esc };
    function headerOffset() {
        const h = document.getElementById('header');
        if (!h) return;
        const set = () => document.documentElement.style.setProperty('--cours-header-h', Math.round(h.getBoundingClientRect().height) + 'px');
        set();
        window.addEventListener('resize', set);
        window.addEventListener('scroll', set, { passive: true });
    }
    document.addEventListener('DOMContentLoaded', () => {
        headerOffset();
        initCode(); initFiles(); initPipelines(); initQuiz(); initCards(); initTabs();
    });
})();
