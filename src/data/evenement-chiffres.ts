// Key figures for the "Chiffres clés" section (borne + website + VR).
// Single source of truth: evenement-chiffres.json (the VR copies it to
// public/xr/chiffres-xr.json via scripts/build-xr-sections.mjs).
// Numbers are exact as supplied by ETAFAT; labels are condensed for the kiosk.
import raw from "./evenement-chiffres.json";

export type FunnelStep = { value: number; label: string; detail: string };
export type Stat = { value: number; prefix?: string; suffix?: string; label: string; detail?: string };

export type Programme = {
  key: "procasef" | "pamofor";
  country: string;
  name: string;
  tagline: string;
  closing: string;
};

export const PROCASEF = raw.procasef as Programme & {
  steps: FunnelStep[];
  footprint: Stat[];
};

export const PAMOFOR = raw.pamofor as Programme & {
  hero: Stat;
  stats: Stat[];
  territory: Stat[];
};
