// English content for the borne (/evenement kiosk) and the VR app (/xr) — the French originals stay in
// evenement.ts, evenement-apps.ts, presence.ts and evenement-chiffres.json. Keyed by slug / key / ISO code,
// so adding a project means adding its translation here too (missing entries fall back to French).

export type ThemeEn = { label: string; tagline: string };
export type ProjetEn = { title: string; subThemes: string[]; description: string; short?: string };

export const THEMES_EN: Record<string, ThemeEn> = {
  "villes-territoires-patrimoine": { label: "Cities, territories and heritage", tagline: "Urban modelling, mapping and heritage enhancement" },
  "foncier-cadastre-si": { label: "Land, cadastre and information systems", tagline: "Land tenure security, cadastre and information systems" },
  "infrastructures-transports-reseaux": { label: "Infrastructure, transport and networks", tagline: "Roads, underground networks and major structures" },
  "eau-environnement-maritime": { label: "Water, environment and maritime works", tagline: "Bathymetry, hydrology and maritime structures" },
  "batiment-industrie-mines": { label: "Buildings, industry and mining", tagline: "3D scanning, BIM, industrial and mining sites" },
  "agriculture-rural": { label: "Agriculture and rural development", tagline: "Agricultural GIS and rural territorial development" },
};

export const PROJETS_EN: Record<string, ProjetEn> = {
  "maquette-numerique-3d-de-rabat-et-de-la-vallee-du-bouregreg": { title: "3D digital model of Rabat and the Bouregreg Valley", subThemes: ["3D urban modelling", "Urban planning", "Geoportal", "Virtual tours"], description: "3D digital twin of Rabat and the Bouregreg Valley, shared through a geoportal and virtual tours to support urban planning." },
  "pagef-renforcement-du-cadastrage-a-abidjan": { title: "PAGEF — Strengthening the cadastre of Abidjan", subThemes: ["Fiscal cadastre", "Property inventory", "Cadastral mapping", "Aerial and LiDAR acquisition"], description: "Strengthening Abidjan’s fiscal cadastre: property inventory, cadastral mapping and aerial and LiDAR acquisition." },
  "regis-gestion-du-patrimoine-foncier-et-immobilier-de-locp": { title: "REGIS — Land and real-estate asset management for OCP", short: "REGIS — OCP land and real-estate assets", subThemes: ["Land asset management", "Web and mobile GIS", "Digitalisation of procedures", "Document management"], description: "Web and mobile GIS platform to manage OCP’s land and real-estate assets and digitalise its procedures." },
  "leves-lidar-de-brazzaville-et-pointe-noire": { title: "LiDAR surveys of Brazzaville and Pointe-Noire", subThemes: ["Large-scale urban mapping", "Airborne LiDAR", "Digital terrain models", "Orthophotography"], description: "Large-scale urban mapping of Brazzaville and Pointe-Noire with airborne LiDAR, digital terrain models and orthophotography." },
  "bathymetrie-et-expertise-3d-des-ouvrages-de-tanger-med": { title: "Bathymetry and 3D assessment of the Tanger Med structures", subThemes: ["Port bathymetry", "Structural assessment", "3D surveys"], description: "Port bathymetry and 3D assessment of the structures of the port of Tanger Med." },
  "detection-du-pipeline-petroci-pacoboyamoussoukro": { title: "PETROCI pipeline detection — Pacobo–Yamoussoukro", subThemes: ["Pipelines", "Underground network detection", "Georeferencing", "Network mapping"], description: "Detection and georeferencing of the PETROCI pipeline between Pacobo and Yamoussoukro, with mapping of the underground networks." },
  "maquette-bim-de-lhotel-harmattan-a-bouake": { title: "BIM model of the Harmattan Hotel in Bouaké", subThemes: ["As-built survey by mobile scanner", "BIM modelling", "Plans and floor areas", "Virtual tours"], description: "Mobile-scanner survey and BIM model of the Harmattan Hotel in Bouaké, with plans, floor areas and virtual tours." },
  "mnt-lidar-pour-le-suivi-des-inondations-au-burkina-faso": { title: "LiDAR DTM for flood monitoring in Burkina Faso", subThemes: ["Flood risk", "Watercourse topography", "Digital terrain models", "Hydraulic structure surveys"], description: "LiDAR digital terrain models to monitor flood risk and hydraulic structures in Burkina Faso." },
  "pagds-suivi-des-chantiers-pour-lageroute": { title: "PAGDS — Construction-site monitoring for AGEROUTE", subThemes: ["Road construction monitoring", "Drone photogrammetry", "Multi-date comparison", "Training"], description: "Monitoring of AGEROUTE road construction sites by drone photogrammetry, with multi-date comparison and team training." },
  "numerisation-3d-de-leglise-du-sacre-cur": { title: "3D digitisation of the Sacré-Cœur church", subThemes: ["Architectural heritage", "3D laser scanning", "Geometric diagnosis", "Documentation for rehabilitation"], description: "3D laser-scan digitisation of the Sacré-Cœur church for its geometric diagnosis and the documentation of its rehabilitation." },
  "systeme-dinformation-des-operations-minieres-de-maaden": { title: "Information system for MAADEN’s mining operations", subThemes: ["Mining GIS", "Permit management", "Operating areas management", "Field reporting"], description: "Geographic information system for MAADEN’s mining operations: permits, operating areas and field reporting." },
  "evaluation-volumetrique-des-actifs-industriels-de-locp": { title: "Volumetric assessment of OCP’s industrial assets", subThemes: ["Stockpile inventory", "3D laser scanning", "Volume calculation", "Storage capacity management"], description: "Volumetric assessment of OCP’s industrial stockpiles by 3D laser scanning, to manage storage capacity." },
  "maquette-numerique-3d-du-tramway-t2-de-casablanca": { title: "3D digital model of Casablanca’s T2 tramway", subThemes: ["Urban transport", "Interactive 3D model", "Construction visualisation", "Touch interface"], description: "Interactive 3D model of Casablanca’s T2 tramway to visualise the works on a touch interface." },
  "pagds-cadastre-de-daloa-korhogo-et-yamoussoukro": { title: "PAGDS — Cadastre of Daloa, Korhogo and Yamoussoukro", subThemes: ["Urban cadastre", "Land tenure surveys", "3D building modelling", "Online cadastre"], description: "Urban cadastre of Daloa, Korhogo and Yamoussoukro: land tenure surveys, 3D building modelling and online publication of the cadastre." },
  "pilier-donnees-aeriennes-et-plans-durbanisme-de-ndjamena": { title: "PILIER — Aerial data and urban plans for N’Djamena", subThemes: ["Urban planning", "Aerial acquisition", "LiDAR and photogrammetry", "Geographic reference data"], description: "Airborne LiDAR and photogrammetric acquisition and urban plans for N’Djamena, with a geographic reference dataset." },
  "leve-lidar-de-la-route-lirangangangania": { title: "LiDAR survey of the Liranga–Ngangania road", subThemes: ["Road studies", "Corridor mapping", "Airborne LiDAR", "Digital terrain models"], description: "Study of the Liranga–Ngangania road corridor with airborne LiDAR and digital terrain models." },
  "leve-lidar-pour-le-barrage-hydroelectrique-de-saltinho": { title: "LiDAR survey for the Saltinho hydroelectric dam", subThemes: ["Hydropower", "Site topography", "Airborne LiDAR", "Geodetic network"], description: "Airborne LiDAR survey and geodetic network for the Saltinho hydroelectric dam." },
  "detection-des-reseaux-souterrains-de-jorf-lasfar": { title: "Underground network detection at Jorf Lasfar", subThemes: ["Buried industrial networks", "Ground-penetrating radar and electromagnetic detection", "Georeferencing", "Network plans"], description: "Ground-penetrating radar and electromagnetic detection of Jorf Lasfar’s buried industrial networks, with georeferenced plans." },
  "releves-2d-et-3d-des-monuments-de-la-medina-de-fes": { title: "2D and 3D surveys of the monuments of the Fez medina", subThemes: ["Urban heritage", "Architectural inventory", "Façade surveys", "3D modelling and rehabilitation"], description: "2D and 3D surveys and architectural inventory of the monuments of the Fez medina, ahead of their rehabilitation." },
  "controle-du-dragage-par-bathymetrie-a-tanger-med": { title: "Dredging control by bathymetry at Tanger Med", subThemes: ["Port dredging", "Multibeam bathymetry", "Control of maritime works"], description: "Control of the dredging works at the port of Tanger Med by multibeam bathymetry." },
  "sig-de-la-dngr-pour-les-zones-de-production-rizi-piscicoles-": { title: "DNGR GIS for rice-fish farming areas in Guinea", short: "DNGR GIS — rice-fish farming areas (Guinea)", subThemes: ["Institutional GIS", "Road infrastructure mapping", "Improving rural access", "Training"], description: "Institutional GIS for the DNGR to open up rice-fish farming production areas in Guinea." },
  "smart-pamofor-application-web-et-mobile-pour-la-securisation": { title: "SMART PAMOFOR — Web and mobile app for rural land tenure security", short: "SMART PAMOFOR — Rural land security (web & mobile)", subThemes: ["Land information system", "Offline mobile data collection", "Data centralisation", "Geoportal"], description: "Web and mobile application for rural land tenure security, with offline data collection, data centralisation and a geoportal." },
  "smart-ife-application-web-et-mobile-pour-un-projet-foncier": { title: "SMART IFE — Web and mobile app for a land project", subThemes: ["Land registration", "Mobile data collection", "Parcel data management", "GIS"], description: "Web and mobile land registration application: mobile data collection, parcel data management and GIS." },
  "systeme-de-veille-des-batiments-menacant-ruine-du-grand-casa": { title: "Monitoring system for buildings at risk of collapse in Greater Casablanca", short: "Monitoring buildings at risk of collapse in Greater Casablanca", subThemes: ["Building-related risks", "Geographic inventory", "Indicators and alerts", "Intervention tracking"], description: "Monitoring system for buildings at risk of collapse in Greater Casablanca: geographic inventory, indicators and tracking of interventions." },
  "systeme-dinformation-du-patrimoine-immobilier-de-barid-al-ma": { title: "Real-estate asset information system for Barid Al-Maghrib", short: "Barid Al-Maghrib real-estate information system", subThemes: ["Property management", "Asset register", "Lease management", "Digitalisation of procedures"], description: "Real-estate asset information system for Barid Al-Maghrib: asset register, lease management and digitalisation of procedures." },
  "inventaire-et-gestion-des-actifs-imposables-de-skhiratetemar": { title: "Inventory and management of taxable assets in Skhirate–Témara", short: "Taxable assets inventory — Skhirate–Témara", subThemes: ["Local taxation", "Use of public land", "Signs and billboards inventory", "Fee calculation"], description: "Inventory of Skhirate–Témara’s taxable assets: use of public land, signage and fee calculation." },
  "solution-web-et-mobile-dexpertise-agricole-et-multirisque-cl": { title: "Web and mobile agricultural and multi-risk climate assessment solution for MAMDA", short: "Web & mobile agricultural assessment for MAMDA", subThemes: ["Agricultural insurance", "Field assessment", "Geolocated data collection", "Dashboards"], description: "Web and mobile solution for agricultural and multi-risk climate assessment for MAMDA, with geolocated data collection and dashboards." },
  "mise-en-place-dun-sig-pilote-pour-la-radeej": { title: "Setting up a pilot GIS for RADEEJ", short: "Pilot GIS for RADEEJ", subThemes: ["Drinking water", "Sanitation", "MV/LV electrical networks", "GIS data structuring"], description: "RADEEJ pilot GIS structuring its drinking water, sanitation and MV/LV electrical network data." },
  "sig-pour-le-registre-national-agricole": { title: "GIS for the National Agricultural Register", subThemes: ["Agricultural census", "Parcel mapping", "Mobile data collection", "Management platform"], description: "GIS for the National Agricultural Register: census, parcel mapping and mobile data collection." },
  "prises-de-vues-aeriennes-orthophotos-et-restitution-numeriqu": { title: "Aerial photography, orthophotos and digital mapping of Casablanca", subThemes: ["Aerial photogrammetry", "Orthophotography", "Urban mapping", "Topographic reference data"], description: "Aerial photography, orthophotos and digital mapping of Casablanca for an urban topographic reference dataset." },
  "plan-topographique-de-sousse-par-lidar-aeroporte-et-orthopho": { title: "Topographic map of Sousse from airborne LiDAR and orthophotography", short: "Topographic map of Sousse by airborne LiDAR", subThemes: ["Airborne LiDAR", "Photogrammetry", "Urban mapping", "Terrain modelling"], description: "Topographic map of Sousse produced from airborne LiDAR and orthophotography." },
  "releve-de-la-route-nationale-n8-par-scanner-laser-3d-mobile": { title: "Survey of National Road 8 by mobile 3D laser scanning", subThemes: ["Mobile mapping", "Road inventory", "3D point clouds", "360° panoramic imagery"], description: "Survey of National Road 8 by mobile 3D laser scanning: road inventory, point clouds and 360° panoramic imagery." },
  "inventaire-et-evaluation-des-facades-historiques-de-rabat-la": { title: "Inventory and assessment of Rabat’s historic façades — Lagza, Laälou, Sidi Fateh, Waqqassa and Mellah", short: "Inventory and assessment of Rabat’s historic façades", subThemes: ["Architectural heritage", "3D scanning", "Façade surveys", "Documentation for restoration"], description: "Inventory and 3D-scan survey of Rabat’s historic façades to document their restoration." },
  "prestations-geospatiales-pour-lavant-projet-de-lautoroute-ra": { title: "Geospatial services for the preliminary design of the Rabat–Casablanca motorway and the Mohammedia West–Aïn Harrouda section", short: "Geospatial services — Rabat–Casablanca motorway", subThemes: ["Motorway studies", "Satellite imagery", "Digital terrain models", "Parcel plans"], description: "Geospatial services for the preliminary design of the Rabat–Casablanca motorway: satellite imagery, DTM and parcel plans." },
  "detection-des-reseaux-enterres-entre-tobene-et-taiba": { title: "Underground network detection between Tobène and Taïba", subThemes: ["Ground-penetrating radar", "Electromagnetic detection", "Georeferencing", "Network mapping"], description: "Ground-penetrating radar and electromagnetic detection and mapping of the underground networks between Tobène and Taïba." },
  "topographie-et-detection-des-reseaux-enterres-de-lusine-oulm": { title: "Topography and underground network detection at the Oulmès plant", short: "Underground networks at the Oulmès plant", subThemes: ["Industrial networks", "Non-intrusive detection", "Topographic surveys", "Georeferenced plans"], description: "Topography and non-intrusive detection of the Oulmès plant’s underground networks, with georeferenced plans." },
  "cartographie-aerienne-des-localites-de-beni-mellal-azilal-fq": { title: "Aerial mapping of Béni Mellal, Azilal, Fquih Ben Salah and Khouribga", short: "Aerial mapping of Béni Mellal, Azilal, Fquih Ben Salah, Khouribga", subThemes: ["Aerial photogrammetry", "Orthophotography", "Map compilation", "Digital terrain models"], description: "Aerial mapping of Béni Mellal, Azilal, Fquih Ben Salah and Khouribga: orthophotography and digital terrain models." },
  "prises-de-vues-aeriennes-et-plans-photogrammetriques-de-la-p": { title: "Aerial photography and photogrammetric maps of the province of Tétouan", short: "Aerial photography and photogrammetric maps of Tétouan", subThemes: ["Aerial acquisition", "Territorial mapping", "Orthophoto maps", "1:2,000 mapping"], description: "Aerial photography and photogrammetric maps of the province of Tétouan, compiled at 1:2,000." },
  "prises-de-vues-aeriennes-et-orthophotoplans-de-la-province-d": { title: "Aerial photography and orthophoto maps of the province of El Jadida", short: "Aerial photography and orthophoto maps of El Jadida", subThemes: ["Photogrammetry", "Orthophotography", "Elevation and surface models", "Urban mapping"], description: "Aerial photography and orthophoto maps of the province of El Jadida, with elevation and surface models." },
  "acquisition-aerienne-et-restitution-pour-lamenagement-de-la-": { title: "Aerial acquisition and mapping for the development of the Bouregreg Valley", short: "Aerial acquisition for the Bouregreg Valley development", subThemes: ["Territorial development", "Aerial acquisition", "High-resolution orthophotography", "Terrain modelling"], description: "High-resolution aerial acquisition and mapping for the development of the Bouregreg Valley." },
  "sead-padcae-b-portails-public-et-interne-du-burundi": { title: "SEAD — Public & internal portals of PADCAE-B (Burundi)", short: "SEAD — PADCAE-B portals (Burundi)", subThemes: ["Public & internal GIS portal", "Agricultural monitoring and evaluation", "Land tenure security", "Real-time agricultural weather", "Agricultural markets & stakeholder directory"], description: "SEAD platform for PADCAE-B in Burundi: public portal (geolocated agricultural markets, weather by commune, stakeholder directory, financing) and internal portal (monitoring and evaluation, parcel-level land tenure security, land-use map, year-over-year comparison of SEAD reports)." },
};

