import { useState } from "react";
import { AlertOctagon, CheckCircle2, AlertTriangle, Info, FileDown, Loader2 } from "lucide-react";
import type { AmrSummary } from "@/lib/amr-summary.functions";
import { presentResults, RESEARCH_DISCLAIMER } from "@/lib/result-presentation";
import { Button } from "@/components/ui/button";
import { ResultsWatermark } from "./ResultsWatermark";

export const riskStyles: Record<string, string> = {
  low: "bg-susceptible/10 text-susceptible border-susceptible/30",
  moderate: "bg-primary/10 text-primary border-primary/30",
  high: "bg-resistant/10 text-resistant border-resistant/30",
  critical: "bg-resistant/20 text-resistant border-resistant/50",
};

export function AmrSummaryView({ summary }: { summary: AmrSummary }) {
  const results = presentResults(summary);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const download = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const { downloadResultsReport } = await import("@/lib/results-report-pdf");
      await downloadResultsReport(results);
    } catch {
      setDownloadError("Could not create the report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };
  return (
    <ResultsWatermark>
      <section aria-label="Model analysis results" className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold text-primary-text">BactoAI · Research use only</p>
            <h3 className="mt-2 text-xl font-display font-semibold text-foreground">
              Resistance predictions
            </h3>
          </div>
          <Button onClick={download} disabled={downloading} className="min-h-11">
            {downloading ? <Loader2 className="animate-spin" /> : <FileDown />}
            {downloading ? "Creating report…" : "Download PDF report"}
          </Button>
        </header>
        {downloadError && (
          <p role="alert" className="text-sm text-resistant">
            {downloadError}
          </p>
        )}
        <div className="divide-y divide-border">
          {results.map((row) => {
            const uncertain = row.status === "Uncertain";
            const resistant = row.status === "Resistant";
            const Icon = uncertain ? AlertTriangle : resistant ? AlertOctagon : CheckCircle2;
            const color = uncertain
              ? "text-primary-text"
              : resistant
                ? "text-resistant"
                : "text-susceptible";
            return (
              <article key={row.drug} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="min-w-0 break-words text-base font-semibold text-foreground">
                    {row.drug}
                  </h4>
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold ${color}`}>
                    <Icon size={16} aria-hidden="true" />
                    {row.status}
                  </span>
                </div>
                {row.probability !== undefined && (
                  <dl className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    <dt className="text-muted-foreground">Resistance probability</dt>
                    <dd className="font-mono text-lg text-foreground">{row.probability}%</dd>
                  </dl>
                )}
                {row.interval && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    95% probability interval: {row.interval.lower}%–{row.interval.upper}%
                  </p>
                )}
                {row.recommendation && (
                  <div className="mt-3 border-l-2 border-border pl-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Model recommendation
                    </p>
                    <p className="mt-1 break-words text-sm leading-relaxed text-foreground">
                      {row.recommendation}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <footer className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          <p className="mb-2 inline-flex items-center gap-2 font-semibold text-foreground">
            <Info size={14} aria-hidden="true" />
            Research-use disclaimer
          </p>
          <p>{RESEARCH_DISCLAIMER}</p>
        </footer>
      </section>
    </ResultsWatermark>
  );
}
