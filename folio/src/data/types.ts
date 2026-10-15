export const NATURES = [
  "nombres",
  "geometrie-algebrique",
  "analyse",
  "geometrie",
  "physique-math",
  "informatique",
  "combinatoire",
  "probabilites",
  "dynamique",
  "algebre",
  "operateurs",
  "logique",
] as const;

export const DOMAINS = [
  "nombres",
  "formes",
  "physique",
  "calcul",
  "structures",
  "information",
  "hasard",
  "dynamique",
] as const;

export const COMPLEXITIES = ["lecture", "avance", "frontiere"] as const;

export type Nature = (typeof NATURES)[number];
export type Domain = (typeof DOMAINS)[number];
export type Complexity = (typeof COMPLEXITIES)[number];
export type Lang = "fr" | "en";
export type Level = "plain" | "expert";
export type DateAxis = "manuscript" | "problem";
export type GroupBy = "domain" | "nature" | "complexity" | "era";

export type PdfLink = { title: string; href: string };

export type Family = {
  id: string;
  titleEn: string;
  titleFr: string;
  claim: string;
  nature: Nature;
  domain: Domain;
  complexity: Complexity;
  problemYear: number | null;
  yearKnown: boolean;
  manuscriptDate: string | null;
  lean: boolean;
  pdfs: PdfLink[];
  plainFr: string;
  plainEn: string;
  expertFr: string;
  expertEn: string;
  sparkFr: string;
  sparkEn: string;
};

export type CopyBlock = { fr: string; en: string };