// field applications (borne "Applications terrain" tile / VR apps panel)
export const APPS_EN: Record<string, { tagline: string }> = {
  procasef: { tagline: "Rural land tenure security — surveys, boundary demarcation and parcel surveying (Senegal)." },
  presfor: { tagline: "Strengthening rural land tenure security (Côte d’Ivoire)." },
  srm: { tagline: "Field monitoring and surveying — SRM project, Casablanca." },
};
export const APPS_SECTION_EN = { label: "Field applications", tagline: "Our data collection apps deployed in the field" };

// presence globe — country names, regions and project lists (same order as presence.ts)
export const REGIONS_EN: Record<string, string> = {
  Afrique: "Africa", Europe: "Europe", "Moyen-Orient": "Middle East", Asie: "Asia", "Amérique latine": "Latin America",
};
export const PRESENCE_EN: Record<number, { name: string; projects?: { title: string; place?: string }[] }> = {
  504: { name: "Morocco", projects: [
    { title: "3D digital model of Rabat and the Bouregreg Valley", place: "Rabat" },
    { title: "3D digital model of the T2 tramway", place: "Casablanca" },
    { title: "Bathymetry and 3D assessment of the port structures", place: "Tanger Med" },
    { title: "Underground network detection", place: "Jorf Lasfar" },
    { title: "2D and 3D surveys of the medina’s monuments", place: "Fez" },
    { title: "BIM model of the Sidi Ali plant", place: "Oulmès" },
    { title: "REGIS — land and real-estate asset management for OCP" },
  ] },
  384: { name: "Côte d’Ivoire", projects: [
    { title: "PAGEF — strengthening the cadastre", place: "Abidjan" },
    { title: "PETROCI pipeline detection", place: "Pacobo–Yamoussoukro" },
    { title: "PAGDS — construction-site monitoring for AGEROUTE" },
    { title: "PAGDS — cadastre of Daloa, Korhogo and Yamoussoukro" },
    { title: "BIM model of the Harmattan Hotel", place: "Bouaké" },
    { title: "PRESFOR — rural land tenure security", place: "Gontougo / Bafing" },
  ] },
  686: { name: "Senegal", projects: [
    { title: "PROCASEF — cadastre and land tenure security", place: "Dakar (Mermoz / Sacré-Cœur)" },
    { title: "SMART PAMOFOR — web and mobile app for rural land tenure security" },
  ] },
  478: { name: "Mauritania", projects: [{ title: "Mining operations information system — MAADEN" }] },
  324: { name: "Guinea", projects: [{ title: "DNGR GIS for rice-fish farming production areas" }] },
  624: { name: "Guinea-Bissau", projects: [{ title: "LiDAR survey for the Saltinho hydroelectric dam" }] },
  854: { name: "Burkina Faso", projects: [{ title: "LiDAR DTM for flood monitoring" }] },
  178: { name: "Congo", projects: [{ title: "LiDAR surveys of Brazzaville and Pointe-Noire" }, { title: "LiDAR survey of the Liranga–Ngangania road" }] },
  148: { name: "Chad", projects: [{ title: "PILIER — aerial data and urban plans", place: "N’Djamena" }] },
  788: { name: "Tunisia" }, 466: { name: "Mali" }, 430: { name: "Liberia" }, 288: { name: "Ghana" }, 768: { name: "Togo" },
  566: { name: "Nigeria" }, 266: { name: "Gabon" }, 24: { name: "Angola" }, 180: { name: "Democratic Republic of the Congo" },
  508: { name: "Mozambique" }, 108: { name: "Burundi" }, 204: { name: "Benin" }, 270: { name: "Gambia" },
  250: { name: "France" }, 300: { name: "Greece" },
  634: { name: "Qatar" }, 784: { name: "United Arab Emirates" }, 682: { name: "Saudi Arabia" },
  608: { name: "Philippines" }, 170: { name: "Colombia" },
};

