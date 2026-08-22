import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Stakes } from "@/components/site/Stakes";
import { TrustBar } from "@/components/site/TrustBar";
import { Problem } from "@/components/site/Problem";
import { Solution } from "@/components/site/Solution";
import { ProductDemo } from "@/components/site/ProductDemo";
import { Validation } from "@/components/site/Validation";
import { PreFooterCTA } from "@/components/site/PreFooterCTA";
import { ScrollProgressBar } from "@/components/site/ScrollProgressBar";
import { useAutoReveal } from "@/hooks/use-auto-reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useAutoReveal();
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Nav />
      <main>
        <Hero />
        <Stakes />
        <TrustBar />
        <Problem />
        <Solution />
        <ProductDemo />
        <Validation />
        <PreFooterCTA />
      </main>
      <Footer />
    </div>
  );
}
