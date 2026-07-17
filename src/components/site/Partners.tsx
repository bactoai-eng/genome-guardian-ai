export function Partners() {
  const partners = [
    "Kenyatta University",
    "Kenyatta Innovation Centre",
    "KEMRI",
    "Oxford Nanopore",
    "THRIVE",
    "CDIE",
    "Lancaster University",
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
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map((p) => (
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
