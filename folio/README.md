# Folio

Atlas des **372 familles** de manuscrits de ce dépôt (719 articles). Toile façon planche, filtres, et une fiche par famille.

Deux lectures :

- **Lecture** — une première passe en langage courant, sans présupposer le formalisme.
- **Expert** — l'argument au tableau : définitions, ce qu'on savait, le pas de preuve, un calcul écrit. Le niveau visé est celui de la famille 130. La règle d'écriture est dans [skills/fiche-didactique/SKILL.md](skills/fiche-didactique/SKILL.md). Les formules sont rendues par KaTeX.

Classements : nature, domaine, complexité pédagogique, et deux axes de date (âge du problème, date du manuscrit). L’interface est bilingue français / anglais.

Les classements sont un guide de lecture. Ils ne sont pas une validation des preuves, ni un substitut au [catalogue](../CONTENTS.md) ou aux formalisations Lean.

## Lancer

```bash
cd folio
npm install
npm run dev
```

Puis ouvrir l’adresse affichée. `npm run build` produit `dist/`.

## Vercel

Le dépôt se déploie sans changer le répertoire racine du projet. [`vercel.json`](../vercel.json), à la racine, installe et construit `folio/`, puis publie `folio/dist`. Node 22 (`.node-version`). Un commit qui ne touche pas `folio/` ne relance pas le build.

Importer [le dépôt](https://github.com/andyrandriamiarisoa-web/OpenAi_math) dans Vercel et laisser le répertoire racine sur la racine du dépôt. Ne pas le fixer sur `folio` : ce n’est utile que si `folio/vercel.json` doit prendre le relais.

Le clone fait environ 800 Mo à cause des manuscrits. Le premier déploiement peut être long. L’atlas lui-même ne publie que le site statique.
