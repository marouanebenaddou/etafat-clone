// Pre-renders the VR globe's Earth texture (equirectangular, ETAFAT palette) and
// emits presence-xr.json (per-country lon/lat + projects) for the WebXR app.
// Offline + geographically accurate (d3-geo + world-atlas topojson).
import { createCanvas } from "@napi-rs/canvas";
import { geoEquirectangular, geoPath, geoGraticule10, geoCentroid } from "d3-geo";
import { feature, merge } from "topojson-client";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/xr");

// ── ETAFAT presence (mirrors src/data/presence.ts) ──────────────────────────
const PRESENCE = [
  { iso: 504, name: "Maroc", region: "Afrique", projects: [
    { title: "Maquette numérique 3D de Rabat et de la vallée du Bouregreg", place: "Rabat" },
    { title: "Maquette numérique 3D du tramway T2", place: "Casablanca" },
    { title: "Bathymétrie et expertise 3D des ouvrages du port", place: "Tanger Med" },
    { title: "Détection des réseaux souterrains", place: "Jorf Lasfar" },
    { title: "Relevés 2D et 3D des monuments de la médina", place: "Fès" },
    { title: "Maquette BIM de l'usine Sidi Ali", place: "Oulmès" },
    { title: "REGIS — patrimoine foncier et immobilier de l'OCP" } ] },
  { iso: 384, name: "Côte d'Ivoire", region: "Afrique", projects: [
    { title: "PAGEF — renforcement du cadastrage", place: "Abidjan" },
    { title: "Détection du pipeline PETROCI", place: "Pacobo–Yamoussoukro" },
    { title: "PAGDS — suivi des chantiers pour l'AGEROUTE" },
    { title: "PAGDS — cadastre de Daloa, Korhogo et Yamoussoukro" },
    { title: "Maquette BIM de l'hôtel Harmattan", place: "Bouaké" },
    { title: "PRESFOR — sécurisation foncière rurale", place: "Gontougo / Bafing" } ] },
  { iso: 686, name: "Sénégal", region: "Afrique", projects: [
    { title: "PROCASEF — cadastre et sécurisation foncière", place: "Dakar" },
    { title: "SMART PAMOFOR — application de sécurisation foncière rurale" } ] },
  { iso: 478, name: "Mauritanie", region: "Afrique", projects: [
    { title: "Système d'information des opérations minières — MAADEN" } ] },
  { iso: 324, name: "Guinée", region: "Afrique", projects: [
    { title: "SIG de la DNGR — zones de production rizi-piscicoles" } ] },
  { iso: 624, name: "Guinée-Bissau", region: "Afrique", projects: [
    { title: "Levé LiDAR pour le barrage hydroélectrique de Saltinho" } ] },
  { iso: 854, name: "Burkina Faso", region: "Afrique", projects: [
    { title: "MNT LiDAR pour le suivi des inondations" } ] },
  { iso: 178, name: "Congo", region: "Afrique", projects: [
    { title: "Levés LiDAR de Brazzaville et Pointe-Noire" },
    { title: "Levé LiDAR de la route Liranga–Ngangania" } ] },
  { iso: 148, name: "Tchad", region: "Afrique", projects: [
    { title: "PILIER — données aériennes et plans d'urbanisme", place: "N'Djaména" } ] },
  { iso: 788, name: "Tunisie", region: "Afrique", projects: [] },
  { iso: 466, name: "Mali", region: "Afrique", projects: [] },
  { iso: 430, name: "Libéria", region: "Afrique", projects: [] },
  { iso: 288, name: "Ghana", region: "Afrique", projects: [] },
  { iso: 768, name: "Togo", region: "Afrique", projects: [] },
  { iso: 566, name: "Nigéria", region: "Afrique", projects: [] },
  { iso: 266, name: "Gabon", region: "Afrique", projects: [] },
  { iso: 24, name: "Angola", region: "Afrique", projects: [] },
  { iso: 180, name: "R.D. Congo", region: "Afrique", projects: [] },
  { iso: 508, name: "Mozambique", region: "Afrique", projects: [] },
  { iso: 108, name: "Burundi", region: "Afrique", projects: [] },
  { iso: 250, name: "France", region: "Europe", projects: [] },
  { iso: 300, name: "Grèce", region: "Europe", projects: [] },
  { iso: 634, name: "Qatar", region: "Moyen-Orient", projects: [] },
  { iso: 784, name: "Émirats arabes unis", region: "Moyen-Orient", projects: [] },
  { iso: 682, name: "Arabie Saoudite", region: "Moyen-Orient", projects: [] },
  { iso: 170, name: "Colombie", region: "Amérique latine", projects: [] },
];
const ISO = new Set(PRESENCE.map((c) => c.iso));
// nicer marker coords where a polygon centroid is misleading
const COORD_OVERRIDE = { 250: [2.35, 46.6], 504: [-7.09, 31.8], 682: [45.0, 24.0], 170: [-73.5, 4.6] };

