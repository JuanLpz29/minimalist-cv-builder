import type { CV } from "@/domain/cv/types";
import { defaultColors } from "@/domain/cv/defaults";
import { ContactLine, PageShell, Photo, SectionBody } from "./shared";

/**
 * Classic layout matching typical “ruled header” CVs:
 * colored name + full-width hairline under the title, contact below the rule.
 */
export function ClassicTemplate({ cv }: { cv: CV }) {
  const { personal, sections, appearance } = cv;
  const accent = appearance.nameColor || "#3B7A8A";
  const contactBits = [
    personal.city,
    personal.email,
    personal.phone,
    personal.linkedin,
    personal.github,
    personal.website,
  ].filter(Boolean);
  const showPhoto = Boolean(personal.photoDataUrl && !appearance.atsMode);

  return (
    <PageShell cv={cv}>
      <header className={`mb-8 ${showPhoto ? "flex gap-4 items-start" : ""}`}>
        <Photo
          src={personal.photoDataUrl}
          atsMode={appearance.atsMode}
          position={personal.photoPosition}
        />
        <div className="min-w-0 flex-1">
          <h1
            className="text-[20pt] font-semibold tracking-tight leading-tight"
            style={{ color: accent }}
          >
            {personal.fullName || "Your Name"}
          </h1>
          {personal.title && (
            <div className="mt-1 text-[11pt]" style={{ color: appearance.titleColor || "#525252" }}>
              {personal.title}
            </div>
          )}
          <div className="mt-3 mb-2.5 h-px w-full" style={{ backgroundColor: accent }} />
          <ContactLine bits={contactBits} color={appearance.contactColor} />
        </div>
      </header>

      {sections.map((section) => {
        const empty =
          section.kind === "entries" ? section.entries.length === 0 : !section.body.trim();
        if (empty) return null;
        return (
          <section key={section.id} className="cv-section mb-7">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3"
              style={{
                // ponytail: el negro por defecto cuenta como "sin elegir" y toma el color del nombre;
                // si alguien elige justo #111111 en Clásico verá el acento. Separar "vacío" de "negro" si molesta.
                color:
                  section.titleColor && section.titleColor !== defaultColors.sectionTitle
                    ? section.titleColor
                    : accent,
              }}
            >
              {section.title}
            </h2>
            <SectionBody section={section} />
          </section>
        );
      })}
    </PageShell>
  );
}
