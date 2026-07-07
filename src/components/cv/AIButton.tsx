import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { stubProvider } from "@/domain/ai/provider";
import type { AIAction } from "@/domain/ai/provider";
import { toast } from "sonner";

interface Props {
  action: AIAction;
  input: string;
  onResult: (result: string) => void;
  label?: string;
  size?: "sm" | "default";
}

export function AIButton({ action, input, onResult, label = "Improve with AI", size = "sm" }: Props) {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim() && action !== "generate_experience_bullets") {
      toast.error("Write something first, or use Generate.");
      return;
    }
    setLoading(true);
    try {
      const result = await stubProvider.run({ action, input });
      onResult(result);
    } catch {
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" size={size} variant="ghost" onClick={run} disabled={loading} className="text-xs h-7 gap-1.5 text-neutral-600 hover:text-foreground">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
}
