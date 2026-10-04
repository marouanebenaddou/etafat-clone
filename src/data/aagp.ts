// Gazoduc Afrique Atlantique (AAGP, Nigeria–Maroc) — the globe's "AAGP" overlay on the borne:
// the 13 countries the pipeline runs through (ISO 3166-1 numeric, same ids as presence.ts / world-atlas)
// and its offshore route along the West African coast, from the Niger Delta up to southern Spain,
// traced after the « Projet de tracé du gazoduc » map.

export const AAGP_COUNTRIES: { iso: number; fr: string; en: string }[] = [
  { iso: 566, fr: "Nigéria", en: "Nigeria" },
  { iso: 204, fr: "Bénin", en: "Benin" },
  { iso: 768, fr: "Togo", en: "Togo" },
  { iso: 288, fr: "Ghana", en: "Ghana" },
  { iso: 384, fr: "Côte d’Ivoire", en: "Côte d’Ivoire" },
  { iso: 430, fr: "Libéria", en: "Liberia" },
  { iso: 694, fr: "Sierra Leone", en: "Sierra Leone" },
  { iso: 324, fr: "Guinée", en: "Guinea" },
  { iso: 624, fr: "Guinée-Bissau", en: "Guinea-Bissau" },
  { iso: 270, fr: "Gambie", en: "Gambia" },
  { iso: 686, fr: "Sénégal", en: "Senegal" },
  { iso: 478, fr: "Mauritanie", en: "Mauritania" },
  { iso: 504, fr: "Maroc", en: "Morocco" },
];

// [lon, lat], a little offshore, south-east → north
export const AAGP_ROUTE: [number, number][] = [
  [6.2, 4.2], // Niger Delta (Nigeria)
  [4.6, 5.6],
  [3.4, 6.1], // Lagos
  [2.4, 6.1], // Cotonou
  [1.2, 5.9], // Lomé
  [0.0, 5.4], // Tema
  [-1.8, 4.6], // Takoradi
  [-4.0, 4.9], // Abidjan
  [-6.6, 4.3], // San-Pédro
  [-9.0, 4.9],
  [-10.9, 6.0], // Monrovia
  [-13.4, 8.1], // Freetown
  [-14.2, 9.3], // Conakry
  [-16.3, 11.4], // Bissau
  [-17.1, 13.3], // Banjul
  [-17.8, 14.6], // Dakar
  [-16.7, 18.1], // Nouakchott
  [-17.4, 20.8], // Nouadhibou
  [-16.4, 23.6], // Dakhla
  [-14.0, 26.6],
  [-12.6, 28.2],
  [-10.1, 30.4], // Agadir
  [-9.9, 32.3], // Safi
  [-7.9, 33.9], // Casablanca
  [-6.9, 34.7],
  [-6.4, 35.7], // Tanger
  [-6.3, 36.5], // Cadix (Espagne)
];

// globe view while the overlay is on: centred on the route, zoomed in on West Africa
export const AAGP_FOCUS = { center: [-7, 19] as [number, number], zoom: 1.75 };
