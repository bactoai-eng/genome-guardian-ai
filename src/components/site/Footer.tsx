import logo from "@/assets/bactoai-logo.svg";
import { Linkedin, Mail, MapPin, ArrowUpRight } from "lucide-react";

const productLinks = [
  { label: "Technology", href: "#technology" },
  { label: "Platform demo", href: "#product" },
  { label: "Validation", href: "#validation" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const companyLinks = [
  { label: "The problem", href: "#problem" },
  { label: "Our team", href: "#team" },
  { label: "Research & awards", href: "#research" },
  { label: "Partners", href: "#partners" },
];

const actionLinks = [
  { label: "Request a demo", href: "#contact" },
  { label: "Partner with us", href: "#partner-inquiry" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bactoai-model-32303335a",
    external: true,
  },
  { label: "Email us", href: "mailto:bactoai01@gmail.com" },
];

export function Footer() {
  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="BactoAI" className="h-12 w-auto brightness-0 invert" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            AI-powered antimicrobial resistance prediction from bacterial genomes.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-primary-glow" />
              <a href="mailto:bactoai01@gmail.com" className="hover:text-white transition">
                bactoai01@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin size={14} className="text-primary-glow" />
              <a
                href="https://www.linkedin.com/in/bactoai-model-32303335a"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                LinkedIn
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-primary-glow mt-0.5" />
              <span>Kenyatta University, Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-4">Product</div>
          <ul className="space-y-2 text-sm text-white/60">
            {productLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-4">Company</div>
          <ul className="space-y-2 text-sm text-white/60">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-4">Get involved</div>
          <ul className="space-y-2 text-sm text-white/60">
            {actionLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 hover:text-white transition"
                >
                  {l.label}
                  {l.external && <ArrowUpRight size={12} />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <div>© {new Date().getFullYear()} BactoAI. All rights reserved.</div>
          <div>Built at Kenyatta University · Nairobi, Kenya</div>
        </div>
      </div>
    </footer>
  );
}
