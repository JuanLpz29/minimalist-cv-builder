import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MoreHorizontal, Upload } from "lucide-react";
import { localRepository } from "@/domain/cv/repository";
import { appearanceForTemplate, EXAMPLE_CV_ID, exampleCV, newCV } from "@/domain/cv/defaults";
import { importCvFromFile } from "@/domain/cv/import/fromFile";
import type { CV, TemplateId } from "@/domain/cv/types";
import { LayoutPicker } from "@/components/cv/LayoutPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Dashboard });

const EXAMPLE_DELETED_KEY = "mitrilo.example.deleted";

async function loadCVs(): Promise<CV[]> {
  const list = await localRepository.list();
  if (list.some((c) => c.id === EXAMPLE_CV_ID)) return list;
  if (typeof window !== "undefined" && window.localStorage.getItem(EXAMPLE_DELETED_KEY)) {
    return list;
  }
  await localRepository.save(exampleCV());
  return localRepository.list();
}

function Dashboard() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [importing, setImporting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [pickedLayout, setPickedLayout] = useState<TemplateId>("minimal");
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCVs().then(setCVs);
  }, []);

  const create = async (template: TemplateId) => {
    const cv = newCV("CV sin título", "es", template);
    await localRepository.save(cv);
    setCreateOpen(false);
    navigate({ to: "/cv/$id", params: { id: cv.id } });
  };

  const remove = async (id: string) => {
    await localRepository.remove(id);
    if (id === EXAMPLE_CV_ID) window.localStorage.setItem(EXAMPLE_DELETED_KEY, "1");
    setCVs((prev) => prev.filter((c) => c.id !== id));
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setImporting(true);
    try {
      const cv = await importCvFromFile(file);
      cv.appearance = appearanceForTemplate(cv.appearance.template ?? "minimal", cv.appearance);
      await localRepository.save(cv);
      toast.success("CV importado — revisá los campos y ajustá lo que falte");
      navigate({ to: "/cv/$id", params: { id: cv.id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "No se pudo importar el archivo");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const openCreate = () => {
    setPickedLayout("minimal");
    setCreateOpen(true);
  };

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-neutral-900" />
            <span className="text-sm font-semibold tracking-tight">Mitrilo</span>
            <span className="text-sm text-neutral-400">/ CVs</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Tus currículums</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Abrí el ejemplo y reemplazá el texto, o importá / creá uno nuevo.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => onImport(e.target.files?.[0])}
            />
            <Button
              variant="outline"
              className="h-10 w-full gap-1.5 sm:h-9 sm:w-auto"
              disabled={importing}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {importing ? "Importando…" : "Importar PDF/DOCX"}
            </Button>
            <Button onClick={openCreate} className="h-10 w-full gap-1.5 sm:h-9 sm:w-auto">
              <Plus className="h-4 w-4" />
              Nuevo CV
            </Button>
          </div>
        </div>

        <ul className="divide-y divide-neutral-100 border-y border-neutral-100">
          {cvs.map((cv) => (
            <li key={cv.id} className="group flex items-center justify-between gap-2 py-4">
              <Link
                to="/cv/$id"
                params={{ id: cv.id }}
                className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
              >
                <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-sm border border-neutral-200 bg-white">
                  <div className="h-1 w-4 rounded-full bg-neutral-300" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{cv.title}</div>
                  <div className="truncate text-xs text-neutral-500">
                    {cv.appearance.template === "classic" ? "Clásico" : "Minimal"} ·{" "}
                    {cv.personal.fullName || "Sin nombre"}
                    {cv.personal.title ? ` · ${cv.personal.title}` : ""} · Editado{" "}
                    {new Date(cv.updatedAt).toLocaleDateString("es-CL")}
                  </div>
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-neutral-500 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => remove(cv.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="mx-4 max-w-[calc(100vw-2rem)] bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Elegí el diseño</DialogTitle>
            <DialogDescription>
              CV en blanco. El diseño lo podés cambiar después en el editor.
            </DialogDescription>
          </DialogHeader>
          <LayoutPicker value={pickedLayout} onChange={setPickedLayout} />
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
            <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => create(pickedLayout)}>
              Crear CV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
