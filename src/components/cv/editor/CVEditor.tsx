import { useRef, useState } from "react";
import type { CV, CVSection, Locale, SectionEntry, SectionKind } from "@/domain/cv/types";
import { FONT_FAMILIES } from "@/domain/cv/types";
import { newEntry, newSection, switchLocale } from "@/domain/cv/defaults";
import { Field, SectionHeader } from "./Field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, GripVertical, ImagePlus } from "lucide-react";

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

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#111111"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-neutral-200 bg-transparent"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 border-neutral-200 shadow-none"
        />
      </div>
    </div>
  );
}

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function patchSection(sections: CVSection[], id: string, patch: Partial<CVSection>): CVSection[] {
  return sections.map((s) => (s.id === id ? { ...s, ...patch } : s));
}

function patchEntry(
  sections: CVSection[],
  sectionId: string,
  entryId: string,
  patch: Partial<SectionEntry>,
): CVSection[] {
  return sections.map((s) =>
    s.id !== sectionId
      ? s
      : { ...s, entries: s.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)) },
  );
}

export function CVEditor({ cv, update }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const setSections = (sections: CVSection[]) => update((p) => ({ ...p, sections }));

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...cv.sections];
    const from = list.findIndex((s) => s.id === dragId);
    const to = list.findIndex((s) => s.id === targetId);
    if (from < 0 || to < 0) return;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    setSections(list);
    setDragId(null);
  };

  return (
    <div className="divide-y divide-neutral-100">
      <Group title="Idioma / Language">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-3 py-2.5">
          <div>
            <div className="text-sm font-medium">Versión del CV</div>
            <div className="text-xs text-neutral-500">
              ES y EN son independientes. Al cambiar por primera vez se copia el contenido para que lo edites.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-medium ${cv.locale === "es" ? "text-foreground" : "text-neutral-400"}`}>
              ES
            </span>
            <Switch
              checked={cv.locale === "en"}
              onCheckedChange={(en) => update((p) => switchLocale(p, (en ? "en" : "es") as Locale))}
            />
            <span className={`text-xs font-medium ${cv.locale === "en" ? "text-foreground" : "text-neutral-400"}`}>
              EN
            </span>
          </div>
        </div>
      </Group>

      <Group title="Personal information">
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            className="h-16 w-16 rounded-full border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 hover:border-neutral-400"
          >
            {cv.personal.photoDataUrl && !cv.appearance.atsMode ? (
              <img src={cv.personal.photoDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-5 w-5 text-neutral-400" />
            )}
          </button>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const dataUrl = await readImage(f);
              update((p) => ({ ...p, personal: { ...p.personal, photoDataUrl: dataUrl } }));
            }}
          />
          <div className="text-xs text-neutral-500 space-y-1">
            <div>Foto de perfil (opcional)</div>
            {cv.personal.photoDataUrl && (
              <button
                type="button"
                className="underline"
                onClick={() => update((p) => ({ ...p, personal: { ...p.personal, photoDataUrl: undefined } }))}
              >
                Quitar foto
              </button>
            )}
            {cv.appearance.atsMode && (
              <div className="text-amber-700">Oculta en modo ATS</div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" value={cv.personal.fullName} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, fullName: v } }))} />
          <Field label="Title" value={cv.personal.title} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, title: v } }))} />
          <Field label="Email" value={cv.personal.email} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, email: v } }))} />
          <Field label="Phone" value={cv.personal.phone} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, phone: v } }))} />
          <Field label="City" value={cv.personal.city} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, city: v } }))} />
          <Field label="LinkedIn" value={cv.personal.linkedin} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, linkedin: v } }))} />
          <Field label="GitHub" value={cv.personal.github} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, github: v } }))} />
          <Field label="Website" value={cv.personal.website} onChange={(v) => update((p) => ({ ...p, personal: { ...p.personal, website: v } }))} />
        </div>
      </Group>

      <Group
        title="Sections"
        right={
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-xs"
              onClick={() => setSections([...cv.sections, newSection(cv.locale === "es" ? "Nueva sección" : "New section", "text")])}
            >
              <Plus className="h-3.5 w-3.5" /> Text
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-xs"
              onClick={() => setSections([...cv.sections, newSection(cv.locale === "es" ? "Nueva sección" : "New section", "entries")])}
            >
              <Plus className="h-3.5 w-3.5" /> Entries
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1 text-xs"
              onClick={() => setSections([...cv.sections, newSection(cv.locale === "es" ? "Nueva sección" : "New section", "tags")])}
            >
              <Plus className="h-3.5 w-3.5" /> Tags
            </Button>
          </div>
        }
      >
        <p className="text-xs text-neutral-500 -mt-2">Arrastrá el asa para reordenar.</p>
        {cv.sections.map((section) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => setDragId(section.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(section.id)}
            className={`rounded-lg border border-neutral-200 p-4 space-y-3 bg-white ${dragId === section.id ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-2">
              <button type="button" className="mt-2 text-neutral-400 cursor-grab active:cursor-grabbing" aria-label="Drag">
                <GripVertical className="h-4 w-4" />
              </button>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Field
                  label="Section title"
                  value={section.title}
                  onChange={(v) => setSections(patchSection(cv.sections, section.id, { title: v }))}
                />
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Type</Label>
                  <Select
                    value={section.kind}
                    onValueChange={(v) =>
                      setSections(
                        patchSection(cv.sections, section.id, {
                          kind: v as SectionKind,
                          entries: v === "entries" && !section.entries.length ? [newEntry()] : section.entries,
                        }),
                      )
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="entries">Entries (jobs, edu…)</SelectItem>
                      <SelectItem value="tags">Tags / list</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ColorField
                  label="Title color"
                  value={section.titleColor}
                  onChange={(v) => setSections(patchSection(cv.sections, section.id, { titleColor: v }))}
                />
                <ColorField
                  label="Subtitle color"
                  value={section.subtitleColor}
                  onChange={(v) => setSections(patchSection(cv.sections, section.id, { subtitleColor: v }))}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-neutral-400 hover:text-destructive"
                onClick={() => setSections(cv.sections.filter((s) => s.id !== section.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {section.kind === "text" || section.kind === "tags" ? (
              <Textarea
                value={section.body}
                onChange={(e) => setSections(patchSection(cv.sections, section.id, { body: e.target.value }))}
                className={areaCls}
                placeholder={
                  section.kind === "tags"
                    ? "One item per line, or Category: a, b, c"
                    : "Section content…"
                }
              />
            ) : (
              <div className="space-y-3">
                {section.entries.map((entry) => (
                  <div key={entry.id} className="rounded-md border border-neutral-100 p-3 space-y-2 relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-1 right-1 h-7 w-7 text-neutral-400"
                      onClick={() =>
                        setSections(
                          cv.sections.map((s) =>
                            s.id === section.id
                              ? { ...s, entries: s.entries.filter((e) => e.id !== entry.id) }
                              : s,
                          ),
                        )
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <div className="grid grid-cols-2 gap-2 pr-8">
                      <Field
                        label="Heading"
                        value={entry.heading}
                        onChange={(v) => setSections(patchEntry(cv.sections, section.id, entry.id, { heading: v }))}
                      />
                      <Field
                        label="Subheading"
                        value={entry.subheading}
                        onChange={(v) => setSections(patchEntry(cv.sections, section.id, entry.id, { subheading: v }))}
                      />
                      <div className="col-span-2">
                        <Field
                          label="Meta (dates, link…)"
                          value={entry.meta}
                          onChange={(v) => setSections(patchEntry(cv.sections, section.id, entry.id, { meta: v }))}
                        />
                      </div>
                    </div>
                    <Textarea
                      value={entry.body}
                      onChange={(e) =>
                        setSections(patchEntry(cv.sections, section.id, entry.id, { body: e.target.value }))
                      }
                      className={areaCls}
                      placeholder="Bullets or description"
                    />
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() =>
                    setSections(
                      cv.sections.map((s) =>
                        s.id === section.id ? { ...s, entries: [...s.entries, newEntry()] } : s,
                      ),
                    )
                  }
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add entry
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Label className="text-[11px] text-neutral-500">Section image</Label>
              <Input
                type="file"
                accept="image/*"
                className="h-8 text-xs"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const dataUrl = await readImage(f);
                  setSections(patchSection(cv.sections, section.id, { imageDataUrl: dataUrl }));
                }}
              />
              {section.imageDataUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => setSections(patchSection(cv.sections, section.id, { imageDataUrl: undefined }))}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </Group>

      <Group title="Appearance">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-3 py-2.5 mb-2">
          <div>
            <div className="text-sm font-medium">Modo ATS</div>
            <div className="text-xs text-neutral-500">Oculta fotos e imágenes al exportar / preview</div>
          </div>
          <Switch
            checked={cv.appearance.atsMode}
            onCheckedChange={(atsMode) => update((p) => ({ ...p, appearance: { ...p.appearance, atsMode } }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 col-span-2">
            <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
              Layout
            </Label>
            <Select
              value={cv.appearance.template === "classic" ? "classic" : "minimal"}
              onValueChange={(v) => {
                const template = v as CV["appearance"]["template"];
                update((p) => ({
                  ...p,
                  appearance: {
                    ...p.appearance,
                    template,
                    // Classic defaults to teal accent like the reference CV
                    ...(template === "classic" && p.appearance.accentColor === "#111111"
                      ? {
                          accentColor: "#3B7A8A",
                          nameColor: "#3B7A8A",
                        }
                      : {}),
                    ...(template === "minimal"
                      ? {
                          accentColor: p.appearance.accentColor === "#3B7A8A" ? "#111111" : p.appearance.accentColor,
                          nameColor: p.appearance.nameColor === "#3B7A8A" ? "#111111" : p.appearance.nameColor,
                        }
                      : {}),
                  },
                }));
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal B/N — limpio</SelectItem>
                <SelectItem value="classic">Classic — nombre + raya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Font</Label>
            <Select
              value={cv.appearance.font}
              onValueChange={(v) =>
                update((p) => ({ ...p, appearance: { ...p.appearance, font: v as CV["appearance"]["font"] } }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ColorField
            label="Accent (default)"
            value={cv.appearance.accentColor}
            onChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, accentColor: v } }))}
          />
          <ColorField
            label="Name color"
            value={cv.appearance.nameColor}
            onChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, nameColor: v } }))}
          />
          <ColorField
            label="Title / subtitle color"
            value={cv.appearance.titleColor}
            onChange={(v) => update((p) => ({ ...p, appearance: { ...p.appearance, titleColor: v } }))}
          />
          <Field
            label="Font size (pt)"
            type="number"
            value={String(cv.appearance.fontSize)}
            onChange={(v) =>
              update((p) => ({
                ...p,
                appearance: { ...p.appearance, fontSize: Math.max(9, Math.min(14, Number(v) || 11)) },
              }))
            }
          />
          <Field
            label="Line height"
            type="number"
            value={String(cv.appearance.spacing)}
            onChange={(v) =>
              update((p) => ({
                ...p,
                appearance: { ...p.appearance, spacing: Math.max(1, Math.min(2, Number(v) || 1.4)) },
              }))
            }
          />
          <Field
            label="Margin (mm)"
            type="number"
            value={String(cv.appearance.margin)}
            onChange={(v) =>
              update((p) => ({
                ...p,
                appearance: { ...p.appearance, margin: Math.max(8, Math.min(30, Number(v) || 18)) },
              }))
            }
          />
        </div>
      </Group>
    </div>
  );
}
