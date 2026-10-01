/**
 * Map each universal savoir-faire slug to an Iconify icon name (Phosphor duotone).
 */
export const SKILL_ICONS: Record<string, string> = {
  "topographie-et-geodesie": "ph:mountains-duotone",
  "assistance-fonciere": "ph:handshake-duotone",
  "cadastre-et-securisation-fonciere": "ph:shield-check-duotone",
  "releves-geospatiaux": "ph:crosshair-simple-duotone",
  cartographie: "ph:map-trifold-duotone",
  "geospatial-intelligence": "ph:globe-hemisphere-west-duotone",
  "modelisation-3d-et-bim": "ph:cube-duotone",
  "systemes-d-information-geographique": "ph:stack-duotone",
  "etudes-territoriales": "ph:chart-bar-duotone",
  "conseil-et-audit-geospatial": "ph:magnifying-glass-plus-duotone",
};

/**
 * Keyword-based fallback: match common ETAFAT skill name patterns to icons.
 * Order matters — first match wins.
 */
const KEYWORD_RULES: Array<[RegExp, string]> = [
  [/topographie|geodesie|geodes/i, "ph:mountains-duotone"],
  [/scanner|laser|nuages? de points/i, "ph:scan-duotone"],
  [/assistance.+fonc|foncier.+assist/i, "ph:handshake-duotone"],
  [/cadastre|securisation|securis/i, "ph:shield-check-duotone"],
  [/inspection.+structure|inspection des ouvrages|inspection/i, "ph:hard-hat-duotone"],
  [/bathymetrie|hydrograph|eau|hydraul/i, "ph:waves-duotone"],
  [/agric|rural|cultur/i, "ph:plant-duotone"],
  [/parcellair|plans? parcellair|emprise/i, "ph:grid-four-duotone"],
  [/cartograph|plans?|map/i, "ph:map-trifold-duotone"],
  [/foncier/i, "ph:map-pin-area-duotone"],
  [/sig|systeme.+information|bases? de donnees|webmapping/i, "ph:stack-duotone"],
  [/3d|bim|modelisation|jumeaux/i, "ph:cube-duotone"],
  [/geospatial.+intelligence|intelligence|geoint|analyse spatial/i, "ph:globe-hemisphere-west-duotone"],
  [/drone|aerien|lidar/i, "ph:drone-duotone"],
  [/releve|acquisition|mobile mapping|gnss/i, "ph:crosshair-simple-duotone"],
  [/radar|reseau/i, "tabler:radar-2"],
  [/etude/i, "ph:chart-bar-duotone"],
  [/conseil|audit/i, "ph:magnifying-glass-plus-duotone"],
  [/formation|transfert/i, "ph:graduation-cap-duotone"],
  [/maitrise.+ouvrage|amoa|moa/i, "ph:user-check-duotone"],
];

/**
 * Illustrated pictures of the savoir-faire (2026 visual refresh): cut from the per-domain mockups into
 * /etafat/visuels/savoir-faire/<domain>/<n>.jpg. Keyed by title slug; the first domain showing a skill wins,
 * plus a few aliases for close titles. Skills without one keep their line icon.
 */
const SKILL_ILLUSTRATIONS: Record<string, string> = {
  "assistance-fonciere": "foncier/1",
  "cadastre-et-securisation-fonciere": "foncier/2",
  "topographie-et-geodesie": "foncier/3",
  "plans-parcellaires-et-emprises": "foncier/4",
  "cartographie-fonciere": "foncier/5",
  "sig-foncier-et-bases-cadastrales": "foncier/6",
  "etudes-foncieres-et-diagnostics-territoriaux": "foncier/7",
  "releves-geospatiaux": "foncier/8",
  "geospatial-intelligence-fonciere": "foncier/9",
  "conseil-et-audit-foncier-geospatial": "foncier/10",
  "cartographie": "amenagement-du-territoire/5",
  "geospatial-intelligence": "amenagement-du-territoire/6",
  "modelisation-3d-et-bim": "amenagement-du-territoire/7",
  "systemes-dinformation-geographique": "amenagement-du-territoire/8",
  "etudes-territoriales": "amenagement-du-territoire/9",
  "conseil-et-audit-geospatial": "amenagement-du-territoire/10",
  "sig-et-bases-de-donnees-geographiques": "energie-mines/4",
  "foncier-et-securisation-des-emprises": "energie-mines/5",
  "scanner-laser-3d-et-nuages-de-points": "batiment-patrimoine/3",
  "inspection-des-structures": "batiment-patrimoine/5",
  "cartographie-et-plans-du-bati": "batiment-patrimoine/6",
  "sig-et-gestion-patrimoniale": "batiment-patrimoine/7",
  "cartographie-et-plans-techniques": "infrastructures/3",
  "sig-et-bases-de-donnees-dinfrastructures": "infrastructures/4",
  "modelisation-3d-et-bim-infrastructure": "infrastructures/6",
  "cartographie-agricole-et-occupation-du-sol": "agriculture-eau/3",
  "sig-agricole-et-bases-de-donnees-rurales": "agriculture-eau/4",
  "gestion-de-leau-et-ouvrages-hydrauliques": "agriculture-eau/5",
  "bathymetrie-et-releves-hydrographiques": "agriculture-eau/6",
  "foncier-rural-et-securisation-des-emprises": "agriculture-eau/7",
  "modeles-numeriques-et-analyse-du-relief": "agriculture-eau/8",
  "geospatial-intelligence-agricole-et-hydrique": "agriculture-eau/9",
  // aliases
  "scanner-laser-3d-et-mms": "batiment-patrimoine/3",
  "bathymetrie-et-hydrographie": "agriculture-eau/6",
  "inspection-et-surveillance-douvrage": "infrastructures/5",
  "releves-aeriens-et-lidar": "amenagement-du-territoire/4",
};

function slugOf(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Illustrated picture for a savoir-faire title, if one exists. */
export function illustrationForSkillTitle(title: string): string | undefined {
  const key = SKILL_ILLUSTRATIONS[slugOf(title)];
  return key ? `/etafat/visuels/savoir-faire/${key}.jpg` : undefined;
}

/**
 * Resolve a savoir-faire title to an Iconify icon name.
 * First tries exact slug match; falls back to keyword pattern matching;
 * defaults to compass.
 */
export function iconForSkillTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['']/g, "")
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (SKILL_ICONS[slug]) return SKILL_ICONS[slug];
  for (const [re, icon] of KEYWORD_RULES) {
    if (re.test(title)) return icon;
  }
  return "ph:compass-duotone";
}
