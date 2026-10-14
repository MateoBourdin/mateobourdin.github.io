// Banque d'énigmes de « Trouve le bug ».
// Chaque énigme : une seule ligne fautive (index `bug`, à partir de 0), un classement
// de difficulté (type Elo), un thème, la ligne corrigée et une explication FR/EN.
const BUG_THEMES = {
    syntax: { fr: 'Syntaxe et opérateurs', en: 'Syntax and operators' },
    bounds: { fr: 'Bornes et boucles', en: 'Bounds and loops' },
    types: { fr: 'Types et conversions', en: 'Types and conversions' },
    scope: { fr: 'Portée des variables', en: 'Variable scope' },
    async: { fr: 'Asynchrone', en: 'Asynchronous code' },
    nulls: { fr: 'Valeurs nulles', en: 'Null values' },
    mutation: { fr: 'Mutations et références', en: 'Mutation and references' },
    security: { fr: 'Sécurité', en: 'Security' },
    sql: { fr: 'Logique SQL', en: 'SQL logic' },
    reactivity: { fr: 'Réactivité Vue', en: 'Vue reactivity' },
    containers: { fr: 'Conteneurs et config', en: 'Containers and config' },
    perf: { fr: 'Ressources et performances', en: 'Resources and performance' }
};

const BUG_PUZZLES = [
    // ---------- Débutant (≈ 600-1000) ----------
    {
        id: 'py-assign-if', lang: 'Python', theme: 'syntax', rating: 650,
        code: ['age = int(input("Ton âge : "))', 'if age = 18:', '    print("Majeur")'],
        bug: 1, fix: 'if age >= 18:',
        fr: 'Un seul = est une affectation, interdite dans un if en Python : c’est une erreur de syntaxe. Pour comparer, on utilise == (ici plutôt >= pour « majeur »).',
        en: 'A single = is an assignment, which Python forbids in an if: it’s a syntax error. Compare with == (here >= makes more sense for “adult”).'
    },
    {
        id: 'js-assign-if', lang: 'JavaScript', theme: 'syntax', rating: 750,
        code: ['function estAdmin(user) {', '  if (user.role = "admin") {', '    return true;', '  }', '  return false;', '}'],
        bug: 1, fix: '  if (user.role === "admin") {',
        fr: 'Un seul = est une affectation : le rôle devient "admin" et la condition est toujours vraie. N’importe qui devient administrateur.',
        en: 'A single = is an assignment: the role becomes "admin" and the condition is always true. Anyone becomes an admin.'
    },
    {
        id: 'js-const-reassign', lang: 'JavaScript', theme: 'scope', rating: 780,
        code: ['const total = 0;', 'for (const prix of panier) {', '  total += prix;', '}'],
        bug: 0, fix: 'let total = 0;',
        fr: 'Une variable const ne peut pas être réaffectée : total += prix lève « Assignment to constant variable ». Il faut let.',
        en: 'A const variable can’t be reassigned: total += prix throws “Assignment to constant variable”. Use let.'
    },
    {
        id: 'py-str-int', lang: 'Python', theme: 'types', rating: 800,
        code: ['score = 10', 'print("Score : " + score)'],
        bug: 1, fix: 'print("Score : " + str(score))',
        fr: 'Python refuse de concaténer une chaîne et un entier (TypeError). Il faut convertir avec str(), ou utiliser une f-string : f"Score : {score}".',
        en: 'Python refuses to concatenate a string and an int (TypeError). Convert with str(), or use an f-string: f"Score : {score}".'
    },
    {
        id: 'sql-no-where', lang: 'SQL', theme: 'sql', rating: 850,
        code: ['-- Vendre un exemplaire du produit 42', 'UPDATE produits', 'SET stock = stock - 1;'],
        bug: 2, fix: 'SET stock = stock - 1 WHERE id = 42;',
        fr: 'Sans WHERE, la mise à jour touche toutes les lignes : le stock de tous les produits diminue.',
        en: 'Without WHERE, the update hits every row: the stock of every product goes down.'
    },
    {
        id: 'js-getbyid-hash', lang: 'JavaScript', theme: 'syntax', rating: 880,
        code: ["const titre = document.getElementById('#titre');", "titre.textContent = 'Bonjour';"],
        bug: 0, fix: "const titre = document.getElementById('titre');",
        fr: 'getElementById attend l’identifiant sans le # (c’est querySelector qui utilise les sélecteurs CSS). Ici il renvoie null et la ligne suivante plante.',
        en: 'getElementById expects the id without # (querySelector is the one that takes CSS selectors). It returns null here and the next line crashes.'
    },
    {
        id: 'cs-off-by-one', lang: 'C#', theme: 'bounds', rating: 900,
        code: ['int[] notes = { 12, 15, 9 };', 'for (int i = 0; i <= notes.Length; i++)', '{', '    Console.WriteLine(notes[i]);', '}'],
        bug: 1, fix: 'for (int i = 0; i < notes.Length; i++)',
        fr: 'Avec <=, le dernier tour lit notes[3], qui n’existe pas : IndexOutOfRangeException. Les indices vont de 0 à Length - 1.',
        en: 'With <=, the last iteration reads notes[3], which doesn’t exist: IndexOutOfRangeException. Indices go from 0 to Length - 1.'
    },
    {
        id: 'py-range-end', lang: 'Python', theme: 'bounds', rating: 950,
        code: ['total = 0', 'for i in range(1, 10):', '    total += i', 'print(total)  # 55 attendu'],
        bug: 1, fix: 'for i in range(1, 11):',
        fr: 'range(1, 10) s’arrête avant 10 : on obtient 45. La borne de fin est exclue, il faut range(1, 11).',
        en: 'range(1, 10) stops before 10, giving 45. The end bound is excluded: use range(1, 11).'
    },
    {
        id: 'py-alias-list', lang: 'Python', theme: 'mutation', rating: 1000,
        code: ['original = [1, 2, 3]', 'copie = original', 'copie.append(4)', 'print(original)  # [1, 2, 3] attendu'],
        bug: 1, fix: 'copie = original.copy()',
        fr: 'copie = original ne copie rien : les deux noms désignent la même liste, donc original contient aussi 4. Il faut .copy() (ou list(original)).',
        en: 'copie = original copies nothing: both names point to the same list, so original also gets 4. Use .copy() (or list(original)).'
    },

    // ---------- Intermédiaire (≈ 1000-1400) ----------
    {
        id: 'cs-missing-await', lang: 'C#', theme: 'async', rating: 1100,
        code: ['public async Task<Produit?> GetByIdAsync(int id)', '{', '    var produit = _context.Produits.FindAsync(id);', '    return produit;', '}'],
        bug: 2, fix: '    var produit = await _context.Produits.FindAsync(id);',
        fr: 'Il manque await : FindAsync renvoie une tâche (ValueTask), pas le produit. La méthode ne compile pas tant qu’on n’attend pas le résultat.',
        en: 'await is missing: FindAsync returns a task (ValueTask), not the product. The method won’t compile until the result is awaited.'
    },
    {
        id: 'vue-ref-value', lang: 'Vue 3', theme: 'reactivity', rating: 1100,
        code: ["import { ref } from 'vue'", 'const compteur = ref(0)', 'function incrementer() {', '  compteur++', '}'],
        bug: 3, fix: '  compteur.value++',
        fr: 'Dans le script, un ref se lit et se modifie via .value. compteur++ essaie de réaffecter la constante. (Dans le template, Vue déballe le ref automatiquement.)',
        en: 'In the script, a ref is read and changed through .value. compteur++ tries to reassign the constant. (In the template, Vue unwraps the ref for you.)'
    },
    {
        id: 'cs-first-null', lang: 'C#', theme: 'nulls', rating: 1150,
        code: ['var admin = users.First(u => u.Role == "admin");', 'if (admin == null)', '{', '    return NotFound();', '}'],
        bug: 0, fix: 'var admin = users.FirstOrDefault(u => u.Role == "admin");',
        fr: 'First lève une exception quand rien ne correspond : le test null n’est jamais atteint. FirstOrDefault renvoie null, ce que le code attend.',
        en: 'First throws when nothing matches, so the null check is never reached. FirstOrDefault returns null, which is what the code expects.'
    },
    {
        id: 'cs-or-null', lang: 'C#', theme: 'nulls', rating: 1150,
        code: ['string? saisie = Console.ReadLine();', 'if (saisie == null || saisie.Length > 0)', '{', '    Traiter(saisie);', '}'],
        bug: 1, fix: 'if (saisie != null && saisie.Length > 0)',
        fr: 'Avec ||, une saisie null entre quand même dans le bloc et Traiter reçoit null. Il faut saisie != null && saisie.Length > 0 (ou !string.IsNullOrEmpty(saisie)).',
        en: 'With ||, a null input still enters the block and Traiter receives null. Use saisie != null && saisie.Length > 0 (or !string.IsNullOrEmpty(saisie)).'
    },
    {
        id: 'sql-injection', lang: 'Python · SQL', theme: 'security', rating: 1200,
        code: ['def trouver(nom):', '    sql = "SELECT * FROM users WHERE nom = \'" + nom + "\'"', '    return db.execute(sql).fetchall()'],
        bug: 1, fix: '    return db.execute("SELECT * FROM users WHERE nom = ?", (nom,)).fetchall()',
        fr: 'Injection SQL : la saisie est collée dans la requête. Avec nom = "\' OR \'1\'=\'1", on récupère toute la table. Il faut une requête paramétrée.',
        en: 'SQL injection: user input is pasted into the query. With nom = "\' OR \'1\'=\'1", you get the whole table. Use a parameterised query.'
    },
    {
        id: 'cs-int-division', lang: 'C#', theme: 'types', rating: 1200,
        code: ['int somme = notes.Sum();', 'double moyenne = somme / notes.Count;', 'Console.WriteLine(moyenne); // 12,67 attendu, 12 affiché'],
        bug: 1, fix: 'double moyenne = (double)somme / notes.Count;',
        fr: 'Deux int donnent une division entière : le résultat est tronqué avant d’être converti en double. Il faut convertir un des opérandes.',
        en: 'Two ints give an integer division: the result is truncated before being converted to double. Cast one of the operands.'
    },
    {
        id: 'js-var-loop', lang: 'JavaScript', theme: 'scope', rating: 1250,
        code: ['for (var i = 0; i < 3; i++) {', '  setTimeout(() => console.log(i), 100);', '}'],
        bug: 0, fix: 'for (let i = 0; i < 3; i++) {',
        fr: 'Avec var, i est partagé par toutes les fonctions : on affiche 3, 3, 3. Avec let, chaque tour a sa propre variable et on obtient 0, 1, 2.',
        en: 'With var, i is shared by every callback, so it prints 3, 3, 3. With let, each iteration gets its own variable and prints 0, 1, 2.'
    },
    {
        id: 'js-array-equality', lang: 'JavaScript', theme: 'mutation', rating: 1250,
        code: ['const attendu = [1, 2, 3];', "const recu = JSON.parse('[1,2,3]');", 'if (attendu === recu) {', "  console.log('Identiques');", '}'],
        bug: 2, fix: 'if (JSON.stringify(attendu) === JSON.stringify(recu)) {',
        fr: '=== compare les références des tableaux, pas leur contenu : deux tableaux distincts ne sont jamais égaux. Il faut comparer les éléments.',
        en: '=== compares array references, not their contents: two distinct arrays are never equal. Compare the elements instead.'
    },
    {
        id: 'cs-foreach-remove', lang: 'C#', theme: 'mutation', rating: 1250,
        code: ['foreach (var p in panier)', '{', '    if (p.Quantite == 0)', '        panier.Remove(p);', '}'],
        bug: 3, fix: 'panier.RemoveAll(p => p.Quantite == 0);',
        fr: 'Modifier une liste pendant qu’on la parcourt avec foreach lève InvalidOperationException (« Collection was modified »). RemoveAll fait le tri en une fois.',
        en: 'Changing a list while iterating it with foreach throws InvalidOperationException (“Collection was modified”). RemoveAll does it in one go.'
    },
    {
        id: 'docker-workdir', lang: 'Docker', theme: 'containers', rating: 1250,
        code: ['FROM python:3.12-slim', 'COPY . /app', 'RUN pip install -r /app/requirements.txt', 'CMD ["python", "app.py"]'],
        bug: 3, fix: 'CMD ["python", "/app/app.py"]',
        fr: 'Le conteneur démarre dans /, où app.py n’existe pas. Il manque WORKDIR /app avant le COPY (ou le chemin complet /app/app.py).',
        en: 'The container starts in /, where app.py doesn’t exist. WORKDIR /app is missing before COPY (or use the full /app/app.py path).'
    },
    {
        id: 'py-mutable-default', lang: 'Python', theme: 'mutation', rating: 1300,
        code: ['def ajouter(article, panier=[]):', '    panier.append(article)', '    return panier'],
        bug: 0, fix: 'def ajouter(article, panier=None):  # puis panier = panier or []',
        fr: 'La liste par défaut est créée une seule fois et partagée entre tous les appels : les paniers se mélangent. Il faut panier=None puis créer la liste dans la fonction.',
        en: 'The default list is created once and shared by every call, so baskets get mixed. Use panier=None and create the list inside the function.'
    },
    {
        id: 'sql-eq-null', lang: 'SQL', theme: 'sql', rating: 1300,
        code: ['-- Utilisateurs sans e-mail renseigné', 'SELECT nom FROM users', 'WHERE email = NULL;'],
        bug: 2, fix: 'WHERE email IS NULL;',
        fr: 'En SQL, toute comparaison avec NULL donne « inconnu », jamais vrai : la requête ne renvoie rien. Il faut IS NULL.',
        en: 'In SQL, any comparison with NULL is “unknown”, never true, so the query returns nothing. Use IS NULL.'
    },
    {
        id: 'js-innerhtml-xss', lang: 'JavaScript', theme: 'security', rating: 1300,
        code: ["const nom = new URLSearchParams(location.search).get('nom');", "document.querySelector('#bienvenue').innerHTML = `Bonjour ${nom} !`;"],
        bug: 1, fix: "document.querySelector('#bienvenue').textContent = `Bonjour ${nom} !`;",
        fr: 'Faille XSS : un lien piégé (?nom=<img src=x onerror=…>) exécute du JavaScript sur la page. textContent affiche le texte sans l’interpréter.',
        en: 'XSS flaw: a crafted link (?nom=<img src=x onerror=…>) runs JavaScript on the page. textContent displays the text without interpreting it.'
    },
    {
        id: 'py-dict-del-loop', lang: 'Python', theme: 'mutation', rating: 1350,
        code: ["stock = {'a': 0, 'b': 3, 'c': 0}", 'for produit in stock:', '    if stock[produit] == 0:', '        del stock[produit]'],
        bug: 1, fix: 'for produit in list(stock):',
        fr: 'Supprimer des clés pendant qu’on parcourt un dictionnaire lève RuntimeError (« dictionary changed size during iteration »). On parcourt une copie des clés.',
        en: 'Deleting keys while iterating a dict raises RuntimeError (“dictionary changed size during iteration”). Iterate over a copy of the keys.'
    },
    {
        id: 'py-is-eq', lang: 'Python', theme: 'types', rating: 1350,
        code: ['def meme_ville(a, b):', '    return a.ville is b.ville'],
        bug: 1, fix: '    return a.ville == b.ville',
        fr: 'is compare l’identité des objets, pas leur valeur : deux chaînes égales peuvent être deux objets différents. Il faut ==.',
        en: 'is compares object identity, not value: two equal strings can be two different objects. Use ==.'
    },
    {
        id: 'vue-mutate-prop', lang: 'Vue 3', theme: 'reactivity', rating: 1400,
        code: ["const props = defineProps(['quantite'])", "const emit = defineEmits(['update:quantite'])", 'function ajouter() {', '  props.quantite++', '}'],
        bug: 3, fix: "  emit('update:quantite', props.quantite + 1)",
        fr: 'Les props sont en lecture seule : Vue refuse la modification (avertissement). Le composant enfant doit émettre un événement et laisser le parent changer la valeur.',
        en: 'Props are read-only: Vue rejects the change (warning). The child component must emit an event and let the parent change the value.'
    },

    // ---------- Avancé (≈ 1400-1800) ----------
    {
        id: 'js-async-foreach', lang: 'JavaScript', theme: 'async', rating: 1450,
        code: ['async function toutSauver(items) {', '  items.forEach(async (item) => {', '    await sauver(item);', '  });', "  console.log('Tout est sauvegardé');", '}'],
        bug: 1, fix: '  for (const item of items) {',
        fr: 'forEach n’attend pas les fonctions async : le message s’affiche avant la fin des sauvegardes, et les erreurs sont perdues. Il faut for…of avec await (ou Promise.all).',
        en: 'forEach doesn’t wait for async callbacks: the message prints before the saves finish, and errors are lost. Use for…of with await (or Promise.all).'
    },
    {
        id: 'sql-where-aggregate', lang: 'SQL', theme: 'sql', rating: 1450,
        code: ['SELECT ville, COUNT(*) AS nb', 'FROM clients', 'WHERE COUNT(*) > 10', 'GROUP BY ville;'],
        bug: 2, fix: 'HAVING COUNT(*) > 10  -- après le GROUP BY',
        fr: 'WHERE filtre les lignes avant le regroupement : on ne peut pas y utiliser un agrégat. Un filtre sur COUNT(*) se met dans HAVING, après GROUP BY.',
        en: 'WHERE filters rows before grouping, so it can’t use an aggregate. A filter on COUNT(*) goes in HAVING, after GROUP BY.'
    },
    {
        id: 'docker-secret-env', lang: 'Docker', theme: 'security', rating: 1450,
        code: ['FROM node:22-alpine', 'WORKDIR /app', 'COPY . .', 'ENV DB_MDP=azerty123', 'CMD ["node", "server.js"]'],
        bug: 3, fix: '# mot de passe fourni au lancement : docker run -e DB_MDP=… (ou un secret)',
        fr: 'Une valeur mise dans ENV est gravée dans l’image : quiconque récupère l’image la lit avec docker inspect. Les secrets se passent au lancement du conteneur.',
        en: 'A value set with ENV is baked into the image: anyone who pulls it can read it with docker inspect. Secrets are passed when the container starts.'
    },
    {
        id: 'js-float-eq', lang: 'JavaScript', theme: 'types', rating: 1500,
        code: ['const total = 0.1 + 0.2;', 'if (total === 0.3) {', '  valider();', '}'],
        bug: 1, fix: 'if (Math.abs(total - 0.3) < Number.EPSILON) {',
        fr: '0.1 + 0.2 vaut 0.30000000000000004 en virgule flottante : l’égalité stricte échoue. On compare avec une tolérance (ou on calcule en centimes entiers).',
        en: '0.1 + 0.2 is 0.30000000000000004 in floating point, so strict equality fails. Compare with a tolerance (or compute in integer cents).'
    },
    {
        id: 'js-this-callback', lang: 'JavaScript', theme: 'scope', rating: 1500,
        code: ['class Minuteur {', '  constructor() { this.secondes = 0; }', '  demarrer() {', '    setInterval(function () {', '      this.secondes++;', '    }, 1000);', '  }', '}'],
        bug: 3, fix: '    setInterval(() => {',
        fr: 'Une function classique a son propre this : dans le callback, il ne désigne plus le Minuteur. Une fonction fléchée garde le this de demarrer().',
        en: 'A regular function has its own this: inside the callback it no longer refers to the Minuteur. An arrow function keeps demarrer()’s this.'
    },
    {
        id: 'compose-localhost', lang: 'Docker Compose', theme: 'containers', rating: 1500,
        code: ['services:', '  db:', '    image: postgres:16', '  api:', '    build: .', '    environment:', '      DB_HOST: localhost'],
        bug: 6, fix: '      DB_HOST: db',
        fr: 'Dans un conteneur, localhost désigne le conteneur lui-même, pas la base. Sur le réseau Compose, on joint un service par son nom : db.',
        en: 'Inside a container, localhost is the container itself, not the database. On the Compose network, you reach a service by its name: db.'
    },
    {
        id: 'cs-return-entity', lang: 'C#', theme: 'security', rating: 1550,
        code: ['[HttpGet("{id}")]', 'public async Task<ActionResult<Utilisateur>> Get(int id)', '{', '    return await _context.Utilisateurs.FindAsync(id);', '}'],
        bug: 3, fix: '    var u = await _context.Utilisateurs.FindAsync(id); return u is null ? NotFound() : _mapper.Map<UtilisateurDto>(u);',
        fr: 'L’entité est renvoyée telle quelle, avec tous ses champs (dont le hash du mot de passe), et un id inconnu ne renvoie pas 404. On passe par un DTO et on gère le cas null.',
        en: 'The entity is returned as-is, with every field (including the password hash), and an unknown id doesn’t return 404. Map to a DTO and handle null.'
    },
    {
        id: 'cs-missing-include', lang: 'C# · EF Core', theme: 'nulls', rating: 1600,
        code: ['var commandes = await _context.Commandes.ToListAsync();', 'foreach (var c in commandes)', '{', '    Console.WriteLine(c.Client.Nom);', '}'],
        bug: 0, fix: 'var commandes = await _context.Commandes.Include(c => c.Client).ToListAsync();',
        fr: 'Sans chargement différé activé, EF Core ne charge pas les relations : c.Client est null et la boucle plante. Il faut Include(c => c.Client).',
        en: 'Without lazy loading, EF Core doesn’t load navigation properties: c.Client is null and the loop crashes. Add Include(c => c.Client).'
    },
    {
        id: 'sql-count-column', lang: 'SQL', theme: 'sql', rating: 1600,
        code: ['-- Nombre total de clients', 'SELECT COUNT(telephone) FROM clients;'],
        bug: 1, fix: 'SELECT COUNT(*) FROM clients;',
        fr: 'COUNT(colonne) ignore les valeurs NULL : les clients sans téléphone ne sont pas comptés. Pour compter les lignes, c’est COUNT(*).',
        en: 'COUNT(column) skips NULL values, so customers without a phone aren’t counted. To count rows, use COUNT(*).'
    },
    {
        id: 'py-generator-exhausted', lang: 'Python', theme: 'mutation', rating: 1650,
        code: ['carres = (x * x for x in range(5))', 'print(sum(carres))  # 30', 'print(max(carres))  # 16 attendu'],
        bug: 0, fix: 'carres = [x * x for x in range(5)]',
        fr: 'Les parenthèses créent un générateur, qui ne se parcourt qu’une fois : après sum(), il est vide et max() lève ValueError. Une liste se relit autant qu’on veut.',
        en: 'Parentheses create a generator, which can only be consumed once: after sum() it’s empty and max() raises ValueError. A list can be read many times.'
    },
    {
        id: 'cs-async-void', lang: 'C#', theme: 'async', rating: 1700,
        code: ['public async void Sauvegarder()', '{', '    await _repo.SaveAsync();', '}'],
        bug: 0, fix: 'public async Task Sauvegarder()',
        fr: 'async void ne peut pas être attendu : l’appelant ne sait pas quand la sauvegarde finit, et une exception fait planter le processus au lieu d’être rattrapée. Il faut renvoyer Task.',
        en: 'async void can’t be awaited: the caller can’t know when saving ends, and an exception crashes the process instead of being caught. Return Task.'
    },
    {
        id: 'vue-destructure-reactive', lang: 'Vue 3', theme: 'reactivity', rating: 1700,
        code: ['const etat = reactive({ compteur: 0 })', 'const { compteur } = etat', 'function incrementer() {', '  etat.compteur++', '}', '// le template affiche {{ compteur }}'],
        bug: 1, fix: 'const { compteur } = toRefs(etat)',
        fr: 'Déstructurer un objet reactive copie la valeur à l’instant t : compteur reste à 0 dans le template. toRefs garde le lien réactif.',
        en: 'Destructuring a reactive object copies the value at that moment: compteur stays at 0 in the template. toRefs keeps the reactive link.'
    },
    {
        id: 'cs-httpclient-using', lang: 'C#', theme: 'perf', rating: 1750,
        code: ['public async Task<string> Meteo(string ville)', '{', '    using var client = new HttpClient();', '    return await client.GetStringAsync($"https://api.exemple.fr/{ville}");', '}'],
        bug: 2, fix: '    var client = _httpClientFactory.CreateClient();',
        fr: 'Créer et jeter un HttpClient à chaque appel épuise les sockets sous charge (ils restent en TIME_WAIT). On réutilise un client, idéalement via IHttpClientFactory.',
        en: 'Creating and disposing an HttpClient per call exhausts sockets under load (they linger in TIME_WAIT). Reuse a client, ideally through IHttpClientFactory.'
    },
    {
        id: 'py-default-datetime', lang: 'Python', theme: 'mutation', rating: 1750,
        code: ['from datetime import datetime', 'def journaliser(message, date=datetime.now()):', '    print(f"[{date}] {message}")'],
        bug: 1, fix: 'def journaliser(message, date=None):  # puis date = date or datetime.now()',
        fr: 'La valeur par défaut est calculée une seule fois, au chargement du module : tous les messages ont la même date. Il faut None puis calculer l’heure dans la fonction.',
        en: 'The default value is computed once, when the module loads: every message gets the same date. Use None and compute the time inside the function.'
    },

    // ---------- Expert (≈ 1800-2200) ----------
    {
        id: 'py-late-binding', lang: 'Python', theme: 'scope', rating: 1800,
        code: ['fonctions = []', 'for i in range(3):', '    fonctions.append(lambda: i)', 'print([f() for f in fonctions])  # [0, 1, 2] attendu'],
        bug: 2, fix: '    fonctions.append(lambda i=i: i)',
        fr: 'Les lambdas lisent i au moment de l’appel, pas de leur création : elles voient toutes la dernière valeur, 2. On fige la valeur avec un argument par défaut.',
        en: 'The lambdas read i when called, not when created: they all see the last value, 2. Freeze the value with a default argument.'
    },
    {
        id: 'sql-left-join-where', lang: 'SQL', theme: 'sql', rating: 1850,
        code: ['-- Tous les clients, avec leurs grosses commandes s’il y en a', 'SELECT c.nom, co.total', 'FROM clients c', 'LEFT JOIN commandes co ON co.client_id = c.id', 'WHERE co.total > 100;'],
        bug: 4, fix: '-- condition à déplacer dans le ON : … ON co.client_id = c.id AND co.total > 100',
        fr: 'Le WHERE s’applique après la jointure : les clients sans commande ont co.total à NULL et sont éliminés. Le LEFT JOIN se comporte comme un INNER JOIN. La condition doit aller dans le ON.',
        en: 'WHERE runs after the join: customers without orders have co.total = NULL and get filtered out, so the LEFT JOIN behaves like an INNER JOIN. Move the condition into ON.'
    },
    {
        id: 'cs-linq-deferred', lang: 'C# · LINQ', theme: 'mutation', rating: 1900,
        code: ['var actifs = users.Where(u => u.Actif);', 'users.Add(new User { Nom = "Zoé", Actif = true });', 'Console.WriteLine(actifs.Count()); // 2 attendu, 3 affiché'],
        bug: 0, fix: 'var actifs = users.Where(u => u.Actif).ToList();',
        fr: 'Une requête LINQ est différée : elle n’est exécutée qu’au Count(), donc après l’ajout de Zoé. ToList() fige le résultat au moment voulu.',
        en: 'A LINQ query is deferred: it only runs at Count(), so after Zoé was added. ToList() materialises the result when you want it.'
    },
    {
        id: 'cs-sync-over-async', lang: 'C#', theme: 'async', rating: 1950,
        code: ['private void BoutonCharger_Click(object sender, EventArgs e)', '{', '    titre.Text = ChargerTitreAsync().Result;', '}'],
        bug: 2, fix: '    titre.Text = await ChargerTitreAsync();  // et le handler en async void',
        fr: '.Result bloque le thread de l’interface en attendant la tâche, qui veut justement revenir sur ce thread pour se terminer : interblocage, l’application se fige. Il faut await (un handler d’événement est le seul cas où async void est admis).',
        en: '.Result blocks the UI thread while waiting for a task that needs that very thread to finish: deadlock, the app freezes. Use await (an event handler is the one place where async void is accepted).'
    },
    {
        id: 'js-promise-race-state', lang: 'JavaScript', theme: 'async', rating: 2000,
        code: ['let resultats = [];', "champ.addEventListener('input', async () => {", '  const rep = await fetch(`/api/recherche?q=${champ.value}`);', '  resultats = await rep.json();', '  afficher(resultats);', '});'],
        bug: 3, fix: '  if (requete === derniereRequete) resultats = await rep.json();  // ignorer les réponses périmées',
        fr: 'Les réponses n’arrivent pas forcément dans l’ordre : une recherche lente pour « ch » peut écraser celle de « chat », arrivée avant. Il faut ignorer les réponses périmées (compteur de requête ou AbortController).',
        en: 'Responses don’t necessarily arrive in order: a slow search for “ch” can overwrite the one for “chat” that arrived first. Ignore stale responses (request counter or AbortController).'
    },
    {
        id: 'py-float-money', lang: 'Python', theme: 'types', rating: 2050,
        code: ['prix = [19.99, 5.01, 0.10]', 'total = sum(prix)', 'if total == 25.10:', '    print("Paiement exact")'],
        bug: 2, fix: 'if round(total, 2) == 25.10:  # ou Decimal pour de l’argent',
        fr: 'La somme flottante vaut 25.099999999999998 : l’égalité échoue. Pour de l’argent, on utilise Decimal ou des centimes entiers ; à défaut, on arrondit avant de comparer.',
        en: 'The float sum is 25.099999999999998, so equality fails. For money, use Decimal or integer cents; at least round before comparing.'
    },
    {
        id: 'cs-static-counter', lang: 'C# · ASP.NET', theme: 'scope', rating: 2100,
        code: ['public class PanierController : ControllerBase', '{', '    private static List<Article> _articles = new();', '    [HttpPost] public IActionResult Ajouter(Article a) { _articles.Add(a); return Ok(_articles); }', '}'],
        bug: 2, fix: '    // stocker le panier par utilisateur (session ou base), jamais dans un champ static',
        fr: 'Un champ static est partagé par toutes les requêtes et tous les utilisateurs : chacun voit le panier des autres, et List n’est pas thread-safe sous accès concurrents.',
        en: 'A static field is shared by every request and every user: everyone sees everyone else’s basket, and List isn’t thread-safe under concurrent access.'
    }
];
