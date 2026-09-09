// Heuristic CV text → free-form sections (any heading, not only tech CVs).

import type { CV, CVSection, SectionEntry, SectionKind } from "../types";
import { defaultColors, detectLocale, newCV, newSection, uid } from "../defaults";

const KNOWN_HEADER =
  /^(perfil(\s+profesional)?|professional\s+summary|summary|resumen|objetivo|profile|experiencia(\s+profesional|\s+laboral)?|professional\s+experience|work\s+experience|antecedentes\s+(laborales|acad[eé]micos)|employment|educaci[oó]n|education|formaci[oó]n(\s+acad[eé]mica)?|academic|proyectos|projects|portfolio|portafolio|habilidades(\s+y\s+tecnolog[ií]as)?|technical\s+skills|skills|tecnolog[ií]as|competencias|certificaciones|certifications|certificates|idiomas|languages|otros|other|additional|contacto|contact)\b/i;

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\d[\d\s().-]{7,}\d)/;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s|/]+/i;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|/]+/i;
const URL_RE = /(?:https?:\/\/)?(?:www\.)?[a-z0-9][-a-z0-9.]*\.[a-z]{2,}(?:\/[^\s|]*)?/i;
const MONTH =
  "(?:ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sep(?:t(?:iembre)?)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";
const DATE_TOKEN = `(?:${MONTH}\\s+\\d{4}|\\d{1,2}[\\/.\\-]\\d{2,4}|\\d{4})`;
const DATE_RANGE_RE = new RegExp(
  `((?:${DATE_TOKEN}))\\s*[-–—]\\s*((?:actual(?:idad)?|present(?:e)?|hoy|current|now|${DATE_TOKEN}))`,
  "i",
);

function normalize(text: string): string {
  return text
    .replace(/\u000c/g, "\n")
    .replace(/[\u00ad\u200b\u200c\u200d\ufeff]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function isBullet(line: string) {
  return /^[-•●▪◦*]+\s+/.test(line) || /^\u2013\s+/.test(line);
}

function stripBullet(line: string) {
  return line.replace(/^[-•●▪◦*\u2013]+\s+/, "").trim();
}

function isDateOnlyLine(line: string) {
  const t = line.replace(/[|·•]/g, " ").trim();
  const m = t.match(DATE_RANGE_RE);
  return Boolean(m && m[0].replace(/\s+/g, " ").length >= t.replace(/\s+/g, " ").length - 1);
}

function looksLikeJobHeader(line: string) {
  if (isBullet(line) || isDateOnlyLine(line) || line.length > 140) return false;
  if ((line.match(/\|/g) ?? []).length >= 1) return true;
  if (line === line.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3,}/.test(line) && line.length < 90 && !KNOWN_HEADER.test(line))
    return true;
  return false;
}

/** Any short title-like line becomes a section (not only tech CVs). */
function looksLikeSectionHeader(line: string): boolean {
  const t = line.trim();
  if (t.length < 2 || t.length > 55) return false;
  if (isBullet(t) || isDateOnlyLine(t)) return false;
  if (EMAIL_RE.test(t) || PHONE_RE.test(t)) return false;
  if (/\|/.test(t)) return false;
  if (KNOWN_HEADER.test(t)) return true;
  // ALL CAPS heading
  if (t === t.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3,}/.test(t) && !DATE_RANGE_RE.test(t)) return true;
  return false;
}

