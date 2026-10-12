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
    let strandColor = "";
    let complementColor = "";
    let bridgeColor = "";
    let lightAppearance = false;
    const readPalette = () => {
      const styles = getComputedStyle(canvas);
      strandColor = styles.getPropertyValue("--dna-strand").trim();
      complementColor = styles.getPropertyValue("--dna-complement").trim();
      bridgeColor = styles.getPropertyValue("--dna-bridge").trim();
      lightAppearance = document.documentElement.classList.contains("light");
    };
    readPalette();

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

      const time = reduced ? 0.7 : t * 0.00022;
      const cx = isMobile ? w * 0.5 : w * 0.78;
      const helixHeight = Math.min(h * (isMobile ? 0.9 : 0.8), 560);
      const top = (h - helixHeight) * 0.5;
      const radius = Math.min(isMobile ? w * 0.32 : w * 0.115, 148);
      const turns = isMobile ? 2 : 3.25;

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
      const rungCount = isMobile ? 14 : 34;
      const rungs = Array.from({ length: rungCount }, (_, i) => {
        const progress = (i + 0.5) / rungCount;
        const a = pointAt(progress);
        const b = pointAt(progress, true);
        return { a, b, progress, depth: Math.max(a.z, b.z) };
      }).sort((a, b) => a.depth - b.depth);

      for (const { a, b, depth } of rungs) {
        const alpha = 0.32 + ((depth + 1) / 2) * 0.3;
        ctx.globalAlpha = alpha;
        if (isMobile) {
          ctx.strokeStyle = bridgeColor;
        } else {
          const bridge = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          bridge.addColorStop(0, strandColor);
          bridge.addColorStop(0.5, bridgeColor);
          bridge.addColorStop(1, complementColor);
          ctx.strokeStyle = bridge;
        }
        ctx.lineWidth = 0.7 + ((depth + 1) / 2) * 1.15;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

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
        const alpha = 0.48 + depth * 0.42;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = section.strand === 0 ? strandColor : complementColor;
        ctx.lineWidth = isMobile ? 1.3 + depth * 1.4 : 1.4 + depth * 2.8;
        ctx.lineCap = "round";
        ctx.shadowBlur = lightAppearance || isMobile ? 0 : 4 * depth;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(section.a.x, section.a.y);
        ctx.lineTo(section.b.x, section.b.y);
        ctx.stroke();
        ctx.restore();
      }

      // Molecular nodes catch light as they rotate toward the viewer.
      for (const { a, b } of rungs) {
        for (const [node, color] of [
          [a, strandColor],
          [b, complementColor],
        ] as const) {
          const depth = (node.z + 1) / 2;
          const nodeRadius = isMobile ? 1 + depth * 1.1 : 1.5 + depth * 2.6;
          ctx.save();
          ctx.globalAlpha = 0.6 + depth * 0.35;
          ctx.shadowBlur = lightAppearance || isMobile ? 0 : depth * 4;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
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
    const appearanceObserver = new MutationObserver(() => {
      readPalette();
      resume();
    });
    appearanceObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
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
      appearanceObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", resume);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="hero-dna absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}

const stats = [
  { k: "0.952", srK: "0.952", label: "ROC-AUC on Meropenem", sub: "Internal validation" },
  {
    k: "<10",
    srK: "Under 10 minutes",
    label: "under 10 minutes from genome to result",
    sub: "vs. 48–72 hrs lab",
  },
  {
    k: "3",
    srK: "3",
    label: "3 antibiotics currently modeled, with more planned",
    sub: "Meropenem · Ciprofloxacin · Cefotaxime",
  },
];

export function Hero() {
  return (
    <>
      <section className="bacto-hero relative overflow-hidden" aria-labelledby="hero-heading">
        <HelixCanvas />
        <div className="hero-shade absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl w-full px-6">
          <div className="hero-copy">
            <div className="hero-eyebrow hidden md:flex items-center gap-2 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" aria-hidden="true" />
              AI · Genomics · Precision Medicine
            </div>
            <h1 id="hero-heading" className="hero-title font-display font-bold">
              <span className="hero-brand block">BactoAI</span>
              <span className="sr-only">: </span>
              Antibiotic resistance decisions in minutes, not days.
            </h1>
            <p className="hero-description hidden md:block">
              BactoAI uses machine learning to predict antimicrobial resistance from bacterial
              genomes — before lab results come back.
            </p>
            <div className="hero-actions grid grid-cols-2 gap-3 sm:flex">
              <Button
                asChild
                className="hero-demo min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background px-4 sm:px-6"
              >
                <a href="#demo">
                  <Play size={16} aria-hidden="true" /> See the Demo{" "}
                  <ArrowRight className="hidden sm:block" size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="hero-pilot min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background px-4 sm:px-6"
              >
                <Link to="/contact">Request a Pilot</Link>
              </Button>
            </div>
          </div>
          <h2 id="hero-stats-desktop" className="sr-only">
            BactoAI model statistics
          </h2>
          <ul
            className="hero-desktop-stats hidden md:grid md:grid-cols-3"
            aria-labelledby="hero-stats-desktop"
          >
            {stats.map((s) => (
              <li key={s.k} className="hero-stat">
                <div className="font-stat text-3xl font-bold">
                  <span aria-hidden="true">{s.k}</span>
                  <span className="sr-only">{s.srK}</span>
                </div>
                <div className="mt-2 text-sm font-medium">{s.label}</div>
                <div className="hero-stat-note mt-1 text-xs">{s.sub}</div>
              </li>
            ))}
          </ul>
        </div>
        <a
          href="#stakes"
          aria-label="Skip to next section"
          className="hero-next rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background absolute bottom-5 right-6"
        >
          <ChevronDown size={22} aria-hidden="true" />
        </a>
      </section>
      <section className="hero-phone-stats md:hidden px-6 py-8" aria-labelledby="hero-stats-phone">
        <h2 id="hero-stats-phone" className="sr-only">
          BactoAI model statistics
        </h2>
        <ul>
          {stats.map((s) => (
            <li key={s.k} className="hero-stat py-5">
              <div className="font-stat text-4xl font-bold">
                <span aria-hidden="true">{s.k}</span>
                <span className="sr-only">{s.srK}</span>
              </div>
              <div className="mt-2 text-sm font-medium">{s.label}</div>
              <div className="hero-stat-note mt-1 text-xs">{s.sub}</div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
