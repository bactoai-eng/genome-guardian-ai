
# BactoAI Redesign — Execution Plan

Working from the redesign doc, your three choices are locked: **everything in the doc**, **realistic sample content** for gaps, **hybrid dark cinematic hero + emerald/cyan brand for the rest**.

## Design system updates (`src/styles.css`)
- Add cinematic tokens: `--ink-navy: #0A1628`, `--ink-navy-2: #102A43`, `--teal-glow: #00D4AA`, gradient + glow tokens for the hero/Stakes bands only.
- Keep existing emerald/cyan tokens for all downstream sections (Solution, Features, Team, etc.).
- Add typography scale from the doc: display 96/72/48, body 20/16/14, mono for stats. Load Space Grotesk + JetBrains Mono via `<link>` in `__root.tsx`.
- Add utilities: `.glass-dark`, `.text-hero-gradient`, `.shadow-glow-teal`, `@keyframes` for `count-up`, `pulse-dot`, `float-slow`, `helix-drift`.

## Motion foundation
- Install `framer-motion`. Add reusable primitives: `MotionSection`, `CountUp`, `Marquee` (already exists), `Parallax`.
- Replace one-shot reveals with staggered fade+rise where sections have multiple children; keep `useAutoReveal` as the fallback.

## Section-by-section work

### Rebuild (dark cinematic surfaces)
1. **Hero** — dark navy background, canvas DNA-helix particle field, oversized headline with word-by-word reveal, dual CTAs ("See the Demo" primary teal, "Join Pilot Program" outline), 3 floating glass stat cards (0.952 ROC-AUC, <5 min turnaround, 6 antibiotics), scroll-indicator chevron. Trust bar of partner logos in grayscale beneath.
2. **NEW: Stakes** — dark full-bleed section right after Hero. Count-up to "1.27M+ deaths / year", 3 supporting stat cards, animated 48h → 5min clock comparison, WHO quote, CTA to solution.

### Enhance (keep brand palette)
3. **Problem** — split layout, large headline left, illustration + stat callouts right.
4. **Solution** — convert vertical 6-step into interactive horizontal carousel with progress indicator, auto-advance + hover pause, mobile snap-scroll.
5. **NEW: Live Product Demo** — replace static `ProductDemo` mock with an interactive simulation: fake drag-drop upload → progress bar → animated results with confidence bars + antibiotic toggles + "Try sample" button.
6. **Features** — convert to tabbed carousel with 4 categories × 3 features (AI & Prediction / Integration / Security / Reporting).
7. **NEW: WhyBactoAI** — refine 3 audience cards (Hospitals, Researchers, Public Health) with hover reveal.
8. **Validation** — add animated ROC curve (SVG path draw-on), accuracy count-ups, comparison table BactoAI vs Traditional vs Competitors, download-report CTA.
9. **NEW: Testimonials** — 3D-ish coverflow carousel, 5 realistic sample testimonials (clinicians + researchers + public-health, clearly attributed as pilot participants), star ratings, hospital logos.
10. **Technology** — animated 5-stage pipeline (Sequence → Assemble → Predict → Report → Deploy) with sequential highlight.
11. **Research/Awards** — vertical timeline layout with year markers and photo thumbnails.
12. **Team** — coverflow-style carousel; upgrade cards with LinkedIn + focus-area chips.
13. **Partners** — keep infinite marquee, add "Become a partner" CTA that scrolls to Partners form.
14. **Roadmap** — interactive horizontal timeline, completed / in-progress / upcoming states, click-to-expand milestones.
15. **NEW: Pricing** — 3 tiers (Research Free / Clinical $ / Enterprise Custom), feature checklists, Clinical highlighted "Most popular", monthly/annual toggle, per-tier CTA.
16. **FAQ** — expand to 8-10 Qs across pricing, data privacy, integration, regulatory.
17. **NEW: Blog / Resources hub** — grid of 6 sample article cards with categories (Research / Clinical / Public Health / Product), newsletter signup, whitepaper download CTAs. Wire into existing `/resources` route.
18. **NEW: Newsletter band** — email capture above footer with "Join 500+ clinicians and researchers", social links.
19. **CTA banner + Footer** — big pre-footer "Ready to transform AMR diagnostics?" band, then 4-column footer (Product / Company / Resources / Legal) with newsletter, socials, final legal row.

## New routes
- `/blog` — full blog index consuming the same sample articles used on home.
- Keep `/privacy`, `/terms`, `/careers`, `/resources`, add `/pricing` deep link.

## Head / SEO
- Update `__root.tsx` head copy to the new hero language.
- Per-route head on `/pricing`, `/blog`, `/resources`, `/careers`.

## Order of implementation
1. Tokens + fonts + framer-motion install.
2. Hero + Stakes (highest visual impact).
3. Interactive Solution + Product Demo.
4. Features tabs + Validation + Testimonials.
5. Team coverflow + Awards timeline + Roadmap timeline.
6. Pricing + Blog + Newsletter + pre-footer CTA + Footer.
7. Nav (add Pricing, Blog links) + polish pass + mobile QA.

## Deliberate omissions
- No new backend — reuse existing `contact_submissions` for newsletter/pricing form leads with a new `form_type`.
- No WebGL Three.js — canvas 2D particle helix keeps bundle light and mobile-safe.
- Testimonials are labeled "Pilot participant" so the sample content stays honest.

Approve and I'll ship it in that order.
