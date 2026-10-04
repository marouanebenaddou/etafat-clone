// Countries where ETAFAT has delivered projects — drives the interactive globe.
// `iso` is the ISO 3166-1 numeric code (matches the world-atlas topojson ids).
// Project lists are populated where known (the flagship projects); the others
// are listed as presence only until their projects are provided.
export type PresenceProject = { title: string; place?: string };

export type PresenceCountry = {
  iso: number;
  name: string;
  region: "Afrique" | "Europe" | "Moyen-Orient" | "Asie" | "Amérique latine";
  projects: PresenceProject[];
};

export const PRESENCE: PresenceCountry[] = [
  // ───────────────────────── Afrique ─────────────────────────
  {
    iso: 504, name: "Maroc", region: "Afrique", projects: [
      { title: "IFE – Lot 68 – Tiznit–Tarsouat" },
      { title: "IFE – Lot 4 – Al Hoceima / Bni Gmil" },
      { title: "IFE – Lot 2 – Al Hoceima / Bni Ammart" },
      { title: "IFE – Lot 19 – Sefrou / Aghbalou Aqorar" },
      { title: "OCP REGIS – Gestion du patrimoine foncier et immobilier" },
      { title: "SIG du Registre National Agricole" },
      { title: "Recensement des plantations fruitières de Fès-Boulemane" },
      { title: "Mise en place d’un SIG pilote – RADEEJ" },
      { title: "Solution Web et Mobile pour l’expertise agricole et la multirisque climatique – MAMDA" },
      { title: "Inventaire et gestion des actifs imposables de Skhirate–Témara" },
      { title: "Système de veille des bâtiments menaçant ruine – Grand Casablanca" },
      { title: "SI de gestion du patrimoine immobilier – Barid Al-Maghrib" },
      { title: "PVA, LiDAR, orthophotos et restitutions numériques de Casablanca" },
      { title: "PVA, ortho-images et plans de restitution – Beni Mellal, Fquih Ben Salah et Khouribga" },
      { title: "PVA et orthophotos – Tiznit, Beni Mellal, Azilal et Chichaoua" },
      { title: "PVA et orthophotos – Taroudant, Guelmim–Sidi Ifni, Essaouira et bassin de Massa" },
      { title: "PVA et orthophotos – Driouch, Khouribga, Sidi Slimane, Settat, Ouarzazate, Berkane et Khemisset–Tiflet" },
      { title: "PVA et plans stéréophotogrammétriques – Tétouan" },
      { title: "PVA et plans stéréophotogrammétriques – Tétouan et centres environnants" },
      { title: "PVA et plans stéréophotogrammétriques – Littoral Martil, Azla et Amsa" },
      { title: "PVA et orthophotos – Province d’El Jadida" },
      { title: "PVA et orthophotos – Bnidghough et Lemnakra" },
      { title: "PVA et orthophotos – Ville d’El Jadida et périphérie" },
      { title: "PVA et orthophotos – Centres d’El Jadida et Sidi Bennour" },
      { title: "PVA et orthophotos – Littoral Haouzia, Sidi Abed, Laatatra et Laagagcha" },
      { title: "Ortho-photo-plans, plans cotés et parcellaires des Douars de Marrakech" },
      { title: "Maquette numérique 3D de Rabat et de la Vallée du Bouregreg" },
      { title: "PVA et restitution de la Vallée du Bouregreg" },
      { title: "PVA, orthophotos et restitutions numériques d’Agadir" },
      { title: "PVA et plans stéréophotogrammétriques – Berrechid et Benslimane" },
      { title: "PVA et plans stéréophotogrammétriques – El Gara, El Foqra Ouled Ameur et Ouled Yahya Louta" },
      { title: "Prises de vues aériennes verticales et restitution numérique pour projets éoliens" },
      { title: "Projet cartographique de l’Agence Urbaine de Taroudannt–Tiznit–Tata" },
      { title: "Orthophotos haute résolution de la commune de Ras El Ma" },
      { title: "Cartes géologiques numériques sur 35 000 km²" },
      { title: "Numérisation et modélisation 3D du patrimoine de la ville d’Azemmour" },
      { title: "Anfa Place Casablanca – Maquette 3D et simulation de trafic" },
      { title: "Maquette numérique 3D BIM d’un échangeur autoroutier" },
      { title: "Complexe industriel de fabrication de matériaux pour batteries électriques – Jorf Lasfar" },
      { title: "Futur siège du Crédit du Maroc à Casablanca" },
      { title: "Plateforme d’alerte précoce aux crues et gestion du domaine public hydraulique du Loukkos" },
      { title: "Atlas des zones inondables de la province d’Al Haouz" },
      { title: "Atlas des zones inondables de la zone d’action de l’ABHL" },
      { title: "Plans de prévention des risques d’inondation de Tanger-Assilah" },
      { title: "Atlas des zones inondables – Taroudant et Chichaoua" },
      { title: "Plans topographiques pour l’utilisation des eaux excédentaires des bassins du Nord" },
      { title: "Plans topographiques du barrage Beni Mansour sur Oued Laou" },
      { title: "Plans topographiques des barrages Assaka et Ait Ziat" },
      { title: "Plans topographiques du barrage sur Oued Lakhdar" },
      { title: "Étude topographique et bathymétrique du barrage El Kansara" },
      { title: "Levés bathymétriques de onze ports marocains" },
      { title: "Bathymétrie des barrages Mansour Eddahbi et Sultan Moulay Ali Cherif" },
      { title: "Travaux topographiques et bathymétriques de six retenues de barrages" },
      { title: "Travaux bathymétriques et expertise 3D du complexe portuaire Tanger Med" },
      { title: "Levés bathymétriques multifaisceaux pour le contrôle du dragage de Tanger Med" },
      { title: "Prestations de bathymétrie au port Tanger Med" },
      { title: "Étude bathymétrique du barrage Lalla Takerkoust" },
      { title: "Levé bathymétrique d’Imiouaddar" },
      { title: "Contrôle topographique des infrastructures du port Nador West Med" },
      { title: "Assistance, contrôle et suivi topographique de la lagune de Marchica" },
      { title: "Étude, suivi et contrôle topographique et bathymétrique de la lagune de Marchica" },
      { title: "Étude, assistance et contrôle topographique de la lagune de Marchica" },
      { title: "Travaux topographiques à l’intérieur du port de Casablanca" },
      { title: "Études topographiques des parcs éoliens Jbel Al Hadid et Taza II" },
      { title: "Eco-Cité Zenata – Prestations topographiques" },
      { title: "Avant-projet de l’autoroute continentale Rabat–Casablanca" },
      { title: "Études topographiques de la ligne BHNS T1 de Marrakech" },
      { title: "Études topographiques des projets Casablanca Aménagement" },
      { title: "Prestations topographiques pour routes régionales" },
      { title: "Prestations topographiques – Direction des Routes Lot 4" },
      { title: "Études topographiques des lignes TCSP T3 et T4 de Casablanca" },
      { title: "Tramway Casablanca – Ligne T2 et extension T1" },
      { title: "Études topographiques de la première ligne du Tramway de Casablanca" },
      { title: "Travaux topographiques LYDEC" },
      { title: "Renforcement des réseaux d’assainissement de Casablanca et Mohammedia" },
      { title: "Contrôle extérieur des ouvrages de protection contre les crues de l’Oued Bouskoura" },
      { title: "Contrôle topographique de la Trémie des Almohades" },
      { title: "Travaux topographiques et cartographiques ANCFCC – Catégorie D" },
      { title: "Plan coté et suivi topographique du Sindibad Beach Resort" },
      { title: "Al Houara Coastal Resort – Topographical Consultancy Services" },
      { title: "Aménagement de la Ville Verte de Bouskoura" },
      { title: "Projet Tanger Med Port – Prestations topographiques" },
      { title: "Auscultation topographique des bâtiments du projet Al Ikhlass" },
      { title: "Relevés topographiques 2D/3D des monuments historiques de la Médina de Fès" },
      { title: "Travaux topographiques par laser scanner 3D sur la RN8" },
      { title: "Bouskoura Golf City – Études et maîtrise d’œuvre des VRD" },
      { title: "Ryad Al Andalous – Études et maîtrise d’œuvre des réseaux AEP et assainissement" },
      { title: "Études techniques et maîtrise d’œuvre des réseaux eau et assainissement – SRM Casablanca-Settat" },
      { title: "Maquette numérique 3D du tramway T2 de Casablanca" },
      { title: "Évaluation volumétrique des actifs industriels de l’OCP" },
      { title: "Détection des réseaux souterrains de Jorf Lasfar" },
      { title: "Topographie et détection des réseaux enterrés de l’usine Oulmès" },
      { title: "Numérisation 3D de l’église du Sacré-Cœur" },
      { title: "Inventaire et évaluation des façades historiques de Rabat" },
    ],
  },
  {
    iso: 384, name: "Côte d'Ivoire", region: "Afrique", projects: [
      { title: "PAGEF – Renforcement du cadastrage pour le recouvrement de l’impôt foncier de la ville d’Abidjan" },
      { title: "PAMOFOR Phase Pilote – Lot 2 – Sud-Comoé et Indénié-Djuablin" },
      { title: "PAMOFOR Phase Pilote – Lot 3 – Bafing et N’Zi" },
      { title: "PAMOFOR Phase Extension – Lot 2 – Sud-Comoé et Indénié-Djuablin" },
      { title: "PAMOFOR Phase Extension – Lot 3 – Bafing et N’Zi" },
      { title: "PAGDS – Renforcement du cadastrage de Daloa, Korhogo et Yamoussoukro" },
      { title: "PAGDS – Recensement électronique des parcelles et des activités économiques" },
      { title: "PAGDS – Suivi des chantiers par photogrammétrie pour l’AGEROUTE" },
      { title: "PRESFOR – Lot 5 – Région du Gontougo" },
      { title: "PRESFOR – Lot 12 – Région du Bafing" },
      { title: "Fourniture, installation et maintenance de 11 stations permanentes GNSS/CORS" },
      { title: "Levé bathymétrique multifaisceaux de la lagune d’Ébrié" },
      { title: "Relevé IMMS et modélisation 3D BIM de l’Hôtel Harmattan à Bouaké" },
      { title: "Relevé IMMS et modélisation 3D BIM du Palais Présidentiel" },
      { title: "Détection du pipeline PETROCI – Pacobo–Yamoussoukro" },
      { title: "Détection des réseaux enterrés du campus de l’ESATIC à Abidjan" },
      { title: "Scan 3D de la façade du nouveau parc des expositions d’Abidjan" },
    ],
  },
  {
    iso: 686, name: "Sénégal", region: "Afrique", projects: [
      { title: "SMART PROCASEF – Vallée du Fleuve Sénégal et Ferlo" },
      { title: "SMART PROCASEF – Casamance Naturelle" },
      { title: "Relevé LiDAR aéroporté du TER Dakar–Thiès" },
      { title: "Études topographiques et hydrauliques des sites du Projet Enseignement Supérieur Professionnel Orienté Insertion et Réussite des Jeunes" },
      { title: "Prises de vues aériennes de plusieurs villes du Sénégal" },
      { title: "Détection des réseaux enterrés entre Tobène et Taïba" },
    ],
  },
  {
    iso: 478, name: "Mauritanie", region: "Afrique", projects: [
      { title: "Système d’information de gestion des opérations minières – MAADEN" },
      { title: "Prises de vues aériennes de la liaison routière Nouakchott–Nouadhibou" },
      { title: "Prises de vues aériennes LiDAR de la liaison électrique Nouakchott–Nouadhibou" },
    ],
  },
  {
    iso: 324, name: "Guinée", region: "Afrique", projects: [
      { title: "Mise en place d’un SIG pour la DNGR et cartographie des infrastructures routières des zones de production rizi-piscicoles en Guinée Forestière et Basse Guinée" },
    ],
  },
  {
    iso: 624, name: "Guinée-Bissau", region: "Afrique", projects: [
      { title: "Levé LiDAR aérien du projet de barrage hydroélectrique de Saltinho" },
    ],
  },
  {
    iso: 854, name: "Burkina Faso", region: "Afrique", projects: [
      { title: "Conception et déploiement d’outils pour l’élaboration d’un MNT LiDAR pour le suivi des inondations" },
    ],
  },
  {
    iso: 178, name: "Congo", region: "Afrique", projects: [
      { title: "Acquisition LiDAR des agglomérations de Brazzaville et Pointe-Noire – DURQuaP" },
      { title: "Levé LiDAR pour les études d’aménagement et de bitumage de la route Liranga–Ngangania" },
    ],
  },
  {
    iso: 148, name: "Tchad", region: "Afrique", projects: [
      { title: "PILIER – Mise à jour des plans d’urbanisme et acquisition de données aériennes pour la planification urbaine" },
    ],
  },
  { iso: 788, name: "Tunisie", region: "Afrique", projects: [
      { title: "Réalisation du plan topographique de la ville de Sousse par LiDAR aéroporté et orthophotographies" },
    ] },
  { iso: 466, name: "Mali", region: "Afrique", projects: [
      { title: "Relevé par scanner 3D et modélisation 3D des trois ponts de Bamako" },
    ] },
  { iso: 430, name: "Libéria", region: "Afrique", projects: [] },
  { iso: 288, name: "Ghana", region: "Afrique", projects: [] },
  { iso: 768, name: "Togo", region: "Afrique", projects: [
      { title: "Mission de levé 2D et établissement des plans – Villa 112 – Lomé" },
    ] },
  { iso: 566, name: "Nigéria", region: "Afrique", projects: [] },
  { iso: 266, name: "Gabon", region: "Afrique", projects: [] },
  { iso: 24, name: "Angola", region: "Afrique", projects: [] },
  { iso: 180, name: "République Démocratique du Congo", region: "Afrique", projects: [] },
  { iso: 508, name: "Mozambique", region: "Afrique", projects: [
      { title: "Levés LiDAR et imagerie aérienne des sous-bassins versants de Montepuez, Nacala, Nampula et Pemba" },
      { title: "Plan de développement des marchés de Maputo" },
      { title: "Adressage des rues et gestion urbaine de Matola" },
      { title: "Implémentation d’adresses au Mozambique" },
    ] },
  { iso: 108, name: "Burundi", region: "Afrique", projects: [
      { title: "PADCAE-B – Digitalisation du foncier et de l’agriculture, certification et sécurisation foncière des terres agricoles" },
    ] },
  { iso: 204, name: "Bénin", region: "Afrique", projects: [] },
  { iso: 270, name: "Gambie", region: "Afrique", projects: [] },

  // ───────────────────────── Europe ──────────────────────────
  { iso: 250, name: "France", region: "Europe", projects: [
      { title: "Programme GB Infographie – Numérisation de plans topographiques, plans de bâtiments, feuilles cadastrales et cartes pour SIG" },
      { title: "Travaux de numérisation SIG – 14 communes" },
      { title: "Travaux de numérisation SIG – 10 communes – 1998" },
      { title: "Travaux de numérisation SIG – 10 communes – 1999" },
      { title: "Travaux de numérisation SIG – 12 communes" },
      { title: "Travaux de numérisation SIG – 44 communes" },
    ] },
  { iso: 300, name: "Grèce", region: "Europe", projects: [] },

  // ─────────────────────── Moyen-Orient ──────────────────────
  { iso: 634, name: "Qatar", region: "Moyen-Orient", projects: [] },
  { iso: 784, name: "Émirats arabes unis", region: "Moyen-Orient", projects: [] },
  { iso: 682, name: "Arabie Saoudite", region: "Moyen-Orient", projects: [] },

  // ─────────────────────────── Asie ──────────────────────────
  { iso: 608, name: "Philippines", region: "Asie", projects: [
      { title: "SPLIT – Subdivision Survey of Collective CLOAs 2024-A – Lot 18" },
    ] },

  // ────────────────────── Amérique latine ────────────────────
  { iso: 170, name: "Colombie", region: "Amérique latine", projects: [] },
];

export const PRESENCE_BY_ISO: Map<number, PresenceCountry> = new Map(
  PRESENCE.map((c) => [c.iso, c]),
);

export const PRESENCE_COUNT = PRESENCE.length;
export const PRESENCE_PROJECT_COUNT = PRESENCE.reduce((n, c) => n + c.projects.length, 0);
