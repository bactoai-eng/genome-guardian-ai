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

// Kenya border (lon, lat), traced from national boundary reference points. Drawn locally; no external map service.
const outline: [number, number][] = [
  [33.91, -1.0],
  [33.91, 0.1],
  [34.0, 0.24],
  [34.1, 0.37],
  [34.28, 0.62],
  [34.42, 0.82],
  [34.5, 1.1],
  [34.8, 1.25],
  [35.0, 1.6],
  [34.95, 2.0],
  [34.9, 2.5],
  [34.6, 3.0],
  [34.45, 3.5],
  [34.2, 3.9],
  [34.0, 4.25],
  [33.99, 4.62],
  [34.4, 4.62],
  [35.0, 4.85],
  [35.3, 5.0],
  [35.8, 4.78],
  [35.95, 4.6],
  [36.05, 4.45],
  [36.85, 4.45],
  [37.6, 4.0],
  [38.1, 3.6],
  [38.6, 3.6],
  [39.0, 3.45],
  [39.5, 3.43],
  [39.9, 3.85],
  [40.4, 4.0],
  [40.8, 4.25],
  [41.2, 3.95],
  [41.85, 3.95],
  [41.6, 3.6],
  [41.3, 3.2],
  [40.99, 2.8],
  [40.99, 1.5],
  [40.99, 0.0],
  [41.0, -0.87],
  [41.55, -1.68],
  [41.1, -1.9],
  [40.85, -2.2],
  [40.6, -2.4],
  [40.2, -2.75],
  [40.1, -3.2],
  [39.85, -3.6],
  [39.65, -4.0],
  [39.5, -4.35],
  [39.2, -4.68],
  [38.4, -4.1],
  [37.7, -3.6],
  [37.6, -3.0],
  [36.5, -2.4],
  [35.5, -1.85],
  [34.6, -1.35],
  [34.07, -1.05],
];
const lakeVictoria: [number, number][] = [
  [33.91, -1.0],
  [34.07, -1.05],
  [34.25, -0.75],
  [34.35, -0.5],
  [34.6, -0.42],
  [34.82, -0.32],
  [34.7, -0.18],
  [34.45, -0.2],
  [34.2, -0.08],
  [34.05, 0.05],
  [33.91, 0.1],
];
const lakeTurkana: [number, number][] = [
  [35.95, 4.55],
  [36.12, 4.45],
  [36.2, 4.0],
  [36.3, 3.55],
  [36.5, 3.0],
  [36.68, 2.5],
  [36.6, 2.4],
  [36.4, 2.8],
  [36.15, 3.3],
  [35.98, 3.8],
  [35.88, 4.2],
];
const landmarks = [
  { name: "Mt Kenya", lon: 37.3, lat: -0.15 },
  { name: "Mt Kilimanjaro", lon: 37.35, lat: -3.07 },
];
const regionLabels = [
  { name: "UGANDA", lon: 33.95, lat: 2.0 },
  { name: "ETHIOPIA", lon: 38.6, lat: 4.6 },
  { name: "SOMALIA", lon: 41.75, lat: 1.2 },
  { name: "TANZANIA", lon: 35.3, lat: -3.8 },
  { name: "SOUTH SUDAN", lon: 34.4, lat: 5.1 },
  { name: "INDIAN OCEAN", lon: 41.0, lat: -3.9 },
];
const cityLabels = [
  { name: "Nairobi", lon: 36.82, lat: -1.29, dx: -8, anchor: "end" },
  { name: "Mombasa", lon: 39.67, lat: -4.05, dx: -8, anchor: "end" },
  { name: "Kisumu", lon: 34.76, lat: -0.09, dx: 0, dy: 16, anchor: "middle" },
  { name: "Eldoret", lon: 35.27, lat: 0.51, dx: 8, anchor: "start" },
  { name: "Nyeri", lon: 36.95, lat: -0.42, dx: 8, anchor: "start" },
  { name: "Kilifi", lon: 39.85, lat: -3.63, dx: 8, anchor: "start" },
] as const;

const W = 400;
const H = 460;
const project = (lon: number, lat: number) => ({
  x: ((lon - 33.3) / (42.5 - 33.3)) * W,
  y: ((5.4 - lat) / (5.4 + 5.0)) * H,
});
const toPath = (pts: [number, number][]) =>
  pts
    .map(([lo, la], i) => {
      const p = project(lo, la);
      return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ") + " Z";
const outlinePath = toPath(outline);
const victoriaPath = toPath(lakeVictoria);
const turkanaPath = toPath(lakeTurkana);
const equatorY = project(0, 0).y;

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
        <defs>
          <pattern id="kenya-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" className="fill-primary/20" />
          </pattern>
        </defs>
        {regionLabels.map((r) => {
          const p = project(r.lon, r.lat);
          return (
            <text
              key={r.name}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              className="fill-muted-foreground/50"
              style={{ fontSize: 9, letterSpacing: 2 }}
            >
              {r.name}
            </text>
          );
        })}
        <line
          x1={0}
          x2={W}
          y1={equatorY}
          y2={equatorY}
          className="stroke-muted-foreground/30"
          strokeDasharray="3 5"
          strokeWidth={0.8}
        />
        <text
          x={W - 4}
          y={equatorY - 4}
          textAnchor="end"
          className="fill-muted-foreground/60"
          style={{ fontSize: 8 }}
        >
          Equator
        </text>
        <path
          d={outlinePath}
          className="fill-primary/10 stroke-primary/60"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        <path d={outlinePath} fill="url(#kenya-grid)" />
        <path d={victoriaPath} className="fill-accent/40 stroke-primary/40" strokeWidth={0.8} />
        <path d={turkanaPath} className="fill-accent/40 stroke-primary/40" strokeWidth={0.8} />
        {(() => {
          const p = project(34.25, -0.55);
          return (
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              className="fill-muted-foreground/70"
              style={{ fontSize: 7 }}
            >
              L. Victoria
            </text>
          );
        })()}
        {(() => {
          const p = project(36.75, 3.4);
          return (
            <text x={p.x} y={p.y} className="fill-muted-foreground/70" style={{ fontSize: 7 }}>
              L. Turkana
            </text>
          );
        })()}
        {landmarks.map((m) => {
          const p = project(m.lon, m.lat);
          return (
            <g key={m.name} transform={`translate(${p.x},${p.y})`}>
              <path d="M0,-5 L5,4 L-5,4 Z" className="fill-muted-foreground/40" />
              <text x={7} y={4} className="fill-muted-foreground/60" style={{ fontSize: 7 }}>
                {m.name}
              </text>
            </g>
          );
        })}
        {cityLabels.map((c) => {
          const p = project(c.lon, c.lat);
          return (
            <text
              key={c.name}
              x={p.x + c.dx}
              y={p.y + ("dy" in c ? c.dy : 3)}
              textAnchor={c.anchor}
              className="fill-foreground/80 font-medium"
              style={{ fontSize: 9 }}
            >
              {c.name}
            </text>
          );
        })}
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
