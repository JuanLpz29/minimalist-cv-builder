import type { CV } from "@/domain/cv/types";
import { MinimalTemplate } from "./templates/MinimalTemplate";

export function CVPreview({ cv, printRoot = false }: { cv: CV; printRoot?: boolean }) {
  // Template registry — add more templates here.
  const Template = MinimalTemplate;
  const content = <Template cv={cv} />;
  return printRoot ? <div id="print-root">{content}</div> : content;
}
