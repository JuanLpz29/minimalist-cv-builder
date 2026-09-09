import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Undo2, Redo2, Check, ZoomIn, ZoomOut, Eye, Pencil } from "lucide-react";
import { useCV } from "@/hooks/useCV";
import { CVEditor } from "@/components/cv/editor/CVEditor";
import { CVPreview } from "@/components/cv/CVPreview";

export const Route = createFileRoute("/cv/$id")({ component: EditorPage });

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

function EditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { cv, update, loading, saving, undo, redo, canUndo, canRedo } = useCV(id);
  const [zoom, setZoom] = useState(0.7);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [previewScale, setPreviewScale] = useState(0.7);

  useEffect(() => {
    const sync = () => setPreviewScale(window.innerWidth < 1024 ? Math.min(zoom, 0.52) : zoom);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [zoom]);

  useEffect(() => {
    if (!loading && !cv) navigate({ to: "/" });
  }, [loading, cv, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (mod && e.key === "p") {
        e.preventDefault();
        window.print();
      }
      if (mod && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10));
      }
      if (mod && e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10));
      }
      if (mod && e.key === "0") {
        e.preventDefault();
        setZoom(0.85);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  if (loading || !cv) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white text-sm text-neutral-500">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-white text-neutral-900 print:h-auto print:block">
      <header className="no-print flex h-14 shrink-0 items-center gap-2 border-b border-neutral-100 bg-white px-3 sm:gap-3 sm:px-4">
        <Link
          to="/"
          className="shrink-0 rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100"
          aria-label="Volver"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Input
          value={cv.title}
          onChange={(e) => update((p) => ({ ...p, title: e.target.value }))}
          className="h-8 min-w-0 flex-1 border-transparent px-2 text-sm font-medium shadow-none focus-visible:border-neutral-200 focus-visible:ring-0 sm:max-w-xs sm:flex-none sm:w-56"
          placeholder="Título del CV"
        />
        <div className="hidden items-center gap-1 text-xs text-neutral-400 sm:flex">
          {saving ? (
            <span>Guardando…</span>
          ) : (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Guardado
            </span>
          )}
        </div>
        <div className="hidden flex-1 lg:block" />

        <div className="hidden items-center gap-0.5 rounded-md border border-neutral-200 px-0.5 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10))}
            title="Alejar"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <button
            type="button"
            className="h-7 min-w-[2.75rem] px-1 text-xs tabular-nums text-neutral-600 hover:text-neutral-900"
            onClick={() => setZoom(0.85)}
            title="Restablecer zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10))}
            title="Acercar"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 sm:inline-flex"
          disabled={!canUndo}
          onClick={undo}
          title="Deshacer"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 sm:inline-flex"
          disabled={!canRedo}
          onClick={redo}
          title="Rehacer"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button className="h-8 shrink-0 gap-1.5 px-2.5 text-xs sm:px-3 sm:text-sm" onClick={() => window.print()}>
          <Download className="h-3.5 w-3.5" />
          <span className="hidden xs:inline sm:inline">PDF</span>
        </Button>
      </header>

      {/* Mobile tabs */}
      <div className="no-print flex border-b border-neutral-100 bg-white lg:hidden">
        <button
          type="button"
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium ${
            mobileTab === "edit" ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-400"
          }`}
          onClick={() => setMobileTab("edit")}
        >
          <Pencil className="h-3.5 w-3.5" /> Editar
        </button>
        <button
          type="button"
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium ${
            mobileTab === "preview" ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-400"
          }`}
          onClick={() => setMobileTab("preview")}
        >
          <Eye className="h-3.5 w-3.5" /> Vista previa
        </button>
      </div>

      <div className="grid no-print flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,480px)_1fr]">
        <div
          className={`overflow-y-auto border-r border-neutral-100 bg-white ${
            mobileTab === "edit" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <CVEditor cv={cv} update={update} />
          </div>
        </div>

        <div
          className={`overflow-auto bg-neutral-50 ${
            mobileTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex justify-center px-3 py-6 sm:px-6 sm:py-10">
            <div className="origin-top" style={{ transform: `scale(${previewScale})` }}>
              <CVPreview cv={cv} />
            </div>
          </div>
        </div>
      </div>

      {/* Fuera del layout (hidden/scale) — si no, el PDF sale en blanco */}
      <div id="print-root" className="print-only">
        <CVPreview cv={cv} />
      </div>
    </div>
  );
}
