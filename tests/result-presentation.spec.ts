import { expect, test } from "@playwright/test";
import { presentResults } from "../src/lib/result-presentation";
import type { AmrSummary } from "../src/lib/amr-summary.functions";

const summary = (rationale: string): AmrSummary => ({
  overall_risk: "critical",
  headline: "Generated headline",
  summary: "Generated summary",
  drug_risks: [{ drug: "Meropenem", risk: "high", confidence: 95, rationale }],
  evidence: [],
  recommendations: ["Generated advice"],
  limitations: [],
});

test("only retained model probability, interval and recommendation are presented", () => {
  expect(
    presentResults(
      summary("Resistance probability 95% (95% interval 88% to 99%). Confirm in the lab."),
    ),
  ).toEqual([
    {
      drug: "Meropenem",
      status: "Resistant",
      probability: 95,
      interval: { lower: 88, upper: 99 },
      recommendation: "Confirm in the lab.",
    },
  ]);
});

test("missing fields and derived confidence are omitted instead of invented", () => {
  expect(presentResults(summary("No retained model fields"))).toEqual([
    { drug: "Meropenem", status: "Resistant" },
  ]);
  expect(presentResults(summary("Resistance probability 40%."))[0]).toEqual({
    drug: "Meropenem",
    status: "Resistant",
    probability: 40,
  });
});

test("uncertain calls remain uncertain without a binary prediction", () => {
  const input = summary("Resistance probability 50%.");
  input.drug_risks[0].risk = "moderate";
  expect(presentResults(input)[0].status).toBe("Uncertain");
});
