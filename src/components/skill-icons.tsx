import {
  Compass,
  FolderOpen,
  ShieldCheck,
  MapPin,
  Map,
  Satellite,
  Box,
  Layers,
  PenLine,
  Search,
  Eye,
  Waves,
  Wheat,
  type LucideIcon,
} from "lucide-react";

/**
 * Map each universal savoir-faire slug to a Lucide icon.
 * Line-art style matches the geofit visual language.
 */
export const SKILL_ICONS: Record<string, LucideIcon> = {
  "topographie-et-geodesie": Compass,
  "assistance-fonciere": FolderOpen,
  "cadastre-et-securisation-fonciere": ShieldCheck,
  "releves-geospatiaux": MapPin,
  cartographie: Map,
  "geospatial-intelligence": Satellite,
  "modelisation-3d-et-bim": Box,
  "systemes-d-information-geographique": Layers,
  "etudes-territoriales": PenLine,
  "conseil-et-audit-geospatial": Search,
};

/**
 * Keyword-based fallback: match common ETAFAT skill name patterns to icons.
 * Order matters — first match wins.
 */
const KEYWORD_RULES: Array<[RegExp, LucideIcon]> = [
  [/topographie|geodesie|geodes/i, Compass],
  [/scanner|laser|nuages? de points/i, Eye],
  [/assistance.+fonc|foncier.+assist/i, FolderOpen],
  [/cadastre|securisation|securis/i, ShieldCheck],
  [/inspection.+structure|inspection des ouvrages|inspection/i, Eye],
  [/bathymetrie|hydrograph|eau|hydraul/i, Waves],
  [/agric|rural|cultur/i, Wheat],
  [/parcellair|plans? parcellair|emprise/i, FolderOpen],
  [/cartograph|plans?|map/i, Map],
  [/foncier/i, FolderOpen],
  [/sig|systeme.+information|bases? de donnees|webmapping/i, Layers],
  [/3d|bim|modelisation|jumeaux/i, Box],
  [/geospatial.+intelligence|intelligence|geoint|analyse spatial/i, Satellite],
  [/releve|acquisition|lidar|drone|mobile mapping|gnss/i, MapPin],
  [/etude/i, PenLine],
  [/conseil|audit/i, Search],
];

/**
 * Resolve a savoir-faire title to a Lucide icon.
 * First tries exact slug match; falls back to keyword pattern matching;
 * defaults to Compass.
 */
export function iconForSkillTitle(title: string): LucideIcon {
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
  return Compass;
}
