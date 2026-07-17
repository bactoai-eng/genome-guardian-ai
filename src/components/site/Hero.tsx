import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-mesh">
      {/* animated DNA helix */}
      <svg
        aria-hidden
        className="absolute -right-20 top-24 w-[600px] h-[600px] opacity-20 md:opacity-30 pointer-events-none"
        viewBox="0 0 400 400"
      >
        <defs>
          <linearGradient id="dna1" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.475 0.09 168)" />
            <stop offset="1" stopColor="oklch(0.72 0.12 195)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 20 + i * 16;
          const phase = (i / 22) * Math.PI * 4;
          const x1 = 200 + Math.sin(phase) * 90;
          const x2 = 200 - Math.sin(phase) * 90;
          return (
            <g key={i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="url(#dna1)" strokeWidth="2" opacity="0.6" />
              <circle cx={x1} cy={y} r="4" fill="oklch(0.475 0.09 168)" />
              <circle cx={x2} cy={y} r="4" fill="oklch(0.72 0.12 195)" />
            </g>
          );
        })}
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles size={14} />
            AI · Genomics · Precision Medicine
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] text-foreground">
            AI-powered antimicrobial <span className="text-gradient">resistance prediction</span> from bacterial genomes.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            BactoAI analyzes bacterial genomic sequences and predicts antibiotic resistance in
            minutes — supporting faster, data-driven treatment decisions and improved antimicrobial
            stewardship.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-soft transition-all"
            >
              Request a Demo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#technology"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition"
            >
              View Technology
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl">
            {[
              { k: "Minutes", v: "Prediction" },
              { k: "0.952", v: "ROC-AUC*" },
              { k: "1,800+", v: "Training genomes" },
            ].map((s) => (
              <div key={s.k}>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground/70">
            *Meropenem model — internal validation on training genomes. Clinical validation ongoing.
          </p>
        </div>
      </div>
    </section>
  );
}
