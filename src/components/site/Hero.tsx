import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

/** Canvas-2D DNA helix + particle field. Lightweight, mobile-safe. */
function HelixCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
    }));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // particles
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(159, 227, 206, ${p.a * 0.7})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // helix on right
      const cx = w * 0.78;
      const amp = Math.min(140, w * 0.12);
      const step = 18;
      const time = reduced ? 0 : t * 0.0009;
      for (let i = 0; i < 34; i++) {
        const y = 40 + i * step;
        if (y > h - 20) break;
        const phase = i * 0.42 + time;
        const x1 = cx + Math.sin(phase) * amp;
        const x2 = cx - Math.sin(phase) * amp;
        const alpha = 0.15 + 0.35 * (0.5 + 0.5 * Math.cos(phase));

        ctx.strokeStyle = `rgba(23, 185, 143, ${alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        ctx.fillStyle = `rgba(23, 185, 143, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x1, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(x2, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}

const words = ["Antibiotic", "resistance", "decisions", "in", "minutes,", "not", "days."];

const stats = [
  { k: "0.952", label: "ROC-AUC on Meropenem", sub: "Internal validation" },
  { k: "<5 min", label: "From genome to result", sub: "vs. 48–72 hrs lab" },
  { k: "6", label: "Antibiotics predicted", sub: "Expanding panel" },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <section className="relative overflow-hidden bg-ink text-white min-h-[92vh] flex items-center pt-28 pb-20">
      <div className="absolute inset-0 bg-ink-mesh" />
      <HelixCanvas />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#070B0A]/95" />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.15fr_.85fr] gap-16 items-center w-full">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--color-teal-glow-soft)] backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-teal-glow)] animate-pulse-dot" />
            AI · Genomics · Precision Medicine
          </div>

          <h1 className="mt-6 font-display font-bold tracking-tight text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02]">
            {words.map((w, i) => (
              <span
                key={i}
                className="inline-block mr-[0.25em] text-hero-gradient"
                style={{
                  opacity: mounted ? undefined : 0,
                  animation: mounted ? `word-reveal 0.7s cubic-bezier(.2,.9,.3,1.2) ${i * 90}ms both` : undefined,
                }}
              >
                {w}
              </span>
            ))}
          </h1>

          <p className="mt-8 text-lg md:text-xl text-white/70 leading-relaxed max-w-xl">
            BactoAI uses machine learning to predict antimicrobial resistance from bacterial
            genomes — before lab results come back.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-teal-glow)] px-7 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] shadow-glow-teal hover:brightness-110 transition"
            >
              <Play size={16} /> See the Demo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Join Pilot Program
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/40">
            <span className="h-px w-8 bg-white/20" />
            Backed by clinicians and researchers across Africa & the UK
          </div>
        </div>

        <div className="relative h-[420px] lg:h-[520px]">
          {stats.map((s, i) => (
            <div
              key={s.k}
              className="glass-dark rounded-2xl p-5 absolute w-[240px] animate-float-slow"
              style={{
                top: `${[8, 42, 72][i]}%`,
                left: `${[6, 42, 12][i]}%`,
                animationDelay: `${i * 1.3}s`,
              }}
            >
              <div className="font-stat text-4xl font-bold text-white leading-none">{s.k}</div>
              <div className="mt-2 text-xs font-semibold text-white/90">{s.label}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">{s.sub}</div>
              <div className="mt-3 h-0.5 rounded-full bg-gradient-to-r from-[color:var(--color-teal-glow)] to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <a
        href="#stakes"
        aria-label="Scroll to next section"
        className="absolute left-1/2 -translate-x-1/2 bottom-6 text-white/60 hover:text-white transition animate-chevron"
      >
        <ChevronDown size={26} />
      </a>
    </section>
  );
}
