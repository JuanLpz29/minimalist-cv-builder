import type { TemplateId } from "@/domain/cv/types";
import { TEMPLATE_OPTIONS } from "@/domain/cv/types";
import { cn } from "@/lib/utils";

export function LayoutPicker({
  value,
  onChange,
  className,
}: {
  value: TemplateId;
  onChange: (t: TemplateId) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {TEMPLATE_OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "text-left rounded-xl border p-4 transition-colors",
              selected
                ? "border-foreground bg-neutral-50 ring-1 ring-foreground"
                : "border-neutral-200 hover:border-neutral-300",
            )}
          >
            <div className="h-16 mb-3 rounded-md bg-white border border-neutral-100 overflow-hidden p-2.5">
              {opt.id === "classic" ? (
                <div>
                  <div className="h-2.5 w-2/3 rounded-sm" style={{ backgroundColor: "#3B7A8A" }} />
                  <div className="mt-1.5 h-px w-full" style={{ backgroundColor: "#3B7A8A" }} />
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-neutral-200 rounded" />
                    <div className="h-1 w-4/5 bg-neutral-200 rounded" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="h-2.5 w-2/3 rounded-sm bg-neutral-800" />
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-neutral-200 rounded" />
                    <div className="h-1 w-4/5 bg-neutral-200 rounded" />
                    <div className="h-1 w-3/5 bg-neutral-200 rounded" />
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm font-medium">{opt.label}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{opt.hint}</div>
          </button>
        );
      })}
    </div>
  );
}
