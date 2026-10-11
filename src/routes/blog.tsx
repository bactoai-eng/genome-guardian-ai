import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { posts } from "@/content/posts";
import agarImage from "@/assets/blog-agar.webp";
import genomeImage from "@/assets/blog-genome.webp";
import surveillanceImage from "@/assets/blog-surveillance.webp";
import limsImage from "@/assets/blog-lims.webp";
import microscopeImage from "@/assets/blog-microscope.webp";
import networkImage from "@/assets/blog-network.webp";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — BactoAI · AMR research, clinical, and product notes" },
      {
        name: "description",
        content:
          "Research notes, clinical perspectives, and public-health analysis on antimicrobial resistance from the BactoAI team and partners.",
      },
      { property: "og:title", content: "Blog — BactoAI" },
      {
        property: "og:description",
        content: "AMR research, clinical, and product notes from BactoAI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bactoai.co.ke/blog" },
    ],
    links: [{ rel: "canonical", href: "https://bactoai.co.ke/blog" }],
  }),
  component: BlogPage,
});

const categories = ["All", "Research", "Clinical", "Public Health", "Product"] as const;
type Category = (typeof categories)[number];

const postImages: Record<string, { src: string; alt: string }> = {
  "why-genomic-amr-prediction": {
    src: agarImage,
    alt: "A gloved hand holds an agar plate with bacterial colonies on a laboratory bench.",
  },
  "validating-meropenem-model": {
    src: genomeImage,
    alt: "Genome sequence strips and a scatter plot on a monitor beside a sequencing instrument.",
  },
  "amr-in-lmic-hospitals": {
    src: surveillanceImage,
    alt: "Sealed clinical sample tubes and a microscope in an anonymous hospital laboratory.",
  },
  "bactoai-api-launch": {
    src: limsImage,
    alt: "A laptop displaying genomic data panels beside a scanner and laboratory sample tubes.",
  },
  "confidence-scores-clinical": {
    src: microscopeImage,
    alt: "Anonymous gloved hands adjust a microscope beside laboratory glassware.",
  },
  "who-priority-pathogens": {
    src: networkImage,
    alt: "An illustrated world map centred on Africa with connected pathogen surveillance points.",
  },
};

function BlogPage() {
  const [active, setActive] = useState<Category>("All");
  const shown = active === "All" ? posts : posts.filter((p) => p.category === active);
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">Blog</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Ideas from the AMR frontier.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Field notes, model deep-dives, and clinical perspectives from the BactoAI team and pilot
            partners.
          </p>

          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter articles">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === active}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  c === active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground/70 hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <article
                key={p.slug}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition"
              >
                <div className="relative aspect-video overflow-hidden rounded-t-[inherit]">
                  <img
                    src={postImages[p.slug]?.src}
                    alt={postImages[p.slug]?.alt}
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 rounded-full bg-card/95 text-primary text-[11px] font-semibold px-3 py-1">
                    {p.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-muted-foreground">
                    {p.date} · {p.readTime}
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary transition">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          {shown.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No {active} articles yet — check back soon.
            </p>
          )}

          <p className="mt-12 text-center text-sm text-muted-foreground">
            More articles are on the way. Subscribe below to get them in your inbox.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
