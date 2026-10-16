import katex from "katex";
import { splitMath, toLatex } from "./math-split";

function htmlFor(latex: string, display: boolean): string {
  try {
    return katex.renderToString(toLatex(latex), {
      throwOnError: false,
      displayMode: display,
      output: "html",
      strict: "ignore",
    });
  } catch {
    return "";
  }
}

export function MathText({ text, display = false }: { text: string; display?: boolean }) {
  const pieces = splitMath(text);
  return (
    <>
      {pieces.map((piece, i) =>
        piece.math ? (
          <span
            key={i}
            className="folio-math"
            dangerouslySetInnerHTML={{ __html: htmlFor(piece.text, display && pieces.length === 1) }}
          />
        ) : (
          <span key={i}>{piece.text}</span>
        ),
      )}
    </>
  );
}
