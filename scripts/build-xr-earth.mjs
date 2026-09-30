// Builds the VR globe's data: globe-tiles.json (the land as a mosaic of square tiles, like the
// ETAFAT logo, each tagged with its country) + presence-xr.json (per-country lon/lat + projects).
// Offline + geographically accurate (d3-geo + world-atlas topojson).
import { createCanvas } from "@napi-rs/canvas";
import { geoEquirectangular, geoPath, geoCentroid } from "d3-geo";
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

// rasterise country ids (colour-coded; anti-aliased edge pixels fail the checksum and are ignored)
const W = 2880, H = 1440;
const canvas = createCanvas(W, H), ctx = canvas.getContext("2d");
const path = geoPath(geoEquirectangular().fitSize([W, H], { type: "Sphere" }), ctx);
ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
feats.forEach((f, i) => { ctx.beginPath(); path(f); ctx.fillStyle = `rgb(${i + 1},${254 - i},128)`; ctx.fill(); });
const px = ctx.getImageData(0, 0, W, H).data;
const idAt = (lon, lat) => {
  const x = Math.min(W - 1, Math.max(0, Math.floor((lon + 180) / 360 * W))), y = Math.min(H - 1, Math.max(0, Math.floor((90 - lat) / 180 * H))), k = (y * W + x) * 4;
  return px[k + 2] === 128 && px[k] + px[k + 1] === 255 ? px[k] - 1 : -1;
};

// equal-area-ish tile grid: 2.25° rows, fewer columns toward the poles; a cell is land when ≥ 40 % of
// a 5×5 sample falls on land, tagged with the majority country
const STEP = 2.25, ROWS = Math.round(180 / STEP), rowN = [];
const cells = new Map(); // row*1000+col → feature index
for (let r = 0; r < ROWS; r++) {
  const lat = -90 + (r + 0.5) * STEP, n = Math.max(1, Math.round(360 * Math.cos(lat * Math.PI / 180) / STEP)); rowN.push(n);
  for (let c = 0; c < n; c++) {
    const lon = -180 + (c + 0.5) * 360 / n, votes = new Map(); let land = 0;
    for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) {
      const id = idAt(lon + ((b + 0.5) / 5 - 0.5) * 360 / n, lat + ((a + 0.5) / 5 - 0.5) * STEP);
      if (id >= 0) { land++; votes.set(id, (votes.get(id) || 0) + 1); }
    }
    if (land >= 10) cells.set(r * 1000 + c, [...votes].sort((p, q) => q[1] - p[1])[0][0]);
  }
}
const cellOf = (lon, lat) => { const r = Math.min(ROWS - 1, Math.floor((lat + 90) / STEP)), n = rowN[r]; return r * 1000 + Math.min(n - 1, Math.floor((lon + 180) / 360 * n)); };

await mkdir(OUT, { recursive: true });
await rm(join(OUT, "earth.png"), { force: true }); // superseded by the tile globe

// per-country coordinates for 3D markers/arcs
const byId = new Map(countries.map((f) => [Number(f.id), f]));
const out = PRESENCE.map((c) => {
  let lonlat = COORD_OVERRIDE[c.iso];
  if (!lonlat) { const f = byId.get(c.iso); lonlat = f ? geoCentroid(f) : [0, 0]; }
  return { iso: c.iso, name: c.name, region: c.region, lon: +lonlat[0].toFixed(2), lat: +lonlat[1].toFixed(2), projects: c.projects };
});
const isoOf = feats.map((f) => Number(f.id));
for (const c of out) { // tiny countries (Qatar, Burundi…) can lose every majority vote: give them their marker's cell
  const fi = isoOf.indexOf(c.iso);
  if (fi >= 0 && ![...cells.values()].includes(fi)) cells.set(cellOf(c.lon, c.lat), fi);
}
const used = [...new Set(cells.values())].sort((a, b) => a - b), isoList = used.map((i) => isoOf[i]);
const flat = []; for (const [key, fi] of cells) flat.push(Math.floor(key / 1000), key % 1000, used.indexOf(fi));
await writeFile(join(OUT, "globe-tiles.json"), JSON.stringify({ step: STEP, rows: rowN, iso: isoList, cells: flat }));
await writeFile(join(OUT, "presence-xr.json"), JSON.stringify({ hq: { name: "Casablanca", lon: -7.62, lat: 33.59 }, countries: out }, null, 0));
console.log(`✓ globe-tiles.json (${cells.size} land tiles, ${isoList.length} countries) + presence-xr.json (${out.length} countries) → public/xr/`);
