import { Link } from "@tanstack/react-router";
import { FlaskConical, Activity, GraduationCap, Check, Mail } from "lucide-react";

const tracks = [
  {
    icon: FlaskConical,
    title: "Hospital & clinical labs",
    body: "Compare BactoAI predictions with your existing susceptibility testing for meropenem, ciprofloxacin and cefotaxime.",
  },
  {
    icon: Activity,
    title: "Public health & surveillance",
    body: "Explore genome-based AMR screening alongside your regional sequencing and surveillance work.",
  },
  {
    icon: GraduationCap,
    title: "Academic & genomic research",
    body: "Collaborate on validation studies and model evaluation using locally relevant bacterial isolates.",
  },
];

const deliverables = [
  "A shared validation protocol agreed before work begins",
  "Agreement analysis against your own laboratory results",
  "Technical onboarding for your team",
  "A joint review of pilot findings",
];

export function Testimonials() {
  return (
    <section id="pilot-partners" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">
            Validation partnerships
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Join our clinical and research validation cohort.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We are seeking laboratories, hospitals and research groups to help validate BactoAI
            against real-world isolates.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {tracks.map((t) => (
            <div key={t.title} className="rounded-2xl border border-border bg-card p-6">
              <t.icon className="text-primary" size={24} aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-foreground">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-8 md:p-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-foreground">What pilot sites receive</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {deliverables.map((d) => (
                <li key={d} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 shrink-0 text-primary" size={16} aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
            >
              Request a Pilot
            </Link>
            <a
              href="mailto:info@bactoai.co.ke"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              <Mail size={16} aria-hidden="true" />
              info@bactoai.co.ke
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
