import kenyattaLogo from "@/assets/kenyatta-university-logo.png";
import kemriLogo from "@/assets/kemri-logo.png";
import lancasterLogo from "@/assets/lancaster-logo.svg";

export function Partners() {
  const logoPartners = [
    { name: "Kenyatta University", src: kenyattaLogo },
    { name: "KEMRI", src: kemriLogo },
    { name: "Lancaster University", src: lancasterLogo },
  ];
  const textPartners = [
    "Kenyatta Innovation Centre",
    "Oxford Nanopore",
    "THRIVE",
    "CDIE",
    "East Africa Biodesign",
  ];
  return (
    <section id="partners" className="py-24 bg-card/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">Partners</div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Backed by research and innovation networks.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {logoPartners.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-border bg-background px-6 py-8 flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition"
            >
              <img
                src={p.src}
                alt={`${p.name} logo`}
                className="h-20 w-auto object-contain"
                loading="lazy"
              />
              <div className="text-sm font-semibold text-foreground text-center">{p.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {textPartners.map((p) => (
            <div
              key={p}
              className="rounded-2xl border border-border bg-background px-4 py-6 text-center text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
