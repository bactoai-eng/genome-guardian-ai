import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { Problem } from "@/components/site/Problem";
import { Solution } from "@/components/site/Solution";
import { Features } from "@/components/site/Features";
import { WhyBactoAI } from "@/components/site/WhyBactoAI";
import { ProductDemo } from "@/components/site/ProductDemo";
import { Technology } from "@/components/site/Technology";
import { Validation } from "@/components/site/Validation";
import { Impact } from "@/components/site/Impact";
import { Team } from "@/components/site/Team";
import { Roadmap } from "@/components/site/Roadmap";
import { Partners } from "@/components/site/Partners";
import { Research } from "@/components/site/Research";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
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
        <TrustBar />
        <Problem />
        <Solution />
        <Features />
        <WhyBactoAI />
        <ProductDemo />
        <Technology />
        <Validation />
        <Impact />
        <Research />
        <Team />
        <Partners />
        <Roadmap />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
