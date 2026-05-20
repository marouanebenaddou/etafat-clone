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
