import raw from "./fiches.json";
import type { DiagramKind } from "@/components/atlas/diagrams";

export type FicheDoc = {
  id: string;
  diagram: DiagramKind;
  captionFr: string;
  captionEn: string;
  storyFr: string;
  storyEn: string;
  usesFr: string;
  usesEn: string;
  statementFr: string;
  statementEn: string;
  formula: string;
  knownFr: string;
  knownEn: string;
  addsFr: string;
  addsEn: string;
  planFr: string;
  planEn: string;
  exampleFr: string;
  exampleEn: string;
  sparkFr: string;
  sparkEn: string;
  related: string[];
  numeric: boolean;
};

export const FICHES = raw as Record<string, FicheDoc>;
