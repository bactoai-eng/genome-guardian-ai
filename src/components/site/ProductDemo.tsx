import { useEffect, useRef, useState } from "react";
import { Upload, FileDown, CheckCircle2, AlertOctagon, RotateCcw, Sparkles, FlaskConical } from "lucide-react";

type Result = { drug: string; status: "Resistant" | "Susceptible"; confidence: number };

type Sample = {
  id: string;
  isolate: string;
  organism: string;
  source: string;
  format: "FASTA" | "FASTQ";
  size: string;
  patientId: string;
  file: string;
  results: Result[];
};

const samples: Sample[] = [
  {
    id: "A12",
    isolate: "Isolate A12",
    organism: "K. pneumoniae",
    source: "Blood culture",
    format: "FASTA",
    size: "3.2 MB",
    patientId: "PT-00184-KE",
    file: "isolate_A12.fasta",
    results: [
      { drug: "Meropenem", status: "Resistant", confidence: 95 },
      { drug: "Ciprofloxacin", status: "Resistant", confidence: 91 },
      { drug: "Cefotaxime", status: "Susceptible", confidence: 89 },
      { drug: "Gentamicin", status: "Susceptible", confidence: 84 },
      { drug: "Tetracycline", status: "Resistant", confidence: 78 },
      { drug: "Ampicillin", status: "Resistant", confidence: 97 },
    ],
  },
  {
    id: "B07",
    isolate: "Isolate B07",
    organism: "E. coli",
    source: "Urine culture",
    format: "FASTQ",
    size: "5.8 MB",
    patientId: "PT-00219-KE",
    file: "isolate_B07.fastq",
    results: [
      { drug: "Meropenem", status: "Susceptible", confidence: 92 },
      { drug: "Ciprofloxacin", status: "Susceptible", confidence: 88 },
      { drug: "Cefotaxime", status: "Susceptible", confidence: 94 },
      { drug: "Gentamicin", status: "Resistant", confidence: 81 },
      { drug: "Tetracycline", status: "Susceptible", confidence: 90 },
      { drug: "Ampicillin", status: "Resistant", confidence: 86 },
    ],
  },
  {
    id: "C21",
    isolate: "Isolate C21",
    organism: "S. aureus",
    source: "Wound swab",
    format: "FASTA",
    size: "2.7 MB",
    patientId: "PT-00256-KE",
    file: "isolate_C21.fasta",
    results: [
      { drug: "Meropenem", status: "Resistant", confidence: 87 },
      { drug: "Ciprofloxacin", status: "Resistant", confidence: 83 },
      { drug: "Cefotaxime", status: "Resistant", confidence: 90 },
      { drug: "Gentamicin", status: "Susceptible", confidence: 79 },
      { drug: "Tetracycline", status: "Susceptible", confidence: 85 },
      { drug: "Ampicillin", status: "Resistant", confidence: 96 },
    ],
  },
  {
    id: "D34",
    isolate: "Isolate D34",
    organism: "P. aeruginosa",
    source: "Sputum / respiratory",
    format: "FASTQ",
    size: "6.4 MB",
    patientId: "PT-00301-KE",
    file: "isolate_D34.fastq",
    results: [
      { drug: "Meropenem", status: "Resistant", confidence: 93 },
      { drug: "Ciprofloxacin", status: "Susceptible", confidence: 82 },
      { drug: "Cefotaxime", status: "Resistant", confidence: 88 },
      { drug: "Gentamicin", status: "Resistant", confidence: 76 },
      { drug: "Tetracycline", status: "Resistant", confidence: 91 },
      { drug: "Ampicillin", status: "Resistant", confidence: 98 },
    ],
  },
];

type Phase = "idle" | "uploading" | "analyzing" | "done";

export function ProductDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [selectedId, setSelectedId] = useState(samples[0].id);
  const timerRef = useRef<number | null>(null);

  const sample = samples.find((s) => s.id === selectedId) ?? samples[0];
  const results = sample.results;

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  const start = () => {
    setPhase("uploading");
    setProgress(0);
    let p = 0;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      p += 4 + Math.random() * 6;
      if (p >= 55) setPhase("analyzing");
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

  const selectSample = (id: string) => {
    setSelectedId(id);
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
              Pick a sample isolate, then click <em>Analyze sample</em> to simulate the BactoAI
              workflow — upload, pre-processing, model inference, and clinician-ready report.
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

          <div className="space-y-8">
            {/* Step 1 — Sample selection */}
            <div id="sample-selection">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <h3 className="text-xl font-bold text-foreground">Select a sample to analyze</h3>
              </div>
              <p className="mt-2 ml-10 text-sm text-muted-foreground">
                Four de-identified bacterial whole-genome samples from our validation set.
              </p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {samples.map((s) => {
                  const active = s.id === selectedId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => selectSample(s.id)}
                      aria-pressed={active}
                      className={`text-left rounded-2xl border p-4 transition ${
                        active
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FlaskConical size={15} className={active ? "text-primary" : "text-muted-foreground"} />
                          <span className="text-sm font-semibold text-foreground">{s.isolate}</span>
                        </div>
                        {active && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm italic text-foreground/80">{s.organism}</div>
                      <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between gap-2">
                          <dt>Source</dt>
                          <dd className="text-foreground/70">{s.source}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Format</dt>
                          <dd className="font-mono text-foreground/70">{s.format}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>File size</dt>
                          <dd className="font-mono text-foreground/70">{s.size}</dd>
                        </div>
                      </dl>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 — Run analysis */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <h3 className="text-xl font-bold text-foreground">Run the prediction</h3>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-primary opacity-10 blur-3xl rounded-3xl" />
                <div className="relative rounded-3xl border border-border bg-card shadow-elegant overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-susceptible/60" />
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
                        <div className="font-mono text-sm font-semibold">{sample.patientId}</div>
                      </div>
                      <div className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        phase === "done"
                          ? "bg-susceptible/10 text-susceptible"
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
                          <div className="font-semibold text-foreground">{sample.file}</div>
                          <div className="text-xs text-muted-foreground">
                            {sample.size} · WGS · {sample.organism} · {phase === "idle" ? "Ready to analyze" : phase === "done" ? "Analyzed" : "In progress"}
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
                            className="h-full bg-accent transition-[width] duration-150"
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
                                      <AlertOctagon size={14} className="text-resistant" />
                                    ) : (
                                      <CheckCircle2 size={14} className="text-susceptible" />
                                    )}
                                    <div className="text-sm font-semibold">{r.drug}</div>
                                  </div>
                                  <div className={`text-[11px] font-semibold ${isR ? "text-resistant" : "text-susceptible"}`}>
                                    {r.status}
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-3">
                                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${isR ? "bg-resistant" : "bg-susceptible"}`}
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
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                          Need a confirmatory culture workup?{" "}
                          <a href="#labs" className="text-primary font-semibold hover:underline">
                            Find a partner lab near you
                          </a>
                          .
                        </p>
                      </div>
                    )}

                    {phase === "idle" && (
                      <div className="rounded-xl border border-dashed border-border/70 p-5 text-center text-sm text-muted-foreground">
                        Results will appear here after analysis. Change the selected sample above to see
                        different genomic resistance profiles.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
