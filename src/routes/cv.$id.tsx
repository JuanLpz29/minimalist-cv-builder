import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Undo2, Redo2, Check } from "lucide-react";
import { useCV } from "@/hooks/useCV";
import { CVEditor } from "@/components/cv/editor/CVEditor";
import { CVPreview } from "@/components/cv/CVPreview";

export const Route = createFileRoute("/cv/$id")({ component: EditorPage });

function EditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { cv, update, loading, saving, undo, redo, canUndo, canRedo } = useCV(id);

  useEffect(() => {
    if (!loading && !cv) navigate({ to: "/" });
  }, [loading, cv, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if (mod && e.key === "p") { e.preventDefault(); window.print(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  if (loading || !cv) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-neutral-500">Loading…</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
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
          {saving ? <span>Saving…</span> : <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>}
        </div>
        <div className="flex-1" />
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

      {/* Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] overflow-hidden">
        {/* Editor pane */}
        <div className="no-print border-r border-neutral-100 overflow-y-auto">
          <div className="px-6 max-w-xl">
            <CVEditor cv={cv} update={update} />
          </div>
        </div>

        {/* Preview pane */}
        <div className="overflow-y-auto bg-neutral-100/60">
          <div className="py-10 px-6 flex justify-center">
            <div className="scale-[0.85] origin-top">
              <CVPreview cv={cv} printRoot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
