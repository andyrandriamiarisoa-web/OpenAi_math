import { DEEP } from "@/data/deep";
import {
  complexityHint,
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

function Block({ kicker, children }: { kicker: string; children: string }) {
  return (
    <section className="space-y-1">
      <h3 className="text-xs tracking-widest text-muted uppercase">{kicker}</h3>
      <p className="text-sm leading-relaxed text-ink">{children}</p>
    </section>
  );
}

export function FicheBody({ family, onClose }: { family: Family; onClose?: () => void }) {
  const lang = useAtlas((s) => s.lang);
  const level = useAtlas((s) => s.level);
  const setLevel = useAtlas((s) => s.setLevel);
  const deep = DEEP[family.id];
  const title = lang === "fr" ? family.titleFr : family.titleEn;
  const alt = lang === "fr" ? family.titleEn : family.titleFr;

  return (
    <article className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs tracking-widest text-muted uppercase tabular-nums">
            {lang === "fr" ? "Famille" : "Family"} {family.id}
            {family.lean ? ` · ${t(lang, "lean")}` : ""}
            {deep ? ` · ${t(lang, "example")}` : ""}
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
          className={cn(
            "min-h-11 flex-1 rounded-full text-sm",
            level === "plain" ? "bg-ink text-paper" : "bg-linen text-ink",
          )}
        >
          {t(lang, "plain")}
        </button>
        <button
          type="button"
          onClick={() => setLevel("expert")}
          className={cn(
            "min-h-11 flex-1 rounded-full text-sm",
            level === "expert" ? "bg-ink text-paper" : "bg-linen text-ink",
          )}
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
        <p className="text-xs leading-relaxed text-muted">{tx(lang, complexityHint[family.complexity])}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted">{t(lang, "problem")}</dt>
            <dd className="tabular-nums">{yearLabel(family.problemYear, family.yearKnown, lang)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t(lang, "manuscript")}</dt>
            <dd className="tabular-nums">
              {family.manuscriptDate ? formatDay(family.manuscriptDate, lang) : "—"}
            </dd>
          </div>
        </dl>

        {level === "plain" ? (
          deep ? (
            <>
              <Block kicker={t(lang, "question")} children={deep.question[lang]} />
              <Block kicker={t(lang, "picture")} children={deep.picture[lang]} />
            </>
          ) : (
            <p className="text-sm leading-relaxed">{lang === "fr" ? family.plainFr : family.plainEn}</p>
          )
        ) : (
          <>
            {deep ? (
              <>
                <Block kicker={t(lang, "shown")} children={deep.shown[lang]} />
                <section className="example-note space-y-1 px-3 py-3">
                  <h3 className="text-xs tracking-widest text-cinnabar uppercase">{t(lang, "example")}</h3>
                  <p className="text-sm leading-relaxed">{deep.example[lang]}</p>
                </section>
                <Block kicker={t(lang, "inspiration")} children={deep.inspiration[lang]} />
              </>
            ) : (
              <>
                <p className="text-sm leading-relaxed">{lang === "fr" ? family.expertFr : family.expertEn}</p>
                <Block kicker={t(lang, "inspiration")} children={lang === "fr" ? family.sparkFr : family.sparkEn} />
              </>
            )}
            <details className="text-sm">
              <summary className="cursor-pointer text-xs tracking-widest text-muted uppercase">{t(lang, "claim")}</summary>
              <p className="mt-2 leading-relaxed text-muted">{family.claim}</p>
            </details>
          </>
        )}

        <section className="space-y-2 border-t border-line pt-3">
          <h3 className="text-xs tracking-widest text-muted uppercase">{t(lang, "papers")}</h3>
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
            <a
              href={`${repoUrl}/blob/main/lean/docs/${family.id}.md`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm text-cinnabar underline underline-offset-2"
            >
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
