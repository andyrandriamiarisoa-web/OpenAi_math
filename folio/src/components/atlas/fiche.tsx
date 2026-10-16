import { FICHES } from "@/data/fiches";
import { families } from "@/data/families";
import {
  complexityLabel,
  domainLabel,
  formatDay,
  legendBody,
  natureLabel,
  repoUrl,
  t,
  tx,
  yearLabel,
} from "@/data/i18n";
import type { Family, Lang } from "@/data/types";
import { useAtlas } from "@/lib/atlas-store";
import { cn } from "@/lib/cn";
import { ExternalLink, X } from "lucide-react";
import { Diagram } from "./diagrams";

function Paras({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (
          <p key={p.slice(0, 48)} className="text-[15px] leading-relaxed text-ink">
            {p}
          </p>
        ))}
    </div>
  );
}

function Lines({ text, ordered }: { text: string; ordered?: boolean }) {
  const rows = text
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("space-y-2 text-[15px] leading-relaxed", ordered ? "list-decimal pl-4" : "list-disc pl-4")}>
      {rows.map((row) => (
        <li key={row.slice(0, 60)}>{row}</li>
      ))}
    </Tag>
  );
}

function Kicker({ children }: { children: string }) {
  return <h3 className="text-xs tracking-widest text-muted uppercase">{children}</h3>;
}

