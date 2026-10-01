import { useRef, useState } from "react";
import type { CV, CVSection, Locale, SectionEntry, SectionKind } from "@/domain/cv/types";
import { FONT_FAMILIES } from "@/domain/cv/types";
import { appearanceForTemplate, newEntry, newSection, switchLocale } from "@/domain/cv/defaults";
import { Field, SectionHeader } from "./Field";
import { LayoutPicker } from "../LayoutPicker";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  Plus,
  GripVertical,
  ImagePlus,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Props {
  cv: CV;
  update: (updater: (prev: CV) => CV) => void;
}

const areaCls =
  "min-h-[100px] bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none text-sm leading-relaxed";

const labelCls = "text-[11px] font-medium text-neutral-500 uppercase tracking-wide";
const summaryCls =
  "flex min-h-11 w-fit cursor-pointer list-none items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 [&::-webkit-details-marker]:hidden";

const moveBtnCls =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 md:h-8 md:w-8";

const SECTION_KINDS: [SectionKind, string][] = [
  ["text", "Texto (perfil, resumen…)"],
  ["entries", "Entradas (trabajo, estudios…)"],
  ["tags", "Etiquetas (habilidades, idiomas…)"],
];

function sectionHint(section: CVSection) {
  if (section.kind === "entries")
    return `${section.entries.length} ${section.entries.length === 1 ? "entrada" : "entradas"}`;
  return section.kind === "tags" ? "Etiquetas" : "Texto";
}

