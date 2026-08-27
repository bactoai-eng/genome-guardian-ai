export function TrustBar() {
  const items = [
    { label: "Built by", name: "Kenyatta University" },
    { label: "Supported by", name: "THRIVE" },
    { label: "Grant", name: "CDIE Catalyst" },
    { label: "Program", name: "East Africa Biodesign" },
    { label: "Bootcamp", name: "GEES" },
  ];
  return (
    <section className="border-y border-border bg-card/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Built with support from world-class research institutions
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {items.map((it) => (
            <div key={it.name} className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                {it.label}
              </div>
              <div className="mt-1 text-sm md:text-base font-semibold text-foreground">
                {it.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
