import { frameTitle, t, tx, complexityLabel } from "@/data/i18n";
import { FICHES } from "@/data/fiches";
import type { Family } from "@/data/types";
import { useAtlas } from "@/lib/atlas-store";
import { CARD_H, CARD_W, layoutWorld, type WorldNode } from "@/lib/layout";
import { useEffect, useMemo, useRef } from "react";
import { Minus, Plus, Locate } from "lucide-react";

type Cam = { x: number; y: number; k: number };

function matchesNode(
  family: Family,
  state: {
    query: string;
    natures: string[];
    domains: string[];
    complexities: string[];
    axis: "manuscript" | "problem";
    yearMin: number;
    yearMax: number;
    dateMin: string;
    dateMax: string;
    includeUndated: boolean;
    deepOnly: boolean;
    leanOnly: boolean;
  },
) {
  if (state.query) {
    const q = state.query.trim().toLowerCase();
    const blob = `${family.id} ${family.titleEn} ${family.titleFr} ${family.plainEn} ${family.plainFr}`.toLowerCase();
    if (!blob.includes(q)) return false;
  }
  if (state.natures.length && !state.natures.includes(family.nature)) return false;
  if (state.domains.length && !state.domains.includes(family.domain)) return false;
  if (state.complexities.length && !state.complexities.includes(family.complexity)) return false;
  if (state.deepOnly && !FICHES[family.id]?.numeric) return false;
  if (state.leanOnly && !family.lean) return false;
  if (state.axis === "problem") {
    if (family.problemYear == null) return state.includeUndated;
    return family.problemYear >= state.yearMin && family.problemYear <= state.yearMax;
  }
  if (!family.manuscriptDate) return state.includeUndated;
  return family.manuscriptDate >= state.dateMin && family.manuscriptDate <= state.dateMax;
}

export function useMatched(families: Family[]) {
  const query = useAtlas((s) => s.query);
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
  return useMemo(
    () =>
      families.filter((f) =>
        matchesNode(f, {
          query,
          natures,
          domains,
          complexities,
          axis,
          yearMin,
          yearMax,
          dateMin,
          dateMax,
          includeUndated,
          deepOnly,
          leanOnly,
        }),
      ),
    [
      families,
      query,
      natures,
      domains,
      complexities,
      axis,
      yearMin,
      yearMax,
      dateMin,
      dateMax,
      includeUndated,
      deepOnly,
      leanOnly,
    ],
  );
}

