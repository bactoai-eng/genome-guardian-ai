import { useEffect, useRef, useState } from "react";
import { Upload, FileDown, CheckCircle2, AlertOctagon, RotateCcw, Sparkles } from "lucide-react";

type Result = { drug: string; status: "Resistant" | "Susceptible"; confidence: number };

const sampleA: Result[] = [
  { drug: "Meropenem", status: "Resistant", confidence: 95 },
  { drug: "Ciprofloxacin", status: "Resistant", confidence: 91 },
  { drug: "Cefotaxime", status: "Susceptible", confidence: 89 },
  { drug: "Gentamicin", status: "Susceptible", confidence: 84 },
  { drug: "Tetracycline", status: "Resistant", confidence: 78 },
  { drug: "Ampicillin", status: "Resistant", confidence: 97 },
];
const sampleB: Result[] = [
  { drug: "Meropenem", status: "Susceptible", confidence: 92 },
  { drug: "Ciprofloxacin", status: "Susceptible", confidence: 88 },
  { drug: "Cefotaxime", status: "Susceptible", confidence: 94 },
  { drug: "Gentamicin", status: "Resistant", confidence: 81 },
  { drug: "Tetracycline", status: "Susceptible", confidence: 90 },
  { drug: "Ampicillin", status: "Resistant", confidence: 86 },
];

type Phase = "idle" | "uploading" | "analyzing" | "done";

export function ProductDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [sample, setSample] = useState<"A" | "B">("A");
  const timerRef = useRef<number | null>(null);

  const results = sample === "A" ? sampleA : sampleB;

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  const start = () => {
    setPhase("uploading");
    setProgress(0);
    let p = 0;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      p += 4 + Math.random() * 6;
      if (p >= 55 && phase !== "analyzing") {
        setPhase("analyzing");
      }
      if (p >= 100) {
        p = 100;
        setProgress(100);
        setPhase("done");
        if (timerRef.current) window.clearInterval(timerRef.current);
      } else {
        setProgress(p);
      }
    }, 140);
  };

  const reset = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setPhase("idle");
    setProgress(0);
  };

  const switchSample = (which: "A" | "B") => {
    setSample(which);
    reset();
  };

  return (
    <section id="demo" className="py-24 md:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] items-start">
          <div className="lg:sticky lg:top-28">
            <div className="text-sm font-semibold text-primary uppercase tracking-widest">Live Product Demo</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Try it yourself. Watch a genome become a treatment recommendation.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Click <em>Analyze sample</em> to simulate the BactoAI workflow — upload,
              pre-processing, model inference, and clinician-ready report.
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

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2">Sample isolate:</span>
              {(["A", "B"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => switchSample(s)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    sample === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  Isolate {s === "A" ? "A12 · K. pneumoniae" : "B07 · E. coli"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-3xl" />
            <div className="relative rounded-3xl border border-border bg-card shadow-elegant overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="ml-4 text-xs text-muted-foreground font-mono">app.bactoai.com/predict</div>
                <div className="ml-auto flex items-center gap-2">
                  {phase !== "idle" && (
                    <button onClick={reset} title="Reset" className="text-muted-foreground hover:text-foreground transition">
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-5 min-h-[520px]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Patient ID</div>
                    <div className="font-mono text-sm font-semibold">
                      PT-{sample === "A" ? "00184" : "00219"}-KE
                    </div>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    phase === "done"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : phase === "idle"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {phase === "idle" && "Ready"}
                    {phase === "uploading" && "Uploading…"}
                    {phase === "analyzing" && "Analyzing genome…"}
                    {phase === "done" && "Analysis complete"}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5">
                  <div className="flex items-center gap-4">
                    <Upload className="text-primary" size={22} />
                    <div className="text-sm flex-1">
                      <div className="font-semibold text-foreground">
                        isolate_{sample === "A" ? "A12" : "B07"}.fasta
                      </div>
                      <div className="text-xs text-muted-foreground">
                        3.2 MB · WGS · {phase === "idle" ? "Ready to analyze" : phase === "done" ? "Analyzed" : "In progress"}
                      </div>
                    </div>
                    {phase === "idle" ? (
                      <button
                        onClick={start}
                        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95 transition inline-flex items-center gap-1.5"
                      >
                        <Sparkles size={12} /> Analyze sample
                      </button>
                    ) : (
                      <div className="text-xs font-mono text-muted-foreground">{Math.round(progress)}%</div>
                    )}
                  </div>
                  {phase !== "idle" && (
                    <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-hero transition-[width] duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {phase === "done" && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Prediction Results
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {results.map((r, i) => {
                        const isR = r.status === "Resistant";
                        return (
                          <div
                            key={r.drug}
                            className="rounded-xl border border-border p-4 animate-fade-up"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isR ? (
                                  <AlertOctagon size={14} className="text-red-500" />
                                ) : (
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                )}
                                <div className="text-sm font-semibold">{r.drug}</div>
                              </div>
                              <div className={`text-[11px] font-semibold ${isR ? "text-red-600" : "text-emerald-600"}`}>
                                {r.status}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${isR ? "bg-red-500" : "bg-emerald-500"}`}
                                  style={{
                                    width: `${r.confidence}%`,
                                    animation: `bar-fill 900ms cubic-bezier(.2,.9,.3,1.2) ${i * 60 + 100}ms both`,
                                  }}
                                />
                              </div>
                              <div className="text-xs font-mono text-muted-foreground">{r.confidence}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 transition">
                      <FileDown size={16} /> Download Clinical PDF
                    </button>
                  </div>
                )}

                {phase === "idle" && (
                  <div className="rounded-xl border border-dashed border-border/70 p-5 text-center text-sm text-muted-foreground">
                    Results will appear here after analysis. Toggle isolates to see different genomic profiles.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
