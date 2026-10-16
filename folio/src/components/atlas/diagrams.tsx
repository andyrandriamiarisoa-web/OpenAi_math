import type { ReactElement } from "react";

export const DIAGRAMS = [
  "wave",
  "spectrum",
  "step",
  "curve",
  "cloud",
  "grid",
  "tree",
  "flow",
  "orbit",
  "tiles",
  "balance",
  "network",
  "dft",
] as const;

export type DiagramKind = (typeof DIAGRAMS)[number];

const ink = "#1c1916";
const red = "#b8432f";
const line = "#d9d0c3";

function Wave() {
  const sum = (x: number) => {
    let y = 0;
    for (const k of [1, 3, 5, 7]) y += Math.sin(k * x) / k;
    return y;
  };
  let d = "";
  for (let i = 0; i <= 80; i++) {
    const x = (i / 80) * Math.PI * 2;
    const px = 16 + (i / 80) * 200;
    const py = 72 - sum(x) * 28;
    d += `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  const square = "M16 52 H66 V92 H116 V52 H166 V92 H216";
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect x="0" y="0" width="320" height="150" fill="#f7f3ec" />
      <path d={square} fill="none" stroke={line} strokeWidth="1.5" />
      <path d={d} fill="none" stroke={red} strokeWidth="2.2" />
      <g transform="translate(232 28)">
        {[1, 1 / 3, 1 / 5, 1 / 7].map((h, i) => (
          <rect key={i} x={i * 16} y={70 - h * 62} width="8" height={h * 62} fill={i === 0 ? ink : red} opacity={i === 0 ? 0.9 : 0.75} />
        ))}
      </g>
    </svg>
  );
}

function Spectrum() {
  const hs = [0.35, 0.9, 0.55, 0.2, 0.7, 0.4, 0.15, 0.5];
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <line x1="28" y1="120" x2="292" y2="120" stroke={line} />
      {hs.map((h, i) => (
        <rect key={i} x={40 + i * 32} y={120 - h * 88} width="16" height={h * 88} fill={i === 1 ? red : ink} opacity={i === 1 ? 1 : 0.75} />
      ))}
    </svg>
  );
}

function Step() {
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <path d="M24 118 C 80 118, 90 36, 160 36 S 240 118, 296 118" fill="none" stroke={ink} strokeWidth="2" />
      <path d="M24 118 C 80 100, 120 78, 160 70 S 230 96, 296 118" fill="none" stroke={red} strokeWidth="2" />
      <circle cx="168" cy="36" r="3.5" fill={red} />
    </svg>
  );
}

function Curve() {
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <path d="M24 110 C 70 110, 80 30, 140 48 S 230 130, 296 70" fill="none" stroke={ink} strokeWidth="2" />
      {[
        [78, 86],
        [140, 48],
        [196, 78],
        [250, 96],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={i === 1 ? red : "#f7f3ec"} stroke={ink} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function Cloud() {
  const pts = [
    [40, 90], [70, 60], [96, 100], [120, 48], [150, 80], [176, 40], [200, 96], [230, 64], [258, 88], [286, 52],
  ];
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <line x1="70" y1="60" x2="176" y2="40" stroke={red} strokeWidth="1.5" />
      <line x1="120" y1="48" x2="230" y2="64" stroke={ink} strokeWidth="1" opacity="0.5" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 1 || i === 5 ? 5 : 3} fill={i === 1 || i === 5 ? red : ink} />
      ))}
    </svg>
  );
}

function Grid() {
  const cells = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 7; c++) cells.push([c, r]);
  }
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      {cells.map(([c, r]) => (
        <rect
          key={`${c}-${r}`}
          x={36 + c * 28}
          y={36 + r * 20}
          width="22"
          height="14"
          fill={(c + r) % 5 === 0 ? red : "none"}
          stroke={ink}
          strokeWidth="1"
          opacity={(c + r) % 5 === 0 ? 0.9 : 0.45}
        />
      ))}
    </svg>
  );
}

function Tree() {
  const edges = [
    [160, 40, 100, 78],
    [160, 40, 220, 78],
    [100, 78, 64, 116],
    [100, 78, 128, 116],
    [220, 78, 190, 116],
    [220, 78, 256, 116],
  ];
  const nodes = [
    [160, 40],
    [100, 78],
    [220, 78],
    [64, 116],
    [128, 116],
    [190, 116],
    [256, 116],
  ];
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="1.4" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 7 : 5} fill={i === 0 ? red : "#f7f3ec"} stroke={ink} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function Flow() {
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <path d="M24 100 C 80 100, 90 40, 150 60 S 230 120, 300 50" fill="none" stroke={ink} strokeWidth="1.6" />
      <path d="M24 80 C 90 40, 140 130, 210 70 S 260 40, 300 90" fill="none" stroke={red} strokeWidth="1.6" />
      <polygon points="294,46 306,50 296,58" fill={ink} />
    </svg>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <ellipse cx="160" cy="84" rx="100" ry="36" fill="none" stroke={ink} strokeWidth="1.6" />
      <circle cx="250" cy="70" r="6" fill={red} />
      <circle cx="80" cy="98" r="4" fill={ink} />
      <circle cx="160" cy="48" r="3" fill={ink} />
    </svg>
  );
}

function Tiles() {
  const rects = [
    [30, 40, 70, 50],
    [104, 40, 46, 28],
    [154, 40, 60, 70],
    [218, 40, 70, 36],
    [104, 72, 46, 38],
    [218, 80, 40, 30],
    [262, 80, 26, 30],
    [30, 94, 40, 28],
  ];
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      {rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={i === 2 ? red : "none"} stroke={ink} strokeWidth="1.4" opacity={i === 2 ? 0.85 : 1} />
      ))}
    </svg>
  );
}

function Balance() {
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      <line x1="160" y1="36" x2="160" y2="118" stroke={ink} strokeWidth="1.6" />
      <line x1="60" y1="56" x2="260" y2="72" stroke={ink} strokeWidth="1.6" />
      <circle cx="160" cy="36" r="4" fill={red} />
      <rect x="40" y="56" width="36" height="22" fill="none" stroke={ink} />
      <rect x="236" y="64" width="28" height="16" fill={red} opacity="0.8" />
    </svg>
  );
}

function Network() {
  const nodes = [
    [60, 80],
    [130, 48],
    [150, 100],
    [220, 60],
    [260, 108],
    [200, 112],
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [2, 5],
    [3, 4],
    [5, 4],
  ];
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full" role="img">
      <rect width="320" height="150" fill="#f7f3ec" />
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={i === 3 ? red : ink} strokeWidth={i === 3 ? 2 : 1.2} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill={i === 3 ? red : "#f7f3ec"} stroke={ink} strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function Dft() {
  const wave = (x: number) => Math.sin(x) * 0.65 + Math.sin(3 * x) * 0.35;
  let d = "";
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2;
    const px = 16 + (i / 64) * 132;
    const py = 78 - wave(t) * 36;
    d += `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  const bars = [0.15, 0.72, 0.12, 0.48, 0.1, 0.08, 0.1, 0.06];
  return (
    <svg viewBox="0 0 320 156" className="h-auto w-full" role="img">
      <rect width="320" height="156" fill="#f7f3ec" />
      <path d={d} fill="none" stroke={ink} strokeWidth="2" />
      <line x1="16" y1="118" x2="148" y2="118" stroke={line} />
      <polygon points="158,74 172,74 172,70 186,78 172,86 172,82 158,82" fill={red} />
      {bars.map((h, i) => (
        <rect key={i} x={196 + i * 14} y={118 - h * 78} width="8" height={h * 78} fill={i === 1 || i === 3 ? red : ink} />
      ))}
      <line x1="192" y1="118" x2="308" y2="118" stroke={line} />
    </svg>
  );
}

const DRAW: Record<DiagramKind, () => ReactElement> = {
  wave: Wave,
  spectrum: Spectrum,
  step: Step,
  curve: Curve,
  cloud: Cloud,
  grid: Grid,
  tree: Tree,
  flow: Flow,
  orbit: Orbit,
  tiles: Tiles,
  balance: Balance,
  network: Network,
  dft: Dft,
};

export function Diagram({ kind }: { kind: DiagramKind }) {
  const Draw = DRAW[kind] ?? Wave;
  return (
    <figure className="overflow-hidden rounded-2xl border border-line">
      <Draw />
    </figure>
  );
}
