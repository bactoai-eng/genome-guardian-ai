import { useState } from "react";
import { ArrowRight, Handshake } from "lucide-react";
import kenyattaLogo from "@/assets/kenyatta-university-logo.png";
import kemriLogo from "@/assets/kemri-logo.png";
import lancasterLogo from "@/assets/lancaster-logo.svg";
import cdieLogo from "@/assets/cdie-logo.png";
import thriveLogo from "@/assets/thrive-logo.png";
import nanoporeLogo from "@/assets/oxford-nanopore-logo.jpg";
import { Reveal } from "./Reveal";

const logoPartners = [
  { name: "Kenyatta University", src: kenyattaLogo },
  { name: "KEMRI", src: kemriLogo },
  { name: "Lancaster University", src: lancasterLogo },
  { name: "Oxford Nanopore", src: nanoporeLogo },
  { name: "CDIE", src: cdieLogo },
  { name: "THRiVE", src: thriveLogo },
];

const textPartners = ["Kenyatta Innovation Centre", "East Africa Biodesign", "GEES Bootcamp"];

const partnershipTypes = [
  "Clinical validation study",
  "Sequencing / data partnership",
  "Research collaboration",
  "Pilot deployment",
  "Investment / grant",
  "Other",
];

export function Partners() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    type: partnershipTypes[0],
    message: "",
  });

  return (
    <section id="partners" className="relative py-24 bg-card/40 border-y border-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="text-center">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">Partners</div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Backed by research and innovation networks.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Built alongside leading universities, medical research institutes and technology partners
            across East Africa and the UK.
          </p>
        </Reveal>

        {/* Logo marquee — infinite scroll */}
        <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-6">
            {[...logoPartners, ...logoPartners].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="shrink-0 rounded-2xl border border-border bg-background px-6 py-6 w-56 h-32 flex flex-col items-center justify-center gap-3 hover:border-primary/40 transition"
              >
                <img
                  src={p.src}
                  alt={`${p.name} logo`}
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
                <div className="text-xs font-semibold text-muted-foreground text-center">{p.name}</div>
              </div>
            ))}
          </div>
        </div>

        <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
          {textPartners.map((p) => (
            <span
              key={p}
              className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </Reveal>

        {/* Partner inquiry form */}
        <div id="partner-inquiry" className="mt-20 grid lg:grid-cols-5 gap-8 items-start">
          <Reveal variant="left" className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              <Handshake size={14} /> Partner with us
            </div>
            <h3 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Let's build the AMR response of the next decade — together.
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We work with hospitals, sequencing providers, public-health agencies and academic
              groups. Tell us about your work and we'll respond within 2 business days.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>· Access to our validation pipeline</li>
              <li>· Co-authored clinical studies</li>
              <li>· Custom AMR reports for your isolates</li>
              <li>· Deployment support in low-resource labs</li>
            </ul>
          </Reveal>

          <Reveal variant="right" delay={120} className="lg:col-span-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.name.trim() || !form.email.trim()) return;
                setSubmitted(true);
              }}
              className="rounded-2xl border border-border bg-background p-6 md:p-8 shadow-soft space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Full name</label>
                  <input
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Work email</label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Organization</label>
                  <input
                    maxLength={150}
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Role</label>
                  <input
                    maxLength={100}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Type of partnership</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {partnershipTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Tell us about your project</label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:opacity-95 transition disabled:opacity-70"
              >
                {submitted ? "Thanks — we'll be in touch shortly" : (<>Submit partnership inquiry <ArrowRight size={16} /></>)}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                Your details stay private. We reply within 2 business days.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
