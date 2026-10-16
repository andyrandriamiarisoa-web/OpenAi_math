import { domainLabel, frameTitle, t, tx } from "@/data/i18n";
import type { DateAxis, Family, GroupBy, Lang } from "@/data/types";
import { groupKey } from "@/lib/layout";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Branch = {
  id: string;
  label: string;
  count: number;
  families: Family[];
  children: Branch[];
};

const DOMAIN_RANK: Record<string, number> = {
  nombres: 0,
  formes: 1,
  physique: 2,
  calcul: 3,
  structures: 4,
  information: 5,
  hasard: 6,
  dynamique: 7,
};
const NATURE_RANK: Record<string, number> = {
  nombres: 0,
  "geometrie-algebrique": 1,
  analyse: 2,
  geometrie: 3,
  "physique-math": 4,
  informatique: 5,
  combinatoire: 6,
  probabilites: 7,
  dynamique: 8,
  algebre: 9,
  operateurs: 10,
  logique: 11,
};

const MONTHS: Record<Lang, string[]> = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

function centuryLabel(year: number, lang: Lang): string {
  const n = Math.floor(year / 100) + 1;
  if (lang === "fr") return `${n}e siècle`;
  const teen = n % 100;
  const suf = teen >= 11 && teen <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suf} century`;
}

function pack(
  items: Family[],
  levels: Array<(f: Family) => { id: string; label: string; rank: number }>,
  prefix = "",
): Branch[] {
  if (levels.length === 0) return [];
  const [level, ...rest] = levels;
  const buckets = new Map<string, { label: string; rank: number; items: Family[] }>();
  for (const f of items) {
    const { id, label, rank } = level(f);
    const found = buckets.get(id);
    if (found) found.items.push(f);
    else buckets.set(id, { label, rank, items: [f] });
  }
  return [...buckets.entries()]
    .sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]))
    .map(([id, bucket]) => ({
      id: `${prefix}${id}`,
      label: bucket.label,
      count: bucket.items.length,
      families: rest.length ? [] : bucket.items.slice().sort((a, b) => a.id.localeCompare(b.id)),
      children: rest.length ? pack(bucket.items, rest, `${prefix}${id}/`) : [],
    }));
}

function dateLevels(axis: DateAxis, lang: Lang): Array<(f: Family) => { id: string; label: string; rank: number }> {
  if (axis === "manuscript") {
    return [
      (f) => {
        const y = f.manuscriptDate?.slice(0, 4) ?? "none";
        return { id: y, label: y === "none" ? t(lang, "undatedGroup") : y, rank: y === "none" ? 9999 : Number(y) };
      },
      (f) => {
        const m = f.manuscriptDate ? Number(f.manuscriptDate.slice(5, 7)) : 0;
        return { id: String(m), label: m ? MONTHS[lang][m - 1] : t(lang, "undatedGroup"), rank: m || 99 };
      },
      (f) => {
        const d = f.manuscriptDate?.slice(8, 10) ?? "00";
        return { id: d, label: f.manuscriptDate ? String(Number(d)) : "—", rank: Number(d) };
      },
    ];
  }
  return [
    (f) => {
      if (f.problemYear == null) return { id: "none", label: t(lang, "undatedGroup"), rank: 9999 };
      const c = Math.floor(f.problemYear / 100) * 100;
      return { id: String(c), label: centuryLabel(f.problemYear, lang), rank: c };
    },
    (f) => {
      if (f.problemYear == null) return { id: "none", label: t(lang, "undatedGroup"), rank: 9999 };
      const d = Math.floor(f.problemYear / 10) * 10;
      return { id: String(d), label: lang === "fr" ? `années ${d}` : `${d}s`, rank: d };
    },
    (f) => {
      if (f.problemYear == null) return { id: "none", label: t(lang, "undatedGroup"), rank: 9999 };
      return { id: String(f.problemYear), label: String(f.problemYear), rank: f.problemYear };
    },
  ];
}

function collectIds(nodes: Branch[], into: string[]) {
  for (const node of nodes) {
    into.push(node.id);
    collectIds(node.children, into);
  }
}

export function TreeList({
  families,
  lang,
  groupBy,
  axis,
  sortDate,
  selectedId,
  query,
  onSelect,
}: {
  families: Family[];
  lang: Lang;
  groupBy: GroupBy;
  axis: DateAxis;
  sortDate: boolean;
  selectedId: string | null;
  query: string;
  onSelect: (id: string) => void;
}) {
  const tree = useMemo(() => {
    const levels = sortDate
      ? dateLevels(axis, lang)
      : [
          (f: Family) => {
            const key = groupKey(f, groupBy, axis);
            const rank =
              groupBy === "domain"
                ? (DOMAIN_RANK[key] ?? 50)
                : groupBy === "nature"
                  ? (NATURE_RANK[key] ?? 50)
                  : 0;
            return { id: key, label: frameTitle(key, lang), rank };
          },
          ...(groupBy === "domain"
            ? []
            : [
                (f: Family) => ({
                  id: f.domain,
                  label: tx(lang, domainLabel[f.domain]),
                  rank: DOMAIN_RANK[f.domain] ?? 50,
                }),
              ]),
        ];
    return pack(families, levels);
  }, [families, lang, groupBy, axis, sortDate]);

  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!query.trim()) {
      setOpen(new Set());
      return;
    }
    const ids: string[] = [];
    collectIds(tree, ids);
    setOpen(new Set(ids));
  }, [query, tree]);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul>
      {tree.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} open={open} toggle={toggle} lang={lang} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function TreeNode({
  node,
  depth,
  open,
  toggle,
  lang,
  selectedId,
  onSelect,
}: {
  node: Branch;
  depth: number;
  open: Set<string>;
  toggle: (id: string) => void;
  lang: Lang;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const isOpen = open.has(node.id);
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={() => toggle(node.id)}
        className="flex min-h-11 w-full items-center gap-2 px-3 text-left"
        style={{ paddingLeft: 12 + depth * 14 }}
        aria-expanded={isOpen}
      >
        <ChevronRight className={cn("size-4 shrink-0 text-muted transition-transform", isOpen && "rotate-90")} />
        <span className="min-w-0 flex-1 truncate text-sm">{node.label}</span>
        <span className="text-xs text-muted tabular-nums">{node.count}</span>
      </button>
      {isOpen ? (
        node.children.length > 0 ? (
          <ul>
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                open={open}
                toggle={toggle}
                lang={lang}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        ) : (
          <ul>
            {node.families.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onSelect(f.id)}
                  className={cn("flex w-full items-start gap-3 py-3 pr-3 text-left", f.id === selectedId ? "bg-linen" : "")}
                  style={{ paddingLeft: 28 + depth * 14 }}
                >
                  <span className="w-8 shrink-0 text-xs text-muted tabular-nums">{f.id}</span>
                  <span className="min-w-0 flex-1 text-sm">{lang === "fr" ? f.titleFr : f.titleEn}</span>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </li>
  );
}
