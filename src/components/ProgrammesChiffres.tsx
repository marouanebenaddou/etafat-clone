"use client";

import type { CSSProperties } from "react";
import { ChiffresContent } from "@/app/evenement/ChiffresSection";

// The borne's "Nos programmes en chiffres" (PROCASEF / PAMOFOR · PRESFOR) on the website, in the light palette
// its --k-* colour variables expect.
const LIGHT = {
  "--k-text": "#12293f",
  "--k-muted": "rgba(18,41,63,0.62)",
  "--k-surface": "#ffffff",
  "--k-surface-2": "#ffffff",
  "--k-border": "rgba(18,41,63,0.10)",
  "--k-accent": "#00669d",
  "--k-chip": "rgba(0,102,157,0.08)",
} as CSSProperties;

export function ProgrammesChiffres() {
  return (
    <div style={LIGHT}>
      <ChiffresContent />
    </div>
  );
}
