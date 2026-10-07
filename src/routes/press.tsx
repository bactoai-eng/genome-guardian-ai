import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Mail } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ScrollProgressBar } from "@/components/site/ScrollProgressBar";
import { useAutoReveal } from "@/hooks/use-auto-reveal";
import { Reveal } from "@/components/site/Reveal";
import { Media } from "@/components/site/Media";
import logoWordmark from "@/assets/bactoai-logo-wordmark.png.asset.json";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press & media — BactoAI coverage and press kit" },
      {
        name: "description",
        content:
          "BactoAI in the media: KUTV Kenya's AMR interview, BIK Ventures Hub coverage, plus our press kit, brand assets, and media contact.",
      },
      { property: "og:title", content: "Press & media — BactoAI" },
      {
        property: "og:description",
        content:
          "Coverage of BactoAI's work on genome-driven antimicrobial resistance prediction, with press kit and media contact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bactoai.co.ke/press" },
    ],
    links: [{ rel: "canonical", href: "https://bactoai.co.ke/press" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "BactoAI press & media",
          url: "https://bactoai.co.ke/press",
          about:
            "Media coverage of BactoAI, a genomic antimicrobial resistance prediction platform.",
        }),
      },
    ],
  }),
  component: PressPage,
});

const kit = [
  {
    icon: null as unknown as typeof Mail,
    title: "Logo & wordmark",
    body: "The BactoAI wordmark with the bacterial emblem, for use in articles and event material. Please keep clear space around it and don't recolour it.",
    href: logoWordmark.url,
    cta: "Download logo (PNG)",
    download: true,
  },
  {
    icon: Mail,
    title: "Company one-pager",
    body: "A concise overview of the platform, our validation approach, and current pilot opportunities. Available on request while we finalise the public version.",
    href: "mailto:info@bactoai.co.ke?subject=BactoAI%20press%20one-pager%20request",
    cta: "Request one-pager",
  },
  {
    icon: Mail,
    title: "Interviews & expert comment",
    body: "Our founder and team are available for interviews and background briefings on antimicrobial resistance, genomic diagnostics, and health innovation in East Africa.",
    href: "mailto:info@bactoai.co.ke?subject=BactoAI%20interview%20request",
    cta: "Request an interview",
  },
];
