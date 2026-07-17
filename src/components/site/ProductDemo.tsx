import { Upload, FileDown, CheckCircle2, AlertOctagon } from "lucide-react";

const results = [
  { drug: "Meropenem", status: "Resistant", confidence: 95, color: "text-red-600", bar: "bg-red-500" },
  { drug: "Ciprofloxacin", status: "Resistant", confidence: 91, color: "text-red-600", bar: "bg-red-500" },
  { drug: "Cefotaxime", status: "Susceptible", confidence: 89, color: "text-emerald-600", bar: "bg-emerald-500" },
];

export function ProductDemo() {
  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-sm font-semibold text-primary uppercase tracking-widest">Product Demo</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              A clinician-friendly dashboard for genomic AMR prediction.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Upload a bacterial genome, receive a ranked resistance profile with confidence
              scores, and generate a downloadable clinical report — all in a browser.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {[
                "Drag-and-drop FASTA / FASTQ upload",
                "Per-antibiotic resistance & confidence",
                "PDF clinical reports",
                "Audit-ready result history",
              ].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary" /> {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-3xl" />
            <div className="relative rounded-3xl border border-border bg-card shadow-elegant overflow-hidden">
              {/* window chrome */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="ml-4 text-xs text-muted-foreground font-mono">app.bactoai.com/predict</div>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Patient ID</div>
                    <div className="font-mono text-sm font-semibold">PT-00184-KE</div>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    Analysis complete
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 flex items-center gap-4">
                  <Upload className="text-primary" size={20} />
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">isolate_A12.fasta</div>
                    <div className="text-xs text-muted-foreground">3.2 MB · WGS · Uploaded 12s ago</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Prediction Results
                  </div>
                  <div className="space-y-3">
                    {results.map((r) => (
                      <div key={r.drug} className="rounded-xl border border-border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {r.status === "Resistant" ? (
                              <AlertOctagon size={14} className={r.color} />
                            ) : (
                              <CheckCircle2 size={14} className={r.color} />
                            )}
                            <div className="text-sm font-semibold">{r.drug}</div>
                          </div>
                          <div className={`text-xs font-semibold ${r.color}`}>{r.status}</div>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${r.bar}`} style={{ width: `${r.confidence}%` }} />
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">{r.confidence}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition">
                  <FileDown size={16} /> Download Clinical PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
