import type { Complexity, CopyBlock, DateAxis, Domain, GroupBy, Lang, Nature } from "@/data/types";

export const natureLabel: Record<Nature, CopyBlock> = {
  nombres: { fr: "Nombres", en: "Number theory" },
  "geometrie-algebrique": { fr: "Géométrie algébrique", en: "Algebraic geometry" },
  analyse: { fr: "Analyse", en: "Analysis" },
  geometrie: { fr: "Géométrie", en: "Geometry" },
  "physique-math": { fr: "Physique mathématique", en: "Mathematical physics" },
  informatique: { fr: "Informatique théorique", en: "Theoretical CS" },
  combinatoire: { fr: "Combinatoire", en: "Combinatorics" },
  probabilites: { fr: "Probabilités", en: "Probability" },
  dynamique: { fr: "Dynamique", en: "Dynamics" },
  algebre: { fr: "Algèbre", en: "Algebra" },
  operateurs: { fr: "Algèbres d'opérateurs", en: "Operator algebras" },
  logique: { fr: "Logique", en: "Logic" },
};

export const domainLabel: Record<Domain, CopyBlock> = {
  nombres: { fr: "Nombres & arithmétique", en: "Numbers & arithmetic" },
  formes: { fr: "Formes & espace", en: "Shape & space" },
  physique: { fr: "Physique & matière", en: "Physics & matter" },
  calcul: { fr: "Calcul & algorithmes", en: "Computation" },
  structures: { fr: "Structures pures", en: "Pure structure" },
  information: { fr: "Information & quantique", en: "Information & quantum" },
  hasard: { fr: "Hasard", en: "Chance" },
  dynamique: { fr: "Dynamique & chaos", en: "Dynamics & chaos" },
};

export const complexityLabel: Record<Complexity, CopyBlock> = {
  lecture: { fr: "Lecture", en: "Glimpse" },
  avance: { fr: "Avancé", en: "Advanced" },
  frontiere: { fr: "Frontière", en: "Frontier" },
};

export const complexityHint: Record<Complexity, CopyBlock> = {
  lecture: {
    fr: "L'idée se raconte avec un objet, un jeu ou un dessin.",
    en: "The idea can be told with an object, a game, or a picture.",
  },
  avance: {
    fr: "Il faut une image de courbe, de graphe, de matrice ou d'équation.",
    en: "You need a picture of a curve, a graph, a matrix, or an equation.",
  },
  frontiere: {
    fr: "Même la question demande le vocabulaire de la recherche.",
    en: "Even the question needs the vocabulary of research.",
  },
};

const ERA: Record<string, CopyBlock> = {
  "era-classic": { fr: "Avant 1900", en: "Before 1900" },
  "era-early": { fr: "1900–1949", en: "1900–1949" },
  "era-mid": { fr: "1950–1979", en: "1950–1979" },
  "era-late": { fr: "1980–1999", en: "1980–1999" },
  "era-now": { fr: "Depuis 2000", en: "Since 2000" },
  "era-unknown": { fr: "Âge non daté", en: "Undated problem" },
  "d:none": { fr: "Sans date de manuscrit", en: "No manuscript date" },
};

const MONTHS: Record<Lang, string[]> = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export function tx(lang: Lang, block: CopyBlock): string {
  return block[lang];
}

export function formatDay(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  const name = MONTHS[lang][m - 1] ?? "";
  return lang === "fr" ? `${d} ${name} ${y}` : `${name} ${d}, ${y}`;
}

export function frameTitle(key: string, lang: Lang): string {
  if (key in domainLabel) return tx(lang, domainLabel[key as Domain]);
  if (key in natureLabel) return tx(lang, natureLabel[key as Nature]);
  if (key in complexityLabel) return tx(lang, complexityLabel[key as Complexity]);
  if (key in ERA) return tx(lang, ERA[key]);
  if (key.startsWith("d:")) return formatDay(key.slice(2), lang);
  return key;
}

export function yearLabel(year: number | null, known: boolean, lang: Lang): string {
  if (year == null) return lang === "fr" ? "Âge non daté" : "Undated";
  if (known) return String(year);
  return lang === "fr" ? `vers ${year}` : `c. ${year}`;
}

