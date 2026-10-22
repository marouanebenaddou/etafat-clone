// The borne's projets phares (src/data/evenement.ts) as they appear on the WEBSITE: each project gets one of the
// site's six domains (the Références tabs / domaines d'activité) and its country (ISO numeric, same ids as the
// presence globe), so the Références explorer, the /references/<slug> pages, the presence globe and the domain
// pages all read the same list. Adding a project to the borne + one line here puts it on the site too.
import { EVENEMENT_PROJETS, type EvenementProjet } from "@/data/evenement";
import { PRESENCE_BY_ISO } from "@/data/presence";

export type DomainSlug =
  | "foncier"
  | "amenagement-du-territoire"
  | "energie-mines"
  | "batiment-patrimoine"
  | "infrastructures"
  | "agriculture-eau";

export const DOMAIN_LABELS: Record<DomainSlug, string> = {
  foncier: "Foncier",
  "amenagement-du-territoire": "Aménagement du territoire",
  "energie-mines": "Énergie & Mines",
  "batiment-patrimoine": "Bâtiment & Patrimoine",
  infrastructures: "Infrastructures",
  "agriculture-eau": "Agriculture & Eau",
};

export const DOMAIN_ICONS: Record<DomainSlug, string> = {
  foncier: "ph:map-trifold-duotone",
  "amenagement-du-territoire": "ph:buildings-duotone",
  "energie-mines": "ph:sun-duotone",
  "batiment-patrimoine": "ph:bank-duotone",
  infrastructures: "ph:road-horizon-duotone",
  "agriculture-eau": "ph:drop-duotone",
};

const MA = 504, CI = 384, SN = 686, CG = 178, BF = 854, MR = 478, TD = 148, GW = 624, GN = 324, TN = 788, BI = 108, TG = 768;

// borne project number → [site domain, country]
const SITE: Record<number, [DomainSlug, number]> = {
  1: ["amenagement-du-territoire", MA],
  2: ["foncier", CI],
  3: ["foncier", MA],
  4: ["amenagement-du-territoire", CG],
  5: ["infrastructures", MA],
  6: ["energie-mines", CI],
  7: ["batiment-patrimoine", CI],
  8: ["agriculture-eau", BF],
  9: ["infrastructures", CI],
  10: ["batiment-patrimoine", MA],
  11: ["energie-mines", MR],
  12: ["energie-mines", MA],
  13: ["infrastructures", MA],
  14: ["foncier", CI],
  15: ["amenagement-du-territoire", TD],
  16: ["infrastructures", CG],
  17: ["energie-mines", GW],
  18: ["energie-mines", MA],
  19: ["batiment-patrimoine", MA],
  20: ["infrastructures", MA],
  21: ["agriculture-eau", GN],
  22: ["foncier", CI],
  23: ["foncier", MA],
  24: ["batiment-patrimoine", MA],
  25: ["foncier", MA],
  26: ["foncier", MA],
  27: ["agriculture-eau", MA],
  28: ["infrastructures", MA],
  29: ["agriculture-eau", MA],
  30: ["amenagement-du-territoire", MA],
  31: ["agriculture-eau", TN],
  32: ["infrastructures", MA],
  33: ["batiment-patrimoine", MA],
  34: ["infrastructures", MA],
  35: ["energie-mines", SN],
  36: ["energie-mines", MA],
  37: ["amenagement-du-territoire", MA],
  38: ["amenagement-du-territoire", MA],
  39: ["amenagement-du-territoire", MA],
  40: ["amenagement-du-territoire", MA],
  41: ["agriculture-eau", BI],
  42: ["infrastructures", CI],
  43: ["batiment-patrimoine", CI],
  44: ["batiment-patrimoine", TG],
  45: ["batiment-patrimoine", CI],
  46: ["foncier", CI],
};

// digital platforms (web & mobile apps, information systems) — the Innovation page's "Nos solutions digitales"
const DIGITAL = new Set([3, 11, 21, 22, 23, 24, 25, 26, 27, 28, 29, 41]);

export type SiteProjet = EvenementProjet & {
  domain: DomainSlug;
  domainLabel: string;
  country: number;
  countryName: string;
  digital: boolean;
  href: string;
  images: string[];
};

export const SITE_PROJETS: SiteProjet[] = EVENEMENT_PROJETS.filter((p) => SITE[p.n]).map((p) => {
  const [domain, country] = SITE[p.n];
  return {
    ...p,
    domain,
    domainLabel: DOMAIN_LABELS[domain],
    country,
    countryName: PRESENCE_BY_ISO.get(country)?.name ?? "",
    digital: DIGITAL.has(p.n),
    href: `/references/${p.slug}/`,
    images: p.media?.images ?? (p.photo ? [p.photo] : []),
  };
});

export const projetBySlug = (slug: string) => SITE_PROJETS.find((p) => p.slug === slug);
export const projetsForDomain = (d: DomainSlug) => SITE_PROJETS.filter((p) => p.domain === d);
export const projetsForCountry = (iso: number) => SITE_PROJETS.filter((p) => p.country === iso);
export const digitalProjets = () => SITE_PROJETS.filter((p) => p.digital);
