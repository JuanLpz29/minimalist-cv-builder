import type { CV } from "@/domain/cv/types";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";

export function CVPreview({ cv, printRoot = false }: { cv: CV; printRoot?: boolean }) {
  const Template = cv.appearance.template === "classic" ? ClassicTemplate : MinimalTemplate;
  const content = <Template cv={cv} />;
  return printRoot ? <div id="print-root">{content}</div> : content;
}
