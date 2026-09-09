import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";
import { parseCvText } from "./parseCvText";
import type { CV } from "../types";

// Vite resolves the worker as a separate asset URL.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function textFromPdf(data: ArrayBuffer): Promise<string> {
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // Reconstruct lines by Y position — closer to visual reading order than raw join.
    const items = content.items as { str: string; transform: number[] }[];
    const lines: { y: number; parts: { x: number; t: string }[] }[] = [];
    for (const it of items) {
      if (!it.str) continue;
      const x = it.transform[4];
      const y = Math.round(it.transform[5]);
      let line = lines.find((l) => Math.abs(l.y - y) <= 2);
      if (!line) {
        line = { y, parts: [] };
        lines.push(line);
      }
      line.parts.push({ x, t: it.str });
    }
    lines.sort((a, b) => b.y - a.y);
    pages.push(
      lines
        .map((l) =>
          l.parts
            .sort((a, b) => a.x - b.x)
            .map((p) => p.t)
            .join("")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean)
        .join("\n"),
    );
  }
  return pages.join("\n");
}

async function textFromDocx(data: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: data });
  return result.value;
}

export async function importCvFromFile(file: File): Promise<CV> {
  const name = file.name.replace(/\.(pdf|docx)$/i, "");
  const buf = await file.arrayBuffer();
  const lower = file.name.toLowerCase();
  let text: string;
  if (lower.endsWith(".pdf")) text = await textFromPdf(buf);
  else if (lower.endsWith(".docx")) text = await textFromDocx(buf);
  else throw new Error("Solo PDF o DOCX");
  if (!text.trim()) throw new Error("No se pudo leer texto del archivo");
  return parseCvText(text, name);
}
