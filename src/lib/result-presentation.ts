import type { AmrSummary } from "./amr-summary.functions";

export const RESEARCH_DISCLAIMER =
  "Research use only. Predictions support, and do not replace, laboratory testing and clinical judgment. Confirm with phenotypic antimicrobial susceptibility testing.";

export type PresentedResult = {
  drug: string;
  status: "Resistant" | "Susceptible" | "Uncertain";
  probability?: number;
  interval?: { lower: number; upper: number };
  recommendation?: string;
};

/** Only model-backed values retained by the unchanged summary handler.
 * Stored confidence and overall risk are derived, not raw model outputs.
 * Never infer missing probability from confidence or expose generated advice.
 */
export function presentResults(summary: AmrSummary): PresentedResult[] {
  return summary.drug_risks.map((row) => {
    const match =
      /^Resistance probability (\d+)%(?: \(95% interval (\d+)% to (\d+)%\))?\.\s*(.*)$/.exec(
        row.rationale,
      );
    const percent = (value: string | undefined) => {
      if (value === undefined) return undefined;
      const number = Number(value);
      return number >= 0 && number <= 100 ? number : undefined;
    };
    const probability = percent(match?.[1]);
    const lower = percent(match?.[2]);
    const upper = percent(match?.[3]);
    return {
      drug: row.drug,
      status:
        row.risk === "moderate" ? "Uncertain" : row.risk === "high" ? "Resistant" : "Susceptible",
      ...(probability !== undefined ? { probability } : {}),
      ...(lower !== undefined && upper !== undefined && lower <= upper
        ? { interval: { lower, upper } }
        : {}),
      ...(match?.[4]?.trim() ? { recommendation: match[4].trim() } : {}),
    };
  });
}
