// AI port. UI depends on this shape, not on a specific provider.
// Wire the real provider (Lovable AI, OpenAI, FastAPI backend) in one place.

export type AIAction =
  | "improve"
  | "summarize"
  | "expand"
  | "bulletize"
  | "translate_en"
  | "translate_es"
  | "ats_optimize"
  | "generate_experience_bullets";

export interface AIRequest {
  action: AIAction;
  input: string;
  context?: Record<string, string>;
}

export interface AIProvider {
  run(req: AIRequest): Promise<string>;
}

// Local stub provider — deterministic, offline. Replace with real provider later.
export const stubProvider: AIProvider = {
  async run({ action, input }) {
    await new Promise((r) => setTimeout(r, 500));
    const trimmed = input.trim();
    if (!trimmed) return "";
    switch (action) {
      case "improve":
        return polish(trimmed);
      case "summarize":
        return trimmed.split(/\.\s+/).slice(0, 2).join(". ") + ".";
      case "expand":
        return `${polish(trimmed)} Delivered measurable outcomes and collaborated cross-functionally to align technical work with business objectives.`;
      case "bulletize":
        return trimmed
          .split(/[\.\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `• ${capitalize(s)}`)
          .join("\n");
      case "generate_experience_bullets":
        return [
          "• Led design and delivery of core features shipped to production",
          "• Collaborated with product and design to define scope and success metrics",
          "• Improved reliability and performance through instrumentation and testing",
        ].join("\n");
      case "translate_en":
        return trimmed; // stub
      case "translate_es":
        return trimmed; // stub
      case "ats_optimize":
        return polish(trimmed).replace(/\b(stuff|things)\b/gi, "responsibilities");
      default:
        return trimmed;
    }
  },
};

function polish(s: string) {
  const clean = s
    .replace(/\s+/g, " ")
    .replace(/\bi\b/g, "I")
    .trim();
  return clean.endsWith(".") ? clean : clean + ".";
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
