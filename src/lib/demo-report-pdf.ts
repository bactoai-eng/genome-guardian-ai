import logo from "@/assets/bactoai-logo-wordmark.png.asset.json";

type Row = { drug: string; status: string; confidence: number };

async function loadLogo(): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch(logo.url);
    const blob = await res.blob();
    const data: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const dims: { w: number; h: number } = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 4, h: 1 });
      img.src = data;
    });
    return { data, ...dims };
  } catch {
    return null;
  }
}

/** Builds a research-use PDF in the browser. Never includes patient identifiers. */
export async function downloadDemoReport(input: {
  isolate: string;
  organism: string;
  format: string;
  results: Row[];
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 18;
  const img = await loadLogo();
  const addWatermark = () => {
    if (!img) return;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const w = Math.min(pageWidth * 0.72, (pageHeight * 0.7 * img.w) / img.h);
    const h = (w * img.h) / img.w;
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.07 }));
    doc.addImage(img.data, "PNG", (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
    doc.restoreGraphicsState();
  };
  // Draw first on each page so all report text remains above the watermark.
  addWatermark();
  doc.internal.events.subscribe("addPage", addWatermark);
  if (img) {
    const w = 45;
    doc.addImage(img.data, "PNG", 15, y - 6, w, (w * img.h) / img.w);
    y += (w * img.h) / img.w + 4;
  } else {
    doc.setFontSize(18);
    doc.text("BactoAI", 15, y);
    y += 10;
  }
  doc.setFontSize(15);
  doc.text("AMR prediction report (demonstration)", 15, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 15, y);
  y += 10;
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(`Isolate: ${input.isolate}`, 15, y);
  doc.text(`Organism: ${input.organism}`, 15, y + 6);
  doc.text(`Input format: ${input.format}`, 15, y + 12);
  y += 24;
  doc.setFont("helvetica", "bold");
  doc.text("Antibiotic", 15, y);
  doc.text("Prediction", 90, y);
  doc.text("Confidence", 150, y);
  doc.setFont("helvetica", "normal");
  doc.line(15, y + 2, 195, y + 2);
  y += 9;
  for (const r of input.results) {
    if (y > 265) {
      doc.addPage();
      y = 22;
    }
    doc.text(r.drug, 15, y);
    doc.text(r.status, 90, y);
    doc.text(`${r.confidence}%`, 150, y);
    y += 8;
  }
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(90);
  const disclaimer =
    "Research-use demonstration. Predictions support, and do not replace, laboratory testing and clinical judgment. Do not upload identifiable patient data. Uploaded files are not stored.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, 180);
  if (y + disclaimerLines.length * 4 > 282) {
    doc.addPage();
    y = 22;
  }
  doc.text(disclaimerLines, 15, y);
  doc.save(`bactoai-report-${input.isolate.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
