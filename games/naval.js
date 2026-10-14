// Défends l'île : clin d'œil à Survival Island (SAE 1.01).
// Le canon de l'île vise le pointeur ; les bateaux ennemis arrivent par vagues.
(() => {
    const W = 640, H = 480, CX = W / 2, CY = H / 2, ISLAND_R = 44;
    const canvas = document.getElementById('navalCanvas');
    const ctx = Game.setupCanvas(canvas, W, H);
    const scoreEl = document.getElementById('navalScore');
    const bestEl = document.getElementById('navalBest');
    const waveEl = document.getElementById('navalWave');
    const hpEl = document.getElementById('navalHp');

    const TXT = {
        fr: { start: 'Clique ou appuie sur Espace pour défendre l’île', hint: 'Vise avec la souris (ou les flèches), tire en cliquant', wave: 'Vague', over: 'L’île est tombée', score: 'Score', record: 'Nouveau record !', again: 'Clique ou Espace pour rejouer', paused: 'Pause', repaired: '+1 point de vie' },
        en: { start: 'Click or press Space to defend the island', hint: 'Aim with the mouse (or arrows), click to fire', wave: 'Wave', over: 'The island has fallen', score: 'Score', record: 'New record!', again: 'Click or Space to play again', paused: 'Paused', repaired: '+1 health' }
    };
    const t = k => Game.t(TXT, k);
    const MAX_HP = 10;

    let state, angle, bullets, boats, particles, score, hp, wave, toSpawn, spawnTimer, cooldown, banner, bannerTime, newRecord, aimKeys, firing, time;

    function reset() {
        state = 'ready';
        angle = -Math.PI / 2;
        bullets = [];
        boats = [];
        particles = [];
        score = 0;
        hp = MAX_HP;
        wave = 0;
        toSpawn = 0;
        spawnTimer = 0;
        cooldown = 0;
        banner = '';
        bannerTime = 0;
        newRecord = false;
        aimKeys = 0;
        firing = false;
        time = 0;
        hud();
    }

    function hud() {
        scoreEl.textContent = score;
        bestEl.textContent = Game.best('naval');
        waveEl.textContent = wave || '–';
        hpEl.textContent = `${Math.max(hp, 0)} / ${MAX_HP}`;
    }

    function nextWave() {
        wave++;
        toSpawn = 4 + wave * 2;
        spawnTimer = 1.2;
        banner = `${t('wave')} ${wave}`;
        bannerTime = 1.6;
        if (wave > 1 && hp < MAX_HP) { hp++; banner += ` · ${t('repaired')}`; }
        hud();
    }

    function spawnBoat() {
        const a = Math.random() * Math.PI * 2;
        const dist = Math.hypot(W, H) / 2 + 30;
        const big = wave >= 2 && Math.random() < Math.min(0.45, 0.12 * wave);
        const base = 26 + wave * 4 + Math.random() * 14;
        boats.push({
            x: CX + Math.cos(a) * dist,
            y: CY + Math.sin(a) * dist,
            speed: big ? base * 0.65 : base,
            hp: big ? 3 : 1,
            maxHp: big ? 3 : 1,
            size: big ? 17 : 11,
            points: big ? 25 : 10,
            bob: Math.random() * 6
        });
    }

    function start() {
        if (state === 'over') reset();
        if (state === 'ready') { state = 'play'; nextWave(); return; }
        if (state === 'paused') state = 'play';
    }

    function fire() {
        if (state !== 'play' || cooldown > 0) return;
        cooldown = Math.max(0.12, 0.28 - wave * 0.012);
        const tipX = CX + Math.cos(angle) * 30, tipY = CY + Math.sin(angle) * 30;
        bullets.push({ x: tipX, y: tipY, vx: Math.cos(angle) * 430, vy: Math.sin(angle) * 430, life: 1.4 });
    }

    function burst(x, y, color, n) {
        if (Game.reducedMotion) n = Math.ceil(n / 3);
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, s = 40 + Math.random() * 120;
            particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.4, color });
        }
    }

    function update(dt) {
        time += dt;
        bannerTime = Math.max(0, bannerTime - dt);
        for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
        particles = particles.filter(p => p.life > 0);
        if (state !== 'play') return;

        angle += aimKeys * 3 * dt;
        cooldown = Math.max(0, cooldown - dt);
        if (firing) fire();

        if (toSpawn > 0) {
            spawnTimer -= dt;
            if (spawnTimer <= 0) {
                spawnBoat();
                toSpawn--;
                spawnTimer = Math.max(0.35, 1.3 - wave * 0.08) * (0.6 + Math.random() * 0.8);
            }
        }

        for (const b of bullets) { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; }

        for (const boat of boats) {
            const dx = CX - boat.x, dy = CY - boat.y, d = Math.hypot(dx, dy);
            boat.dir = Math.atan2(dy, dx);
            boat.x += dx / d * boat.speed * dt;
            boat.y += dy / d * boat.speed * dt;
            if (d < ISLAND_R + boat.size) {
                boat.dead = true;
                hp -= boat.maxHp;
                burst(boat.x, boat.y, '#d64545', 14);
                hud();
            }
            for (const b of bullets) {
                if (b.life > 0 && Math.hypot(b.x - boat.x, b.y - boat.y) < boat.size + 3) {
                    b.life = 0;
                    boat.hp--;
                    burst(b.x, b.y, '#ffffff', 5);
                    if (boat.hp <= 0 && !boat.dead) {
                        boat.dead = true;
                        score += boat.points;
                        burst(boat.x, boat.y, '#f2a33a', 16);
                        hud();
                    }
                }
            }
        }
        bullets = bullets.filter(b => b.life > 0 && b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20);
        boats = boats.filter(b => !b.dead);

        if (hp <= 0) {
            state = 'over';
            newRecord = Game.saveBest('naval', score);
            hud();
            return;
        }
        if (toSpawn === 0 && boats.length === 0) nextWave();
    }

    function drawSea() {
        ctx.fillStyle = '#5f86d9';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.lineWidth = 2;
        const shift = Game.reducedMotion ? 0 : (time * 14) % 40;
        for (let y = -20; y < H + 20; y += 40) {
            ctx.beginPath();
            for (let x = 0; x <= W; x += 20) {
                const yy = y + shift + Math.sin((x + y) / 30) * 4;
                x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
            }
            ctx.stroke();
        }
    }

    function drawIsland() {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(CX, CY, ISLAND_R + 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e9d3a1';
        ctx.beginPath();
        ctx.arc(CX, CY, ISLAND_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4f8f5f';
        ctx.beginPath();
        ctx.arc(CX - 14, CY - 10, 13, 0, Math.PI * 2);
        ctx.arc(CX + 16, CY + 12, 10, 0, Math.PI * 2);
        ctx.fill();
        // Cannon
        ctx.save();
        ctx.translate(CX, CY);
        ctx.rotate(angle);
        ctx.fillStyle = '#2b2f45';
        ctx.fillRect(0, -5, 30, 10);
        ctx.restore();
        ctx.fillStyle = '#1d2240';
        ctx.beginPath();
        ctx.arc(CX, CY, 11, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawBoat(b) {
        ctx.save();
        ctx.translate(b.x, b.y + Math.sin(time * 3 + b.bob) * 1.5);
        ctx.rotate(b.dir || 0);
        const s = b.size;
        ctx.fillStyle = b.maxHp > 1 ? '#5b3a29' : '#7a4f34';
        ctx.beginPath();
        ctx.moveTo(s * 1.4, 0);
        ctx.lineTo(-s, -s * 0.7);
        ctx.lineTo(-s, s * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f4efe2';
        ctx.fillRect(-s * 0.4, -s * 0.35, s * 0.8, s * 0.7);
        ctx.restore();
        if (b.maxHp > 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            ctx.fillRect(b.x - 14, b.y - b.size - 10, 28, 4);
            ctx.fillStyle = '#7ee0a3';
            ctx.fillRect(b.x - 14, b.y - b.size - 10, 28 * b.hp / b.maxHp, 4);
        }
    }

    function panel(lines) {
        ctx.fillStyle = 'rgba(247,248,252,0.92)';
        const h = 30 + lines.length * 28;
        ctx.fillRect(W / 2 - 230, H / 2 - h / 2, 460, h);
        ctx.fillStyle = '#1d2240';
        ctx.textAlign = 'center';
        lines.forEach((l, i) => {
            ctx.font = i === 0 ? '800 22px Manrope, Inter, sans-serif' : '500 15px Inter, sans-serif';
            ctx.fillText(l, W / 2, H / 2 - h / 2 + 38 + i * 28);
        });
    }

    function draw() {
        drawSea();
        for (const b of boats) drawBoat(b);
        drawIsland();
        ctx.fillStyle = '#fff6c8';
        for (const b of bullets) { ctx.beginPath(); ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2); ctx.fill(); }
        for (const p of particles) {
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        }
        ctx.globalAlpha = 1;

        if (bannerTime > 0 && state === 'play') {
            ctx.fillStyle = `rgba(29,34,64,${Math.min(1, bannerTime) * 0.75})`;
            ctx.fillRect(0, 26, W, 40);
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 20px Manrope, Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(banner, W / 2, 53);
        }
        if (state === 'ready') panel(['🏝️', t('start'), t('hint')]);
        if (state === 'paused') panel([t('paused')]);
        if (state === 'over') {
            const lines = [t('over'), `${t('score')} : ${score} · ${t('wave')} ${wave}`];
            if (newRecord) lines.push(t('record'));
            lines.push(t('again'));
            panel(lines);
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

    function aimAt(e) {
        const p = Game.pointer(canvas, e, W, H);
        angle = Math.atan2(p.y - CY, p.x - CX);
    }
    canvas.addEventListener('pointermove', aimAt);
    canvas.addEventListener('pointerdown', e => {
        aimAt(e);
        if (state !== 'play') { start(); return; }
        firing = true;
        fire();
        canvas.setPointerCapture(e.pointerId);
    });
    const stop = () => { firing = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);

    document.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        if (k === 'arrowleft' || k === 'a' || k === 'q') { aimKeys = -1; e.preventDefault(); }
        if (k === 'arrowright' || k === 'd') { aimKeys = 1; e.preventDefault(); }
        if (k === ' ' || k === 'enter') {
            e.preventDefault();
            if (state === 'play') firing = true; else start();
        }
        if ((k === 'p' || k === 'escape') && (state === 'play' || state === 'paused')) {
            state = state === 'play' ? 'paused' : 'play';
        }
    });
    document.addEventListener('keyup', e => {
        const k = e.key.toLowerCase();
        if (['arrowleft', 'a', 'q', 'arrowright', 'd'].includes(k)) aimKeys = 0;
        if (k === ' ' || k === 'enter') firing = false;
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'play') state = 'paused'; });

    reset();
    requestAnimationFrame(loop);
})();
