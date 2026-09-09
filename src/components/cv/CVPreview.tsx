import type { CV } from "@/domain/cv/types";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";

export function CVPreview({ cv }: { cv: CV }) {
  const Template = cv.appearance.template === "classic" ? ClassicTemplate : MinimalTemplate;
  return <Template cv={cv} />;
}