const UI = {
  name: { fr: "Folio", en: "Folio" },
  tag: { fr: "372 familles, deux lectures", en: "372 families, two readings" },
  search: { fr: "Rechercher un titre, un numéro…", en: "Search a title or a number…" },
  filters: { fr: "Filtres", en: "Filters" },
  nature: { fr: "Nature", en: "Nature" },
  domain: { fr: "Domaine", en: "Domain" },
  complexity: { fr: "Complexité", en: "Complexity" },
  group: { fr: "Grouper", en: "Group" },
  byDomain: { fr: "Domaine", en: "Domain" },
  byNature: { fr: "Nature", en: "Nature" },
  byComplexity: { fr: "Complexité", en: "Complexity" },
  byEra: { fr: "Date", en: "Date" },
  axis: { fr: "Axe de date", en: "Date axis" },
  problem: { fr: "Âge du problème", en: "Age of the problem" },
  manuscript: { fr: "Date du manuscrit", en: "Manuscript date" },
  undated: { fr: "Inclure les non datés", en: "Include undated" },
  deepOnly: { fr: "Avec exemple chiffré", en: "With a worked example" },
  leanOnly: { fr: "Signalées en Lean", en: "Flagged in Lean" },
  reset: { fr: "Tout effacer", en: "Clear" },
  plain: { fr: "Lecture", en: "Reading" },
  expert: { fr: "Expert", en: "Expert" },
  list: { fr: "Liste", en: "List" },
  canvas: { fr: "Toile", en: "Canvas" },
  fit: { fr: "Cadrer", en: "Frame" },
  about: { fr: "À propos", en: "About" },
  close: { fr: "Fermer", en: "Close" },
  empty: { fr: "Aucune famille ne passe ces filtres.", en: "No family matches these filters." },
  families: { fr: "familles", en: "families" },
  visible: { fr: "visibles", en: "showing" },
  question: { fr: "La question", en: "The question" },
  picture: { fr: "Image", en: "Picture" },
  shown: { fr: "Ce que le manuscrit affirme", en: "What the manuscript asserts" },
  example: { fr: "Exemple pour voir", en: "An example, to see it" },
  inspiration: { fr: "Piste", en: "A reason to look" },
  claim: { fr: "Phrase du dépôt", en: "Repository sentence" },
  papers: { fr: "Manuscrits", en: "Manuscripts" },
  related: { fr: "Familles proches", en: "Nearby families" },
  uses: { fr: "À quoi ça peut servir", en: "Where this question comes back" },
  statement: { fr: "Au tableau", en: "At the board" },
  known: { fr: "Ce qu'on savait", en: "What was already known" },
  adds: { fr: "Ce que le papier ajoute", en: "What the paper adds" },
  plan: { fr: "Le fil", en: "The line of the argument" },
  formula: { fr: "En une formule", en: "In one formula" },
  lean: { fr: "Lean", en: "Lean" },
  open: { fr: "Ouvrir le PDF", en: "Open PDF" },
  legendTitle: { fr: "Comment lire la toile", en: "How to read the canvas" },
  sortId: { fr: "Numéro", en: "Number" },
  sortDate: { fr: "Date", en: "Date" },
  from: { fr: "De", en: "From" },
  to: { fr: "À", en: "To" },
  menu: { fr: "Menu", en: "Menu" },
  combine: {
    fr: "Plusieurs cases à la fois : on garde chaque famille qui est dans l'un des choix.",
    en: "Tick several at once: every family in any ticked box stays in the list.",
  },
  undatedGroup: { fr: "Sans date", en: "Undated" },
} as const;

export type UiKey = keyof typeof UI;

export function t(lang: Lang, key: UiKey): string {
  return UI[key][lang];
}

export function groupLabel(groupBy: GroupBy, lang: Lang): string {
  if (groupBy === "domain") return t(lang, "byDomain");
  if (groupBy === "nature") return t(lang, "byNature");
  if (groupBy === "complexity") return t(lang, "byComplexity");
  return t(lang, "byEra");
}

export function axisLabel(axis: DateAxis, lang: Lang): string {
  return axis === "problem" ? t(lang, "problem") : t(lang, "manuscript");
}

export const legendBody: CopyBlock = {
  fr: "Chaque pastille est une famille de manuscrits. Les îlots regroupent par domaine, par nature, par complexité, ou par date. Un point plein marque la frontière ; un anneau, une idée qu'on peut entrevoir. Le carré rouge signale une fiche avec un exemple chiffré.",
  en: "Each tile is a family of manuscripts. Islands group by domain, nature, complexity, or date. A solid dot marks frontier material; a ring marks an idea you can glimpse. A red square marks a fiche with a worked example.",
};

export const aboutBody: CopyBlock = {
  fr: "Folio parcourt les 372 familles du dépôt OpenAi_math : 719 manuscrits produits par un modèle interne, à des stades divers de vérification. Ce n'est pas un catalogue de modèles appliqués, et une fiche ne certifie pas la preuve. Chaque famille a deux lectures : une explication en langage courant, avec un dessin, puis le plan du manuscrit, une formule quand elle se dit, et un exemple pour voir. La nature, le domaine et l'âge du problème sont des repères de lecture reconstruits ici.",
  en: "Folio browses the 372 families in the OpenAi_math repository: 719 manuscripts produced by an internal model, at various stages of verification. This is not a catalog of applied models, and a fiche does not certify the proof. Each family has two readings: a plain-language explanation with a drawing, then the plan of the manuscript, a formula when it can be said, and an example to see it. Nature, domain, and the age of the problem are reading guides built here.",
};

export const repoUrl = "https://github.com/andyrandriamiarisoa-web/OpenAi_math";