export function FicheBody({ family, onClose }: { family: Family; onClose?: () => void }) {
  const lang = useAtlas((s) => s.lang);
  const level = useAtlas((s) => s.level);
  const setLevel = useAtlas((s) => s.setLevel);
  const select = useAtlas((s) => s.select);
  const doc = FICHES[family.id];
  const title = lang === "fr" ? family.titleFr : family.titleEn;
  const alt = lang === "fr" ? family.titleEn : family.titleFr;
  const pick = (fr: string, en: string) => (lang === "fr" ? fr : en);

  return (
    <article className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs tracking-widest text-muted uppercase tabular-nums">
            {lang === "fr" ? "Famille" : "Family"} {family.id}
            {family.lean ? ` · ${t(lang, "lean")}` : ""}
          </p>
          <h2 className="font-display mt-1 text-2xl leading-tight text-ink">{title}</h2>
          {alt !== title ? <p className="mt-1 text-xs text-muted">{alt}</p> : null}
        </div>
        {onClose ? (
          <button type="button" aria-label={t(lang, "close")} onClick={onClose} className="grid size-11 place-items-center text-ink">
            <X className="size-5" />
          </button>
        ) : null}
      </header>

      <div className="flex gap-2 px-4 pt-3">
        <button
          type="button"
          onClick={() => setLevel("plain")}
          className={cn("min-h-11 flex-1 rounded-full text-sm", level === "plain" ? "bg-ink text-paper" : "bg-linen text-ink")}
        >
          {t(lang, "plain")}
        </button>
        <button
          type="button"
          onClick={() => setLevel("expert")}
          className={cn("min-h-11 flex-1 rounded-full text-sm", level === "expert" ? "bg-ink text-paper" : "bg-linen text-ink")}
        >
          {t(lang, "expert")}
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-linen px-2 py-1 text-xs">{tx(lang, natureLabel[family.nature])}</span>
          <span className="rounded-full bg-linen px-2 py-1 text-xs">{tx(lang, domainLabel[family.domain])}</span>
          <span className="rounded-full bg-linen px-2 py-1 text-xs">{tx(lang, complexityLabel[family.complexity])}</span>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted">{t(lang, "problem")}</dt>
            <dd className="tabular-nums">{yearLabel(family.problemYear, family.yearKnown, lang)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t(lang, "manuscript")}</dt>
            <dd className="tabular-nums">{family.manuscriptDate ? formatDay(family.manuscriptDate, lang) : "—"}</dd>
          </div>
        </dl>

        {doc ? (
          <>
            <figure className="space-y-2">
              <Diagram kind={doc.diagram} />
              <figcaption className="text-xs leading-relaxed text-muted">{pick(doc.captionFr, doc.captionEn)}</figcaption>
            </figure>
            {level === "plain" ? (
              <>
                <Paras text={pick(doc.storyFr, doc.storyEn)} />
                {doc.formula ? (
                  <section className="space-y-2">
                    <Kicker>{t(lang, "formula")}</Kicker>
                    <p className="font-display text-lg leading-snug text-ink">{doc.formula}</p>
                  </section>
                ) : null}
                <section className="space-y-2">
                  <Kicker>{t(lang, "plan")}</Kicker>
                  <Lines text={pick(doc.planFr, doc.planEn)} ordered />
                </section>
                <section className="space-y-2">
                  <Kicker>{t(lang, "uses")}</Kicker>
                  <Lines text={pick(doc.usesFr, doc.usesEn)} />
                </section>
              </>
            ) : (
              <>
                <section className="space-y-2">
                  <Kicker>{t(lang, "statement")}</Kicker>
                  <Paras text={pick(doc.statementFr, doc.statementEn)} />
                </section>
                {doc.formula ? (
                  <section className="space-y-2">
                    <Kicker>{t(lang, "formula")}</Kicker>
                    <p className="font-display text-lg leading-snug text-ink">{doc.formula}</p>
                  </section>
                ) : null}
                <section className="space-y-2">
                  <Kicker>{t(lang, "known")}</Kicker>
                  <Paras text={pick(doc.knownFr, doc.knownEn)} />
                </section>
                <section className="space-y-2">
                  <Kicker>{t(lang, "adds")}</Kicker>
                  <Paras text={pick(doc.addsFr, doc.addsEn)} />
                </section>
                <section className="space-y-2">
                  <Kicker>{t(lang, "plan")}</Kicker>
                  <Lines text={pick(doc.planFr, doc.planEn)} ordered />
                </section>
                <section className="example-note space-y-2 px-3 py-3">
                  <Kicker>{t(lang, "example")}</Kicker>
                  <Paras text={pick(doc.exampleFr, doc.exampleEn)} />
                </section>
                <section className="space-y-2">
                  <Kicker>{t(lang, "inspiration")}</Kicker>
                  <Paras text={pick(doc.sparkFr, doc.sparkEn)} />
                </section>
              </>
            )}
            {doc.related.length > 0 ? (
              <section className="space-y-2">
                <Kicker>{t(lang, "related")}</Kicker>
                <ul className="flex flex-col gap-1">
                  {doc.related.map((id) => {
                    const other = families.find((f) => f.id === id);
                    if (!other) return null;
                    const label = lang === "fr" ? other.titleFr : other.titleEn;
                    return (
                      <li key={id}>
                        <button type="button" onClick={() => select(id)} className="text-left text-sm text-ink underline decoration-line underline-offset-2">
                          {id} · {label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </>
        ) : level === "plain" ? (
          <p className="text-[15px] leading-relaxed">{pick(family.plainFr, family.plainEn)}</p>
        ) : (
          <>
            <p className="text-[15px] leading-relaxed">{pick(family.expertFr, family.expertEn)}</p>
            <p className="text-sm leading-relaxed text-muted">{pick(family.sparkFr, family.sparkEn)}</p>
          </>
        )}

        <section className="space-y-2 border-t border-line pt-3">
          <Kicker>{t(lang, "papers")}</Kicker>
          <ul className="space-y-2">
            {family.pdfs.map((pdf) => (
              <li key={pdf.href}>
                <a
                  href={`${repoUrl}/blob/main/${pdf.href}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 text-sm text-ink underline decoration-line underline-offset-2"
                >
                  <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
                  <span>{pdf.title}</span>
                </a>
              </li>
            ))}
          </ul>
          {family.lean ? (
            <a href={`${repoUrl}/blob/main/lean/docs/${family.id}.md`} target="_blank" rel="noreferrer" className="inline-flex text-sm text-cinnabar underline underline-offset-2">
              {t(lang, "lean")}
            </a>
          ) : null}
        </section>
      </div>
    </article>
  );
}

export function FichePanel({ family }: { family: Family | null }) {
  const lang = useAtlas((s) => s.lang);
  const select = useAtlas((s) => s.select);
  if (!family) return <Legend lang={lang} />;
  return <FicheBody family={family} onClose={() => select(null)} />;
}

export function Legend({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-4 px-5 py-6">
      <p className="font-display text-3xl text-ink">Folio</p>
      <h2 className="text-sm tracking-widest text-muted uppercase">{t(lang, "legendTitle")}</h2>
      <p className="text-sm leading-relaxed">{legendBody[lang]}</p>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <span className="mark-ring" /> {tx(lang, complexityLabel.lecture)}
        </li>
        <li className="flex items-center gap-2">
          <span className="mark-half" /> {tx(lang, complexityLabel.avance)}
        </li>
        <li className="flex items-center gap-2">
          <span className="mark-dot" /> {tx(lang, complexityLabel.frontiere)}
        </li>
        <li className="flex items-center gap-2">
          <span className="deep-tab" /> {t(lang, "deepOnly")}
        </li>
      </ul>
    </div>
  );
}
