import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Undo2, Redo2, Check, ZoomIn, ZoomOut } from "lucide-react";
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
  const [zoom, setZoom] = useState(0.85);

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
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="no-print border-b border-neutral-100 h-14 flex items-center px-4 gap-3 shrink-0">
        <Link to="/" className="p-1.5 -ml-1.5 rounded-md hover:bg-neutral-100 text-neutral-600">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Input
          value={cv.title}
          onChange={(e) => update((p) => ({ ...p, title: e.target.value }))}
          className="h-8 w-64 border-transparent shadow-none focus-visible:border-neutral-200 focus-visible:ring-0 text-sm font-medium px-2"
        />
        <div className="flex items-center gap-1 ml-2 text-xs text-neutral-400">
          {saving ? (
            <span>Saving…</span>
          ) : (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-0.5 mr-1 rounded-md border border-neutral-200 px-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={zoom <= ZOOM_MIN}
            onClick={() =>
              setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10))
            }
            title="Alejar (⌘-)"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <button
            type="button"
            className="h-7 min-w-[3rem] px-1 text-xs tabular-nums text-neutral-600 hover:text-foreground"
            onClick={() => setZoom(0.85)}
            title="Restablecer zoom (⌘0)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={zoom >= ZOOM_MAX}
            onClick={() =>
              setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10))
            }
            title="Acercar (⌘+)"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canUndo} onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canRedo} onClick={redo}>
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button className="h-8 gap-1.5" onClick={() => window.print()}>
          <Download className="h-3.5 w-3.5" />
          Generate PDF
        </Button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] overflow-hidden">
        <div className="no-print border-r border-neutral-100 overflow-y-auto">
          <div className="px-6 max-w-xl">
            <CVEditor cv={cv} update={update} />
          </div>
        </div>

        <div className="overflow-auto bg-neutral-100/60">
          <div className="py-10 px-6 flex justify-center">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
              <CVPreview cv={cv} printRoot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
