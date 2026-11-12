# Source du CV

`build.py` génère `Mateo_Bourdin_CV_FR.pdf` et `Mateo_Bourdin_CV_EN.pdf` avec WeasyPrint 70 :

```
pip install weasyprint==70.0
python3 build.py
cp Mateo_Bourdin_CV_*.pdf ..
```

Le HTML est écrit pour les ATS : contenu principal avant la colonne de gauche, titres sans espacement de lettres, puces dans le texte, dates collées au titre de chaque poste.
