import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

/** Cinematic Canvas-2D DNA helix with projected depth. Lightweight and mobile-safe. */
function HelixCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let isVisible = false;
    let lastFrame = 0;
    let w = 0,
      h = 0;
    let isMobile = window.matchMedia("(max-width: 767px)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

    const resize = () => {
      isMobile = window.matchMedia("(max-width: 767px)").matches;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (t: number) => {
      if (!isVisible || document.hidden) {
        raf = 0;
        return;
      }
      if (!reduced && t - lastFrame < 1000 / 30) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = t;
      ctx.clearRect(0, 0, w, h);

      const time = reduced ? 0.7 : t * 0.00042;
      const cx = w < 760 ? w * 0.84 : w * 0.78;
      const helixHeight = Math.min(h * 0.8, 560);
      const top = (h - helixHeight) * 0.5;
      const radius = Math.min(w < 760 ? w * 0.16 : w * 0.115, 148);
      const turns = 3.25;

      type HelixPoint = { x: number; y: number; z: number; scale: number };
      const pointAt = (progress: number, opposite = false): HelixPoint => {
        const phase = progress * Math.PI * 2 * turns + time + (opposite ? Math.PI : 0);
        const z = Math.sin(phase);
        const perspective = 0.72 + (z + 1) * 0.18;
        return {
          x: cx + Math.cos(phase) * radius * perspective,
          y: top + progress * helixHeight,
          z,
          scale: perspective,
        };
      };

      // Base-pair bridges are ordered back-to-front, creating real occlusion cues.
      const rungCount = isMobile ? 22 : 34;
      const rungs = Array.from({ length: rungCount }, (_, i) => {
        const progress = (i + 0.5) / rungCount;
        const a = pointAt(progress);
        const b = pointAt(progress, true);
        return { a, b, progress, depth: Math.max(a.z, b.z) };
      }).sort((a, b) => a.depth - b.depth);

      for (const { a, b, depth } of rungs) {
        const alpha = 0.1 + ((depth + 1) / 2) * 0.28;
        if (isMobile) {
          ctx.strokeStyle = `rgba(111, 217, 190, ${alpha * 0.82})`;
        } else {
          const bridge = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          bridge.addColorStop(0, `rgba(23, 185, 143, ${alpha})`);
          bridge.addColorStop(0.5, `rgba(194, 244, 229, ${alpha * 0.72})`);
          bridge.addColorStop(1, `rgba(56, 189, 248, ${alpha * 0.8})`);
          ctx.strokeStyle = bridge;
        }
        ctx.lineWidth = 0.7 + ((depth + 1) / 2) * 1.15;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Draw each backbone in short depth-aware sections so the front edge glows.
      const segments = isMobile ? 54 : 96;
      const strandSections: Array<{ a: HelixPoint; b: HelixPoint; strand: number }> = [];
      for (let strand = 0; strand < 2; strand++) {
        for (let i = 0; i < segments; i++) {
          strandSections.push({
            a: pointAt(i / segments, strand === 1),
            b: pointAt((i + 1) / segments, strand === 1),
            strand,
          });
        }
      }
      strandSections.sort((a, b) => a.a.z + a.b.z - (b.a.z + b.b.z));

      for (const section of strandSections) {
        const depth = (section.a.z + section.b.z) * 0.25 + 0.5;
        const alpha = 0.16 + depth * 0.7;
        ctx.save();
        ctx.strokeStyle =
          section.strand === 0
            ? `rgba(23, 185, 143, ${alpha})`
            : `rgba(105, 210, 236, ${alpha * 0.86})`;
        ctx.lineWidth = 1.2 + depth * 3.4;
        ctx.lineCap = "round";
        ctx.shadowBlur = depth > 0.68 ? (isMobile ? 7 : 13) * depth : 0;
        ctx.shadowColor =
          section.strand === 0 ? "rgba(23, 185, 143, 0.72)" : "rgba(56, 189, 248, 0.58)";
        ctx.beginPath();
        ctx.moveTo(section.a.x, section.a.y);
        ctx.lineTo(section.b.x, section.b.y);
        ctx.stroke();
        ctx.restore();
      }

      // Molecular nodes catch light as they rotate toward the viewer.
      for (const { a, b } of rungs) {
        for (const [node, color] of [
          [a, "23, 185, 143"],
          [b, "56, 189, 248"],
        ] as const) {
          const depth = (node.z + 1) / 2;
          const nodeRadius = 1.5 + depth * 3.4;
          ctx.save();
          ctx.shadowBlur = isMobile ? 3 + depth * 7 : 6 + depth * 13;
          ctx.shadowColor = `rgba(${color}, ${0.35 + depth * 0.5})`;
          if (isMobile) {
            ctx.fillStyle = `rgba(${color}, ${0.55 + depth * 0.4})`;
          } else {
            const orb = ctx.createRadialGradient(
              node.x - nodeRadius * 0.28,
              node.y - nodeRadius * 0.28,
              0,
              node.x,
              node.y,
              nodeRadius,
            );
            orb.addColorStop(0, `rgba(245, 247, 246, ${0.7 + depth * 0.3})`);
            orb.addColorStop(0.35, `rgba(${color}, ${0.52 + depth * 0.45})`);
            orb.addColorStop(1, `rgba(${color}, ${0.08 + depth * 0.22})`);
            ctx.fillStyle = orb;
          }
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (isVisible && !document.hidden) {
        if (reduced) draw(0);
        else raf = requestAnimationFrame(draw);
      }
    };
    const onResize = () => {
      resize();
      resume();
    };
    window.removeEventListener("resize", resize);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", resume);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
        resume();
      },
      { rootMargin: "0px" },
    );
    visibilityObserver.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      visibilityObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", resume);
    };
  }, []);
  return (
    <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
  );
}

