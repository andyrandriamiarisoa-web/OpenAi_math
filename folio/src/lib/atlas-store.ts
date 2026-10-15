import { create } from "zustand";
import { families } from "@/data/families";
import type { Complexity, DateAxis, Domain, GroupBy, Lang, Level, Nature } from "@/data/types";

const years = families.map((f) => f.problemYear).filter((y): y is number => y != null);
const dates = families
  .map((f) => f.manuscriptDate)
  .filter((d): d is string => Boolean(d))
  .sort();

export const yearExtent = {
  min: years.length ? Math.min(...years) : 1600,
  max: years.length ? Math.max(...years) : 2026,
};
export const dateExtent = {
  min: dates[0] ?? "2026-09-10",
  max: dates[dates.length - 1] ?? "2026-10-07",
};
export const dateTicks = [...new Set(dates)];

type AtlasState = {
  lang: Lang;
  level: Level;
  axis: DateAxis;
  groupBy: GroupBy;
  query: string;
  natures: Nature[];
  domains: Domain[];
  complexities: Complexity[];
  yearMin: number;
  yearMax: number;
  dateMin: string;
  dateMax: string;
  includeUndated: boolean;
  deepOnly: boolean;
  leanOnly: boolean;
  selectedId: string | null;
  list: "auto" | "list" | "canvas";
  about: boolean;
  filtersOpen: boolean;
  fitRequest: number;
  setLang: (lang: Lang) => void;
  setLevel: (level: Level) => void;
  setAxis: (axis: DateAxis) => void;
  setGroupBy: (groupBy: GroupBy) => void;
  setQuery: (query: string) => void;
  toggleNature: (nature: Nature) => void;
  toggleDomain: (domain: Domain) => void;
  toggleComplexity: (complexity: Complexity) => void;
  setYearMin: (yearMin: number) => void;
  setYearMax: (yearMax: number) => void;
  setDateMin: (dateMin: string) => void;
  setDateMax: (dateMax: string) => void;
  setIncludeUndated: (includeUndated: boolean) => void;
  setDeepOnly: (deepOnly: boolean) => void;
  setLeanOnly: (leanOnly: boolean) => void;
  select: (selectedId: string | null) => void;
  setList: (list: "auto" | "list" | "canvas") => void;
  setAbout: (about: boolean) => void;
  setFiltersOpen: (filtersOpen: boolean) => void;
  requestFit: () => void;
  resetFilters: () => void;
};

const blank = {
  natures: [] as Nature[],
  domains: [] as Domain[],
  complexities: [] as Complexity[],
  yearMin: yearExtent.min,
  yearMax: yearExtent.max,
  dateMin: dateExtent.min,
  dateMax: dateExtent.max,
  includeUndated: true,
  deepOnly: false,
  leanOnly: false,
  query: "",
};

export const useAtlas = create<AtlasState>((set) => ({
  lang: "fr",
  level: "plain",
  axis: "problem",
  groupBy: "domain",
  ...blank,
  selectedId: null,
  list: "auto",
  about: false,
  filtersOpen: false,
  fitRequest: 0,
  setLang: (lang) => set({ lang }),
  setLevel: (level) => set({ level }),
  setAxis: (axis) => set({ axis }),
  setGroupBy: (groupBy) => set({ groupBy }),
  setQuery: (query) => set({ query }),
  toggleNature: (nature) =>
    set((s) => ({
      natures: s.natures.includes(nature) ? s.natures.filter((n) => n !== nature) : [...s.natures, nature],
    })),
  toggleDomain: (domain) =>
    set((s) => ({
      domains: s.domains.includes(domain) ? s.domains.filter((d) => d !== domain) : [...s.domains, domain],
    })),
  toggleComplexity: (complexity) =>
    set((s) => ({
      complexities: s.complexities.includes(complexity)
        ? s.complexities.filter((c) => c !== complexity)
        : [...s.complexities, complexity],
    })),
  setYearMin: (yearMin) => set({ yearMin }),
  setYearMax: (yearMax) => set({ yearMax }),
  setDateMin: (dateMin) => set({ dateMin }),
  setDateMax: (dateMax) => set({ dateMax }),
  setIncludeUndated: (includeUndated) => set({ includeUndated }),
  setDeepOnly: (deepOnly) => set({ deepOnly }),
  setLeanOnly: (leanOnly) => set({ leanOnly }),
  select: (selectedId) => set({ selectedId }),
  setList: (list) => set({ list }),
  setAbout: (about) => set({ about }),
  setFiltersOpen: (filtersOpen) => set({ filtersOpen }),
  requestFit: () => set((s) => ({ fitRequest: s.fitRequest + 1 })),
  resetFilters: () => set(blank),
}));
