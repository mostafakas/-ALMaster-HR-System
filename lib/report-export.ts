"use client";

/**
 * Report export helpers — wraps html-to-image + jsPDF behind a single API.
 *
 * All exporters take a DOM node (typically the `printRef` of the report
 * surface) plus a base filename, and trigger a browser download. They are
 * client-only because they touch `document` and the canvas APIs.
 */
import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

export type ExportFormat = "png" | "jpeg" | "pdf" | "json" | "csv";

interface ExportOptions {
  filename: string;
  /** Pixel ratio for raster outputs. Higher = sharper, larger file. */
  pixelRatio?: number;
  /** Background color baked into raster outputs. */
  backgroundColor?: string;
}

const DEFAULTS = {
  pixelRatio: 2,
  backgroundColor: "#F8FAFC",
};

/**
 * Trigger a browser download for an in-memory blob/string.
 * Works in modern browsers without any framework-specific APIs.
 */
function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Produce a PNG of the node and download it. */
export async function exportNodeToPng(
  node: HTMLElement,
  { filename, pixelRatio, backgroundColor }: ExportOptions,
) {
  const dataUrl = await toPng(node, {
    pixelRatio: pixelRatio ?? DEFAULTS.pixelRatio,
    backgroundColor: backgroundColor ?? DEFAULTS.backgroundColor,
    cacheBust: true,
  });
  triggerDownload(dataUrl, ensureExt(filename, "png"));
}

/** Produce a JPEG of the node and download it. */
export async function exportNodeToJpeg(
  node: HTMLElement,
  { filename, pixelRatio, backgroundColor }: ExportOptions,
) {
  const dataUrl = await toJpeg(node, {
    pixelRatio: pixelRatio ?? DEFAULTS.pixelRatio,
    backgroundColor: backgroundColor ?? DEFAULTS.backgroundColor,
    quality: 0.92,
    cacheBust: true,
  });
  triggerDownload(dataUrl, ensureExt(filename, "jpg"));
}

/**
 * Rasterize the node, then embed it into a single-page PDF sized to the
 * captured aspect ratio. Using a raster step (vs. jsPDF's `html()`) keeps
 * output identical to the on-screen design — no CSS gaps, no font fallback.
 */
export async function exportNodeToPdf(
  node: HTMLElement,
  { filename, pixelRatio, backgroundColor }: ExportOptions,
) {
  const dataUrl = await toPng(node, {
    pixelRatio: pixelRatio ?? DEFAULTS.pixelRatio,
    backgroundColor: backgroundColor ?? DEFAULTS.backgroundColor,
    cacheBust: true,
  });

  // Decode to learn intrinsic pixel dimensions.
  const img = await loadImage(dataUrl);
  const ratio = img.width / img.height;

  // Use A4 portrait if portrait-shaped, A4 landscape otherwise.
  const isPortrait = ratio < 1;
  const pdf = new jsPDF({
    orientation: isPortrait ? "portrait" : "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  // Fit-contain the image into the page with 24pt margin.
  const margin = 24;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  let drawW = maxW;
  let drawH = drawW / ratio;
  if (drawH > maxH) {
    drawH = maxH;
    drawW = drawH * ratio;
  }
  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;
  pdf.addImage(dataUrl, "PNG", x, y, drawW, drawH);
  pdf.save(ensureExt(filename, "pdf"));
}

/** Serialize the report data structure as a JSON file (for analytics handoff). */
export function exportDataToJson<T>(data: T, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const href = URL.createObjectURL(blob);
  try {
    triggerDownload(href, ensureExt(filename, "json"));
  } finally {
    // Defer revoke so Chrome can fetch the blob first.
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
}

/**
 * Lay multiple section-tables out side-by-side in a single sheet.
 *
 * Each section is a 2D `rows × cols` table; sections may have different
 * row counts and column counts. The output is a single 2D table where
 * row `r` is the concatenation of `section[i][r]` (padded to that
 * section's max width) for every section, separated by `gapCols` empty
 * columns. Sections with fewer rows are blank-padded down so columns
 * align across the whole sheet.
 *
 * Example, two sections placed with gapCols=1:
 *
 *   Section A (3×2)        Section B (2×3)
 *   [a1][a2]               [b1][b2][b3]
 *   [a3][a4]               [b4][b5][b6]
 *   [a5][a6]
 *
 *   Result (3 × (2 + 1 + 3) = 3×6):
 *   [a1][a2][ ][b1][b2][b3]
 *   [a3][a4][ ][b4][b5][b6]
 *   [a5][a6][ ][  ][  ][  ]
 */
export function placeSectionsHorizontally(
  sections: ReadonlyArray<ReadonlyArray<ReadonlyArray<unknown>>>,
  gapCols = 1,
): Array<Array<unknown>> {
  if (sections.length === 0) return [];

  // Per-section dimensions
  const widths = sections.map((s) =>
    s.reduce((max, row) => Math.max(max, row.length), 0),
  );
  const heights = sections.map((s) => s.length);
  const maxRows = Math.max(...heights);

  const out: Array<Array<unknown>> = [];
  for (let r = 0; r < maxRows; r++) {
    const row: unknown[] = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const w = widths[i];
      const sourceRow = section[r];
      // Pad each cell of this section's row to its declared width.
      for (let c = 0; c < w; c++) {
        row.push(sourceRow ? (sourceRow[c] ?? "") : "");
      }
      // Spacer columns between sections.
      if (i < sections.length - 1) {
        for (let g = 0; g < gapCols; g++) row.push("");
      }
    }
    out.push(row);
  }
  return out;
}

/**
 * Convert a 2D array of cells into a single CSV string.
 *
 * Produces an Excel-friendly file:
 *  - CRLF line endings (Excel's preferred separator)
 *  - Fields containing comma / quote / newline are wrapped in double quotes
 *    with embedded quotes doubled (RFC 4180)
 *  - `null` / `undefined` serialize as empty strings
 *
 * The caller controls layout — multiple "sections" can share one file by
 * including blank rows or label rows in the array.
 */
export function buildCsv(rows: ReadonlyArray<ReadonlyArray<unknown>>): string {
  const escapeCell = (raw: unknown): string => {
    if (raw === null || raw === undefined) return "";
    const s =
      raw instanceof Date
        ? raw.toISOString()
        : typeof raw === "number" || typeof raw === "boolean"
          ? String(raw)
          : String(raw);
    // Quote when the field contains special chars; double internal quotes.
    if (/[",\r\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  return rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
}

/**
 * Download an array-of-rows as a `.csv` file. Prepends a UTF-8 BOM so Excel
 * detects encoding correctly (without it, accented characters and
 * non-ASCII names render as mojibake when opened on Windows Excel).
 */
export function exportRowsToCsv(
  rows: ReadonlyArray<ReadonlyArray<unknown>>,
  filename: string,
) {
  const csv = buildCsv(rows);
  // The BOM (\uFEFF) tells Excel "this is UTF-8". Without it, Excel on
  // Windows assumes the system codepage and mangles non-ASCII characters.
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8",
  });
  const href = URL.createObjectURL(blob);
  try {
    triggerDownload(href, ensureExt(filename, "csv"));
  } finally {
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
}

function ensureExt(name: string, ext: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith("." + ext)) return name;
  return `${name}.${ext}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
