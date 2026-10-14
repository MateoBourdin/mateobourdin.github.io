// Descente à Combloux : slalom entre les portes, en évitant les sapins.
(() => {
    const W = 420, H = 620, SKIER_Y = 150;
    const canvas = document.getElementById('skiCanvas');
    const ctx = Game.setupCanvas(canvas, W, H);
    const scoreEl = document.getElementById('skiScore');
    const bestEl = document.getElementById('skiBest');
    const livesEl = document.getElementById('skiLives');

    const TXT = {
        fr: { start: 'Appuie sur Espace ou touche l’écran', go: 'pour t’élancer', over: 'Chute !', overMiss: 'Trop de portes manquées', again: 'Espace ou toucher pour rejouer', record: 'Nouveau record !', paused: 'Pause', gates: 'portes', miss: 'Porte manquée' },
        en: { start: 'Press Space or tap the screen', go: 'to start your run', over: 'Crash!', overMiss: 'Too many missed gates', again: 'Space or tap to play again', record: 'New record!', paused: 'Paused', gates: 'gates', miss: 'Missed gate' }
    };
    const t = k => Game.t(TXT, k);

    let state, skier, objects, speed, travelled, nextGateAt, nextTreeAt, score, lives, dir, flash, trail, gateCount, newRecord, endReason;

    function reset() {
        state = 'ready';
        skier = { x: W / 2 };
        objects = [];
        speed = 170;
        travelled = 0;
        nextGateAt = 260;
        nextTreeAt = 120;
        score = 0;
        lives = 3;
        dir = 0;
        flash = 0;
        trail = [];
        gateCount = 0;
        newRecord = false;
        endReason = '';
        // A few trees on screen from the start so the slope is not empty.
        for (let y = SKIER_Y + 120; y < H + 40; y += 90) spawnTrees(y, null);
        hud();
    }

    function hud() {
        scoreEl.textContent = score;
        bestEl.textContent = Game.best('ski');
        livesEl.textContent = '❤️'.repeat(Math.max(lives, 0)) || '–';
    }

    function spawnGate(y) {
        const gap = Math.max(84, 130 - gateCount * 2);
        const margin = gap / 2 + 24;
        const x = margin + Math.random() * (W - 2 * margin);
        // Keep the corridor through the gate clear of trees spawned earlier.
        objects = objects.filter(o => !(o.type === 'tree' && Math.abs(o.y - y) < 90 && Math.abs(o.x - x) < gap / 2 + 34));
        objects.push({ type: 'gate', x, y, gap, color: gateCount % 2 ? '#d64545' : '#3b6fd6', checked: false });
        gateCount++;
        spawnTrees(y + 60, { x, gap });
    }

    function spawnTrees(y, avoid) {
        const n = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; i++) {
            const x = 20 + Math.random() * (W - 40);
            if (avoid && Math.abs(x - avoid.x) < avoid.gap / 2 + 30) continue;
            objects.push({ type: 'tree', x, y: y + Math.random() * 60, r: 13 + Math.random() * 5 });
        }
    }

    // Extra trees between gates, never inside a gate's corridor.
    function spawnForest(y) {
        const n = 1 + Math.floor(Math.random() * (gateCount > 8 ? 3 : 2));
        for (let i = 0; i < n; i++) {
            const x = 16 + Math.random() * (W - 32);
            const ty = y + Math.random() * 50;
            const blocked = objects.some(o => o.type === 'gate' && Math.abs(o.y - ty) < 90 && Math.abs(o.x - x) < o.gap / 2 + 34);
            if (!blocked) objects.push({ type: 'tree', x, y: ty, r: 12 + Math.random() * 6 });
        }
    }

    function start() {
        if (state === 'over') reset();
        state = 'play';
    }

    function end(reason) {
        state = 'over';
        endReason = reason;
        newRecord = Game.saveBest('ski', score);
        hud();
    }

    function update(dt) {
        if (state !== 'play') return;
        speed = Math.min(520, speed + 7 * dt);
        const dy = speed * dt;
        travelled += dy;
        skier.x = Math.max(14, Math.min(W - 14, skier.x + dir * 250 * dt));

        if (travelled >= nextTreeAt) {
            spawnForest(H + 40);
            nextTreeAt = travelled + 110 + Math.random() * 60;
        }
        if (travelled >= nextGateAt) {
            spawnGate(H + 40);
            nextGateAt = travelled + Math.max(170, 260 - gateCount * 3);
        }

        for (const o of objects) o.y -= dy;
        for (const p of trail) p.y -= dy;
        trail.push({ x: skier.x, y: SKIER_Y + 10 });
        while (trail.length && trail[0].y < -10) trail.shift();

        for (const o of objects) {
            if (o.type === 'gate' && !o.checked && o.y <= SKIER_Y) {
                o.checked = true;
                if (Math.abs(skier.x - o.x) <= o.gap / 2) {
                    score++;
                    o.passed = true;
                } else {
                    lives--;
                    flash = 0.6;
                    if (lives <= 0) { hud(); end('miss'); return; }
                }
                hud();
            }
            if (o.type === 'tree' && Math.hypot(o.x - skier.x, o.y - (SKIER_Y + 4)) < o.r + 7) {
                end('crash');
                return;
            }
        }
        objects = objects.filter(o => o.y > -60);
        flash = Math.max(0, flash - dt);
    }

    function drawTree(o) {
        ctx.fillStyle = '#6b4a2b';
        ctx.fillRect(o.x - 2.5, o.y + o.r * 0.6, 5, 8);
        ctx.fillStyle = '#2f6b4f';
        ctx.beginPath();
        ctx.moveTo(o.x, o.y - o.r * 1.4);
        ctx.lineTo(o.x + o.r, o.y + o.r * 0.7);
        ctx.lineTo(o.x - o.r, o.y + o.r * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.moveTo(o.x, o.y - o.r * 1.4);
        ctx.lineTo(o.x + o.r * 0.35, o.y - o.r * 0.6);
        ctx.lineTo(o.x - o.r * 0.35, o.y - o.r * 0.6);
        ctx.closePath();
        ctx.fill();
    }

    function drawGate(o) {
        const half = o.gap / 2;
        const col = o.checked && !o.passed ? '#9aa0b5' : o.color;
        for (const side of [-1, 1]) {
            const x = o.x + side * half;
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, o.y + 10);
            ctx.lineTo(x, o.y - 18);
            ctx.stroke();
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.moveTo(x, o.y - 18);
            ctx.lineTo(x - side * 14, o.y - 12);
            ctx.lineTo(x, o.y - 6);
            ctx.closePath();
            ctx.fill();
        }
        if (!o.checked) {
            ctx.strokeStyle = o.color + '33';
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.moveTo(o.x - half, o.y);
            ctx.lineTo(o.x + half, o.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    function drawSkier() {
        const x = skier.x, y = SKIER_Y;
        const tilt = dir * 0.35;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.strokeStyle = '#1d2240';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (const s of [-5, 5]) {
            ctx.beginPath();
            ctx.moveTo(s, -6);
            ctx.lineTo(s, 16);
            ctx.stroke();
        }
        ctx.fillStyle = '#6c7bd9';
        ctx.fillRect(-6, -10, 12, 14);
        ctx.fillStyle = '#f2c9a0';
        ctx.beginPath();
        ctx.arc(0, -15, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d64545';
        ctx.fillRect(-5, -21, 10, 4);
        ctx.restore();
    }

    function centered(lines, y) {
        ctx.fillStyle = 'rgba(247,248,252,0.88)';
        ctx.fillRect(30, y - 46, W - 60, 40 + lines.length * 28);
        ctx.fillStyle = '#1d2240';
        ctx.textAlign = 'center';
        lines.forEach((l, i) => {
            ctx.font = i === 0 ? '800 24px Manrope, Inter, sans-serif' : '500 15px Inter, sans-serif';
            ctx.fillText(l, W / 2, y - 12 + i * 28);
        });
    }

    function draw() {
        ctx.fillStyle = '#f4f7fd';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(108,123,217,0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();

        objects.filter(o => o.type === 'gate').forEach(drawGate);
        drawSkier();
        objects.filter(o => o.type === 'tree').forEach(drawTree);

        if (flash > 0) {
            ctx.fillStyle = `rgba(214,69,69,${flash * 0.35})`;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#b02a2a';
            ctx.font = '700 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(t('miss'), W / 2, 60);
        }

        ctx.fillStyle = '#5b6183';
        ctx.font = '600 13px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${Math.round(travelled / 10)} m`, 12, H - 14);

        if (state === 'ready') centered(['⛷️', t('start'), t('go')], H / 2);
        if (state === 'paused') centered([t('paused')], H / 2);
        if (state === 'over') {
            const lines = [endReason === 'crash' ? t('over') : t('overMiss'), `${score} ${t('gates')}`];
            if (newRecord) lines.push(t('record'));
            lines.push(t('again'));
            centered(lines, H / 2);
        }
    }

    let last = performance.now();
    function loop(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        update(dt);
        draw();
        requestAnimationFrame(loop);
    }

    // Controls: arrows, A/D or Q/D (AZERTY), Space to start, P/Escape to pause.
    const held = { left: false, right: false };
    const syncDir = () => { dir = (held.right ? 1 : 0) - (held.left ? 1 : 0); };
    document.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        if (['arrowleft', 'a', 'q'].includes(k)) { held.left = true; syncDir(); e.preventDefault(); }
        if (['arrowright', 'd'].includes(k)) { held.right = true; syncDir(); e.preventDefault(); }
        if (k === ' ' || k === 'enter') {
            if (state === 'ready' || state === 'over') { start(); e.preventDefault(); }
        }
        if ((k === 'p' || k === 'escape') && (state === 'play' || state === 'paused')) {
            state = state === 'play' ? 'paused' : 'play';
        }
    });
    document.addEventListener('keyup', e => {
        const k = e.key.toLowerCase();
        if (['arrowleft', 'a', 'q'].includes(k)) { held.left = false; syncDir(); }
        if (['arrowright', 'd'].includes(k)) { held.right = false; syncDir(); }
    });

    // Touch / mouse: hold on the left or right half of the slope.
    canvas.addEventListener('pointerdown', e => {
        if (state !== 'play') { start(); return; }
        const p = Game.pointer(canvas, e, W, H);
        held.left = p.x < skier.x;
        held.right = !held.left;
        syncDir();
        canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
        if (!held.left && !held.right) return;
        const p = Game.pointer(canvas, e, W, H);
        held.left = p.x < skier.x - 4;
        held.right = p.x > skier.x + 4;
        syncDir();
    });
    const release = () => { held.left = held.right = false; syncDir(); };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);

    document.querySelectorAll('[data-ski]').forEach(btn => {
        const side = btn.dataset.ski;
        btn.addEventListener('pointerdown', e => {
            e.preventDefault();
            if (state !== 'play') start();
            held[side] = true;
            syncDir();
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => { held[side] = false; syncDir(); }));
    });

    // Pause automatically when the tab is hidden.
    document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'play') state = 'paused'; });

    reset();
    requestAnimationFrame(loop);
})();
