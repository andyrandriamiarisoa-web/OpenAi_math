import { COMPLEXITIES, DOMAINS, NATURES, type GroupBy } from "@/data/types";
import { complexityLabel, domainLabel, groupLabel, natureLabel, t, tx } from "@/data/i18n";
import { dateExtent, dateTicks, useAtlas, yearExtent } from "@/lib/atlas-store";
import { cn } from "@/lib/cn";

function Chip({
  on,
  label,
  onClick,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "rounded-full border px-2.5 py-1 text-left text-xs leading-snug transition-colors",
        on
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink hover:border-ink",
      )}
    >
      {label}
    </button>
  );
}

export function Filters({ onNavigate }: { onNavigate?: () => void }) {
  const lang = useAtlas((s) => s.lang);
  const natures = useAtlas((s) => s.natures);
  const domains = useAtlas((s) => s.domains);
  const complexities = useAtlas((s) => s.complexities);
  const axis = useAtlas((s) => s.axis);
  const yearMin = useAtlas((s) => s.yearMin);
  const yearMax = useAtlas((s) => s.yearMax);
  const dateMin = useAtlas((s) => s.dateMin);
  const dateMax = useAtlas((s) => s.dateMax);
  const includeUndated = useAtlas((s) => s.includeUndated);
  const deepOnly = useAtlas((s) => s.deepOnly);
  const leanOnly = useAtlas((s) => s.leanOnly);
  const toggleNature = useAtlas((s) => s.toggleNature);
  const toggleDomain = useAtlas((s) => s.toggleDomain);
  const toggleComplexity = useAtlas((s) => s.toggleComplexity);
  const setYearMin = useAtlas((s) => s.setYearMin);
  const setYearMax = useAtlas((s) => s.setYearMax);
  const setDateMin = useAtlas((s) => s.setDateMin);
  const setDateMax = useAtlas((s) => s.setDateMax);
  const setIncludeUndated = useAtlas((s) => s.setIncludeUndated);
  const setDeepOnly = useAtlas((s) => s.setDeepOnly);
  const setLeanOnly = useAtlas((s) => s.setLeanOnly);
  const resetFilters = useAtlas((s) => s.resetFilters);
  const setAxis = useAtlas((s) => s.setAxis);

  const group = useAtlas((s) => s.groupBy);
  const setGroupBy = useAtlas((s) => s.setGroupBy);
  const groups: GroupBy[] = ["domain", "nature", "complexity", "era"];
  const dateIndex = (iso: string) => Math.max(0, dateTicks.indexOf(iso));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">{t(lang, "filters")}</h2>
        <button type="button" className="text-xs text-cinnabar" onClick={() => { resetFilters(); onNavigate?.(); }}>
          {t(lang, "reset")}
        </button>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs tracking-widest text-muted uppercase">{t(lang, "group")}</legend>
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <Chip key={g} on={group === g} label={groupLabel(g, lang)} onClick={() => setGroupBy(g)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs tracking-widest text-muted uppercase">{t(lang, "domain")}</legend>
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((d) => (
            <Chip key={d} on={domains.includes(d)} label={tx(lang, domainLabel[d])} onClick={() => toggleDomain(d)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs tracking-widest text-muted uppercase">{t(lang, "nature")}</legend>
        <div className="flex flex-wrap gap-1.5">
          {NATURES.map((n) => (
            <Chip key={n} on={natures.includes(n)} label={tx(lang, natureLabel[n])} onClick={() => toggleNature(n)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs tracking-widest text-muted uppercase">{t(lang, "complexity")}</legend>
        <div className="flex flex-wrap gap-1.5">
          {COMPLEXITIES.map((c) => (
            <Chip
              key={c}
              on={complexities.includes(c)}
              label={tx(lang, complexityLabel[c])}
              onClick={() => toggleComplexity(c)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs tracking-widest text-muted uppercase">{t(lang, "axis")}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-full bg-linen p-1">
          <button
            type="button"
            className={cn("rounded-full px-2 py-1.5 text-xs", axis === "problem" ? "bg-paper text-ink" : "text-muted")}
            onClick={() => setAxis("problem")}
          >
            {t(lang, "problem")}
          </button>
          <button
            type="button"
            className={cn("rounded-full px-2 py-1.5 text-xs", axis === "manuscript" ? "bg-paper text-ink" : "text-muted")}
            onClick={() => setAxis("manuscript")}
          >
            {t(lang, "manuscript")}
          </button>
        </div>
        {axis === "problem" ? (
          <div className="mt-3 space-y-2">
            <label className="flex items-center justify-between text-xs text-muted">
              <span>{t(lang, "from")}</span>
              <span className="tabular-nums text-ink">{yearMin}</span>
            </label>
            <input
              type="range"
              min={yearExtent.min}
              max={yearExtent.max}
              value={yearMin}
              onChange={(e) => setYearMin(Math.min(Number(e.target.value), yearMax))}
              className="w-full accent-cinnabar"
            />
            <label className="flex items-center justify-between text-xs text-muted">
              <span>{t(lang, "to")}</span>
              <span className="tabular-nums text-ink">{yearMax}</span>
            </label>
            <input
              type="range"
              min={yearExtent.min}
              max={yearExtent.max}
              value={yearMax}
              onChange={(e) => setYearMax(Math.max(Number(e.target.value), yearMin))}
              className="w-full accent-cinnabar"
            />
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <label className="flex items-center justify-between text-xs text-muted">
              <span>{t(lang, "from")}</span>
              <span className="tabular-nums text-ink">{dateMin}</span>
            </label>
            <input
              type="range"
              min={0}
              max={Math.max(0, dateTicks.length - 1)}
              value={dateIndex(dateMin)}
              onChange={(e) => {
                const i = Math.min(Number(e.target.value), dateIndex(dateMax));
                setDateMin(dateTicks[i] ?? dateExtent.min);
              }}
              className="w-full accent-cinnabar"
            />
            <label className="flex items-center justify-between text-xs text-muted">
              <span>{t(lang, "to")}</span>
              <span className="tabular-nums text-ink">{dateMax}</span>
            </label>
            <input
              type="range"
              min={0}
              max={Math.max(0, dateTicks.length - 1)}
              value={dateIndex(dateMax)}
              onChange={(e) => {
                const i = Math.max(Number(e.target.value), dateIndex(dateMin));
                setDateMax(dateTicks[i] ?? dateExtent.max);
              }}
              className="w-full accent-cinnabar"
            />
          </div>
        )}
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeUndated}
            onChange={(e) => setIncludeUndated(e.target.checked)}
            className="accent-cinnabar"
          />
          {t(lang, "undated")}
        </label>
      </fieldset>

      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={deepOnly} onChange={(e) => setDeepOnly(e.target.checked)} className="accent-cinnabar" />
          {t(lang, "deepOnly")}
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={leanOnly} onChange={(e) => setLeanOnly(e.target.checked)} className="accent-cinnabar" />
          {t(lang, "leanOnly")}
        </label>
      </div>
    </div>
  );
}
