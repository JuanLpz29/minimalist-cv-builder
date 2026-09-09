import type { CV, CVSection } from "@/domain/cv/types";

export function SectionBody({ section, atsMode }: { section: CVSection; atsMode: boolean }) {
  const showImg = Boolean(section.imageDataUrl && !atsMode);

  if (section.kind === "entries") {
    return (
      <div className="space-y-3.5">
        {showImg && (
          <img src={section.imageDataUrl} alt="" className="max-h-24 mb-2 rounded object-cover" />
        )}
        {section.entries.map((e) => (
          <div key={e.id}>
            <div className="flex justify-between gap-4 items-baseline">
              <div
                className="font-semibold uppercase tracking-wide text-[0.95em] min-w-0"
                style={{ color: section.subtitleColor }}
              >
                {[e.heading, e.subheading, e.meta].filter(Boolean).join(" | ") || "—"}
              </div>
            </div>
            {e.body && (
              <div className="mt-1 whitespace-pre-wrap text-neutral-700">{e.body}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === "tags") {
    const lines = section.body.split("\n").map((l) => l.trim()).filter(Boolean);
    return (
      <div className="space-y-1.5">
        {showImg && (
          <img src={section.imageDataUrl} alt="" className="max-h-24 mb-2 rounded object-cover" />
        )}
        {lines.map((line, i) => {
          const idx = line.indexOf(":");
          if (idx > 0 && idx < 40) {
            return (
              <div key={i}>
                <div className="font-medium" style={{ color: section.subtitleColor }}>
                  {line.slice(0, idx)}
                </div>
                <div className="text-neutral-700">{line.slice(idx + 1).trim()}</div>
              </div>
            );
          }
          return (
            <div key={i} className="text-neutral-700">
              {line}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {showImg && (
        <img src={section.imageDataUrl} alt="" className="max-h-28 mb-2 rounded object-cover" />
      )}
      <p className="whitespace-pre-wrap text-neutral-700">{section.body}</p>
    </div>
  );
}

export function PageShell({
  cv,
  children,
}: {
  cv: CV;
  children: React.ReactNode;
}) {
  const { appearance } = cv;
  return (
    <div
      className="cv-page shadow-page mx-auto"
      style={{
        padding: `${appearance.margin}mm`,
        fontFamily: `"${appearance.font}", ui-sans-serif, system-ui, sans-serif`,
        fontSize: `${appearance.fontSize}pt`,
        lineHeight: appearance.spacing,
        color: "#111",
      }}
    >
      {children}
    </div>
  );
}

export function Photo({ src, atsMode }: { src?: string; atsMode: boolean }) {
  if (!src || atsMode) return null;
  return (
    <img
      src={src}
      alt=""
      className="h-20 w-20 rounded-full object-cover shrink-0 border border-neutral-200"
    />
  );
}

export function ContactLine({ bits }: { bits: string[] }) {
  if (!bits.length) return null;
  return (
    <div className="text-[9.5pt] text-neutral-500 flex flex-wrap gap-x-0">
      {bits.map((b, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5 text-neutral-300">|</span>}
          {b}
        </span>
      ))}
    </div>
  );
}
