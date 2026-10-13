import logo from "@/assets/bactoai-logo-wordmark.png.asset.json";
import { RESEARCH_DISCLAIMER, type PresentedResult } from "./result-presentation";

/** Browser-only export; deliberately excludes patient/sample metadata. */
export async function downloadResultsReport(results: PresentedResult[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const response = await fetch(logo.url);
  if (!response.ok) throw new Error("Could not load the report logo");
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the report logo");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const image = canvas.toDataURL("image/png");
  const styles = getComputedStyle(document.documentElement);
  const color = (token: string) => styles.getPropertyValue(token).trim();
  const generated = new Date().toISOString();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const width = pageWidth - margin * 2;
  let y = 49;

  const pageBackground = () => {
    doc.setFillColor(color("--background"));
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    const w = Math.min(pageWidth * 0.72, (pageHeight * 0.7 * canvas.width) / canvas.height);
    const h = (w * canvas.height) / canvas.width;
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.07 }));
    doc.addImage(image, "PNG", (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
    doc.restoreGraphicsState();
    doc.addImage(image, "PNG", margin, 14, 38, (38 * canvas.height) / canvas.width);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(color("--muted-foreground"));
    doc.text("RESEARCH USE ONLY", pageWidth - margin, 21, { align: "right" });
    doc.setFontSize(17);
    doc.setTextColor(color("--foreground"));
    doc.text("Antimicrobial resistance results", margin, 35);
    doc.setFontSize(8);
    doc.setTextColor(color("--muted-foreground"));
    doc.text(`Report generated: ${generated}`, margin, 42);
  };
  pageBackground();
  doc.internal.events.subscribe("addPage", pageBackground);
  const ensureSpace = (height: number) => {
    if (y + height > 270) {
      doc.addPage();
      y = 49;
    }
  };
  const text = (value: string, size: number, token: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(value, width) as string[];
    for (const line of lines) {
      ensureSpace(6);
      // A new page resets graphics state in the header; restore each line's style.
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(color(token));
      doc.text(line, margin, y);
      y += 6;
    }
  };
  for (const row of results) {
    ensureSpace(30);
    doc.setDrawColor(color("--border"));
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    text(row.drug, 12, "--foreground", true);
    text(
      `Prediction: ${row.status}`,
      10,
      row.status === "Resistant"
        ? "--resistant"
        : row.status === "Susceptible"
          ? "--susceptible"
          : "--primary-text",
    );
    if (row.probability !== undefined)
      text(`Resistance probability: ${row.probability}%`, 10, "--foreground");
    if (row.interval)
      text(
        `95% probability interval: ${row.interval.lower}% to ${row.interval.upper}%`,
        9,
        "--muted-foreground",
      );
    if (row.recommendation)
      text(`Model recommendation: ${row.recommendation}`, 9, "--muted-foreground");
    y += 5;
  }
  ensureSpace(35);
  y += 7;
  text("Research-use disclaimer", 10, "--foreground", true);
  text(RESEARCH_DISCLAIMER, 9, "--muted-foreground");
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(color("--muted-foreground"));
    doc.text(`BactoAI | ${page} / ${pages}`, pageWidth - margin, 285, { align: "right" });
  }
  doc.save(`bactoai-results-${generated.slice(0, 10)}.pdf`);
}
