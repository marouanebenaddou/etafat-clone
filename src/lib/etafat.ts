import data from "@/data/etafat-content.json";

export type EtafatSkill = {
  index: number;
  title: string;
  slug: string;
  short: string;
  detail: string;
  competences: string[];
};

export type EtafatDomainCard = {
  index: number;
  name: string;
  short: string;
  competences: string[];
};

export type EtafatDomain = {
  title: string;
  slug: string;
  accroche?: string;
  intro: string[];
  // Aménagement uses the 10 universal skills, others embed cards inline
  skillSlugs?: string[];
  cards?: EtafatDomainCard[];
};

export const domains = data.domains as EtafatDomain[];
export const skills = data.skills as EtafatSkill[];

export function domainBySlug(slug: string): EtafatDomain | undefined {
  return domains.find((d) => d.slug === slug);
}

export function skillBySlug(slug: string): EtafatSkill | undefined {
  return skills.find((s) => s.slug === slug);
}

/**
 * Photo to display on a savoir-faire detail page hero.
 * The 10 original skills have a matching JPG; the 12 newer skills
 * (added from the docx content) borrow a thematically related image.
 */
const SKILL_IMAGE_FALLBACKS: Record<string, string> = {
  "plans-parcellaires-et-emprises": "cadastre-et-securisation-fonciere",
  "cartographie-fonciere": "cartographie",
  "sig-foncier-et-bases-cadastrales": "systemes-d-information-geographique",
  "releves-aeriens-et-lidar": "releves-geospatiaux",
  "scanner-laser-3d-et-mms": "modelisation-3d-et-bim",
  "bathymetrie-et-hydrographie": "releves-geospatiaux",
  "georadar-et-detection-de-reseaux": "releves-geospatiaux",
  "webmapping-et-plateformes-geospatiales": "systemes-d-information-geographique",
  "dematerialisation-et-structuration-de-donnees": "systemes-d-information-geographique",
  "assistance-a-maitrise-d-ouvrage": "conseil-et-audit-geospatial",
  "inspection-et-surveillance-d-ouvrage": "conseil-et-audit-geospatial",
  "formation-et-transfert-de-competences": "etudes-territoriales",
  // Ingénierie Conseil (ETAFAT ING) — new savoir-faire, borrow related images
  "etudes-de-faisabilite-et-diagnostics": "etudes-territoriales",
  "etudes-techniques-aps-apd-pro": "modelisation-3d-et-bim",
  "controle-et-surveillance-des-travaux": "conseil-et-audit-geospatial",
  "maitrise-d-oeuvre-et-pilotage-de-projets": "conseil-et-audit-geospatial",
};
export function skillImage(slug: string): string {
  const resolved = SKILL_IMAGE_FALLBACKS[slug] ?? slug;
  return `/etafat/skills/${resolved}.jpg`;
}

/** Hero video for a domain detail page. */
export function domainVideo(slug: string): string {
  return `/etafat/domains/${slug}.mp4`;
}

/**
 * Curated "savoir-faire associés" map: for each of the 22 skills, the most
 * thematically related skills (same family — acquisition, foncier, data/SIG,
 * 3D/ouvrage, conseil). Every value is a valid skill slug, so each card links
 * to a real /savoir-faire/<slug>/ page. Order = relevance.
 */
