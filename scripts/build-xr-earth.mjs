// Builds the VR globe's data from the website's presence list (single source):
//   earth.png         — equirectangular map, ETAFAT palette, crisp country borders (ETAFAT countries in teal)
//   countries-id.png  — each ETAFAT country painted with its index (hover lookup + highlight shader)
//   presence-xr.json  — per-country lon/lat + projects
// Offline + geographically accurate (d3-geo + world-atlas topojson).
import { createCanvas } from "@napi-rs/canvas";
import { geoEquirectangular, geoPath, geoCentroid, geoGraticule10 } from "d3-geo";
import { feature, merge } from "topojson-client";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/xr");

// ── ETAFAT presence: single source shared with the website (Node strips the TS types) ──
const { PRESENCE } = await import(pathToFileURL(join(ROOT, "src/data/presence.ts")).href);
const ISO = new Set(PRESENCE.map((c) => c.iso));
// nicer marker coords where a polygon centroid is misleading
const COORD_OVERRIDE = { 250: [2.35, 46.6], 504: [-7.09, 31.8], 682: [45.0, 24.0], 170: [-73.5, 4.6] };

const world = JSON.parse(await readFile(join(ROOT, "src/data/world-110m.json"), "utf8"));
const countries = feature(world, world.objects.countries).features;

// Morocco shown complete: merge Western Sahara (732) into Morocco (504) so the
// highlighted country isn't cut off and the internal border dissolves.
const WSAHARA = 732, MOR = 504;
const morParts = world.objects.countries.geometries.filter((g) => Number(g.id) === MOR || Number(g.id) === WSAHARA);
const moroccoMerged = { type: "Feature", id: MOR, geometry: merge(world, morParts) };
const feats = countries.filter((f) => Number(f.id) !== WSAHARA).map((f) => (Number(f.id) === MOR ? moroccoMerged : f));

await mkdir(OUT, { recursive: true });
await rm(join(OUT, "globe-tiles.json"), { force: true }); // the tile-mosaic globe was reverted

// ── earth.png: the map, with every border drawn clearly ──────────────────────────────────
const W = 4096, H = 2048;
const NAVY_DEEP = "#0a1e30", OCEAN = "#103150", LAND = "#1e3d58", LAND2 = "#24506f", ACTIVE = "#2ab5b4", ACTIVE_EDGE = "#b9f3f1";
const canvas = createCanvas(W, H), ctx = canvas.getContext("2d");
const path = geoPath(geoEquirectangular().fitSize([W, H], { type: "Sphere" }), ctx);
const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, NAVY_DEEP); g.addColorStop(0.5, OCEAN); g.addColorStop(1, NAVY_DEEP);
ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
ctx.beginPath(); path(geoGraticule10()); ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1.2; ctx.stroke();
ctx.beginPath(); for (const f of feats) if (!ISO.has(Number(f.id))) path(f);
const lg = ctx.createLinearGradient(0, 0, 0, H); lg.addColorStop(0, LAND2); lg.addColorStop(1, LAND);
ctx.fillStyle = lg; ctx.fill();
ctx.strokeStyle = "rgba(150,200,228,0.55)"; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.stroke();   // borders, light on dark
ctx.save(); ctx.shadowColor = ACTIVE_EDGE; ctx.shadowBlur = 18;
ctx.beginPath(); for (const f of feats) if (ISO.has(Number(f.id))) path(f);
ctx.fillStyle = ACTIVE; ctx.fill(); ctx.restore();
ctx.beginPath(); for (const f of feats) if (ISO.has(Number(f.id))) path(f);
ctx.strokeStyle = ACTIVE_EDGE; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.stroke();                  // ETAFAT countries outlined
await writeFile(join(OUT, "earth.png"), await canvas.encode("png"));

// ── countries-id.png: index+1 of each ETAFAT country (R), checksum G = 255 − R, B = 128 ──────
const IW = 2048, IH = 1024, idc = createCanvas(IW, IH), ix = idc.getContext("2d");
const ipath = geoPath(geoEquirectangular().fitSize([IW, IH], { type: "Sphere" }), ix);
ix.fillStyle = "#000"; ix.fillRect(0, 0, IW, IH);
const byIsoFeat = new Map(feats.map((f) => [Number(f.id), f]));
PRESENCE.forEach((c, i) => { const f = byIsoFeat.get(c.iso); if (!f) return; ix.beginPath(); ipath(f); ix.fillStyle = `rgb(${i + 1},${254 - i},128)`; ix.fill(); });
const img = ix.getImageData(0, 0, IW, IH), d = img.data;
for (let k = 0; k < d.length; k += 4) if (!(d[k + 2] === 128 && d[k] + d[k + 1] === 255)) { d[k] = d[k + 1] = d[k + 2] = 0; d[k + 3] = 255; } // drop anti-aliased edge pixels
ix.putImageData(img, 0, 0);
await writeFile(join(OUT, "countries-id.png"), await idc.encode("png"));

// per-country coordinates for 3D markers/arcs
const byId = new Map(countries.map((f) => [Number(f.id), f]));
const out = PRESENCE.map((c) => {
  let lonlat = COORD_OVERRIDE[c.iso];
  if (!lonlat) { const f = byId.get(c.iso); lonlat = f ? geoCentroid(f) : [0, 0]; }
  return { iso: c.iso, name: c.name, region: c.region, lon: +lonlat[0].toFixed(2), lat: +lonlat[1].toFixed(2), projects: c.projects };
});
await writeFile(join(OUT, "presence-xr.json"), JSON.stringify({ hq: { name: "Casablanca", lon: -7.62, lat: 33.59 }, countries: out }, null, 0));
console.log(`✓ earth.png (${W}×${H}) + countries-id.png (${IW}×${IH}) + presence-xr.json (${out.length} countries) → public/xr/`);
