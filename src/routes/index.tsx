import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, MoreHorizontal, Upload } from "lucide-react";
import { localRepository } from "@/domain/cv/repository";
import { appearanceForTemplate, newCV } from "@/domain/cv/defaults";
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

function Dashboard() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [importing, setImporting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [pickedLayout, setPickedLayout] = useState<TemplateId>("minimal");
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localRepository.list().then(setCVs);
  }, []);

  const create = async (template: TemplateId) => {
    const cv = newCV("Untitled CV", "es", template);
    await localRepository.save(cv);
    setCreateOpen(false);
    navigate({ to: "/cv/$id", params: { id: cv.id } });
  };

  const remove = async (id: string) => {
    await localRepository.remove(id);
    setCVs((prev) => prev.filter((c) => c.id !== id));
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setImporting(true);
    try {
      const cv = await importCvFromFile(file);
      // Keep imported content; ask layout via quick toast defaults to classic-friendly if teal-ish later
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-foreground" />
            <span className="text-sm font-semibold tracking-tight">Mitrilo</span>
            <span className="text-sm text-neutral-400">/ Resumes</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your resumes</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Importá un PDF/DOCX, editá los campos y exportá de nuevo a PDF.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => onImport(e.target.files?.[0])}
            />
            <Button
              variant="outline"
              className="h-9 gap-1.5"
              disabled={importing}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {importing ? "Importando…" : "Import PDF/DOCX"}
            </Button>
            <Button onClick={openCreate} className="h-9 gap-1.5">
              <Plus className="h-4 w-4" />
              New resume
            </Button>
          </div>
        </div>

        {cvs.length === 0 ? (
          <div className="w-full border border-dashed border-neutral-200 rounded-xl py-20 flex flex-col items-center justify-center text-neutral-500">
            <FileText className="h-6 w-6 mb-3" strokeWidth={1.5} />
            <div className="text-sm font-medium">Todavía no hay resumes</div>
            <div className="text-xs mt-1 text-neutral-400 mb-4">Importá tu CV o empezá en blanco</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={importing} onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Import PDF/DOCX
              </Button>
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New resume
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100 border-y border-neutral-100">
            {cvs.map((cv) => (
              <li key={cv.id} className="group flex items-center justify-between py-4">
                <Link
                  to="/cv/$id"
                  params={{ id: cv.id }}
                  className="flex-1 flex items-center gap-4 min-w-0"
                >
                  <div className="h-10 w-8 rounded-sm border border-neutral-200 bg-white flex items-center justify-center">
                    <div className="h-1 w-4 bg-neutral-300 rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {cv.personal.fullName || cv.title}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                      {cv.appearance.template === "classic" ? "Classic" : "Minimal"} ·{" "}
                      {cv.personal.title || "No title"} · Edited{" "}
                      {new Date(cv.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => remove(cv.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Elegí el layout</DialogTitle>
            <DialogDescription>
              Podés cambiarlo después en el editor. Esto solo define el punto de partida.
            </DialogDescription>
          </DialogHeader>
          <LayoutPicker value={pickedLayout} onChange={setPickedLayout} />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => create(pickedLayout)}>Crear resume</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
