import type {
  Appearance,
  CV,
  CVSection,
  Locale,
  LocaleBundle,
  PersonalInfo,
  SectionEntry,
  SectionKind,
  TemplateId,
} from "./types";

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const defaultColors = {
  accent: "#111111",
  name: "#111111",
  title: "#404040",
  sectionTitle: "#111111",
  subtitle: "#525252",
};

export const newEntry = (): SectionEntry => ({
  id: uid(),
  heading: "",
  subheading: "",
  meta: "",
  body: "",
  bodyFormat: "bullets",
});

export const newSection = (
  title = "Nueva sección",
  kind: SectionKind = "text",
  colors?: { title?: string; subtitle?: string },
): CVSection => ({
  id: uid(),
  title,
  kind,
  titleColor: colors?.title ?? defaultColors.sectionTitle,
  subtitleColor: colors?.subtitle ?? defaultColors.subtitle,
  body: "",
  entries: kind === "entries" ? [newEntry()] : [],
});

export const defaultAppearance = (): Appearance => ({
  template: "minimal",
  font: "Inter",
  fontSize: 11,
  spacing: 1.4,
  accentColor: defaultColors.accent,
  nameColor: defaultColors.name,
  titleColor: defaultColors.title,
  margin: 18,
  atsMode: false,
});

/** Apply layout + sensible default colors for that template. */
export function appearanceForTemplate(template: TemplateId, base?: Appearance): Appearance {
  const a = { ...(base ?? defaultAppearance()), template };
  if (template === "classic") {
    return {
      ...a,
      accentColor: a.accentColor === "#111111" ? "#3B7A8A" : a.accentColor,
      nameColor: a.nameColor === "#111111" ? "#3B7A8A" : a.nameColor,
    };
  }
  return {
    ...a,
    accentColor: a.accentColor === "#3B7A8A" ? "#111111" : a.accentColor,
    nameColor: a.nameColor === "#3B7A8A" ? "#111111" : a.nameColor,
  };
}

export const emptyPersonal = (): PersonalInfo => ({
  fullName: "",
  title: "",
  email: "",
  phone: "",
  city: "",
  linkedin: "",
  github: "",
  website: "",
});

const STARTER: Record<Locale, { title: string; kind: SectionKind }[]> = {
  es: [
    { title: "Perfil profesional", kind: "text" },
    { title: "Experiencia", kind: "entries" },
    { title: "Educación", kind: "entries" },
    { title: "Habilidades", kind: "tags" },
  ],
  en: [
    { title: "Professional summary", kind: "text" },
    { title: "Experience", kind: "entries" },
    { title: "Education", kind: "entries" },
    { title: "Skills", kind: "tags" },
  ],
};

/** Contenido de ejemplo para llegar y reemplazar (no vacío). */
export const samplePersonal = (locale: Locale = "es"): PersonalInfo =>
  locale === "en"
    ? {
        fullName: "Alex Rivera",
        title: "Product Designer",
        email: "alex.rivera@email.com",
        phone: "+1 555 010 2030",
        city: "Remote · LatAm",
        linkedin: "linkedin.com/in/alexrivera",
        github: "",
        website: "alexrivera.design",
      }
    : {
        fullName: "Alex Rivera",
        title: "Diseñador/a de producto",
        email: "alex.rivera@email.com",
        phone: "+56 9 1234 5678",
        city: "Santiago, Chile",
        linkedin: "linkedin.com/in/alexrivera",
        github: "",
        website: "alexrivera.design",
      };

