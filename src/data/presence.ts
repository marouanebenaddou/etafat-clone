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
      { title: "Maquette numérique 3D de Rabat et de la vallée du Bouregreg", place: "Rabat" },
      { title: "Maquette numérique 3D du tramway T2", place: "Casablanca" },
      { title: "Bathymétrie et expertise 3D des ouvrages du port", place: "Tanger Med" },
      { title: "Détection des réseaux souterrains", place: "Jorf Lasfar" },
      { title: "Relevés 2D et 3D des monuments de la médina", place: "Fès" },
      { title: "Maquette BIM de l'usine Sidi Ali", place: "Oulmès" },
      { title: "REGIS — gestion du patrimoine foncier et immobilier de l'OCP" },
    ],
  },
  {
    iso: 384, name: "Côte d'Ivoire", region: "Afrique", projects: [
      { title: "PAGEF — renforcement du cadastrage", place: "Abidjan" },
      { title: "Détection du pipeline PETROCI", place: "Pacobo–Yamoussoukro" },
      { title: "PAGDS — suivi des chantiers pour l'AGEROUTE" },
      { title: "PAGDS — cadastre de Daloa, Korhogo et Yamoussoukro" },
      { title: "Maquette BIM de l'hôtel Harmattan", place: "Bouaké" },
      { title: "PRESFOR — sécurisation foncière rurale", place: "Gontougo / Bafing" },
      { title: "Détection des réseaux enterrés, campus de l'ESATIC", place: "Abidjan" },
      { title: "Maquette BIM du Palais présidentiel" },
    ],
  },
  {
    iso: 686, name: "Sénégal", region: "Afrique", projects: [
      { title: "PROCASEF — cadastre et sécurisation foncière", place: "Dakar (Mermoz / Sacré-Cœur)" },
      { title: "SMART PAMOFOR — application web et mobile de sécurisation foncière rurale" },
    ],
  },
  {
    iso: 478, name: "Mauritanie", region: "Afrique", projects: [
      { title: "Système d'information des opérations minières — MAADEN" },
    ],
  },
  {
    iso: 324, name: "Guinée", region: "Afrique", projects: [
      { title: "SIG de la DNGR pour les zones de production rizi-piscicoles" },
    ],
  },
  {
    iso: 624, name: "Guinée-Bissau", region: "Afrique", projects: [
      { title: "Levé LiDAR pour le barrage hydroélectrique de Saltinho" },
    ],
  },
  {
    iso: 854, name: "Burkina Faso", region: "Afrique", projects: [
      { title: "MNT LiDAR pour le suivi des inondations" },
    ],
  },
  {
    iso: 178, name: "Congo", region: "Afrique", projects: [
      { title: "Levés LiDAR de Brazzaville et Pointe-Noire" },
      { title: "Levé LiDAR de la route Liranga–Ngangania" },
    ],
  },
  {
    iso: 148, name: "Tchad", region: "Afrique", projects: [
      { title: "PILIER — données aériennes et plans d'urbanisme", place: "N'Djaména" },
    ],
  },
  { iso: 788, name: "Tunisie", region: "Afrique", projects: [] },
  { iso: 466, name: "Mali", region: "Afrique", projects: [] },
  { iso: 430, name: "Libéria", region: "Afrique", projects: [] },
  { iso: 288, name: "Ghana", region: "Afrique", projects: [] },
  { iso: 768, name: "Togo", region: "Afrique", projects: [
    { title: "Villa 112 — plans, façades et coupes", place: "Lomé" },
  ] },
  { iso: 566, name: "Nigéria", region: "Afrique", projects: [] },
  { iso: 266, name: "Gabon", region: "Afrique", projects: [] },
  { iso: 24, name: "Angola", region: "Afrique", projects: [] },
  { iso: 180, name: "République Démocratique du Congo", region: "Afrique", projects: [] },
  { iso: 508, name: "Mozambique", region: "Afrique", projects: [] },
  { iso: 108, name: "Burundi", region: "Afrique", projects: [] },
  { iso: 204, name: "Bénin", region: "Afrique", projects: [] },
  { iso: 270, name: "Gambie", region: "Afrique", projects: [] },

  // ───────────────────────── Europe ──────────────────────────
  { iso: 250, name: "France", region: "Europe", projects: [] },
  { iso: 300, name: "Grèce", region: "Europe", projects: [] },

  // ─────────────────────── Moyen-Orient ──────────────────────
  { iso: 634, name: "Qatar", region: "Moyen-Orient", projects: [] },
  { iso: 784, name: "Émirats arabes unis", region: "Moyen-Orient", projects: [] },
  { iso: 682, name: "Arabie Saoudite", region: "Moyen-Orient", projects: [] },

  // ─────────────────────────── Asie ──────────────────────────
  { iso: 608, name: "Philippines", region: "Asie", projects: [] },

  // ────────────────────── Amérique latine ────────────────────
  { iso: 170, name: "Colombie", region: "Amérique latine", projects: [] },
];

export const PRESENCE_BY_ISO: Map<number, PresenceCountry> = new Map(
  PRESENCE.map((c) => [c.iso, c]),
);

export const PRESENCE_COUNT = PRESENCE.length;
export const PRESENCE_PROJECT_COUNT = PRESENCE.reduce((n, c) => n + c.projects.length, 0);
