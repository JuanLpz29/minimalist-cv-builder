import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Trash2, MoreHorizontal } from "lucide-react";
import { localRepository } from "@/domain/cv/repository";
import { newCV } from "@/domain/cv/defaults";
import type { CV } from "@/domain/cv/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    localRepository.list().then(setCVs);
  }, []);

  const create = async () => {
    const cv = newCV("Untitled CV");
    await localRepository.save(cv);
    navigate({ to: "/cv/$id", params: { id: cv.id } });
  };

  const remove = async (id: string) => {
    await localRepository.remove(id);
    setCVs((prev) => prev.filter((c) => c.id !== id));
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
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your resumes</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Minimalist, ATS-friendly. Edit on the left, preview on the right.
            </p>
          </div>
          <Button onClick={create} className="h-9 gap-1.5">
            <Plus className="h-4 w-4" />
            New resume
          </Button>
        </div>

        {cvs.length === 0 ? (
          <button
            onClick={create}
            className="w-full border border-dashed border-neutral-200 rounded-xl py-20 flex flex-col items-center justify-center text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 transition-colors"
          >
            <FileText className="h-6 w-6 mb-3" strokeWidth={1.5} />
            <div className="text-sm font-medium">Create your first resume</div>
            <div className="text-xs mt-1 text-neutral-400">Takes about 5 minutes</div>
          </button>
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
    </div>
  );
}
