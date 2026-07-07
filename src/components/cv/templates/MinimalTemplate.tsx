import type { CV, SectionKey } from "@/domain/cv/types";

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <section className="mb-5">
      <h2
        className="text-[10.5px] font-semibold uppercase tracking-[0.14em] pb-1 mb-2 border-b"
        style={{ color: accent, borderColor: "#e5e5e5" }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function Row({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 items-baseline">
      <div className="min-w-0">{left}</div>
      {right && <div className="text-[10px] text-neutral-500 whitespace-nowrap">{right}</div>}
    </div>
  );
}

export function MinimalTemplate({ cv }: { cv: CV }) {
  const { personal, summary, experience, education, projects, skills, certifications, appearance } = cv;
  const contactBits = [personal.city, personal.email, personal.phone, personal.linkedin, personal.github, personal.website].filter(Boolean);

  const sections: Record<SectionKey, React.ReactNode> = {
    summary: summary.trim() ? (
      <Section title="Summary" accent={appearance.accentColor}>
        <p className="whitespace-pre-wrap">{summary}</p>
      </Section>
    ) : null,
    experience: experience.length ? (
      <Section title="Experience" accent={appearance.accentColor}>
        <div className="space-y-3.5">
          {experience.map((e) => (
            <div key={e.id}>
              <Row
                left={
                  <div>
                    <div className="font-semibold">{e.role || "Role"}</div>
                    <div className="text-neutral-600">
                      {[e.company, e.city, e.modality].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                }
                right={[e.startDate, e.endDate].filter(Boolean).join(" — ")}
              />
              {e.description && (
                <div className="mt-1 whitespace-pre-wrap text-neutral-800">{e.description}</div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ) : null,
    education: education.length ? (
      <Section title="Education" accent={appearance.accentColor}>
        <div className="space-y-2">
          {education.map((ed) => (
            <Row
              key={ed.id}
              left={
                <div>
                  <div className="font-semibold">{ed.degree || "Degree"}</div>
                  <div className="text-neutral-600">{ed.institution}</div>
                </div>
              }
              right={[ed.startDate, ed.endDate].filter(Boolean).join(" — ")}
            />
          ))}
        </div>
      </Section>
    ) : null,
    projects: projects.length ? (
      <Section title="Projects" accent={appearance.accentColor}>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id}>
              <Row
                left={
                  <div className="font-semibold">
                    {p.name || "Project"}
                    {p.link && <span className="ml-2 font-normal text-neutral-500">· {p.link}</span>}
                  </div>
                }
              />
              {p.description && <div className="whitespace-pre-wrap text-neutral-800">{p.description}</div>}
              {p.technologies && <div className="text-neutral-500 mt-0.5">{p.technologies}</div>}
            </div>
          ))}
        </div>
      </Section>
    ) : null,
    skills: skills.some((g) => g.items.length) ? (
      <Section title="Skills" accent={appearance.accentColor}>
        <div className="space-y-1">
          {skills
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.category} className="flex gap-2">
                <div className="w-28 shrink-0 text-neutral-500">{g.category}</div>
                <div className="flex-1">{g.items.join(", ")}</div>
              </div>
            ))}
        </div>
      </Section>
    ) : null,
    certifications: certifications.length ? (
      <Section title="Certifications" accent={appearance.accentColor}>
        <div className="space-y-1.5">
          {certifications.map((c) => (
            <Row
              key={c.id}
              left={
                <div>
                  <span className="font-semibold">{c.name}</span>
                  {c.issuer && <span className="text-neutral-600"> · {c.issuer}</span>}
                </div>
              }
              right={c.date}
            />
          ))}
        </div>
      </Section>
    ) : null,
  };

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
      <header className="mb-6">
        <h1 className="text-[22pt] font-semibold tracking-tight leading-tight" style={{ color: appearance.accentColor }}>
          {personal.fullName || "Your Name"}
        </h1>
        {personal.title && <div className="text-neutral-700 mt-0.5">{personal.title}</div>}
        {contactBits.length > 0 && (
          <div className="text-[9.5pt] text-neutral-600 mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {contactBits.map((b, i) => (
              <span key={i}>{b}</span>
            ))}
          </div>
        )}
      </header>
      {appearance.sectionOrder.map((k) => (
        <div key={k}>{sections[k]}</div>
      ))}
    </div>
  );
}
