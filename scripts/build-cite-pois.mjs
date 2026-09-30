// Points of interest + rampart outline for the Cité portugaise (Mazagan, El Jadida) VR viewer.
// Positions come from OpenStreetMap (Overpass); names, categories and short texts are curated here.
// Output: cite-vr/www/pois.json  ({ origin, pois:[{id,name,cat,lat,lon,text}], walls:[[lat,lon]…] })
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = { lat: 33.25852, lon: -8.50344 }; // the model's ENU origin (Production_1.3mx "SRS")

// OSM element → curated entry. cat: patrimoine | religieux | bastion | porte
const PICK = [
  { osm: "n7098821585", name: "Citerne portugaise", cat: "patrimoine",
    text: "Salle voûtée de style manuélin, ancien magasin d’armes du château de 1514 converti en citerne au XVIᵉ siècle. Ses colonnes se reflètent dans une fine nappe d’eau ; Orson Welles y a tourné « Othello »." },
  { osm: "w1227233520", name: "Église de l’Assomption", cat: "religieux",
    text: "Église paroissiale portugaise du XVIᵉ siècle, au cœur de la cité fortifiée." },
  { osm: "w1267679453", name: "Grande Mosquée", cat: "religieux",
    text: "Mosquée de la cité ; son minaret à cinq pans serait une ancienne tour-phare portugaise." },
  { osm: "n11769465516", name: "Porte de la Mer", cat: "porte",
    text: "Bab El Bhar ouvrait sur l’ancien port. C’est par la mer que les Portugais quittèrent Mazagan en 1769." },
  { osm: "n11773838734", name: "Porta da Terra", cat: "porte",
    text: "Ancienne entrée principale côté terre, dans l’axe de la grande rue de la cité." },
  { osm: "w1267679455", name: "Palais du Gouverneur", cat: "patrimoine",
    text: "Vestiges de la résidence du gouverneur portugais de Mazagan." },
  { osm: "w1267677367", name: "Torre de Rebate", cat: "patrimoine",
    text: "Tour du château de 1514 — le noyau le plus ancien de la forteresse, avant l’enceinte bastionnée." },
  { osm: "w1267924184", name: "Synagogue", cat: "religieux",
    text: "Témoin de la communauté juive qui a longtemps habité la cité." },
  { osm: "n11773891145", name: "Bastion de l’Ange", cat: "bastion",
    text: "Bastion sud-est tourné vers l’océan ; ses canons y sont toujours alignés." },
  { osm: "n11775613327", name: "Bastion Saint-Sébastien", cat: "bastion",
    text: "Bastion nord-est de l’enceinte, face au port." },
  { osm: "n11773891143", name: "Bastion Saint-Antoine", cat: "bastion",
    text: "Bastion nord-ouest, gardant le front de terre." },
  { osm: "n11773891144", name: "Bastion Saint-Esprit", cat: "bastion",
    text: "Bastion sud-ouest de l’enceinte en étoile." },
];
const WALLS = "w642015116"; // the fortress outline (citywalls)

const idsOf = (t) => PICK.filter((p) => p.osm[0] === t).map((p) => p.osm.slice(1));
const q = `[out:json][timeout:60];
( node(id:${idsOf("n").join(",")}); way(id:${[...idsOf("w"), WALLS.slice(1)].join(",")}); );
out center geom;`;
let r = null; // public Overpass servers are often busy: try a few
for (const host of ["https://overpass-api.de", "https://overpass.kumi.systems", "https://overpass.private.coffee"]) {
  try { r = await fetch(`${host}/api/interpreter`, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "User-Agent": "ETAFAT-cite-viewer/1.0" } }); if (r.ok) break; } catch { r = null; }
}
if (!r || !r.ok) throw new Error(`Overpass unavailable (${r && r.status})`);
const byId = new Map((await r.json()).elements.map((e) => [e.type[0] + e.id, e]));

const pois = PICK.map((p, i) => {
  const e = byId.get(p.osm); if (!e) throw new Error(`missing ${p.osm}`);
  const g = e.geometry || [], avg = (k) => g.reduce((a, v) => a + v[k], 0) / g.length; // ways: centroid of their outline
  const lat = e.lat ?? e.center?.lat ?? avg("lat"), lon = e.lon ?? e.center?.lon ?? avg("lon");
  return { id: i + 1, name: p.name, cat: p.cat, lat: +lat.toFixed(7), lon: +lon.toFixed(7), text: p.text, osm: p.osm };
});
const w = byId.get(WALLS);
const walls = (w.geometry || []).map((g) => [+g.lat.toFixed(7), +g.lon.toFixed(7)]);

// heights (pins: roof/ground; rampart: wall walk) are sampled from the model in the viewer (?debug → CITE.bake())
// and kept across re-runs
const prev = await readFile(join(ROOT, "cite-vr/www/pois.json"), "utf8").then(JSON.parse).catch(() => null);
if (prev) for (const p of pois) { const o = prev.pois.find((q) => q.osm === p.osm); if (o && o.h != null) p.h = o.h; }
const wallH = prev && prev.wallH && prev.walls.length === walls.length ? prev.wallH : undefined;

const out = {
  title: "Cité portugaise de Mazagan",
  subtitle: "El Jadida · Patrimoine mondial de l’UNESCO (2004)",
  intro: "Forteresse portugaise fondée en 1514 et fortifiée en 1541–1548, occupée jusqu’en 1769. Maquette numérique 3D réalisée par drone — ETAFAT.",
  origin: ORIGIN, pois, walls, wallH,
  source: "Positions : © contributeurs OpenStreetMap (ODbL)",
};
await writeFile(join(ROOT, "cite-vr/www/pois.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`✓ ${pois.length} points of interest + rampart outline (${walls.length} vertices) → cite-vr/www/pois.json`);
