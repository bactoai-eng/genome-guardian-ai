import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Team } from "@/components/site/Team";
import { Partners } from "@/components/site/Partners";
import { Roadmap } from "@/components/site/Roadmap";
import { Testimonials } from "@/components/site/Testimonials";
import { useAutoReveal } from "@/hooks/use-auto-reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BactoAI — Team, media, partners, and roadmap" },
      {
        name: "description",
        content:
          "Meet the BactoAI team, our programmes and recognition, how to join our validation pilots, and where the platform is heading next.",
      },
      { property: "og:title", content: "About BactoAI" },
      {
        property: "og:description",
        content:
          "The team, media, partners, and roadmap behind BactoAI's genomic AMR prediction engine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bactoai.co.ke/about" },
    ],
    links: [{ rel: "canonical", href: "https://bactoai.co.ke/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  useAutoReveal();
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="page-opening pt-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">
            About us
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            The people building genome-driven AMR care.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A clinical and computational team, the institutions backing us, and the roadmap ahead.
          </p>
        </div>
        <Team />
        <Partners />
        <Testimonials />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}
