// Pure domain types. No React, no infra. Portable to any stack.

export type ID = string;
export type Locale = "es" | "en";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  github: string;
  website: string;
  /** data URL; oculto si appearance.atsMode */
  photoDataUrl?: string;
}

export type SectionKind = "text" | "entries" | "tags";

export interface SectionEntry {
  id: ID;
  heading: string;
  subheading: string;
  meta: string;
  body: string;
  /** bullets = one item per line; text = free paragraph */
  bodyFormat?: "bullets" | "text";
}

export interface CVSection {
  id: ID;
  title: string;
  kind: SectionKind;
  titleColor: string;
  subtitleColor: string;
  body: string;
  entries: SectionEntry[];
  imageDataUrl?: string;
}

export type FontFamily = "Inter" | "IBM Plex Sans" | "Source Sans 3" | "Lato";

export const FONT_FAMILIES: FontFamily[] = ["Inter", "IBM Plex Sans", "Source Sans 3", "Lato"];

export type TemplateId = "minimal" | "classic";

export const TEMPLATE_OPTIONS: { id: TemplateId; label: string; hint: string }[] = [
  { id: "minimal", label: "Minimal B/N", hint: "Limpio, sin raya bajo el nombre" },
  { id: "classic", label: "Clásico", hint: "Nombre + raya (estilo tipográfico)" },
];

export interface Appearance {
  template: TemplateId;
  font: FontFamily;
  fontSize: number;
  spacing: number;
  accentColor: string;
  nameColor: string;
  titleColor: string;
  margin: number;
  /** Oculta fotos/imágenes (ATS-friendly) */
  atsMode: boolean;
}

/** Snapshot of the inactive language version */
export interface LocaleBundle {
  personal: PersonalInfo;
  sections: CVSection[];
}

export interface CV {
  id: ID;
  title: string;
  updatedAt: number;
  createdAt: number;
  locale: Locale;
  personal: PersonalInfo;
  sections: CVSection[];
  /** Contenido del otro idioma (se crea la 1ª vez que cambiás el toggle) */
  otherLocale?: LocaleBundle;
  appearance: Appearance;
}

/** @deprecated solo para migrate() de localStorage viejo */
export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications";

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
];
