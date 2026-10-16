import { families } from "@/data/families";
import { aboutBody, domainLabel, groupLabel, legendBody, natureLabel, t, tx } from "@/data/i18n";
import type { GroupBy } from "@/data/types";
import { useAtlas } from "@/lib/atlas-store";
import { groupKey } from "@/lib/layout";
import { BookOpen, ChevronLeft, Info, Languages, LayoutGrid, List, Menu, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Board, useMatched } from "./board";
import { FicheBody, FichePanel } from "./fiche";
import { Filters } from "./filters";
import { TreeList } from "./tree-list";
import { cn } from "@/lib/cn";
import type { Family } from "@/data/types";

const GROUPS: GroupBy[] = ["domain", "nature", "complexity", "era"];

function FicheSheet({ family, onClose }: { family: Family; onClose: () => void }) {
  const origin = useRef<number | null>(null);
  const drag = useRef(0);
  const [dy, setDy] = useState(0);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    origin.current = e.clientY;
    drag.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (origin.current == null) return;
    const next = Math.max(0, e.clientY - origin.current);
    drag.current = next;
    setDy(next);
  };
  const onPointerUp = () => {
    if (drag.current > 72) onClose();
    origin.current = null;
    drag.current = 0;
    setDy(0);
  };

  return (
    <div
      className={cn(
        "mobile-sheet fixed inset-x-0 bottom-0 z-30 max-h-[78dvh] overflow-y-auto rounded-t-2xl border border-line bg-paper lg:hidden",
        dy === 0 && "translate-y-0",
      )}
      style={dy ? { transform: `translateY(${dy}px)`, transition: "none" } : undefined}
    >
      <div
        className="flex touch-none justify-center py-3"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="h-1.5 w-12 rounded-full bg-line" />
      </div>
      <div className="sheet-safe">
        <FicheBody family={family} onClose={onClose} />
      </div>
    </div>
  );
}