function parseContactLine(line: string, personal: CV["personal"]) {
  const email = line.match(EMAIL_RE)?.[0];
  if (email) personal.email = email;
  const phone = line.match(PHONE_RE)?.[0]?.replace(/\s+/g, " ").trim();
  if (phone && /[\d]{7,}/.test(phone)) personal.phone = phone;
  const linkedin = line.match(LINKEDIN_RE)?.[0];
  if (linkedin) personal.linkedin = linkedin.replace(/^https?:\/\//, "");
  const github = line.match(GITHUB_RE)?.[0];
  if (github) personal.github = github.replace(/^https?:\/\//, "");
  const parts = line.split("|").map((p) => p.trim());
  for (const p of parts) {
    if (!p) continue;
    if (EMAIL_RE.test(p) || PHONE_RE.test(p) || /linkedin|github/i.test(p) || URL_RE.test(p)) continue;
    if (!personal.city && /[a-záéíóúñ]/i.test(p)) personal.city = p;
  }
  for (const p of parts) {
    if (/linkedin|github|@/.test(p)) continue;
    const url = p.match(URL_RE)?.[0];
    if (url && !personal.website) personal.website = url.replace(/^https?:\/\//, "");
  }
}

function parseJobHeader(line: string): Pick<SectionEntry, "heading" | "subheading" | "meta"> {
  const cleaned = line.replace(/\s+/g, " ").trim();
  const dateMatch = cleaned.match(DATE_RANGE_RE);
  let meta = "";
  let rest = cleaned;
  if (dateMatch) {
    meta = `${dateMatch[1].trim()} — ${dateMatch[2].trim()}`;
    rest = cleaned.replace(DATE_RANGE_RE, "").replace(/\s*[|·•]\s*$/, "").trim();
  }
  const parts = rest.split("|").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { heading: parts[0], subheading: parts.slice(1).join(" · "), meta };
  }
  return { heading: parts[0] || cleaned, subheading: "", meta };
}

function parseEntries(body: string[]): SectionEntry[] {
  const entries: SectionEntry[] = [];
  let cur: SectionEntry | null = null;
  const flush: string[] = [];

  const push = () => {
    if (!cur) return;
    const lines = flush.map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim()).filter(Boolean);
    cur.body = lines.join("\n");
    const hadBullets = flush.some((l) => /^[-•]/.test(l.trim()) || l.startsWith("•"));
    cur.bodyFormat = hadBullets || lines.length > 1 ? "bullets" : "text";
    flush.length = 0;
    entries.push(cur);
    cur = null;
  };

  for (let i = 0; i < body.length; i++) {
    const line = body[i].trim();
    if (!line) continue;

    if (looksLikeJobHeader(line)) {
      push();
      const h = parseJobHeader(line);
      const next = body[i + 1]?.trim() ?? "";
      if (!h.meta && isDateOnlyLine(next)) {
        const dm = next.match(DATE_RANGE_RE)!;
        h.meta = `${dm[1].trim()} — ${dm[2].trim()}`;
        i++;
      }
      cur = { id: uid(), body: "", bodyFormat: "bullets", ...h };
      continue;
    }

    if (!cur) continue;

    if (isBullet(line)) flush.push(`• ${stripBullet(line)}`);
    else if (isDateOnlyLine(line) && !cur.meta) {
      const dm = line.match(DATE_RANGE_RE)!;
      cur.meta = `${dm[1].trim()} — ${dm[2].trim()}`;
    } else if (flush.length) flush[flush.length - 1] += ` ${line}`;
    else flush.push(line);
  }
  push();
  return entries;
}

function guessKind(title: string, body: string[]): SectionKind {
  if (/habilidad|skill|competenc|tecnolog|idioma|language/i.test(title)) return "tags";
  const joined = body.filter(Boolean);
  const entryHits = joined.filter((l) => looksLikeJobHeader(l) || isDateOnlyLine(l)).length;
  if (entryHits >= 1) return "entries";
  if (joined.length <= 8 && joined.every((l) => l.length < 80 || l.includes(","))) {
    // short lines / comma lists → tags
    if (joined.some((l) => l.includes(",")) || joined.length >= 3) return "tags";
  }
  return "text";
}

function splitBlocks(text: string): { title: string; body: string[] }[] {
  const lines = normalize(text).split(/\n/);
  const blocks: { title: string; body: string[] }[] = [{ title: "__header__", body: [] }];
  let current = blocks[0];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      current.body.push("");
      continue;
    }
    if (looksLikeSectionHeader(line)) {
      // First lines before any section stay in header (name/contact)
      if (current.title === "__header__" && !current.body.some(Boolean)) {
        // unlikely: header title as first content — treat as personal name area
        current.body.push(line);
        continue;
      }
      current = { title: line, body: [] };
      blocks.push(current);
      continue;
    }
    current.body.push(line);
  }
  return blocks;
}

export function parseCvText(raw: string, titleHint?: string): CV {
  const locale = detectLocale(raw);
  const cv = newCV(titleHint ?? "Imported CV", locale);
  cv.sections = [];
  const accent = defaultColors.sectionTitle;
  const blocks = splitBlocks(raw);

  const header = blocks.find((b) => b.title === "__header__");
  if (header) {
    const nonempty = header.body.map((l) => l.trim()).filter(Boolean);
    // skip "CURRICULUM VITAE" style first line
    let idx = 0;
    if (nonempty[0] && /^curriculum/i.test(nonempty[0])) idx = 1;
    if (nonempty[idx]) cv.personal.fullName = nonempty[idx];
    for (const line of nonempty.slice(idx + 1, idx + 8)) {
      if (/\|/.test(line) || EMAIL_RE.test(line) || PHONE_RE.test(line) || /contacto:|cel\.|tel\./i.test(line)) {
        parseContactLine(line, cv.personal);
        continue;
      }
      if (!cv.personal.title && line.length < 80 && !looksLikeSectionHeader(line)) {
        cv.personal.title = line;
      }
    }
  }

  for (const block of blocks) {
    if (block.title === "__header__") continue;
    const kind = guessKind(block.title, block.body);
    const section: CVSection = {
      ...newSection(block.title, kind, { title: accent }),
      kind,
    };

    if (kind === "entries") {
      section.entries = parseEntries(block.body);
      if (!section.entries.length) {
        section.kind = "text";
        section.body = block.body.filter(Boolean).join("\n");
      }
    } else if (kind === "tags") {
      section.body = block.body
        .filter(Boolean)
        .map((l) => stripBullet(l))
        .join("\n");
    } else {
      section.body = block.body.filter(Boolean).join("\n");
    }

    // portfolio → website
    if (/portafolio|portfolio/i.test(block.title)) {
      for (const line of block.body) {
        const url = line.match(URL_RE)?.[0];
        if (url && !/linkedin|github/i.test(url)) cv.personal.website = url.replace(/^https?:\/\//, "");
      }
    }

    cv.sections.push(section);
  }

  if (!cv.sections.length) {
    cv.sections = [
      {
        ...newSection(locale === "es" ? "Contenido" : "Content", "text"),
        body: normalize(raw),
      },
    ];
  }

  cv.title = cv.personal.fullName || titleHint || "Imported CV";
  if (locale === "es") {
    cv.appearance.fontSize = 10.5;
    cv.appearance.spacing = 1.25;
    cv.appearance.margin = 16;
  }
  return cv;
}
