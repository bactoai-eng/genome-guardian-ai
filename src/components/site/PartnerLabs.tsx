import { useMemo, useState } from "react";
import { MapPin, Search, Clock, FlaskConical, ArrowRight } from "lucide-react";

type Lab = {
  name: string;
  location: string;
  city: string;
  county: string;
  role: string;
  turnaround?: string;
  services: string[];
  lat: number;
  lon: number;
};

const labs: Lab[] = [
  {
    name: "Kenyatta National Hospital Microbiology Lab",
    location: "Upper Hill, Nairobi",
    city: "Nairobi",
    county: "Nairobi County",
    role: "National referral hospital",
    turnaround: "48 to 72 hrs",
    services: ["Culture & sensitivity", "Blood cultures"],
    lat: -1.3,
    lon: 36.8,
  },
  {
    name: "KEMRI Centre for Microbiology Research",
    location: "Mbagathi Road, Nairobi",
    city: "Nairobi",
    county: "Nairobi County",
    role: "Genomic reference laboratory",
    turnaround: "72 hrs",
    services: ["Reference testing", "WGS sequencing"],
    lat: -1.32,
    lon: 36.78,
  },
  {
    name: "Aga Khan University Hospital Laboratory",
    location: "Parklands, Nairobi",
    city: "Nairobi",
    county: "Nairobi County",
    role: "Tertiary teaching hospital",
    turnaround: "24 to 48 hrs",
    services: ["Culture & sensitivity", "MIC panels"],
    lat: -1.26,
    lon: 36.82,
  },
  {
    name: "Kenyatta University Teaching & Referral Hospital",
    location: "Kahawa, Nairobi",
    city: "Nairobi",
    county: "Nairobi County",
    role: "University teaching hospital",
    turnaround: "48 hrs",
    services: ["Culture & sensitivity", "Research collaboration"],
    lat: -1.18,
    lon: 36.93,
  },
  {
    name: "Moi Teaching & Referral Hospital Lab",
    location: "Nandi Road, Eldoret",
    city: "Eldoret",
    county: "Uasin Gishu County",
    role: "Western Kenya referral hub",
    turnaround: "72 hrs",
    services: ["Culture & sensitivity", "AMR surveillance"],
    lat: 0.51,
    lon: 35.27,
  },
  {
    name: "Coast General Teaching & Referral Hospital",
    location: "Kisauni Road, Mombasa",
    city: "Mombasa",
    county: "Mombasa County",
    role: "Coastal referral hub",
    turnaround: "72 hrs",
    services: ["Culture & sensitivity"],
    lat: -4.05,
    lon: 39.67,
  },
  {
    name: "KEMRI Wellcome Trust Research Programme",
    location: "Kilifi",
    city: "Kilifi",
    county: "Kilifi County",
    role: "Genomic research centre",
    services: ["WGS sequencing", "Clinical research"],
    lat: -3.63,
    lon: 39.85,
  },
  {
    name: "KEMRI Centre for Global Health Research",
    location: "Kisian, Kisumu",
    city: "Kisumu",
    county: "Kisumu County",
    role: "Regional surveillance research centre",
    services: ["AMR surveillance", "Research collaboration"],
    lat: -0.08,
    lon: 34.6,
  },
  {
    name: "Jaramogi Oginga Odinga Teaching & Referral Hospital",
    location: "Kisumu",
    city: "Kisumu",
    county: "Kisumu County",
    role: "Lake region referral hospital",
    services: ["Culture & sensitivity"],
    lat: -0.1,
    lon: 34.77,
  },
  {
    name: "Nyeri County Referral Hospital Laboratory",
    location: "Nyeri",
    city: "Nyeri",
    county: "Nyeri County",
    role: "Central Kenya referral hospital",
    services: ["Culture & sensitivity"],
    lat: -0.42,
    lon: 36.95,
  },
];

// Simplified outline of Kenya (lon, lat). Drawn locally; no external map service.
const outline: [number, number][] = [
  [34.0, -1.0],
  [33.9, 0.1],
  [34.5, 1.1],
  [34.8, 1.9],
  [35.0, 3.6],
  [35.8, 4.6],
  [35.9, 5.0],
  [36.8, 4.4],
  [38.1, 3.6],
  [39.6, 3.4],
  [40.8, 4.2],
  [41.9, 3.9],
  [41.0, 2.8],
  [41.0, -0.9],
  [41.6, -1.7],
  [40.2, -2.6],
  [39.6, -4.4],
  [39.2, -4.7],
  [37.7, -3.5],
  [37.6, -3.0],
  [34.0, -1.0],
];