export const sampleSections = (locale: Locale = "es"): CVSection[] => {
  if (locale === "en") {
    return [
      {
        ...newSection("Professional summary", "text"),
        body: "Product designer with 6+ years shipping B2B and consumer experiences. I turn fuzzy problems into clear interfaces, partner closely with eng and research, and care about measurable outcomes—not just pretty screens.",
      },
      {
        ...newSection("Experience", "entries"),
        entries: [
          {
            id: uid(),
            heading: "Senior Product Designer",
            subheading: "Northwind · Remote",
            meta: "2022 — Present",
            body: "Led redesign of onboarding; activation +18%\nOwned design system foundations used by 4 squads\nRan weekly discovery with PMs and researchers",
            bodyFormat: "bullets",
          },
          {
            id: uid(),
            heading: "Product Designer",
            subheading: "Acme Apps · Hybrid",
            meta: "2019 — 2022",
            body: "Shipped mobile checkout end-to-end with eng\nCut support tickets related to payments by ~25%\nMentored 2 junior designers",
            bodyFormat: "bullets",
          },
        ],
      },
      {
        ...newSection("Education", "entries"),
        entries: [
          {
            id: uid(),
            heading: "B.A. Design",
            subheading: "Universidad Ejemplo",
            meta: "2014 — 2018",
            body: "",
            bodyFormat: "text",
          },
        ],
      },
      {
        ...newSection("Skills", "tags"),
        body: "Figma, Prototyping, Design systems, User research, Facilitation, HTML/CSS",
      },
    ];
  }

  return [
    {
      ...newSection("Perfil profesional", "text"),
      body: "Diseñador/a de producto con más de 6 años creando experiencias B2B y consumer. Transformo problemas ambiguos en interfaces claras, trabajo codo a codo con engineering e investigación, y me importa el impacto medible — no solo pantallas bonitas.",
    },
    {
      ...newSection("Experiencia", "entries"),
      entries: [
        {
          id: uid(),
          heading: "Senior Product Designer",
          subheading: "Northwind · Remoto",
          meta: "2022 — Actualidad",
          body: "Lideré el rediseño del onboarding; activación +18%\nDueño/a de bases del design system usadas por 4 squads\nDiscovery semanal con PMs e investigadores",
          bodyFormat: "bullets",
        },
        {
          id: uid(),
          heading: "Product Designer",
          subheading: "Acme Apps · Híbrido",
          meta: "2019 — 2022",
          body: "Checkout mobile de punta a punta con engineering\nBajé ~25% los tickets de soporte ligados a pagos\nMentoreé a 2 diseñadores junior",
          bodyFormat: "bullets",
        },
      ],
    },
    {
      ...newSection("Educación", "entries"),
      entries: [
        {
          id: uid(),
          heading: "Licenciatura en Diseño",
          subheading: "Universidad Ejemplo",
          meta: "2014 — 2018",
          body: "",
          bodyFormat: "text",
        },
      ],
    },
    {
      ...newSection("Habilidades", "tags"),
      body: "Figma, Prototipado, Design systems, Research, Facilitación, HTML/CSS",
    },
  ];
};

export const defaultSections = (locale: Locale = "es"): CVSection[] =>
  STARTER[locale].map((s) => newSection(s.title, s.kind));

export const EXAMPLE_CV_ID = "cv-ejemplo";

/** CV de ejemplo fijo en la lista — llegar y reemplazar. */
export const exampleCV = (template: TemplateId = "minimal"): CV => {
  const now = Date.now();
  return {
    id: EXAMPLE_CV_ID,
    title: "CV De ejemplo",
    createdAt: now,
    updatedAt: now,
    locale: "es",
    personal: samplePersonal("es"),
    sections: sampleSections("es"),
    appearance: appearanceForTemplate(template),
  };
};

export const newCV = (title = "Untitled CV", locale: Locale = "es", template: TemplateId = "minimal"): CV => {
  const now = Date.now();
  return {
    id: uid(),
    title,
    createdAt: now,
    updatedAt: now,
    locale,
    personal: emptyPersonal(),
    sections: defaultSections(locale),
    appearance: appearanceForTemplate(template),
  };
};

function cloneBundle(personal: PersonalInfo, sections: CVSection[]): LocaleBundle {
  return {
    personal: { ...personal },
    sections: sections.map((s) => ({
      ...s,
      entries: s.entries.map((e) => ({ ...e })),
    })),
  };
}

/** Swap active locale. First time: copies current content into the other slot (manual edit, no AI). */
export function switchLocale(cv: CV, next: Locale): CV {
  if (cv.locale === next) return cv;
  const current = cloneBundle(cv.personal, cv.sections);
  if (cv.otherLocale) {
    return {
      ...cv,
      locale: next,
      personal: { ...cv.otherLocale.personal },
      sections: cv.otherLocale.sections.map((s) => ({
        ...s,
        entries: s.entries.map((e) => ({ ...e })),
      })),
      otherLocale: current,
    };
  }
  // First toggle: seed other language with same content + starter titles for that locale
  const seeded = cloneBundle(cv.personal, cv.sections);
  const titles = STARTER[next];
  seeded.sections = seeded.sections.map((s, i) => ({
    ...s,
    title: titles[i]?.title ?? s.title,
  }));
  return {
    ...cv,
    locale: next,
    personal: seeded.personal,
    sections: seeded.sections,
    otherLocale: current,
  };
}

export function detectLocale(text: string): Locale {
  const t = text.toLowerCase();
  const esHits = (
    t.match(
      /perfil profesional|experiencia|habilidades|educaci[oó]n|antecedentes|resumen|idiomas/g,
    ) ?? []
  ).length;
  const enHits = (
    t.match(/professional summary|experience|skills|education|certifications|languages/g) ?? []
  ).length;
  return esHits >= enHits ? "es" : "en";
}