const stats = [
  { k: "0.952", label: "ROC-AUC on Meropenem", sub: "Internal validation" },
  { k: "<10", label: "under 10 minutes from genome to result", sub: "vs. 48–72 hrs lab" },
  { k: "3", label: "3 antibiotics currently modeled, with more planned", sub: "Meropenem · Ciprofloxacin · Cefotaxime" },
];

export function Hero() {
  return (
    <>
      <section className="bacto-hero relative overflow-hidden">
        <HelixCanvas />
        <div className="hero-shade absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl w-full px-6">
          <div className="hero-copy">
            <div className="hero-eyebrow hidden md:flex items-center gap-2 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
              AI · Genomics · Precision Medicine
            </div>
            <h1 className="hero-title font-display font-bold">
              <span className="hero-brand block">BactoAI</span>
              Antibiotic resistance decisions in minutes, not days.
            </h1>
            <p className="hero-description hidden md:block">
              BactoAI uses machine learning to predict antimicrobial resistance from bacterial
              genomes — before lab results come back.
            </p>
            <div className="hero-actions grid grid-cols-2 gap-3 sm:flex">
              <Button asChild className="hero-demo min-h-12 px-4 sm:px-6">
                <a href="#demo"><Play size={16} /> See the Demo <ArrowRight className="hidden sm:block" size={16} /></a>
              </Button>
              <Button asChild variant="outline" className="hero-pilot min-h-12 px-4 sm:px-6">
                <Link to="/contact">Request a Pilot</Link>
              </Button>
            </div>
            <p className="hero-guidance hidden md:block text-xs">
              Guided by researchers and mentors across Africa and the UK
            </p>
          </div>
          <div className="hero-desktop-stats hidden md:grid md:grid-cols-3" aria-label="BactoAI model statistics">
            {stats.map((s) => (
              <div key={s.k} className="hero-stat">
                <div className="font-stat text-3xl font-bold">{s.k}</div>
                <div className="mt-2 text-sm font-medium">{s.label}</div>
                <div className="hero-stat-note mt-1 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <a href="#stakes" aria-label="Scroll to next section" className="hero-next absolute bottom-5 right-6">
          <ChevronDown size={22} />
        </a>
      </section>
      <div className="hero-phone-stats md:hidden px-6 py-8" aria-label="BactoAI model statistics">
        {stats.map((s) => (
          <div key={s.k} className="hero-stat py-5">
            <div className="font-stat text-4xl font-bold">{s.k}</div>
            <div className="mt-2 text-sm font-medium">{s.label}</div>
            <div className="hero-stat-note mt-1 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>
    </>
  );
}
