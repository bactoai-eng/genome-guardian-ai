import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Stakes } from "@/components/site/Stakes";
import { TrustBar } from "@/components/site/TrustBar";
import { Problem } from "@/components/site/Problem";
import { Solution } from "@/components/site/Solution";
import { Features } from "@/components/site/Features";
import { WhyBactoAI } from "@/components/site/WhyBactoAI";
import { ProductDemo } from "@/components/site/ProductDemo";
import { PartnerLabs } from "@/components/site/PartnerLabs";

import { Technology } from "@/components/site/Technology";
import { Validation } from "@/components/site/Validation";
import { Impact } from "@/components/site/Impact";
import { Testimonials } from "@/components/site/Testimonials";
import { Team } from "@/components/site/Team";
import { Roadmap } from "@/components/site/Roadmap";
import { Partners } from "@/components/site/Partners";
import { Research } from "@/components/site/Research";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { BlogPreview } from "@/components/site/BlogPreview";
import { Newsletter } from "@/components/site/Newsletter";
import { PreFooterCTA } from "@/components/site/PreFooterCTA";
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
        <Stakes />
        <TrustBar />
        <Problem />
        <Solution />
        <ProductDemo />
        <Features />
        <WhyBactoAI />
        <Technology />
        <Validation />
        <Testimonials />
        <Impact />
        <Research />
        <Team />
        <Partners />
        <Roadmap />
        <Pricing />
        <FAQ />
        <BlogPreview />
        <Contact />
        <Newsletter />
        <PreFooterCTA />
      </main>
      <Footer />
    </div>
  );
}