export function Board({ families }: { families: Family[] }) {
  const lang = useAtlas((s) => s.lang);
  const groupBy = useAtlas((s) => s.groupBy);
  const axis = useAtlas((s) => s.axis);
  const selectedId = useAtlas((s) => s.selectedId);
  const select = useAtlas((s) => s.select);
  const fitRequest = useAtlas((s) => s.fitRequest);
  const matched = useMatched(families);
  const matchIds = useMemo(() => new Set(matched.map((f) => f.id)), [matched]);
  const world = useMemo(() => layoutWorld(families, groupBy, axis), [families, groupBy, axis]);

  const boardRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const cam = useRef<Cam>({ x: 40, y: 40, k: 0.85 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef({ x: 0, y: 0, ox: 0, oy: 0, moved: 0, id: null as string | null });
  const pinch = useRef(0);

  function paint() {
    const el = worldRef.current;
    if (!el) return;
    const { x, y, k } = cam.current;
    el.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    if (zoomRef.current) zoomRef.current.textContent = `${Math.round(k * 100)}%`;
  }

  function zoomAt(clientX: number, clientY: number, factor: number) {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const { x, y, k } = cam.current;
    const next = Math.min(2.2, Math.max(0.28, k * factor));
    const wx = (px - x) / k;
    const wy = (py - y) / k;
    cam.current = { k: next, x: px - wx * next, y: py - wy * next };
    paint();
  }

  function fitBox(box: { x: number; y: number; w: number; h: number }) {
    const board = boardRef.current;
    if (!board || box.w <= 0 || box.h <= 0) return;
    const rect = board.getBoundingClientRect();
    const pad = 56;
    const k = Math.min((rect.width - pad) / box.w, (rect.height - pad) / box.h, 1.15);
    const kk = Math.max(0.28, k);
    cam.current = {
      k: kk,
      x: (rect.width - box.w * kk) / 2 - box.x * kk,
      y: (rect.height - box.h * kk) / 2 - box.y * kk,
    };
    paint();
  }

  function boxOf(nodes: WorldNode[]) {
    if (!nodes.length) return world.bounds;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + CARD_W);
      maxY = Math.max(maxY, n.y + CARD_H);
    }
    return { x: minX - 24, y: minY - 48, w: maxX - minX + 48, h: maxY - minY + 80 };
  }

  function focusStart() {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    if (rect.width < 40) return;
    const k = rect.width < 720 ? 0.92 : 1;
    const frame = world.frames[0];
    cam.current = {
      k,
      x: 18 - (frame?.x ?? 0) * k,
      y: 8 - (frame?.y ?? 0) * k,
    };
    paint();
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => focusStart());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world]);

  useEffect(() => {
    if (fitRequest === 0) return;
    const nodes = world.nodes.filter((n) => matchIds.has(n.family.id));
    fitBox(nodes.length && nodes.length < world.nodes.length ? boxOf(nodes) : world.bounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitRequest]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0012);
      zoomAt(e.clientX, e.clientY, factor);
    };
    board.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      board.removeEventListener("wheel", onWheel);
    };
  }, [world]);

  const mini = { w: 148, h: 96 };
  const scale = Math.min(mini.w / world.bounds.w, mini.h / world.bounds.h);

  return (
    <div
      ref={boardRef}
      className="board-dots relative h-full overflow-hidden"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        const host = e.currentTarget;
        host.setPointerCapture(e.pointerId);
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.current.size === 1) {
          const id = (e.target as HTMLElement).closest("[data-family]")?.getAttribute("data-family") ?? null;
          drag.current = { x: e.clientX, y: e.clientY, ox: cam.current.x, oy: cam.current.y, moved: 0, id };
          pinch.current = 0;
        }
      }}
      onPointerMove={(e) => {
        if (!pointers.current.has(e.pointerId)) return;
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const pts = [...pointers.current.values()];
        if (pts.length >= 2) {
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          const midX = (pts[0].x + pts[1].x) / 2;
          const midY = (pts[0].y + pts[1].y) / 2;
          if (pinch.current > 0) zoomAt(midX, midY, dist / pinch.current);
          pinch.current = dist;
          drag.current.moved = 20;
          return;
        }
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        drag.current.moved = Math.hypot(dx, dy);
        cam.current.x = drag.current.ox + dx;
        cam.current.y = drag.current.oy + dy;
        paint();
      }}
      onPointerUp={(e) => {
        pointers.current.delete(e.pointerId);
        if (pointers.current.size < 2) pinch.current = 0;
        if (pointers.current.size === 0 && drag.current.moved < 6) {
          select(drag.current.id);
        }
      }}
      onPointerCancel={(e) => {
        pointers.current.delete(e.pointerId);
      }}
    >
      <div ref={worldRef} className="atlas-world">
        {world.frames.map((frame) => (
          <div key={frame.key} className="atlas-frame" style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h }}>
            <div className="atlas-frame-label">
              <span>{frameTitle(frame.key, lang)}</span>
              <span className="tabular-nums">{frame.count}</span>
            </div>
          </div>
        ))}
        {world.nodes.map((node) => {
          const on = node.family.id === selectedId;
          const dim = !matchIds.has(node.family.id);
          const title = lang === "fr" ? node.family.titleFr : node.family.titleEn;
          return (
            <button
              key={node.family.id}
              type="button"
              data-family={node.family.id}
              aria-pressed={on}
              className={`atlas-node ${on ? "is-on" : ""} ${dim ? "is-dim" : ""}`}
              style={{ left: node.x, top: node.y }}
            >
              <span className="flex items-center justify-between gap-1">
                <span className="text-xs tabular-nums text-muted">{node.family.id}</span>
                <span className="flex items-center gap-1">
                  {FICHES[node.family.id]?.numeric ? <span className="deep-tab" aria-hidden /> : null}
                  <span
                    className={
                      node.family.complexity === "lecture"
                        ? "mark-ring"
                        : node.family.complexity === "avance"
                          ? "mark-half"
                          : "mark-dot"
                    }
                    aria-label={tx(lang, complexityLabel[node.family.complexity])}
                  />
                </span>
              </span>
              <span className="mt-1 line-clamp-2 text-sm leading-snug">{title}</span>
            </button>
          );
        })}
      </div>

      <div
        className="absolute right-3 bottom-3 hidden overflow-hidden rounded-lg border border-line bg-paper/90 sm:block"
        style={{ width: mini.w, height: mini.h }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <svg
          width={mini.w}
          height={mini.h}
          onClick={(e) => {
            const svg = e.currentTarget.getBoundingClientRect();
            const wx = (e.clientX - svg.left) / scale;
            const wy = (e.clientY - svg.top) / scale;
            const board = boardRef.current?.getBoundingClientRect();
            if (!board) return;
            cam.current.x = board.width / 2 - wx * cam.current.k;
            cam.current.y = board.height / 2 - wy * cam.current.k;
            paint();
          }}
        >
          {world.frames.map((frame) => (
            <rect
              key={frame.key}
              x={frame.x * scale}
              y={frame.y * scale}
              width={Math.max(1, frame.w * scale)}
              height={Math.max(1, frame.h * scale)}
              fill="transparent"
              stroke="currentColor"
              className="text-line"
            />
          ))}
        </svg>
      </div>

      <div
        className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full border border-line bg-paper px-1 py-1"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button type="button" aria-label="−" className="grid size-11 place-items-center" onClick={() => {
          const r = boardRef.current?.getBoundingClientRect();
          if (r) zoomAt(r.left + r.width / 2, r.top + r.height / 2, 0.9);
        }}>
          <Minus className="size-4" />
        </button>
        <span ref={zoomRef} className="w-12 text-center text-xs tabular-nums text-muted">
          100%
        </span>
        <button type="button" aria-label="+" className="grid size-11 place-items-center" onClick={() => {
          const r = boardRef.current?.getBoundingClientRect();
          if (r) zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.1);
        }}>
          <Plus className="size-4" />
        </button>
        <button type="button" aria-label={t(lang, "fit")} className="grid size-11 place-items-center" onClick={() => fitBox(world.bounds)}>
          <Locate className="size-4" />
        </button>
      </div>
    </div>
  );
}
