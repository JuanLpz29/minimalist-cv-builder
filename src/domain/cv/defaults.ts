import {
  type CV,
  type Experience,
  type Education,
  type Project,
  type Certification,
  type SkillGroup,
  SKILL_CATEGORIES,
  DEFAULT_SECTION_ORDER,
} from "./types";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const newExperience = (): Experience => ({
  id: uid(),
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  modality: "",
  city: "",
  description: "",
});

export const newEducation = (): Education => ({
  id: uid(),
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
});

export const newProject = (): Project => ({
  id: uid(),
  name: "",
  description: "",
  technologies: "",
  link: "",
});

export const newCertification = (): Certification => ({
  id: uid(),
  name: "",
  issuer: "",
  date: "",
});

export const emptySkills = (): SkillGroup[] =>
  SKILL_CATEGORIES.map((category) => ({ category, items: [] }));

export const newCV = (title = "Untitled CV"): CV => {
  const now = Date.now();
  return {
    id: uid(),
    title,
    createdAt: now,
    updatedAt: now,
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      city: "",
      linkedin: "",
      github: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: emptySkills(),
    certifications: [],
    appearance: {
      template: "minimal",
      font: "Inter",
      fontSize: 11,
      spacing: 1.4,
      accentColor: "#111111",
      margin: 18,
      sectionOrder: [...DEFAULT_SECTION_ORDER],
    },
  };
};

export { uid };