const W = 4096, H = 2048;
const NAVY_DEEP = "#081726", OCEAN = "#0d2740", LAND = "#24506f", LAND2 = "#2b5c7e",
      ACTIVE = "#2ab5b4", ACTIVE_EDGE = "#8ee6e4", GRAT = "rgba(255,255,255,0.05)";

const world = JSON.parse(await readFile(join(ROOT, "src/data/world-110m.json"), "utf8"));
const countries = feature(world, world.objects.countries).features;

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");
const projection = geoEquirectangular().fitSize([W, H], { type: "Sphere" });
const path = geoPath(projection, ctx);

// Morocco shown complete: merge Western Sahara (732) into Morocco (504) so the
// highlighted country isn't cut off and the internal border dissolves.
const WSAHARA = 732, MOR = 504;
const morParts = world.objects.countries.geometries.filter((g) => Number(g.id) === MOR || Number(g.id) === WSAHARA);
const moroccoMerged = { type: "Feature", id: MOR, geometry: merge(world, morParts) };
const activeFeat = (f) => (Number(f.id) === MOR ? moroccoMerged : f);

// ocean
const g = ctx.createLinearGradient(0, 0, 0, H);
g.addColorStop(0, NAVY_DEEP); g.addColorStop(0.5, OCEAN); g.addColorStop(1, NAVY_DEEP);
ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
// graticule
ctx.beginPath(); path(geoGraticule10()); ctx.strokeStyle = GRAT; ctx.lineWidth = 1; ctx.stroke();
// inactive land
ctx.beginPath();
for (const f of countries) if (!ISO.has(Number(f.id)) && Number(f.id) !== WSAHARA) path(f);
const lg = ctx.createLinearGradient(0, 0, 0, H);
lg.addColorStop(0, LAND2); lg.addColorStop(1, LAND);
ctx.fillStyle = lg; ctx.fill();
ctx.strokeStyle = "rgba(8,23,38,0.6)"; ctx.lineWidth = 1; ctx.stroke();
// active (ETAFAT) countries — glow + fill
ctx.save();
ctx.shadowColor = ACTIVE_EDGE; ctx.shadowBlur = 26;
ctx.beginPath();
for (const f of countries) if (ISO.has(Number(f.id))) path(activeFeat(f));
ctx.fillStyle = ACTIVE; ctx.fill();
ctx.restore();
ctx.beginPath();
for (const f of countries) if (ISO.has(Number(f.id))) path(activeFeat(f));
ctx.strokeStyle = ACTIVE_EDGE; ctx.lineWidth = 2; ctx.stroke();

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "earth.png"), await canvas.encode("png"));

// per-country coordinates for 3D markers/arcs
const byId = new Map(countries.map((f) => [Number(f.id), f]));
const out = PRESENCE.map((c) => {
  let lonlat = COORD_OVERRIDE[c.iso];
  if (!lonlat) { const f = byId.get(c.iso); lonlat = f ? geoCentroid(f) : [0, 0]; }
  return { iso: c.iso, name: c.name, region: c.region, lon: +lonlat[0].toFixed(2), lat: +lonlat[1].toFixed(2), projects: c.projects };
});
await writeFile(join(OUT, "presence-xr.json"), JSON.stringify({ hq: { name: "Casablanca", lon: -7.62, lat: 33.59 }, countries: out }, null, 0));
console.log(`✓ earth.png (${W}x${H}) + presence-xr.json (${out.length} countries) → public/xr/`);
