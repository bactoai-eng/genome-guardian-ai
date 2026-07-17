import logo from "@/assets/bactoai-logo.svg";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="BactoAI" className="h-12 w-auto brightness-0 invert" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            AI-powered antimicrobial resistance prediction from bacterial genomes.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><Linkedin size={16} /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><Github size={16} /></a>
            <a href="mailto:hello@bactoai.com" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"><Mail size={16} /></a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-4">Product</div>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#technology" className="hover:text-white">Technology</a></li>
            <li><a href="#product" className="hover:text-white">Platform</a></li>
            <li><a href="#roadmap" className="hover:text-white">Roadmap</a></li>
            <li><a href="#contact" className="hover:text-white">Request Demo</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-4">Company</div>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#team" className="hover:text-white">Team</a></li>
            <li><a href="#research" className="hover:text-white">Research</a></li>
            <li><a href="#partners" className="hover:text-white">Partners</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-4">Legal</div>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Resources</a></li>
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
