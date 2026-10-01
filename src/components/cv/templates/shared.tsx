import type { CV, CVSection } from "@/domain/cv/types";

function BulletList({ body, marker = "•" }: { body: string; marker?: string }) {
  const lines = body
    .split("\n")
    .map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="mt-1.5 space-y-1.5 text-neutral-700 list-none pl-0">
      {lines.map((line, i) => (
        <li key={i} className="cv-entry-block flex gap-2.5">
          <span className="shrink-0 select-none w-3 text-center">{marker}</span>
          <span className="min-w-0 flex-1">{line}</span>
        </li>
      ))}
    </ul>
  );
}

export function SectionBody({ section }: { section: CVSection }) {
  if (section.kind === "entries") {
    return (
      <div className="space-y-5">
        {section.entries.map((e) => (
          <div key={e.id} className="cv-entry-block">
            <div
              className="font-semibold uppercase tracking-wide text-[0.95em] min-w-0"
              style={{ color: section.subtitleColor }}
            >
              {[e.heading, e.subheading, e.meta].filter(Boolean).join(" | ") || "—"}
            </div>
            {e.body &&
              (e.bodyFormat === "text" ? (
                <div className="mt-1.5 whitespace-pre-wrap text-neutral-700">{e.body}</div>
              ) : (
                <BulletList body={e.body} marker="-" />
              ))}
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === "tags") {
    const lines = section.body
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return (
      <div className="space-y-2">
        {lines.map((line, i) => {
          const idx = line.indexOf(":");
          if (idx > 0 && idx < 40) {
            return (
              <div key={i} className="cv-entry-block">
                <div className="font-medium" style={{ color: section.subtitleColor }}>
                  {line.slice(0, idx)}
                </div>
                <div className="text-neutral-700 mt-0.5">{line.slice(idx + 1).trim()}</div>
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
      {section.bodyFormat === "bullets" ? (
        <BulletList body={section.body} marker="-" />
      ) : (
        <p className="whitespace-pre-wrap text-neutral-700 leading-[inherit]">{section.body}</p>
      )}
    </div>
  );
}

export function PageShell({ cv, children }: { cv: CV; children: React.ReactNode }) {
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

const URL_RE = /^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

/** "https://www.linkedin.com/in/x/?a=1" → "linkedin.com/in/x". Devuelve null si no es URL. */
function shortUrl(value: string): string | null {
  const v = value.trim();
  if (v.includes("@") || !URL_RE.test(v)) return null;
  return v
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");
}

export function ContactLine({ bits }: { bits: string[] }) {
  if (!bits.length) return null;
  // El separador va a la izquierda de cada ítem y el contenedor corre -ml-4 con overflow oculto:
  // el "|" del primer ítem de cada línea queda fuera de vista, así no cuelga al hacer wrap.
  return (
    <div className="overflow-hidden text-[9.5pt] text-neutral-500">
      <div className="-ml-4 flex flex-wrap">
        {bits.map((b, i) => {
          const short = shortUrl(b);
          return (
            <span
              key={i}
              className="relative pl-4 before:absolute before:left-[0.4rem] before:text-neutral-300 before:content-['|']"
            >
              {short ? (
                <a
                  href={/^https?:\/\//i.test(b.trim()) ? b.trim() : `https://${b.trim()}`}
                  className="text-inherit no-underline"
                >
                  {short}
                </a>
              ) : (
                b
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
