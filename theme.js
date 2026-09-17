(function () {
    function currentTheme() {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (e) {}
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme, btn) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) {}
        if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    function init() {
        var btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.className = 'theme-toggle-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Changer de theme clair/sombre');
        btn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
        btn.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            applyTheme(next, btn);
        });
        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
