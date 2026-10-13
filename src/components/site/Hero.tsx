import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

/** Decorative, depth-sorted Canvas 2D DNA; animation never changes page layout. */
function HelixCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const scene = canvas.parentElement;
    if (!ctx || !scene) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = false;
    let lastFrame = 0;
    let phase = 0.7;
    let w = 0;
    let h = 0;
    let mobile = false;
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let palette: string[] = [];

    const resize = () => {
      mobile = canvas.clientWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const style = getComputedStyle(canvas);
      palette = [
        "--dna-backbone-a",
        "--dna-backbone-b",
        "--dna-base-a",
        "--dna-base-t",
        "--dna-base-c",
        "--dna-base-g",
        "--resistant",
      ].map((token) => style.getPropertyValue(token).trim());
    };
    type Point = { x: number; y: number; z: number };
    type Stroke = { a: Point; b: Point; color: string; backbone: boolean; depth: number };

    const draw = (t: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (!motion.matches && lastFrame && t - lastFrame < 1000 / 30) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (!motion.matches) {
        phase += lastFrame ? Math.min(t - lastFrame, 70) * 0.00018 : 0;
        offsetX += (pointerX * 6 - offsetX) * 0.065;
        offsetY += (pointerY * 4 + scrollY - offsetY) * 0.065;
      } else {
        phase = 0.7;
        offsetX = 0;
        offsetY = 0;
      }
      lastFrame = t;
      ctx.clearRect(0, 0, w, h);
      const cx = w * (mobile ? 0.84 : 0.78) + offsetX;
      const height = Math.min(h * 0.8, 560);
      const top = (h - height) * 0.5 + offsetY;
      const radius = Math.min(w * (mobile ? 0.16 : 0.115), 148);
      const point = (p: number, opposite = false): Point => {
        const angle = p * Math.PI * 2 * 2.65 + phase + (opposite ? Math.PI : 0);
        const z = Math.sin(angle);
        const perspective = 1 + z * 0.12;
        return { x: cx + Math.cos(angle) * radius * perspective, y: top + p * height, z };
      };
      const strokes: Stroke[] = [];
      const nodes: { p: Point; color: string }[] = [];
      const segments = mobile ? 100 : 180;
      for (let strand = 0; strand < 2; strand++) {
        for (let i = 0; i < segments; i++) {
          const a = point(i / segments, strand === 1);
          const b = point((i + 1) / segments, strand === 1);
          strokes.push({ a, b, color: palette[strand], backbone: true, depth: (a.z + b.z) / 2 });
        }
      }
      // Complementary A–T / C–G pairs; each half follows its own depth.
      const pairs = mobile ? 26 : 38;
      for (let i = 0; i < pairs; i++) {
        const p = (i + 0.5) / pairs;
        const a = point(p);
        const b = point(p, true);
        const mid = { x: (a.x + b.x) / 2, y: a.y, z: 0 };
        const base = i % 4;
        const complement = [1, 0, 3, 2][base];
        const flagged = p >= 0.56 && p <= 0.68;
        strokes.push(
          { a, b: mid, color: palette[base + 2], backbone: false, depth: a.z / 2 },
          { a: mid, b, color: palette[complement + 2], backbone: false, depth: b.z / 2 },
        );
        nodes.push(
          { p: a, color: palette[flagged ? 6 : 0] },
          { p: b, color: palette[flagged ? 6 : 1] },
        );
      }
      // One painter's-order list: rear rungs never paint over the front backbone.
      const layers = [
        ...strokes.map((stroke) => ({ depth: stroke.depth, stroke, node: null })),
        ...nodes.map((node) => ({ depth: node.p.z, stroke: null, node })),
      ].sort((a, b) => a.depth - b.depth);
      ctx.lineCap = "round";
      for (const layer of layers) {
        const depth = (layer.depth + 1) / 2;
        ctx.shadowBlur = 0;
        if (layer.stroke) {
          const { a, b, color, backbone } = layer.stroke;
          ctx.globalAlpha = backbone ? 0.32 + depth * 0.6 : 0.22 + depth * 0.38;
          ctx.strokeStyle = color;
          ctx.lineWidth = backbone ? 1.3 + depth * 2.8 : 0.85 + depth * 1.1;
          // Gentle optical softness at the rear, restrained halo at the front.
          ctx.shadowColor = color;
          ctx.shadowBlur = backbone ? (mobile ? 2 : 4) * (0.45 + depth * 0.55) : 0;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        } else if (layer.node) {
          const { p, color } = layer.node;
          ctx.globalAlpha = 0.4 + depth * 0.52;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.3 + depth * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      if (!motion.matches) raf = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(raf);
      lastFrame = 0;
      raf = visible && !document.hidden ? requestAnimationFrame(draw) : 0;
    };
    const onResize = () => {
      resize();
      resume();
    };
    const onPointer = (event: PointerEvent) => {
      if (motion.matches || mobile || !visible) return;
      const rect = scene.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const onScroll = () => {
      if (!visible || motion.matches) return;
      scrollY = Math.max(-5, Math.min(5, -scene.getBoundingClientRect().top * 0.015));
    };
    resize();
    const sizeObserver = new ResizeObserver(onResize);
    sizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      resume();
    });
    visibilityObserver.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    scene.addEventListener("pointermove", onPointer, { passive: true });
    scene.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", resume);
    motion.addEventListener("change", resume);
    return () => {
      cancelAnimationFrame(raf);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      scene.removeEventListener("pointermove", onPointer);
      scene.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", resume);
      motion.removeEventListener("change", resume);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
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