// key figures (same shape as evenement-chiffres.json)
export const CHIFFRES_EN = {
  procasef: {
    country: "Senegal",
    tagline: "A large-scale land operation securing land rights",
    steps: [
      { label: "Inventoried, surveyed and mapped", detail: "Identification and documentation of land occupancy" },
      { label: "Mapped with NICAD", detail: "Cadastral identification and parcel referencing" },
      { label: "Deliberated by the municipalities", detail: "Formalisation of rights at municipal level" },
      { label: "Approved by the State", detail: "Administrative securing of land decisions" },
      { label: "Occupancy titles issued", detail: "Completion of the land formalisation process" },
    ],
    footprint: [
      { label: "covered by the inventoried parcels" },
      { label: "villages covered" },
      { label: "municipalities", detail: "6 regions · 28 districts" },
      { label: "territorial clusters", detail: "Casamance Naturelle · Senegal River Valley and Ferlo" },
    ],
    closing: "An integrated operational chain, from land inventory to the issuance of occupancy titles, deployed close to territories and communities.",
  },
  pamofor: {
    country: "Côte d’Ivoire",
    tagline: "A large-scale land operation serving rural territories",
    hero: { label: "Securing rural land rights" },
    stats: [
      { label: "land contracts", detail: "Formalising relations between rights holders and land users" },
      { label: "villages supported", detail: "Socio-land engineering: information, awareness and community dialogue" },
      { label: "village boundaries", detail: "Village Territory Delimitations (DTV) — boundaries clarified and secured" },
    ],
    territory: [{ label: "regions" }, { label: "departments" }, { label: "sub-prefectures" }],
    closing: "An integrated approach — socio-land engineering, certification, contracting and delimitation of village territories — to secure rural land sustainably.",
  },
};

/** Overlay the English strings onto a French key-figures object (numbers stay from the French source). */
export function chiffresEn<T extends { procasef: object; pamofor: object }>(fr: T): T {
  const merge = (a: unknown, b: unknown): unknown => {
    if (Array.isArray(a)) return a.map((x, i) => merge(x, Array.isArray(b) ? b[i] : undefined));
    if (a && typeof a === "object") {
      const out: Record<string, unknown> = { ...(a as Record<string, unknown>) };
      if (b && typeof b === "object") for (const [k, v] of Object.entries(b)) out[k] = k in out ? merge(out[k], v) : v;
      return out;
    }
    return b ?? a;
  };
  return merge(fr, CHIFFRES_EN) as T;
}