function ToggleRow({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-neutral-500">{hint}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function Group({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
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
      <Label className={labelCls}>{label}</Label>
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

function stripBulletMarkers(body: string) {
  return body
    .split("\n")
    .map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim())
    .filter(Boolean)
    .join("\n");
}

/** Editor de descripción con toggle Viñetas / Texto. */
function BodyFormatEditor({
  body,
  bodyFormat,
  onChange,
  textPlaceholder = "Párrafo libre de descripción…",
  bulletPlaceholder = "Logro o responsabilidad…",
}: {
  body: string;
  bodyFormat: "bullets" | "text";
  onChange: (next: { body?: string; bodyFormat?: "bullets" | "text" }) => void;
  textPlaceholder?: string;
  bulletPlaceholder?: string;
}) {
  const isText = bodyFormat === "text";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">
          Descripción
        </Label>
        <label className="flex min-h-10 cursor-pointer items-center gap-2">
          <span
            className={`text-xs ${isText ? "text-neutral-400" : "text-foreground font-medium"}`}
          >
            Viñetas
          </span>
          <Switch
            checked={isText}
            onCheckedChange={(toText) =>
              onChange({
                bodyFormat: toText ? "text" : "bullets",
                body: stripBulletMarkers(body),
              })
            }
          />
          <span
            className={`text-xs ${isText ? "text-foreground font-medium" : "text-neutral-400"}`}
          >
            Texto
          </span>
        </label>
      </div>

      {isText ? (
        <Textarea
          value={body}
          onChange={(e) => onChange({ body: e.target.value })}
          className={areaCls}
          placeholder={textPlaceholder}
        />
      ) : (
        <div className="space-y-1.5">
          {(body === "" ? [""] : body.split("\n")).map((line, idx, arr) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-neutral-400 text-sm shrink-0 w-3">•</span>
              <Input
                value={line.replace(/^[-•●▪◦*]+\s*/, "")}
                className="h-9 bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none text-sm"
                placeholder={bulletPlaceholder}
                onChange={(e) => {
                  const lines =
                    body === "" && arr.length === 1 ? [e.target.value] : body.split("\n");
                  lines[idx] = e.target.value;
                  onChange({ body: lines.join("\n"), bodyFormat: "bullets" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const lines = body === "" ? [""] : body.split("\n");
                    lines.splice(idx + 1, 0, "");
                    onChange({ body: lines.join("\n"), bodyFormat: "bullets" });
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-10 w-10 shrink-0 text-neutral-400 md:h-8 md:w-8"
                disabled={arr.length <= 1 && !line.trim()}
                onClick={() => {
                  const lines = body.split("\n").filter((_, i) => i !== idx);
                  onChange({ body: lines.length ? lines.join("\n") : "", bodyFormat: "bullets" });
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-10 gap-1 text-xs md:h-7"
            onClick={() => {
              const lines = body === "" ? [""] : body.split("\n");
              lines.push("");
              onChange({ body: lines.join("\n"), bodyFormat: "bullets" });
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Agregar viñeta
          </Button>
        </div>
      )}
    </div>
  );
}

export function CVEditor({ cv, update }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const setSections = (sections: CVSection[]) => update((p) => ({ ...p, sections }));
  const setPersonal = (key: keyof CV["personal"]) => (v: string) =>
    update((p) => ({ ...p, personal: { ...p.personal, [key]: v } }));
  const addSection = (kind: SectionKind) =>
    setSections([
      ...cv.sections,
      newSection("Nueva sección", kind, undefined, kind === "text" ? "bullets" : undefined),
    ]);

  const move = (index: number, delta: number) => {
    const to = index + delta;
    if (to < 0 || to >= cv.sections.length) return;
    const list = [...cv.sections];
    [list[index], list[to]] = [list[to], list[index]];
    setSections(list);
  };

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
    <Tabs defaultValue="content">
      <TabsList className="sticky top-0 z-10 mt-4 grid h-11 w-full grid-cols-2 md:h-9">
        <TabsTrigger value="content" className="h-full">
          Contenido
        </TabsTrigger>
        <TabsTrigger value="style" className="h-full">
          Estilo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="mt-0">
        <Group title="Datos personales">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              className="h-14 w-14 shrink-0 rounded-full border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 hover:border-neutral-400"
              aria-label="Foto de perfil"
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
            <div className="grid flex-1 gap-3">
              <Field
                label="Nombre completo"
                value={cv.personal.fullName}
                onChange={setPersonal("fullName")}
              />
              <Field label="Cargo" value={cv.personal.title} onChange={setPersonal("title")} />
            </div>
          </div>
          {cv.personal.photoDataUrl && (
            <div className="text-xs text-neutral-500">
              <button
                type="button"
                className="underline"
                onClick={() =>
                  update((p) => ({ ...p, personal: { ...p.personal, photoDataUrl: undefined } }))
                }
              >
                Quitar foto
              </button>
              {cv.appearance.atsMode && (
                <span className="ml-2 text-amber-700">Oculta en modo ATS</span>
              )}
            </div>
          )}
          <details className="group">
            <summary className={summaryCls}>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
              Contacto y enlaces
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Correo" value={cv.personal.email} onChange={setPersonal("email")} />
              <Field label="Teléfono" value={cv.personal.phone} onChange={setPersonal("phone")} />
              <Field label="Ciudad" value={cv.personal.city} onChange={setPersonal("city")} />
              <Field
                label="LinkedIn"
                value={cv.personal.linkedin}
                onChange={setPersonal("linkedin")}
              />
              <Field label="GitHub" value={cv.personal.github} onChange={setPersonal("github")} />
              <Field
                label="Sitio web"
                value={cv.personal.website}
                onChange={setPersonal("website")}
              />
            </div>
          </details>
        </Group>

        <Group title="Secciones">
          {cv.sections.map((section, index) => (
            <details
              key={section.id}
              draggable
              onDragStart={() => setDragId(section.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(section.id)}
              className={`group rounded-lg border border-neutral-200 bg-white ${dragId === section.id ? "opacity-60" : ""}`}
            >
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 py-1 pl-3 pr-2 [&::-webkit-details-marker]:hidden">
                <GripVertical
                  className="hidden h-4 w-4 shrink-0 cursor-grab text-neutral-300 active:cursor-grabbing md:block"
                  aria-label="Arrastrar para reordenar"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {section.title || "Sin título"}
                  </span>
                  <span className="block text-xs text-neutral-400">{sectionHint(section)}</span>
                </span>
                <button
                  type="button"
                  aria-label="Subir sección"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    move(index, -1);
                  }}
                  className={moveBtnCls}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Bajar sección"
                  disabled={index === cv.sections.length - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    move(index, 1);
                  }}
                  className={moveBtnCls}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-90" />
              </summary>

              <div className="space-y-4 border-t border-neutral-100 p-4">
                <Field
                  label="Título de sección"
                  value={section.title}
                  onChange={(v) => setSections(patchSection(cv.sections, section.id, { title: v }))}
                />

                {section.kind === "tags" ? (
                  <Textarea
                    value={section.body}
                    onChange={(e) =>
                      setSections(patchSection(cv.sections, section.id, { body: e.target.value }))
                    }
                    className={areaCls}
                    placeholder="Un ítem por línea, o Categoría: a, b, c"
                  />
                ) : section.kind === "text" ? (
                  <BodyFormatEditor
                    body={section.body}
                    bodyFormat={section.bodyFormat === "bullets" ? "bullets" : "text"}
                    textPlaceholder="Contenido de la sección…"
                    bulletPlaceholder="Punto o logro…"
                    onChange={(patch) => setSections(patchSection(cv.sections, section.id, patch))}
                  />
                ) : (
                  <div className="space-y-3">
                    {section.entries.map((entry) => (
                      <details
                        key={entry.id}
                        className="group/entry rounded-md border border-neutral-100"
                      >
                        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 [&::-webkit-details-marker]:hidden">
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform group-open/entry:rotate-90" />
                          <span className="flex-1 truncate text-sm">
                            {[entry.heading, entry.subheading].filter(Boolean).join(" · ") ||
                              "Nueva entrada"}
                          </span>
                          <span className="hidden truncate text-xs text-neutral-400 sm:inline">
                            {entry.meta}
                          </span>
                        </summary>
                        <div className="space-y-2 border-t border-neutral-100 p-3">
                          <div className="grid grid-cols-2 gap-2">
                            <Field
                              label="Título"
                              value={entry.heading}
                              onChange={(v) =>
                                setSections(
                                  patchEntry(cv.sections, section.id, entry.id, { heading: v }),
                                )
                              }
                            />
                            <Field
                              label="Subtítulo"
                              value={entry.subheading}
                              onChange={(v) =>
                                setSections(
                                  patchEntry(cv.sections, section.id, entry.id, { subheading: v }),
                                )
                              }
                            />
                            <div className="col-span-2">
                              <Field
                                label="Fechas o enlace"
                                value={entry.meta}
                                onChange={(v) =>
                                  setSections(
                                    patchEntry(cv.sections, section.id, entry.id, { meta: v }),
                                  )
                                }
                              />
                            </div>
                          </div>
                          <BodyFormatEditor
                            body={entry.body}
                            bodyFormat={entry.bodyFormat === "text" ? "text" : "bullets"}
                            onChange={(patch) =>
                              setSections(patchEntry(cv.sections, section.id, entry.id, patch))
                            }
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 gap-1 text-xs text-neutral-500 hover:text-destructive md:h-7"
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
                            <Trash2 className="h-3.5 w-3.5" /> Eliminar entrada
                          </Button>
                        </div>
                      </details>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 md:h-8"
                      onClick={() =>
                        setSections(
                          cv.sections.map((s) =>
                            s.id === section.id ? { ...s, entries: [...s.entries, newEntry()] } : s,
                          ),
                        )
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Agregar entrada
                    </Button>
                  </div>
                )}

                <details className="group/opts">
                  <summary className={summaryCls}>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-open/opts:rotate-90" />
                    Más opciones
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className={labelCls}>Tipo</Label>
                      <Select
                        value={section.kind}
                        onValueChange={(v) =>
                          setSections(
                            patchSection(cv.sections, section.id, {
                              kind: v as SectionKind,
                              entries:
                                v === "entries" && !section.entries.length
                                  ? [newEntry()]
                                  : section.entries,
                            }),
                          )
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_KINDS.map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <ColorField
                      label="Color del título"
                      value={section.titleColor}
                      onChange={(v) =>
                        setSections(patchSection(cv.sections, section.id, { titleColor: v }))
                      }
                    />
                    <ColorField
                      label="Color del subtítulo"
                      value={section.subtitleColor}
                      onChange={(v) =>
                        setSections(patchSection(cv.sections, section.id, { subtitleColor: v }))
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3 h-10 gap-1 text-xs text-neutral-500 hover:text-destructive md:h-8"
                    onClick={() => setSections(cv.sections.filter((s) => s.id !== section.id))}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Eliminar sección
                  </Button>
                </details>
              </div>
            </details>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 w-full gap-1 text-sm">
                <Plus className="h-4 w-4" /> Agregar sección
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64">
              {SECTION_KINDS.map(([value, label]) => (
                <DropdownMenuItem key={value} onSelect={() => addSection(value)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Group>
      </TabsContent>

      <TabsContent value="style" className="mt-0">
        <Group title="Diseño">
          <LayoutPicker
            value={cv.appearance.template === "classic" ? "classic" : "minimal"}
            onChange={(template) =>
              update((p) => ({
                ...p,
                appearance: appearanceForTemplate(template, p.appearance),
              }))
            }
          />
        </Group>

        <Group title="Idioma y formato">
          <ToggleRow
            title="Versión en inglés"
            hint="ES y EN se editan por separado. La primera vez se copia el contenido."
            checked={cv.locale === "en"}
            onChange={(en) => update((p) => switchLocale(p, (en ? "en" : "es") as Locale))}
          />
          <ToggleRow
            title="Modo ATS"
            hint="Oculta la foto para que los filtros automáticos lean bien el CV."
            checked={cv.appearance.atsMode}
            onChange={(atsMode) =>
              update((p) => ({ ...p, appearance: { ...p.appearance, atsMode } }))
            }
          />
        </Group>

        <Group title="Tipografía y colores">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className={labelCls}>Fuente</Label>
              <Select
                value={cv.appearance.font}
                onValueChange={(v) =>
                  update((p) => ({
                    ...p,
                    appearance: { ...p.appearance, font: v as CV["appearance"]["font"] },
                  }))
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
              label="Color de acento"
              value={cv.appearance.accentColor}
              onChange={(v) =>
                update((p) => ({ ...p, appearance: { ...p.appearance, accentColor: v } }))
              }
            />
            <ColorField
              label="Color del nombre"
              value={cv.appearance.nameColor}
              onChange={(v) =>
                update((p) => ({ ...p, appearance: { ...p.appearance, nameColor: v } }))
              }
            />
            <ColorField
              label="Color del cargo"
              value={cv.appearance.titleColor}
              onChange={(v) =>
                update((p) => ({ ...p, appearance: { ...p.appearance, titleColor: v } }))
              }
            />
          </div>
          <details className="group">
            <summary className={summaryCls}>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
              Tamaño, interlineado y márgenes
            </summary>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Field
                label="Tamaño (pt)"
                type="number"
                value={String(cv.appearance.fontSize)}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    appearance: {
                      ...p.appearance,
                      fontSize: Math.max(9, Math.min(14, Number(v) || 11)),
                    },
                  }))
                }
              />
              <Field
                label="Interlineado"
                type="number"
                value={String(cv.appearance.spacing)}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    appearance: {
                      ...p.appearance,
                      spacing: Math.max(1, Math.min(2, Number(v) || 1.5)),
                    },
                  }))
                }
              />
              <Field
                label="Margen (mm)"
                type="number"
                value={String(cv.appearance.margin)}
                onChange={(v) =>
                  update((p) => ({
                    ...p,
                    appearance: {
                      ...p.appearance,
                      margin: Math.max(12, Math.min(32, Number(v) || 20)),
                    },
                  }))
                }
              />
            </div>
          </details>
        </Group>
      </TabsContent>
    </Tabs>
  );
}
