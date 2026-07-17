import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What is BactoAI?", a: "BactoAI is an AI-powered platform that predicts antimicrobial resistance from bacterial whole-genome sequences to support faster, precision antibiotic decisions." },
  { q: "Does BactoAI replace laboratory testing?", a: "No. BactoAI is a decision-support tool that complements laboratory workflows by providing rapid predictive insights while conventional testing is completed." },
  { q: "What sequencing files are supported?", a: "BactoAI accepts standard bacterial whole-genome sequencing inputs including FASTA and FASTQ files from short- and long-read platforms." },
  { q: "How accurate are predictions?", a: "Performance varies by antibiotic and organism. Reported metrics are from internal validation on training genomes; prospective clinical validation is ongoing." },
  { q: "Who can use BactoAI?", a: "Clinical laboratories, hospitals, researchers, and public-health institutions. Access is currently via our pilot program." },
  { q: "How is patient data protected?", a: "BactoAI is designed with strict access control, encryption in transit and at rest, and supports on-premises deployment for restricted environments." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">FAQ</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between text-left px-6 py-5"
              >
                <span className="font-semibold text-foreground">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