/** Lift localStorage v1 (fixed fields) → sections model. */
export function migrateCV(raw: unknown): CV {
  const r = raw as Record<string, unknown>;
  if (r && Array.isArray(r.sections)) {
    const cv = r as unknown as CV;
    const template =
      cv.appearance?.template === "classic" ? "classic" : "minimal";
    return {
      ...newCV(cv.title || "Untitled CV", cv.locale || "es"),
      ...cv,
      locale: cv.locale === "en" ? "en" : "es",
      personal: { ...emptyPersonal(), ...cv.personal },
      appearance: { ...defaultAppearance(), ...cv.appearance, template },
      sections: (cv.sections ?? []).map((s) => ({
        ...newSection(s.title || "Section", s.kind || "text"),
        ...s,
        entries: s.entries ?? [],
        body: s.body ?? "",
        titleColor: s.titleColor || defaultColors.sectionTitle,
        subtitleColor: s.subtitleColor || defaultColors.subtitle,
      })),
    };
  }

  const legacy = r as {
    id?: string;
    title?: string;
    createdAt?: number;
    updatedAt?: number;
    personal?: PersonalInfo;
    summary?: string;
    experience?: Array<{
      id: string;
      role?: string;
      company?: string;
      startDate?: string;
      endDate?: string;
      city?: string;
      modality?: string;
      description?: string;
    }>;
    education?: Array<{
      id: string;
      degree?: string;
      institution?: string;
      startDate?: string;
      endDate?: string;
    }>;
    projects?: Array<{
      id: string;
      name?: string;
      link?: string;
      description?: string;
      technologies?: string;
    }>;
    skills?: Array<{ category: string; items: string[] }>;
    certifications?: Array<{ id: string; name?: string; issuer?: string; date?: string }>;
    appearance?: Partial<Appearance> & {
      sectionOrder?: string[];
      sectionLabels?: Record<string, string>;
      accentColor?: string;
    };
  };

  const accent = legacy.appearance?.accentColor ?? defaultColors.accent;
  const labels = legacy.appearance?.sectionLabels ?? {};
  const order = legacy.appearance?.sectionOrder ?? [
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
  ];

  const sections: CVSection[] = [];
  const push = (build: () => CVSection | null) => {
    const s = build();
    if (s) sections.push(s);
  };

  for (const key of order) {
    if (key === "summary") {
      push(() => {
        if (!legacy.summary?.trim()) return null;
        return {
          ...newSection(labels.summary || "Summary", "text", { title: accent }),
          body: legacy.summary,
        };
      });
    } else if (key === "experience") {
      push(() => {
        if (!legacy.experience?.length) return null;
        return {
          ...newSection(labels.experience || "Experience", "entries", { title: accent }),
          entries: legacy.experience.map((e) => ({
            id: e.id || uid(),
            heading: e.role || "",
            subheading: [e.company, e.city, e.modality].filter(Boolean).join(" · "),
            meta: [e.startDate, e.endDate].filter(Boolean).join(" — "),
            body: e.description || "",
          })),
        };
      });
    } else if (key === "education") {
      push(() => {
        if (!legacy.education?.length) return null;
        return {
          ...newSection(labels.education || "Education", "entries", { title: accent }),
          entries: legacy.education.map((e) => ({
            id: e.id || uid(),
            heading: e.degree || "",
            subheading: e.institution || "",
            meta: [e.startDate, e.endDate].filter(Boolean).join(" — "),
            body: "",
          })),
        };
      });
    } else if (key === "projects") {
      push(() => {
        if (!legacy.projects?.length) return null;
        return {
          ...newSection(labels.projects || "Projects", "entries", { title: accent }),
          entries: legacy.projects.map((p) => ({
            id: p.id || uid(),
            heading: p.name || "",
            subheading: p.technologies || "",
            meta: p.link || "",
            body: p.description || "",
          })),
        };
      });
    } else if (key === "skills") {
      push(() => {
        const lines = (legacy.skills ?? [])
          .filter((g) => g.items?.length)
          .map((g) => `${g.category}: ${g.items.join(", ")}`);
        if (!lines.length) return null;
        return {
          ...newSection(labels.skills || "Skills", "tags", { title: accent }),
          body: lines.join("\n"),
        };
      });
    } else if (key === "certifications") {
      push(() => {
        if (!legacy.certifications?.length) return null;
        return {
          ...newSection(labels.certifications || "Certifications", "entries", { title: accent }),
          entries: legacy.certifications.map((c) => ({
            id: c.id || uid(),
            heading: c.name || "",
            subheading: c.issuer || "",
            meta: c.date || "",
            body: "",
          })),
        };
      });
    }
  }

  const now = Date.now();
  const blob = JSON.stringify(legacy);
  return {
    id: legacy.id || uid(),
    title: legacy.title || "Untitled CV",
    createdAt: legacy.createdAt || now,
    updatedAt: legacy.updatedAt || now,
    locale: detectLocale(blob),
    personal: { ...emptyPersonal(), ...legacy.personal },
    sections:
      sections.length > 0
        ? sections
        : defaultSections(detectLocale(blob)),
    appearance: {
      ...defaultAppearance(),
      ...legacy.appearance,
      accentColor: accent,
      nameColor: (legacy.appearance as Appearance | undefined)?.nameColor || accent,
      titleColor: (legacy.appearance as Appearance | undefined)?.titleColor || defaultColors.title,
      atsMode: Boolean((legacy.appearance as Appearance | undefined)?.atsMode),
    },
  };
}
