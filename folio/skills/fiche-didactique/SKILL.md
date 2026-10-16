---
name: fiche-didactique
description: >
  Écrire ou réécrire une fiche Folio. Deux étages : Lecture pour un
  non-mathématicien, Expert comme un exposé au tableau devant un directeur
  de thèse. Les formules passent par KaTeX, jamais en texte brut.
---

# Fiche didactique

Chaque famille a deux étages. On n'écrit pas le titre du papier à la place de l'argument.

## Lecture

Pour quelqu'un qui n'a pas le vocabulaire.

- Une analogie concrète, puis ce que le dessin montre.
- Une seule formule, écrite et dite mot à mot. Les lettres sont nommées.
- À quoi ça peut servir, en une liste courte.
- Le fil tient en quelques phrases, pas en titres de sections.

## Expert — au tableau

Comme si on l'expliquait à un directeur de thèse, craie en main.

1. L'objet, écrit. La matrice, l'ensemble, la quantité. Chaque symbole est dit.
2. Ce qu'on savait, avec les noms, et sous quelles hypothèses.
3. Pourquoi ces hypothèses ne ferment pas la question dans le modèle du papier.
4. D'où vient le gain : le pas de preuve, pas le slogan.
5. Un calcul ou un exemple physique entièrement écrit, assez petit pour être refait, et une phrase sur ce qu'il ne montre pas.
6. Ce que le papier ajoute. S'il y a plusieurs manuscrits, on les distingue.

On n'ajoute pas un théorème qui n'est pas dans le manuscrit, le résumé ou l'introduction. Si un nombre manque, on le dit.

## Formules

Le rendu est KaTeX (`src/components/atlas/math-text.tsx`).

- En ligne : `$X_k = \sum_{t=0}^{n-1} x_t \omega^{tk}$`
- Seule, en plus grand : `$$O\bigl(n(\log n)^{1-10^{-13}}\bigr)$$`

On ne laisse pas `Σ_{t=0}` ni `^{tk}` en clair : les accolades s'afficheraient telles quelles. Le grec unicode est rattrapé, mais la source d'une formule est du LaTeX.

La phrase française reste dehors des dollars.

## Les deux langues

Français et anglais disent la même chose, au même détail.

## Exemple de niveau

La famille 130. Lecture : l'accord et l'histogramme. Expert : la matrice non normalisée, Cooley–Tukey, Good, Bluestein, Morgenstern, Ailon, Alman–Rao, le mot tensoriel, puis le calcul $n = 4$, $\zeta = i$, $x = (1,0,1,0)$.
