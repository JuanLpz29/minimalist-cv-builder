import type { CV } from "@/domain/cv/types";
import { SKILL_CATEGORIES, FONT_FAMILIES } from "@/domain/cv/types";
import { newExperience, newEducation, newProject, newCertification } from "@/domain/cv/defaults";
import { Field, SectionHeader } from "./Field";
import { AIButton } from "../AIButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  cv: CV;
  update: (updater: (prev: CV) => CV) => void;
}

const areaCls =
  "min-h-[100px] bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none text-sm leading-relaxed";

function Group({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="py-6 border-b border-neutral-100 last:border-b-0">
      <SectionHeader title={title} action={right} />
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ItemCard({ children, onRemove, onUp, onDown }: { children: React.ReactNode; onRemove: () => void; onUp?: () => void; onDown?: () => void }) {
  return (
    <div className="group rounded-lg border border-neutral-200 p-4 space-y-3 relative">
      <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
        {onUp && (
          <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400" onClick={onUp}>
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDown && (
          <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400" onClick={onDown}>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-destructive" onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function moveItem<T>(arr: T[], idx: number, dir: -1 | 1): T[] {
  const target = idx + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

export function CVEditor({ cv, update }: Props) {
  const set = <K extends keyof CV>(key: K) => (value: CV[K]) => update((p) => ({ ...p, [key]: value }));

  return (
    <div className="divide-y divide-neutral-100">
      {/* Personal */}
      <Group title="Personal information">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" value={cv.personal.fullName} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, fullName: v } }))} placeholder="Jane Doe" />
          <Field label="Title" value={cv.personal.title} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, title: v } }))} placeholder="Senior Software Engineer" />
          <Field label="Email" value={cv.personal.email} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, email: v } }))} placeholder="jane@example.com" />
          <Field label="Phone" value={cv.personal.phone} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, phone: v } }))} />
          <Field label="City" value={cv.personal.city} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, city: v } }))} />
          <Field label="LinkedIn" value={cv.personal.linkedin} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, linkedin: v } }))} />
          <Field label="GitHub" value={cv.personal.github} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, github: v } }))} />
          <Field label="Website" value={cv.personal.website} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, website: v } }))} />
        </div>
      </Group>

      {/* Summary */}
      <Group
        title="Summary"
        right={<AIButton action="improve" input={cv.summary} onResult={(v) => set("summary")(v)} />}
      >
        <Textarea
          value={cv.summary}
          onChange={(e) => set("summary")(e.target.value)}
          className={areaCls}
          placeholder="Two or three concise sentences about who you are and what you do."
        />
      </Group>

      {/* Experience */}
      <Group
        title="Experience"
        right={
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => update((p) => ({ ...p, experience: [...p.experience, newExperience()] }))}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        {cv.experience.map((e, i) => (
          <ItemCard
            key={e.id}
            onRemove={() => update((p) => ({ ...p, experience: p.experience.filter((x) => x.id !== e.id) }))}
            onUp={i > 0 ? () => update((p) => ({ ...p, experience: moveItem(p.experience, i, -1) })) : undefined}
            onDown={i < cv.experience.length - 1 ? () => update((p) => ({ ...p, experience: moveItem(p.experience, i, 1) })) : undefined}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role" value={e.role} onChange={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, role: v } : x)) }))} />
              <Field label="Company" value={e.company} onChange={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, company: v } : x)) }))} />
              <Field label="Start" value={e.startDate} onChange={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, startDate: v } : x)) }))} placeholder="Jan 2023" />
              <Field label="End" value={e.endDate} onChange={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, endDate: v } : x)) }))} placeholder="Present" />
              <Field label="Modality" value={e.modality} onChange={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, modality: v } : x)) }))} placeholder="Remote" />
              <Field label="City" value={e.city} onChange={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, city: v } : x)) }))} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Description</Label>
                <div className="flex">
                  <AIButton
                    action="generate_experience_bullets"
                    input={e.description || e.role}
                    label="Generate bullets"
                    onResult={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, description: v } : x)) }))}
                  />
                  <AIButton
                    action="improve"
                    input={e.description}
                    label="Improve"
                    onResult={(v) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, description: v } : x)) }))}
                  />
                </div>
              </div>
              <Textarea value={e.description} onChange={(ev) => update((p) => ({ ...p, experience: p.experience.map((x) => (x.id === e.id ? { ...x, description: ev.target.value } : x)) }))} className={areaCls} placeholder="What you built, owned, and delivered." />
            </div>
          </ItemCard>
        ))}
      </Group>

      {/* Education */}
      <Group
        title="Education"
        right={
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => update((p) => ({ ...p, education: [...p.education, newEducation()] }))}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        {cv.education.map((ed, i) => (
          <ItemCard
            key={ed.id}
            onRemove={() => update((p) => ({ ...p, education: p.education.filter((x) => x.id !== ed.id) }))}
            onUp={i > 0 ? () => update((p) => ({ ...p, education: moveItem(p.education, i, -1) })) : undefined}
            onDown={i < cv.education.length - 1 ? () => update((p) => ({ ...p, education: moveItem(p.education, i, 1) })) : undefined}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Institution" value={ed.institution} onChange={(v) => update((p) => ({ ...p, education: p.education.map((x) => (x.id === ed.id ? { ...x, institution: v } : x)) }))} />
              <Field label="Degree" value={ed.degree} onChange={(v) => update((p) => ({ ...p, education: p.education.map((x) => (x.id === ed.id ? { ...x, degree: v } : x)) }))} />
              <Field label="Start" value={ed.startDate} onChange={(v) => update((p) => ({ ...p, education: p.education.map((x) => (x.id === ed.id ? { ...x, startDate: v } : x)) }))} />
              <Field label="End" value={ed.endDate} onChange={(v) => update((p) => ({ ...p, education: p.education.map((x) => (x.id === ed.id ? { ...x, endDate: v } : x)) }))} />
            </div>
          </ItemCard>
        ))}
      </Group>

      {/* Projects */}
      <Group
        title="Projects"
        right={
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => update((p) => ({ ...p, projects: [...p.projects, newProject()] }))}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        {cv.projects.map((pr, i) => (
          <ItemCard
            key={pr.id}
            onRemove={() => update((p) => ({ ...p, projects: p.projects.filter((x) => x.id !== pr.id) }))}
            onUp={i > 0 ? () => update((p) => ({ ...p, projects: moveItem(p.projects, i, -1) })) : undefined}
            onDown={i < cv.projects.length - 1 ? () => update((p) => ({ ...p, projects: moveItem(p.projects, i, 1) })) : undefined}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" value={pr.name} onChange={(v) => update((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, name: v } : x)) }))} />
              <Field label="Link" value={pr.link} onChange={(v) => update((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, link: v } : x)) }))} />
              <div className="col-span-2">
                <Field label="Technologies" value={pr.technologies} onChange={(v) => update((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, technologies: v } : x)) }))} placeholder="TypeScript, PostgreSQL, AWS" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Description</Label>
                <AIButton action="improve" input={pr.description} label="Improve" onResult={(v) => update((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, description: v } : x)) }))} />
              </div>
              <Textarea value={pr.description} onChange={(ev) => update((p) => ({ ...p, projects: p.projects.map((x) => (x.id === pr.id ? { ...x, description: ev.target.value } : x)) }))} className={areaCls} />
            </div>
          </ItemCard>
        ))}
      </Group>

      {/* Skills */}
      <Group title="Skills">
        {SKILL_CATEGORIES.map((cat) => {
          const group = cv.skills.find((g) => g.category === cat)!;
          return (
            <div key={cat}>
              <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">{cat}</Label>
              <Input
                className="h-9 bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none mt-1.5"
                value={group.items.join(", ")}
                placeholder="Comma-separated"
                onChange={(e) =>
                  update((p) => ({
                    ...p,
                    skills: p.skills.map((g) =>
                      g.category === cat
                        ? { ...g, items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }
                        : g,
                    ),
                  }))
                }
              />
            </div>
          );
        })}
      </Group>

      {/* Certifications */}
      <Group
        title="Certifications"
        right={
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => update((p) => ({ ...p, certifications: [...p.certifications, newCertification()] }))}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        {cv.certifications.map((c, i) => (
          <ItemCard
            key={c.id}
            onRemove={() => update((p) => ({ ...p, certifications: p.certifications.filter((x) => x.id !== c.id) }))}
            onUp={i > 0 ? () => update((p) => ({ ...p, certifications: moveItem(p.certifications, i, -1) })) : undefined}
            onDown={i < cv.certifications.length - 1 ? () => update((p) => ({ ...p, certifications: moveItem(p.certifications, i, 1) })) : undefined}
          >
            <div className="grid grid-cols-3 gap-3">
              <Field label="Name" value={c.name} onChange={(v) => update((p) => ({ ...p, certifications: p.certifications.map((x) => (x.id === c.id ? { ...x, name: v } : x)) }))} />
              <Field label="Issuer" value={c.issuer} onChange={(v) => update((p) => ({ ...p, certifications: p.certifications.map((x) => (x.id === c.id ? { ...x, issuer: v } : x)) }))} />
              <Field label="Date" value={c.date} onChange={(v) => update((p) => ({ ...p, certifications: p.certifications.map((x) => (x.id === c.id ? { ...x, date: v } : x)) }))} />
            </div>
          </ItemCard>
        ))}
      </Group>

      {/* Appearance */}
      <Group title="Appearance">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Font</Label>
            <Select value={cv.appearance.font} onValueChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, font: v as CV["appearance"]["font"] } }))}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Accent color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={cv.appearance.accentColor} onChange={(e) => update((p) => ({ ...p, appearance: { ...p.appearance, accentColor: e.target.value } }))} className="h-9 w-12 rounded border border-neutral-200 bg-transparent" />
              <Input value={cv.appearance.accentColor} onChange={(e) => update((p) => ({ ...p, appearance: { ...p.appearance, accentColor: e.target.value } }))} className="h-9 border-neutral-200 shadow-none" />
            </div>
          </div>
          <Field label="Font size (pt)" type="number" value={String(cv.appearance.fontSize)} onChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, fontSize: Math.max(9, Math.min(14, Number(v) || 11)) } }))} />
          <Field label="Line height" type="number" value={String(cv.appearance.spacing)} onChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, spacing: Math.max(1, Math.min(2, Number(v) || 1.4)) } }))} />
          <Field label="Margin (mm)" type="number" value={String(cv.appearance.margin)} onChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, margin: Math.max(8, Math.min(30, Number(v) || 18)) } }))} />
        </div>
      </Group>
    </div>
  );
}