export function AtlasApp() {
  const lang = useAtlas((s) => s.lang);
  const setLang = useAtlas((s) => s.setLang);
  const level = useAtlas((s) => s.level);
  const setLevel = useAtlas((s) => s.setLevel);
  const groupBy = useAtlas((s) => s.groupBy);
  const setGroupBy = useAtlas((s) => s.setGroupBy);
  const axis = useAtlas((s) => s.axis);
  const query = useAtlas((s) => s.query);
  const setQuery = useAtlas((s) => s.setQuery);
  const list = useAtlas((s) => s.list);
  const setList = useAtlas((s) => s.setList);
  const about = useAtlas((s) => s.about);
  const setAbout = useAtlas((s) => s.setAbout);
  const filtersOpen = useAtlas((s) => s.filtersOpen);
  const setFiltersOpen = useAtlas((s) => s.setFiltersOpen);
  const selectedId = useAtlas((s) => s.selectedId);
  const select = useAtlas((s) => s.select);
  const domains = useAtlas((s) => s.domains);
  const natures = useAtlas((s) => s.natures);
  const toggleDomain = useAtlas((s) => s.toggleDomain);
  const toggleNature = useAtlas((s) => s.toggleNature);
  const requestFit = useAtlas((s) => s.requestFit);
  const matched = useMatched(families);
  const selected = families.find((f) => f.id === selectedId) ?? null;
  const [narrow, setNarrow] = useState(false);
  const [sortDate, setSortDate] = useState(false);
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const showingList = list === "list" || (list === "auto" && narrow);

  const ordered = useMemo(() => {
    const copy = matched.slice();
    copy.sort((a, b) => {
      if (sortDate) {
        if (axis === "problem") return (a.problemYear ?? 9999) - (b.problemYear ?? 9999) || a.id.localeCompare(b.id);
        return (a.manuscriptDate ?? "9999").localeCompare(b.manuscriptDate ?? "9999") || a.id.localeCompare(b.id);
      }
      const ga = groupKey(a, groupBy, axis);
      const gb = groupKey(b, groupBy, axis);
      return ga.localeCompare(gb) || a.id.localeCompare(b.id);
    });
    return copy;
  }, [matched, sortDate, axis, groupBy]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("folio-lang");
      if (stored === "en" || stored === "fr") setLang(stored);
      const lv = localStorage.getItem("folio-level");
      if (lv === "plain" || lv === "expert") setLevel(lv);
    } catch {
      /* ignore */
    }
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setLang, setLevel, setList]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("folio-lang", lang);
      localStorage.setItem("folio-level", level);
    } catch {
      /* ignore */
    }
  }, [lang, level]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "Escape") {
        select(null);
        setAbout(false);
        setFiltersOpen(false);
      }
      if (typing) return;
      if (e.key === "/" || (e.key === "f" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        if (window.matchMedia("(max-width: 1023px)").matches) {
          select(null);
          setFiltersOpen(false);
          setSearching(true);
          setList("list");
        } else {
          document.getElementById("folio-search")?.focus();
        }
      }
      if (e.key === "1") setLevel("plain");
      if (e.key === "2") setLevel("expert");
      if (e.key === "0") requestFit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestFit, select, setAbout, setFiltersOpen, setLevel, setList]);

  return (
    <div className="shell flex flex-col bg-linen text-ink">
      <header className="border-b border-line bg-paper">
        <div className="hidden items-center gap-2 px-3 py-2 lg:flex">
          <div className="flex items-center gap-2 pr-1">
            <span className="grid size-8 place-items-center bg-ink text-paper">
              <BookOpen className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-none">Folio</p>
              <p className="text-xs text-muted">{t(lang, "tag")}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroupBy(g)}
                className={cn("rounded-full px-3 py-2 text-xs", groupBy === g ? "bg-ink text-paper" : "text-muted hover:text-ink")}
              >
                {groupLabel(g, lang)}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-linen px-3">
            <Search className="size-4 shrink-0 text-muted" />
            <input
              id="folio-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                select(null);
              }}
              placeholder={t(lang, "search")}
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            {query ? (
              <button type="button" aria-label={t(lang, "close")} onClick={() => setQuery("")}>
                <X className="size-4" />
              </button>
            ) : null}
          </label>
          <p className="text-xs text-muted tabular-nums">
            {matched.length}/{families.length}
          </p>
          <button type="button" className="flex h-11 items-center rounded-full bg-linen px-3 text-xs" onClick={() => setLevel(level === "plain" ? "expert" : "plain")}>
            {level === "plain" ? t(lang, "plain") : t(lang, "expert")}
          </button>
          <button type="button" className="grid size-11 place-items-center" aria-label={showingList ? t(lang, "canvas") : t(lang, "list")} onClick={() => setList(showingList ? "canvas" : "list")}>
            {showingList ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
          </button>
          <button type="button" className="grid size-11 place-items-center" aria-label={lang === "fr" ? "English" : "Français"} onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
            <Languages className="size-4" />
          </button>
          <button type="button" className="grid size-11 place-items-center" aria-label={t(lang, "about")} onClick={() => setAbout(true)}>
            <Info className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 lg:hidden">
          {searching ? (
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-linen px-2">
              <button
                type="button"
                aria-label={t(lang, "close")}
                className="grid size-11 place-items-center"
                onClick={() => setSearching(false)}
              >
                <ChevronLeft className="size-5" />
              </button>
              <input
                id="folio-search-mobile"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  select(null);
                }}
                placeholder={t(lang, "search")}
                className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted"
              />
              {query ? (
                <button type="button" aria-label={t(lang, "reset")} className="grid size-11 place-items-center" onClick={() => setQuery("")}>
                  <X className="size-4" />
                </button>
              ) : null}
            </label>
          ) : (
            <>
              <span className="grid size-8 shrink-0 place-items-center bg-ink text-paper">
                <BookOpen className="size-4" />
              </span>
              <p className="font-display min-w-0 flex-1 text-lg leading-none">Folio</p>
              <button
                type="button"
                className="grid size-11 place-items-center"
                aria-label={t(lang, "search")}
                onClick={() => {
                  select(null);
                  setFiltersOpen(false);
                  setMenuOpen(false);
                  setList("list");
                  setSearching(true);
                }}
              >
                <Search className="size-4" />
              </button>
              <button
                type="button"
                className={cn("grid size-11 place-items-center", menuOpen && "bg-linen")}
                aria-label={t(lang, "menu")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <Menu className="size-4" />
              </button>
            </>
          )}
        </div>
        {menuOpen && !searching ? (
          <div className="flex items-center gap-1 border-t border-line px-2 py-1 lg:hidden">
            <button type="button" className="grid size-11 place-items-center" aria-label={t(lang, "filters")} onClick={() => { setMenuOpen(false); setFiltersOpen(true); }}>
              <SlidersHorizontal className="size-4" />
            </button>
            <button type="button" className="grid size-11 place-items-center" aria-label={showingList ? t(lang, "canvas") : t(lang, "list")} onClick={() => setList(showingList ? "canvas" : "list")}>
              {showingList ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
            </button>
            <button type="button" className="grid size-11 place-items-center" aria-label={lang === "fr" ? "English" : "Français"} onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
              <Languages className="size-4" />
            </button>
            <button type="button" className="grid size-11 place-items-center" aria-label={t(lang, "about")} onClick={() => { setMenuOpen(false); setAbout(true); }}>
              <Info className="size-4" />
            </button>
            <button type="button" className="ml-auto h-11 rounded-full bg-linen px-3 text-xs" onClick={() => setLevel(level === "plain" ? "expert" : "plain")}>
              {level === "plain" ? t(lang, "plain") : t(lang, "expert")}
            </button>
          </div>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-line bg-paper px-4 py-4 lg:block">
          <Filters />
        </aside>

        <main className="view-root relative" data-view={list}>
          <div className="only-list overflow-y-auto bg-paper">
              <div className="flex items-center justify-between border-b border-line px-4 py-2">
                <p className="text-xs text-muted tabular-nums">
                  {matched.length} {t(lang, "families")}
                </p>
                <button type="button" className="text-xs text-cinnabar" onClick={() => setSortDate((v) => !v)}>
                  {sortDate ? t(lang, "sortDate") : t(lang, "sortId")}
                </button>
              </div>
              {domains.length > 0 || natures.length > 0 ? (
                <div className="flex gap-1.5 overflow-x-auto border-b border-line px-3 py-2">
                  {domains.map((d) => (
                    <button key={d} type="button" onClick={() => toggleDomain(d)} className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-xs text-paper">
                      {tx(lang, domainLabel[d])} ×
                    </button>
                  ))}
                  {natures.map((n) => (
                    <button key={n} type="button" onClick={() => toggleNature(n)} className="shrink-0 rounded-full bg-linen px-2.5 py-1 text-xs text-ink">
                      {tx(lang, natureLabel[n])} ×
                    </button>
                  ))}
                </div>
              ) : null}
              {ordered.length === 0 ? (
                <p className="px-4 py-8 text-sm text-muted">{t(lang, "empty")}</p>
              ) : (
                <TreeList
                  families={ordered}
                  lang={lang}
                  groupBy={groupBy}
                  axis={axis}
                  sortDate={sortDate}
                  selectedId={selectedId}
                  query={query}
                  onSelect={(id) => {
                    setSearching(false);
                    select(id);
                  }}
                />
              )}
            </div>
          <div className="only-canvas relative">
            <Board families={families} />
            {matched.length === 0 ? (
              <p className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-paper px-3 py-2 text-sm text-muted">
                {t(lang, "empty")}
              </p>
            ) : null}
          </div>
        </main>

        <aside className="hidden w-96 shrink-0 overflow-hidden border-l border-line bg-paper lg:block">
          <FichePanel family={selected} />
        </aside>
      </div>

      {selected ? <FicheSheet family={selected} onClose={() => select(null)} /> : null}

      {filtersOpen ? (
        <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div
            className="sheet-safe absolute inset-x-0 bottom-0 max-h-[86dvh] overflow-y-auto rounded-t-2xl bg-paper px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Filters onNavigate={() => setFiltersOpen(false)} />
          </div>
        </div>
      ) : null}

      {about ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" onClick={() => setAbout(false)}>
          <div className="max-w-lg rounded-2xl bg-paper p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-3xl">Folio</h2>
              <button type="button" aria-label={t(lang, "close")} onClick={() => setAbout(false)} className="grid size-11 place-items-center">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{aboutBody[lang]}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{legendBody[lang]}</p>
            <a
              className="mt-4 inline-flex text-sm text-cinnabar underline underline-offset-2"
              href="https://github.com/andyrandriamiarisoa-web/OpenAi_math"
              target="_blank"
              rel="noreferrer"
            >
              OpenAi_math
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
