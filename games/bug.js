// Trouve le bug : un extrait de code, une ligne fautive, 20 secondes.
(() => {
    const ROUNDS = 6, TIME = 20;
    const SNIPPETS = [
        {
            lang: 'C#',
            code: ['public async Task<Produit?> GetByIdAsync(int id)', '{', '    var produit = _context.Produits.FindAsync(id);', '    return produit;', '}'],
            bug: 2,
            fr: 'Il manque await : FindAsync renvoie une tâche, pas le produit. La méthode ne compile pas tant qu’on n’attend pas le résultat.',
            en: 'await is missing: FindAsync returns a task, not the product. The method won’t compile until the result is awaited.'
        },
        {
            lang: 'Python',
            code: ['def ajouter(article, panier=[]):', '    panier.append(article)', '    return panier'],
            bug: 0,
            fr: 'La liste par défaut est créée une seule fois et partagée entre tous les appels : les paniers se mélangent. Il faut panier=None puis créer la liste dans la fonction.',
            en: 'The default list is created once and shared by every call, so baskets get mixed. Use panier=None and create the list inside the function.'
        },
        {
            lang: 'JavaScript',
            code: ['for (var i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 100);', '}'],
            bug: 0,
            fr: 'Avec var, i est partagé par toutes les fonctions : on affiche 3, 3, 3. Avec let, chaque tour a sa propre variable et on obtient 0, 1, 2.',
            en: 'With var, i is shared by every callback, so it prints 3, 3, 3. With let, each iteration gets its own variable and prints 0, 1, 2.'
        },
        {
            lang: 'Python · SQL',
            code: ['def trouver(nom):', '    sql = "SELECT * FROM users WHERE nom = \'" + nom + "\'"', '    return db.execute(sql).fetchall()'],
            bug: 1,
            fr: 'Injection SQL : la saisie est collée dans la requête. Il faut une requête paramétrée, par exemple execute("… WHERE nom = ?", (nom,)).',
            en: 'SQL injection: user input is pasted into the query. Use a parameterised query, e.g. execute("… WHERE nom = ?", (nom,)).'
        },
        {
            lang: 'C#',
            code: ['int[] notes = { 12, 15, 9 };', 'for (int i = 0; i <= notes.Length; i++)', '{', '    Console.WriteLine(notes[i]);', '}'],
            bug: 1,
            fr: 'Erreur d’une case : avec <=, le dernier tour lit notes[3], qui n’existe pas (IndexOutOfRangeException). Il faut i < notes.Length.',
            en: 'Off-by-one: with <=, the last iteration reads notes[3], which doesn’t exist (IndexOutOfRangeException). Use i < notes.Length.'
        },
        {
            lang: 'JavaScript',
            code: ['function estAdmin(user) {', '  if (user.role = "admin") {', '    return true;', '  }', '  return false;', '}'],
            bug: 1,
            fr: 'Un seul = est une affectation : le rôle devient "admin" et la condition est toujours vraie. Il faut ===.',
            en: 'A single = is an assignment: the role becomes "admin" and the condition is always true. Use ===.'
        },
        {
            lang: 'Vue 3',
            code: ['import { ref } from \'vue\'', 'const compteur = ref(0)', 'function incrementer() {', '  compteur++', '}'],
            bug: 3,
            fr: 'Un ref s’utilise via .value dans le script : compteur.value++. (Dans le template, Vue le fait automatiquement.)',
            en: 'A ref is accessed through .value in the script: compteur.value++. (In the template, Vue unwraps it for you.)'
        },
        {
            lang: 'SQL',
            code: ['-- Vendre un exemplaire du produit 42', 'UPDATE produits', 'SET stock = stock - 1;'],
            bug: 2,
            fr: 'Sans WHERE id = 42, le stock de tous les produits diminue.',
            en: 'Without WHERE id = 42, the stock of every product goes down.'
        },
        {
            lang: 'Docker',
            code: ['FROM python:3.12-slim', 'COPY . /app', 'RUN pip install -r /app/requirements.txt', 'CMD ["python", "app.py"]'],
            bug: 3,
            fr: 'Le conteneur démarre dans /, où app.py n’existe pas. Il manque WORKDIR /app (ou le chemin /app/app.py).',
            en: 'The container starts in /, where app.py doesn’t exist. WORKDIR /app is missing (or use the /app/app.py path).'
        },
        {
            lang: 'Python',
            code: ['def meme_ville(a, b):', '    return a.ville is b.ville'],
            bug: 1,
            fr: 'is compare l’identité des objets, pas leur valeur : deux chaînes égales peuvent être des objets différents. Il faut ==.',
            en: 'is compares object identity, not value: two equal strings can be different objects. Use ==.'
        },
        {
            lang: 'C#',
            code: ['string saisie = Console.ReadLine();', 'if (saisie == null || saisie.Length > 0)', '{', '    Traiter(saisie);', '}'],
            bug: 1,
            fr: 'Avec ||, une saisie null entre quand même dans le bloc et Traiter reçoit null. Il faut saisie != null && saisie.Length > 0.',
            en: 'With ||, a null input still enters the block and Traiter receives null. Use saisie != null && saisie.Length > 0.'
        }
    ];

    const TXT = {
        fr: { round: 'Extrait', of: 'sur', time: 's', correct: 'Bien vu !', wrong: 'Raté.', timeout: 'Temps écoulé.', next: 'Extrait suivant →', finish: 'Voir le résultat →', result: 'Score final', record: 'Nouveau record !', replay: 'Rejouer', found: 'bugs trouvés', points: 'points', hint: 'Clique sur la ligne qui contient le bug.' },
        en: { round: 'Snippet', of: 'of', time: 's', correct: 'Well spotted!', wrong: 'Missed.', timeout: 'Time’s up.', next: 'Next snippet →', finish: 'See the result →', result: 'Final score', record: 'New record!', replay: 'Play again', found: 'bugs found', points: 'points', hint: 'Click the line that contains the bug.' }
    };
    const t = k => Game.t(TXT, k);

    const $ = s => document.querySelector(s);
    const startBox = $('#bugStart'), playBox = $('#bugPlay'), endBox = $('#bugEnd');
    let deck, round, score, found, timer, timeLeft, answered;

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        return a;
    }

    function begin() {
        deck = shuffle(SNIPPETS.slice()).slice(0, ROUNDS);
        round = 0; score = 0; found = 0;
        startBox.hidden = true; endBox.hidden = true; playBox.hidden = false;
        show();
    }

    function show() {
        const s = deck[round];
        answered = false;
        timeLeft = TIME;
        $('#bugRound').textContent = `${t('round')} ${round + 1} ${t('of')} ${ROUNDS}`;
        $('#bugLang').textContent = s.lang;
        $('#bugScore').textContent = score;
        $('#bugHint').textContent = t('hint');
        $('#bugFeedback').hidden = true;
        const list = $('#bugCode');
        list.innerHTML = '';
        s.code.forEach((line, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'bug-line';
            b.innerHTML = `<span class="bug-num">${i + 1}</span><code></code>`;
            b.querySelector('code').textContent = line || ' ';
            b.addEventListener('click', () => answer(i));
            list.appendChild(b);
        });
        tick();
        clearInterval(timer);
        timer = setInterval(() => { timeLeft--; tick(); if (timeLeft <= 0) answer(-1); }, 1000);
        list.querySelector('.bug-line').focus({ preventScroll: true });
    }

    function tick() {
        $('#bugTime').textContent = `${Math.max(timeLeft, 0)} ${t('time')}`;
        $('#bugBar').style.width = `${Math.max(timeLeft, 0) / TIME * 100}%`;
    }

    function answer(i) {
        if (answered) return;
        answered = true;
        clearInterval(timer);
        const s = deck[round];
        const lines = document.querySelectorAll('.bug-line');
        lines.forEach(l => (l.disabled = true));
        lines[s.bug].classList.add('is-bug');
        let verdict;
        if (i === s.bug) {
            const gained = 100 + timeLeft * 5;
            score += gained;
            found++;
            verdict = `${t('correct')} +${gained}`;
        } else {
            if (i >= 0) lines[i].classList.add('is-wrong');
            verdict = i < 0 ? t('timeout') : t('wrong');
        }
        $('#bugScore').textContent = score;
        $('#bugVerdict').textContent = verdict;
        $('#bugVerdict').className = i === s.bug ? 'ok' : 'ko';
        $('#bugExplain').textContent = s[Game.lang()] || s.fr;
        $('#bugNext').textContent = round + 1 < ROUNDS ? t('next') : t('finish');
        $('#bugFeedback').hidden = false;
        $('#bugNext').focus();
    }

    function next() {
        round++;
        if (round < ROUNDS) { show(); return; }
        playBox.hidden = true;
        endBox.hidden = false;
        const record = Game.saveBest('bug', score);
        $('#bugFinal').textContent = `${score} ${t('points')}`;
        $('#bugFound').textContent = `${found} / ${ROUNDS} ${t('found')}`;
        $('#bugRecord').hidden = !record;
        $('#bugRecord').textContent = t('record');
        $('#bugBest').textContent = Game.best('bug');
        $('#bugReplay').textContent = t('replay');
    }

    $('#bugBegin').addEventListener('click', begin);
    $('#bugNext').addEventListener('click', next);
    $('#bugReplay').addEventListener('click', begin);
    $('#bugBest').textContent = Game.best('bug');
    $('#bugBestStart').textContent = Game.best('bug');

    // Re-render visible dynamic texts when the language changes mid-game.
    Game.onLangChange(() => {
        if (!playBox.hidden) {
            const s = deck[round];
            $('#bugRound').textContent = `${t('round')} ${round + 1} ${t('of')} ${ROUNDS}`;
            $('#bugHint').textContent = t('hint');
            tick();
            if (answered) {
                $('#bugExplain').textContent = s[Game.lang()] || s.fr;
                $('#bugNext').textContent = round + 1 < ROUNDS ? t('next') : t('finish');
            }
        }
        if (!endBox.hidden) {
            $('#bugFinal').textContent = `${score} ${t('points')}`;
            $('#bugFound').textContent = `${found} / ${ROUNDS} ${t('found')}`;
            $('#bugRecord').textContent = t('record');
            $('#bugReplay').textContent = t('replay');
        }
    });
})();
