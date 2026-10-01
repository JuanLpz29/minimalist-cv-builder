import { useCallback, useEffect, useRef, useState } from "react";
import type { CV } from "@/domain/cv/types";
import { localRepository } from "@/domain/cv/repository";
import { toast } from "sonner";

// Thin React-facing hook that consumes the CVRepository port.
// If we swap repositories, this file stays the same.

export function useCV(id: string | undefined) {
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const history = useRef<CV[]>([]);
  const future = useRef<CV[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    localRepository.get(id).then((c) => {
      setCV(c);
      setLoading(false);
    });
  }, [id]);

  const persist = useCallback((next: CV) => {
    if (timer.current) clearTimeout(timer.current);
    setSaving(true);
    timer.current = setTimeout(async () => {
      try {
        await localRepository.save(next);
        setSaveFailed(false);
      } catch {
        setSaveFailed(true);
        // Casi siempre es localStorage lleno (fotos o fuentes pesadas).
        toast.error(
          "No se pudo guardar: el navegador se quedó sin espacio. Quita la foto o la fuente.",
        );
      } finally {
        setSaving(false);
      }
    }, 400);
  }, []);

  const update = useCallback(
    (updater: (prev: CV) => CV) => {
      setCV((prev) => {
        if (!prev) return prev;
        history.current.push(prev);
        if (history.current.length > 50) history.current.shift();
        future.current = [];
        const next = updater(prev);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const undo = useCallback(() => {
    setCV((prev) => {
      if (!prev) return prev;
      const previous = history.current.pop();
      if (!previous) return prev;
      future.current.push(prev);
      persist(previous);
      return previous;
    });
  }, [persist]);

  const redo = useCallback(() => {
    setCV((prev) => {
      if (!prev) return prev;
      const next = future.current.pop();
      if (!next) return prev;
      history.current.push(prev);
      persist(next);
      return next;
    });
  }, [persist]);

  const canUndo = history.current.length > 0;
  const canRedo = future.current.length > 0;

  return { cv, setCV, loading, saving, saveFailed, update, undo, redo, canUndo, canRedo };
}
