// Pure domain types. No React, no infra. Portable to any stack.

export type ID = string;

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface Experience {
  id: ID;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  modality: string; // Remote, Hybrid, On-site
  city: string;
  description: string;
}

export interface Education {
  id: ID;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: ID;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Cloud"
  | "Databases"
  | "DevOps"
  | "Languages"
  | "Soft Skills";

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Cloud",
  "Databases",
  "DevOps",
  "Languages",
  "Soft Skills",
];

export interface SkillGroup {
  category: SkillCategory;
  items: string[];
}

export interface Certification {
  id: ID;
  name: string;
  issuer: string;
  date: string;
}

export type FontFamily = "Inter" | "IBM Plex Sans" | "Source Sans 3" | "Lato";

export const FONT_FAMILIES: FontFamily[] = ["Inter", "IBM Plex Sans", "Source Sans 3", "Lato"];

export type TemplateId = "minimal" | "ats" | "elegant";

export interface Appearance {
  template: TemplateId;
  font: FontFamily;
  fontSize: number; // 10-14
  spacing: number; // 0.8 - 1.4 line-height multiplier
  accentColor: string; // hex
  margin: number; // in mm
  sectionOrder: SectionKey[];
}

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

export interface CV {
  id: ID;
  title: string; // e.g. "Software Engineer — 2025"
  updatedAt: number;
  createdAt: number;
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  appearance: Appearance;
}
