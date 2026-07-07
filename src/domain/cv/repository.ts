// Storage port. UI code depends on this interface, not on localStorage.
// Swap for a REST / Supabase / FastAPI adapter without touching the app.

import type { CV, ID } from "./types";

export interface CVRepository {
  list(): Promise<CV[]>;
  get(id: ID): Promise<CV | null>;
  save(cv: CV): Promise<CV>;
  remove(id: ID): Promise<void>;
}

const KEY = "mitrilo.cvs.v1";

const read = (): Record<string, CV> => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, CV>;
  } catch {
    return {};
  }
};

const write = (data: Record<string, CV>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
};

export const localRepository: CVRepository = {
  async list() {
    return Object.values(read()).sort((a, b) => b.updatedAt - a.updatedAt);
  },
  async get(id) {
    return read()[id] ?? null;
  },
  async save(cv) {
    const all = read();
    const next: CV = { ...cv, updatedAt: Date.now() };
    all[cv.id] = next;
    write(all);
    return next;
  },
  async remove(id) {
    const all = read();
    delete all[id];
    write(all);
  },
};
