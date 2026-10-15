import type { DateAxis, Family, GroupBy } from "@/data/types";

export const CARD_W = 200;
export const CARD_H = 76;
const GAP = 8;
const PAD = 14;
const LABEL = 34;

export type WorldNode = { family: Family; x: number; y: number };
export type WorldFrame = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  count: number;
};
export type World = {
  frames: WorldFrame[];
  nodes: WorldNode[];
  bounds: { x: number; y: number; w: number; h: number };
};

const DOMAIN_ORDER = ["nombres", "formes", "physique", "calcul", "structures", "information", "hasard", "dynamique"];
const NATURE_ORDER = [
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
];
const COMPLEXITY_ORDER = ["lecture", "avance", "frontiere"];
const ERA_ORDER = ["era-classic", "era-early", "era-mid", "era-late", "era-now", "era-unknown"];

export function eraKey(year: number | null): string {
  if (year == null) return "era-unknown";
  if (year < 1900) return "era-classic";
  if (year < 1950) return "era-early";
  if (year < 1980) return "era-mid";
  if (year < 2000) return "era-late";
  return "era-now";
}

export function groupKey(f: Family, groupBy: GroupBy, axis: DateAxis): string {
  if (groupBy === "domain") return f.domain;
  if (groupBy === "nature") return f.nature;
  if (groupBy === "complexity") return f.complexity;
  if (axis === "manuscript") return f.manuscriptDate ? `d:${f.manuscriptDate}` : "d:none";
  return eraKey(f.problemYear);
}

function orderIndex(key: string, groupBy: GroupBy): number {
  const table =
    groupBy === "domain"
      ? DOMAIN_ORDER
      : groupBy === "nature"
        ? NATURE_ORDER
        : groupBy === "complexity"
          ? COMPLEXITY_ORDER
          : ERA_ORDER;
  const i = table.indexOf(key);
  if (i >= 0) return i;
  if (key.startsWith("d:")) return key === "d:none" ? 9999 : Number(key.slice(2).replaceAll("-", ""));
  return 5000;
}

function colsFor(n: number): number {
  if (n <= 1) return 1;
  if (n <= 4) return n;
  if (n <= 10) return 5;
  return Math.min(8, Math.max(5, Math.ceil(Math.sqrt(n * 1.45))));
}

export function layoutWorld(families: Family[], groupBy: GroupBy, axis: DateAxis): World {
  const buckets = new Map<string, Family[]>();
  for (const f of families) {
    const key = groupKey(f, groupBy, axis);
    const list = buckets.get(key);
    if (list) list.push(f);
    else buckets.set(key, [f]);
  }
  const keys = [...buckets.keys()].sort((a, b) => orderIndex(a, groupBy) - orderIndex(b, groupBy) || a.localeCompare(b));

  const packed: { key: string; w: number; h: number; cols: number; items: Family[] }[] = [];
  for (const key of keys) {
    const items = buckets.get(key)!.slice().sort((a, b) => a.id.localeCompare(b.id));
    const cols = colsFor(items.length);
    const rows = Math.ceil(items.length / cols);
    const w = PAD * 2 + cols * CARD_W + (cols - 1) * GAP;
    const h = LABEL + PAD + rows * CARD_H + (rows - 1) * GAP + PAD;
    packed.push({ key, w, h, cols, items });
  }

  const maxRow = 1680;
  let x = 0;
  let y = 28;
  let rowH = 0;
  const frames: WorldFrame[] = [];
  const nodes: WorldNode[] = [];
  for (const frame of packed) {
    if (x > 0 && x + frame.w > maxRow) {
      x = 0;
      y += rowH + 72;
      rowH = 0;
    }
    frames.push({ key: frame.key, x, y, w: frame.w, h: frame.h, count: frame.items.length });
    frame.items.forEach((family, i) => {
      const col = i % frame.cols;
      const row = Math.floor(i / frame.cols);
      nodes.push({
        family,
        x: x + PAD + col * (CARD_W + GAP),
        y: y + LABEL + PAD + row * (CARD_H + GAP),
      });
    });
    x += frame.w + 56;
    rowH = Math.max(rowH, frame.h);
  }
  const w = Math.max(640, ...frames.map((f) => f.x + f.w)) + 48;
  const h = Math.max(480, ...frames.map((f) => f.y + f.h)) + 48;
  return { frames, nodes, bounds: { x: 0, y: 0, w, h } };
}
