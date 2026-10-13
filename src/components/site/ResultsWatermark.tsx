import type { ReactNode } from "react";
import logo from "@/assets/bactoai-logo-wordmark.png.asset.json";

export function ResultsWatermark({ children }: { children: ReactNode }) {
  return (
    <div className="results-watermark-panel">
      <img className="results-watermark" src={logo.url} alt="" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