const RELATED_SKILLS: Record<string, string[]> = {
  // --- Acquisition / relevés terrain ---
  "topographie-et-geodesie": [
    "releves-geospatiaux",
    "releves-aeriens-et-lidar",
    "scanner-laser-3d-et-mms",
    "cartographie",
    "plans-parcellaires-et-emprises",
  ],
  "releves-geospatiaux": [
    "topographie-et-geodesie",
    "releves-aeriens-et-lidar",
    "scanner-laser-3d-et-mms",
    "bathymetrie-et-hydrographie",
    "georadar-et-detection-de-reseaux",
  ],
  "releves-aeriens-et-lidar": [
    "releves-geospatiaux",
    "topographie-et-geodesie",
    "scanner-laser-3d-et-mms",
    "cartographie",
    "modelisation-3d-et-bim",
  ],
  "scanner-laser-3d-et-mms": [
    "modelisation-3d-et-bim",
    "releves-geospatiaux",
    "releves-aeriens-et-lidar",
    "inspection-et-surveillance-d-ouvrage",
    "topographie-et-geodesie",
  ],
  "bathymetrie-et-hydrographie": [
    "releves-geospatiaux",
    "topographie-et-geodesie",
    "georadar-et-detection-de-reseaux",
    "cartographie",
    "releves-aeriens-et-lidar",
  ],
  "georadar-et-detection-de-reseaux": [
    "releves-geospatiaux",
    "topographie-et-geodesie",
    "scanner-laser-3d-et-mms",
    "inspection-et-surveillance-d-ouvrage",
    "bathymetrie-et-hydrographie",
  ],
  // --- Foncier / cadastre ---
  "assistance-fonciere": [
    "cadastre-et-securisation-fonciere",
    "plans-parcellaires-et-emprises",
    "cartographie-fonciere",
    "sig-foncier-et-bases-cadastrales",
    "etudes-territoriales",
  ],
  "cadastre-et-securisation-fonciere": [
    "assistance-fonciere",
    "plans-parcellaires-et-emprises",
    "cartographie-fonciere",
    "sig-foncier-et-bases-cadastrales",
    "topographie-et-geodesie",
  ],
  "plans-parcellaires-et-emprises": [
    "cadastre-et-securisation-fonciere",
    "assistance-fonciere",
    "cartographie-fonciere",
    "topographie-et-geodesie",
    "sig-foncier-et-bases-cadastrales",
  ],
  "cartographie-fonciere": [
    "cartographie",
    "sig-foncier-et-bases-cadastrales",
    "cadastre-et-securisation-fonciere",
    "plans-parcellaires-et-emprises",
    "assistance-fonciere",
  ],
  "sig-foncier-et-bases-cadastrales": [
    "systemes-d-information-geographique",
    "cartographie-fonciere",
    "cadastre-et-securisation-fonciere",
    "dematerialisation-et-structuration-de-donnees",
    "assistance-fonciere",
  ],
  // --- Data / SIG / cartographie ---
  cartographie: [
    "systemes-d-information-geographique",
    "cartographie-fonciere",
    "webmapping-et-plateformes-geospatiales",
    "geospatial-intelligence",
    "dematerialisation-et-structuration-de-donnees",
  ],
  "systemes-d-information-geographique": [
    "geospatial-intelligence",
    "cartographie",
    "webmapping-et-plateformes-geospatiales",
    "dematerialisation-et-structuration-de-donnees",
    "sig-foncier-et-bases-cadastrales",
  ],
  "geospatial-intelligence": [
    "systemes-d-information-geographique",
    "cartographie",
    "webmapping-et-plateformes-geospatiales",
    "dematerialisation-et-structuration-de-donnees",
    "conseil-et-audit-geospatial",
  ],
  "webmapping-et-plateformes-geospatiales": [
    "systemes-d-information-geographique",
    "geospatial-intelligence",
    "cartographie",
    "dematerialisation-et-structuration-de-donnees",
    "sig-foncier-et-bases-cadastrales",
  ],
  "dematerialisation-et-structuration-de-donnees": [
    "systemes-d-information-geographique",
    "webmapping-et-plateformes-geospatiales",
    "sig-foncier-et-bases-cadastrales",
    "geospatial-intelligence",
    "cartographie",
  ],
  // --- 3D / BIM / ouvrage ---
  "modelisation-3d-et-bim": [
    "scanner-laser-3d-et-mms",
    "releves-geospatiaux",
    "inspection-et-surveillance-d-ouvrage",
    "topographie-et-geodesie",
    "systemes-d-information-geographique",
  ],
  "inspection-et-surveillance-d-ouvrage": [
    "scanner-laser-3d-et-mms",
    "modelisation-3d-et-bim",
    "georadar-et-detection-de-reseaux",
    "releves-geospatiaux",
    "conseil-et-audit-geospatial",
  ],
  // --- Conseil / accompagnement ---
  "etudes-territoriales": [
    "conseil-et-audit-geospatial",
    "geospatial-intelligence",
    "cartographie",
    "systemes-d-information-geographique",
    "assistance-fonciere",
  ],
  "conseil-et-audit-geospatial": [
    "assistance-a-maitrise-d-ouvrage",
    "etudes-territoriales",
    "geospatial-intelligence",
    "formation-et-transfert-de-competences",
    "systemes-d-information-geographique",
  ],
  "assistance-a-maitrise-d-ouvrage": [
    "conseil-et-audit-geospatial",
    "etudes-territoriales",
    "inspection-et-surveillance-d-ouvrage",
    "formation-et-transfert-de-competences",
    "assistance-fonciere",
  ],
  "formation-et-transfert-de-competences": [
    "conseil-et-audit-geospatial",
    "assistance-a-maitrise-d-ouvrage",
    "etudes-territoriales",
    "systemes-d-information-geographique",
    "geospatial-intelligence",
  ],
  // --- Ingénierie Conseil (ETAFAT ING) — related to existing skills ---
  "etudes-de-faisabilite-et-diagnostics": [
    "etudes-territoriales",
    "conseil-et-audit-geospatial",
    "assistance-a-maitrise-d-ouvrage",
    "geospatial-intelligence",
    "systemes-d-information-geographique",
  ],
  "etudes-techniques-aps-apd-pro": [
    "modelisation-3d-et-bim",
    "topographie-et-geodesie",
    "conseil-et-audit-geospatial",
    "assistance-a-maitrise-d-ouvrage",
    "cartographie",
  ],
  "controle-et-surveillance-des-travaux": [
    "inspection-et-surveillance-d-ouvrage",
    "conseil-et-audit-geospatial",
    "assistance-a-maitrise-d-ouvrage",
    "topographie-et-geodesie",
    "releves-geospatiaux",
  ],
  "maitrise-d-oeuvre-et-pilotage-de-projets": [
    "assistance-a-maitrise-d-ouvrage",
    "conseil-et-audit-geospatial",
    "etudes-territoriales",
    "inspection-et-surveillance-d-ouvrage",
    "formation-et-transfert-de-competences",
  ],
};

/**
 * Resolve the savoir-faire associated with a given skill slug.
 * Falls back to the first N other skills if the slug isn't in the curated map.
 */
export function relatedSkills(slug: string, limit = 5): EtafatSkill[] {
  const wanted = RELATED_SKILLS[slug];
  const ordered = wanted ?? skills.map((s) => s.slug).filter((x) => x !== slug);
  return ordered
    .filter((x) => x !== slug)
    .map((x) => skillBySlug(x))
    .filter((s): s is EtafatSkill => Boolean(s))
    .slice(0, limit);
}

/** Get the savoir-faire cards to display for a given domain. */
export function cardsForDomain(domain: EtafatDomain): EtafatDomainCard[] {
  if (domain.cards && domain.cards.length) return domain.cards;
  if (domain.skillSlugs) {
    return domain.skillSlugs
      .map((slug, i) => {
        const s = skillBySlug(slug);
        if (!s) return null;
        return {
          index: i + 1,
          name: s.title,
          short: s.short,
          competences: s.competences,
        };
      })
      .filter(Boolean) as EtafatDomainCard[];
  }
  return [];
}
