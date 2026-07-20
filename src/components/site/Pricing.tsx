import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

type Tier = {
  name: string;
  tagline: string;
  monthly: string;
  annual: string;
  cta: string;
  href: string;
  highlight?: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Research",
    tagline: "For academic labs and single researchers.",
    monthly: "Free",
    annual: "Free",
    cta: "Start free",
    href: "#contact",
    features: [
      "Up to 25 genomes / month",
      "6-antibiotic panel",
      "Browser dashboard",
      "CSV export",
      "Community support",
    ],
  },
  {
    name: "Clinical",
    tagline: "For hospitals and clinical labs.",
    monthly: "$1,900 / mo",
    annual: "$1,500 / mo",
    cta: "Request pilot",
    href: "#contact",
    highlight: true,
    features: [
      "Unlimited genomes",
      "Full antibiotic panel",
      "Clinician-ready PDF reports",
      "LIMS API integration",
      "Audit-ready result history",
      "Priority support, 4-hr SLA",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For health systems and public-health agencies.",
    monthly: "Custom",
    annual: "Custom",
    cta: "Contact sales",
    href: "#contact",
    features: [
      "On-premises deployment option",
      "SSO + role-based access",
      "Custom-trained regional models",
      "Dedicated success engineer",
      "Data-processing agreement",
      "24/7 support",
    ],
  },
];

export function Pricing({ compact = false }: { compact?: boolean }) {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className={`${compact ? "py-16" : "py-24 md:py-32"} bg-card/30`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">Pricing</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free for research. Scale to full clinical deployment when you're ready.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {(["Monthly", "Annual"] as const).map((label) => {
              const isAnnual = label === "Annual";
              const active = isAnnual === annual;
              return (
                <button
                  key={label}
                  onClick={() => setAnnual(isAnnual)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label} {isAnnual && <span className="text-[10px] opacity-80">−20%</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 transition ${
                t.highlight
                  ? "border-primary/40 bg-card shadow-elegant lg:-translate-y-2"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-hero text-white text-[11px] font-bold px-3 py-1 shadow-soft">
                  <Sparkles size={11} /> Most popular
                </div>
              )}
              <div className="text-sm font-semibold text-primary uppercase tracking-widest">{t.name}</div>
              <div className="mt-2 text-sm text-muted-foreground">{t.tagline}</div>
              <div className="mt-6 font-stat text-4xl font-bold text-foreground">
                {annual ? t.annual : t.monthly}
              </div>

              <a
                href={t.href}
                className={`mt-6 block text-center rounded-full py-2.5 text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-primary text-primary-foreground shadow-soft hover:shadow-elegant"
                    : "border border-border text-foreground hover:border-primary/40"
                }`}
              >
                {t.cta}
              </a>

              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Prices in USD. Pilot pricing available for academic and public-health partners in LMICs.
        </p>
      </div>
    </section>
  );
}
