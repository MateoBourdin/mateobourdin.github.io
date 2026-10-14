// Arcade : affiche les records enregistrés dans ce navigateur pour chaque jeu.
(() => {
    const T = {
        fr: { best: 'Ton record', none: 'Pas encore joué', rating: 'Ton classement', daily: 'Bug du jour', dailyDone: 'fait aujourd’hui', dailyTodo: 'à faire aujourd’hui', gates: 'portes', points: 'points' },
        en: { best: 'Your best', none: 'Not played yet', rating: 'Your rating', daily: 'Daily bug', dailyDone: 'done today', dailyTodo: 'waiting for you today', gates: 'gates', points: 'points' }
    };
    function profile() {
        try { return JSON.parse(localStorage.getItem('bugProfile-v1')); } catch (e) { return null; }
    }
    function today() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    function render() {
        const t = T[Game.lang()];
        const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        const ski = Game.best('ski'), naval = Game.best('naval');
        set('arcadeSki', ski ? `${t.best} : <b>${ski}</b> ${t.gates}` : t.none);
        set('arcadeNaval', naval ? `${t.best} : <b>${naval}</b> ${t.points}` : t.none);
        const p = profile();
        if (p && p.played) {
            const done = p.daily && p.daily.results && p.daily.results[today()];
            set('arcadeBug', `${t.rating} : <b>${p.rating}</b> · ${t.daily} ${done ? '✅ ' + t.dailyDone : '📅 ' + t.dailyTodo}`);
        } else set('arcadeBug', `${t.daily} 📅 ${t.dailyTodo}`);
    }
    Game.onLangChange(render);
    render();
})();
