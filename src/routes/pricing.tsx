import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BactoAI · Free for research, priced for clinical" },
      {
        name: "description",
        content:
          "Start free for research. Scale to full clinical deployment with clinician-ready reports, LIMS API integration, and dedicated support.",
      },
      { property: "og:title", content: "Pricing — BactoAI" },
      { property: "og:description", content: "Free for research. Clinical and enterprise tiers for hospitals and health systems." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