const W = 400;
const H = 460;
const project = (lon: number, lat: number) => ({
  x: ((lon - 33.5) / (42.3 - 33.5)) * W,
  y: ((5.3 - lat) / (5.3 + 5.0)) * H,
});
const outlinePath =
  outline
    .map(([lo, la], i) => {
      const p = project(lo, la);
      return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ") + " Z";

function HubMap({
  items,
  active,
  onSelect,
}: {
  items: Lab[];
  active: string | null;
  onSelect: (name: string) => void;
}) {
  const shown = new Set(items.map((l) => l.name));
  return (
    <div className="rounded-3xl border border-border bg-card p-4 md:p-6 lg:sticky lg:top-24">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="group"
        aria-label="Map of target validation sites in Kenya"
      >
        <path
          d={outlinePath}
          className="fill-primary/5 stroke-primary/40"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {labs.map((l) => {
          const p = project(l.lon, l.lat);
          const visible = shown.has(l.name);
          const isActive = active === l.name;
          return (
            <g
              key={l.name}
              transform={`translate(${p.x},${p.y})`}
              className={`cursor-pointer transition-opacity ${visible ? "opacity-100" : "opacity-15"}`}
              role="button"
              tabIndex={visible ? 0 : -1}
              aria-label={`${l.name}, ${l.city}`}
              onClick={() => onSelect(l.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(l.name);
                }
              }}
            >
              {visible && (
                <circle
                  r={6}
                  className="fill-primary/30 motion-safe:animate-ping"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              <circle
                r={isActive ? 8 : 5}
                className={
                  isActive ? "fill-primary stroke-foreground" : "fill-primary stroke-background"
                }
                strokeWidth={1.5}
              />
            </g>
          );
        })}
      </svg>
      <p className="mt-3 text-xs text-muted-foreground">
        Select a pin to see the site's role. Locations are approximate.
      </p>
    </div>
  );
}

export function PartnerLabs() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return labs;
    return labs.filter((l) =>
      [l.name, l.location, l.city, l.county, l.role, ...l.services]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const select = (name: string) => {
    setActive(name);
    document
      .getElementById(`lab-${labs.findIndex((l) => l.name === name)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section id="labs" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">
            Clinical validation
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Target clinical sites for validation
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Sites listed are intended validation settings, not confirmed partners.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search target clinical sites by county, city or capability"
              placeholder="Search by county, city or capability (e.g. Kisumu, WGS)"
              className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <span className="text-xs text-muted-foreground sm:whitespace-nowrap" aria-live="polite">
            {filtered.length} site{filtered.length === 1 ? "" : "s"} listed
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
          <HubMap items={filtered} active={active} onSelect={select} />

          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((lab) => (
              <button
                type="button"
                id={`lab-${labs.indexOf(lab)}`}
                key={lab.name}
                onClick={() => setActive(lab.name)}
                className={`text-left rounded-3xl border bg-card p-6 shadow-soft hover:shadow-elegant transition-all flex flex-col scroll-mt-28 ${
                  active === lab.name ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary">
                  <FlaskConical size={20} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground leading-snug">{lab.name}</h3>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  {lab.role}
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin size={15} className="mt-0.5 text-primary shrink-0" />
                  {lab.location}, {lab.county}
                </div>
                {lab.turnaround && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={15} className="text-primary shrink-0" />
                    Typical turnaround today: {lab.turnaround}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {lab.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="sm:col-span-2 rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No target clinical sites match that search. Interested in piloting BactoAI at your
                facility?{" "}
                <a href="/contact" className="text-primary font-semibold hover:underline">
                  Request a validation partnership
                </a>
                .
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card/60 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            <span className="font-semibold text-foreground">Complementary, not a replacement.</span>{" "}
            BactoAI aims for under 10 minutes from genome to result. Conventional laboratory testing
            and professional clinical judgment remain essential. Contact us to discuss a supervised
            validation pilot.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-elegant transition-shadow shrink-0"
          >
            Request a Pilot <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
