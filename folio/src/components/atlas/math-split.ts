const LETTERS: Record<string, string> = {
  α: "\\alpha",
  β: "\\beta",
  γ: "\\gamma",
  δ: "\\delta",
  ε: "\\varepsilon",
  ζ: "\\zeta",
  η: "\\eta",
  θ: "\\theta",
  λ: "\\lambda",
  μ: "\\mu",
  ν: "\\nu",
  ξ: "\\xi",
  π: "\\pi",
  ρ: "\\rho",
  σ: "\\sigma",
  τ: "\\tau",
  φ: "\\varphi",
  ψ: "\\psi",
  ω: "\\omega",
  Γ: "\\Gamma",
  Δ: "\\Delta",
  Θ: "\\Theta",
  Λ: "\\Lambda",
  Π: "\\Pi",
  Σ: "\\Sigma",
  Φ: "\\Phi",
  Ψ: "\\Psi",
  Ω: "\\Omega",
  ℝ: "\\mathbb{R}",
  ℂ: "\\mathbb{C}",
  ℤ: "\\mathbb{Z}",
  ℕ: "\\mathbb{N}",
  ℚ: "\\mathbb{Q}",
};

const OPS: Record<string, string> = {
  "≤": "\\le",
  "≥": "\\ge",
  "≠": "\\neq",
  "≈": "\\approx",
  "∞": "\\infty",
  "×": "\\times",
  "·": "\\cdot",
  "∈": "\\in",
  "⊂": "\\subset",
  "→": "\\to",
  "↦": "\\mapsto",
  "∀": "\\forall",
  "∃": "\\exists",
  "∂": "\\partial",
  "∇": "\\nabla",
  "∑": "\\sum",
  "∏": "\\prod",
  "∫": "\\int",
  "√": "\\sqrt",
  "½": "\\tfrac{1}{2}",
  "−": "-",
  "–": "-",
  "—": "-",
};

function applyMap(input: string, map: Record<string, string>): string {
  let s = input;
  for (const [from, to] of Object.entries(map)) s = s.split(from).join(to);
  return s;
}

export function toLatex(input: string): string {
  let s = applyMap(input, LETTERS);
  s = s.replace(/\\Sigma(?=_|\^)/g, "\\sum");
  s = s.replace(/\\Pi(?=_|\^)/g, "\\prod");
  s = applyMap(s, OPS);
  s = s.replace(/\\sum\s+_\{/g, "\\sum_{").replace(/\\prod\s+_\{/g, "\\prod_{").replace(/\\int\s+_\{/g, "\\int_{");
  const cmds = [
    "varepsilon", "varphi", "mathbb", "lambda", "infty", "alpha", "gamma", "delta", "theta", "sigma",
    "omega", "times", "tfrac", "sqrt", "prod", "zeta", "beta", "frac", "cdot", "phi", "psi", "rho",
    "tau", "eta", "sum", "int", "neq", "log", "det", "exp", "sin", "cos", "pi", "mu", "nu", "xi",
    "le", "ge", "ne", "in", "to",
  ].sort((a, b) => b.length - a.length);
  for (const cmd of cmds) s = s.replace(new RegExp(`\\\\${cmd}(?=[A-Za-z])`, "g"), `\\${cmd} `);
  return s.replace(/[ \t]+/g, " ").trim();
}

const ATOM =
  "(?:[A-Za-z]|[α-ωΑ-Ωℝℂℤℕℚ∑∏∫√])(?:_\\{[^}]+\\}|_[A-Za-z0-9α-ω]+|\\^\\{[^}]+\\}|\\^[A-Za-z0-9+\\-−]+)*";
const BIG = "[ΣΠ∑∏∫](?:_\\{[^}]+\\}|_[A-Za-z0-9α-ω]+)(?:\\^\\{[^}]+\\})?|[ΣΠ∑∏∫]\\^\\{[^}]+\\}";
const BIGO = "O\\((?:[^()]|\\([^()]*\\))+\\)";
const SUP = "\\d+(?:\\^\\{[^}]+\\}|\\^[0-9+\\-−]+)";
const REL = "[≤≥≠≈∈⊂→↦∞½ℝℂℤℕℚ∑∏∫√×]";
const MATH_RE = new RegExp(`${BIGO}|${BIG}|${ATOM}|${SUP}|${REL}`, "g");
const GAP_RE = /^[\s=+\-−–—×·<>≤≥≠≈∈→↦,]*$/;

export type Piece = { math: boolean; text: string };

function mergeRanges(text: string, ranges: Array<[number, number]>): Array<[number, number]> {
  if (ranges.length === 0) return [];
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const clean: Array<[number, number]> = [];
  for (const range of sorted) {
    const prev = clean[clean.length - 1];
    if (prev && range[0] <= prev[1]) prev[1] = Math.max(prev[1], range[1]);
    else clean.push([range[0], range[1]]);
  }
  const merged: Array<[number, number]> = [clean[0]];
  for (const range of clean.slice(1)) {
    const start = range[0];
    const end = range[1];
    const prev = merged[merged.length - 1];
    const gap = text.slice(prev[1], start);
    if (GAP_RE.test(gap) && gap.length < 12) prev[1] = end;
    else merged.push([start, end]);
  }
  return merged;
}

export function splitMath(text: string): Piece[] {
  if (!text) return [];
  if (text.includes("$")) return splitDollars(text);
  const ranges: Array<[number, number]> = [];
  for (const match of text.matchAll(MATH_RE)) {
    const value = match[0];
    if (!/[_^ΣΠ∑∏∫√≤≥≠≈∞½×α-ωΑ-Ωℝℂℤℕℚ]/.test(value) && !value.startsWith("O(")) continue;
    const from = match.index ?? 0;
    let start = from;
    let end = from + value.length;
    while (start > 0 && /[0-9.]/.test(text[start - 1])) start -= 1;
    if (text[end] === "i" && (end + 1 >= text.length || /[\s/),.]/.test(text[end + 1] ?? ""))) end += 1;
    const frac = /^\/[A-Za-z0-9]{1,4}/.exec(text.slice(end));
    if (frac) end += frac[0].length;
    ranges.push([start, end]);
  }
  const spans = mergeRanges(text, ranges);
  if (spans.length === 0) return [{ math: false, text }];
  const pieces: Piece[] = [];
  let cursor = 0;
  for (const [start, end] of spans) {
    if (start > cursor) pieces.push({ math: false, text: text.slice(cursor, start) });
    pieces.push({ math: true, text: text.slice(start, end) });
    cursor = end;
  }
  if (cursor < text.length) pieces.push({ math: false, text: text.slice(cursor) });
  return pieces;
}

function splitDollars(text: string): Piece[] {
  const pieces: Piece[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let cursor = 0;
  for (const match of text.matchAll(re)) {
    const from = match.index ?? 0;
    if (from > cursor) pieces.push(...plain(text.slice(cursor, from)));
    pieces.push({ math: true, text: match[1] ?? match[2] ?? "" });
    cursor = from + match[0].length;
  }
  if (cursor < text.length) pieces.push(...plain(text.slice(cursor)));
  return pieces.filter((p) => p.text.length > 0);
}

function plain(text: string): Piece[] {
  const clean = text.replaceAll("$", "");
  if (!clean) return [];
  return splitMath(clean);
}
