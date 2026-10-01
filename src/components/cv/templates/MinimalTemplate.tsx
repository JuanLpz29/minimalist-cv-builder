import type { CV } from "@/domain/cv/types";
import { sectionHasContent } from "@/domain/cv/defaults";
import { ContactLine, PageShell, Photo, SectionBody } from "./shared";

/** Clean B/W layout — no accent rule under the name. */
export function MinimalTemplate({ cv }: { cv: CV }) {
  const { personal, sections, appearance } = cv;
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
        <Photo src={personal.photoDataUrl} atsMode={appearance.atsMode} />
        <div className="min-w-0 flex-1">
          <h1
            className="text-[22pt] font-semibold tracking-tight leading-tight"
            style={{ color: appearance.nameColor || "#111" }}
          >
            {personal.fullName || "Your Name"}
          </h1>
          {personal.title && (
            <div className="mt-1 text-neutral-600" style={{ color: appearance.titleColor }}>
              {personal.title}
            </div>
          )}
          <div className="mt-3">
            <ContactLine bits={contactBits} color={appearance.contactColor} />
          </div>
        </div>
      </header>

      {sections.map((section) => {
        const empty = !sectionHasContent(section);
        // Con solo título se ve en la vista previa (para ver lo que armas), pero no se imprime.
        if (empty && !section.title.trim()) return null;
        return (
          <section
            key={section.id}
            className={`cv-section mb-7 ${empty ? "cv-section-empty" : ""}`}
          >
            <h2
              className="text-[10.5px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: section.titleColor || "#111" }}
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
