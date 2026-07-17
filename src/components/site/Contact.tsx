import { Mail, Linkedin, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="contact" className="py-24 md:py-32 bg-card/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl bg-gradient-hero p-1 shadow-elegant">
          <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-background p-8 md:p-14 grid lg:grid-cols-2 gap-12">
            <div>
              <div className="text-sm font-semibold text-primary uppercase tracking-widest">Get in touch</div>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Help shape the future of precision antibiotic decision-making.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Partner with BactoAI to accelerate AMR diagnostics through AI and genomics. Join
                our pilot program or request a live demonstration.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary" />
                  <a href="mailto:bactoai01@gmail.com" className="hover:text-primary transition">bactoai01@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <Linkedin size={16} className="text-primary" />
                  <a
                    href="https://www.linkedin.com/in/bactoai-model-32303335a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition"
                  >
                    linkedin.com/in/bactoai-model
                  </a>
                </li>
                <li className="flex items-center gap-3"><MapPin size={16} className="text-primary" /> Kenyatta University, Nairobi, Kenya</li>
              </ul>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Full name</label>
                <input required className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Work email</label>
                <input type="email" required className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Organization</label>
                <input className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">How can we help?</label>
                <textarea rows={4} className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:opacity-95 transition">
                {submitted ? "Thanks — we'll be in touch" : (<>Request a Demo <ArrowRight size={16} /></>)}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                We respond within 2 business days. Your information stays private.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
