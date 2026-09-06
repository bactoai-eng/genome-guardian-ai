import samwelPhoto from "@/assets/samwel-elegwa.png.asset.json";
import sheilaPhoto from "@/assets/sheila-okwisa.png.asset.json";
import carolynePhoto from "@/assets/carolyne-mboya.jpg.asset.json";
import sylviaPhoto from "@/assets/sylvia-jane-nyambura.jpg.asset.json";

type Member = {
  name: string;
  role: string;
  bio: string;
  extended: string;
  focus: string[];
  photo?: string;
};

const team: Member[] = [
  {
    name: "Samwel Elegwa",
    role: "Founder & CEO",
    photo: samwelPhoto.url,
    bio: "Biotechnology researcher at Kenyatta University with hands-on analytical experience from a Kenya Bureau of Standards attachment (gravimetry, titrimetry, spectroscopy). Alumnus of the NextGen Antimicrobial Stewards Initiative and 2nd-place finisher at Kenyatta's Entrepreneur in Science bootcamp, where BactoAI was first pitched.",
    extended:
      "Samwel set out to build BactoAI after watching clinicians wait days for culture-based susceptibility results while patients stayed on broad-spectrum therapy. He leads the scientific direction of the prediction engine — which resistance determinants matter clinically, how confidence is communicated to a prescriber, and what evidence a hospital needs before trusting a genomic call. He represents BactoAI with hospitals, universities, funders, and antimicrobial stewardship networks across East Africa.",
    focus: ["Scientific direction", "AMR stewardship", "Fundraising & partnerships"],
  },
  {
    name: "Sheila Okwisa",
    role: "Chief Technology Officer",
    photo: sheilaPhoto.url,
    bio: "Software engineer leading BactoAI's platform, cloud infrastructure, and deployment tooling. Focused on making genome-in / report-out AMR pipelines reliable enough for low-resource clinical labs.",
    extended:
      "Sheila owns the end-to-end engineering of the platform: sequence intake, the analysis pipeline, the clinician-facing report, and the security model that keeps patient-linked data protected. Her design constraint is the reality of the labs BactoAI serves — intermittent connectivity, mixed hardware, and small teams — so the system has to be simple to operate and predictable under load.",
    focus: ["Platform architecture", "Cloud & deployment", "Data security"],
  },
  {
    name: "William Otieno",
    role: "Machine Learning Engineer",
    bio: "Electrical engineer specializing in applied machine learning and predictive analytics. Owns the AMR prediction models — training, evaluation, and interpretability for clinician-facing outputs.",
    extended:
      "William builds and validates the models that turn a bacterial genome into a per-antibiotic resistance prediction. His work covers feature engineering from genomic data, honest evaluation against held-out isolates, calibration so confidence scores mean what they say, and interpretability so a clinician can see which genetic determinants drove a call rather than receiving an unexplained verdict.",
    focus: ["Model training", "Validation & calibration", "Interpretability"],
  },
  {
    name: "Sylvia Jane Nyambura",
    role: "Chief Operating Officer",
    photo: sylviaPhoto.url,
    bio: "Runs day-to-day operations, pilot logistics, and organizational strategy — the connective tissue between our scientific, engineering, and partnership tracks.",
    extended:
      "Sylvia keeps BactoAI's pilots running: onboarding lab sites, coordinating sample and sequencing logistics, tracking milestones against funder commitments, and making sure the science, engineering, and partnership tracks stay in step. She also leads internal process, hiring coordination, and reporting.",
    focus: ["Pilot operations", "Logistics & planning", "Reporting & process"],
  },
  {
    name: "Carolyne Mboya",
    role: "Business Partnerships Lead",
    photo: carolynePhoto.url,
    bio: "Leads partnerships with hospitals, research institutes, and funders — translating BactoAI's clinical value into deployment-ready collaborations across East Africa.",
    extended:
      "Carolyne develops the relationships that put BactoAI in front of patients: hospital laboratories, national research institutes, universities, and grant programmes. She shapes each collaboration from first conversation to signed pilot — scoping what a site needs, aligning it with BactoAI's roadmap, and keeping partners informed as the platform matures.",
    focus: ["Hospital partnerships", "Grants & funders", "Market development"],
  },
];


const advisors = [
  {
    name: "Dr. Orinda",
    role: "Scientific Advisor",
    tags: ["Microbiology", "AMR", "Clinical validation"],
  },
  {
    name: "Dr. Thomas Musyoka, PhD",
    role: "Bioinformatics Advisor",
    tags: ["Computational biology", "ML", "Genomics"],
  },
  {
    name: "Kenyatta Innovation Centre",
    role: "Innovation Partner",
    tags: ["Commercialization", "Incubation", "Mentorship"],
  },
];

function initials(n: string) {
  return n
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}

export function Team() {
  return (
    <section id="team" className="py-24 md:py-32 bg-card/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest">Team</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Scientists, engineers, and clinicians — building precision AMR diagnostics.
          </h2>
        </div>

        <div
          className="mt-14 rounded-3xl border border-dashed border-border/70 bg-card/30 h-64 md:h-80 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Team photo coming soon
          </span>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-background p-6 shadow-soft hover:shadow-elegant transition"
            >
              <div className="flex items-center gap-4">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={`${m.name}, ${m.role} at BactoAI`}
                    loading="lazy"
                    className="w-14 h-14 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-hero text-white flex items-center justify-center font-bold">
                    {initials(m.name)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-foreground">{m.name}</div>
                  <div className="text-xs text-primary font-medium">{m.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-bold text-foreground">Advisors & Partners</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {advisors.map((a) => (
              <div key={a.name} className="rounded-2xl border border-border bg-background p-6">
                <div className="font-semibold text-foreground">{a.name}</div>
                <div className="text-xs text-primary font-medium">{a.role}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] rounded-full bg-muted px-2.5 py-1 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
