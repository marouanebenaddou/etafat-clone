// Bakes the VR landscape: real elevation of the Aït Bouguemez valley ("Vallée Heureuse",
// High Atlas, Morocco) around a lookout knoll on the valley's south slope.
// Source: AWS Terrain Tiles (terrarium, SRTM-derived open data — "Mapzen / AWS").
// Output: public/xr/terrain/dem.bin (Int16 LE metres, north-up, row-major) + dem.json.
// Usage: node scripts/build-xr-terrain.mjs [previewDir]
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/xr/terrain");
const PREVIEW = process.argv[2];

const Z = 12, T = 256;
const TILES = { x0: 1973, x1: 1975, y0: 1667, y1: 1669 };     // 3×3 tiles ≈ 25 km
const VIEW_TILE = { x: 1974.262, y: 1668.44 };                  // lookout knoll (≈31.63°N, 6.48°W)
const HALF_KM = 10;                                             // crop ±10 km around the lookout
// The knoll's broad top hides the valley from eye height; a line-of-sight search showed a spur on its
// north-east shoulder (+400 m E, 600 m N, ≈2 108 m) sees ~76 % of the valley floor (vs 18 % from the top).
const SPUR_OFFSET_M = { dx: 400, dz: -600 };

const W = (TILES.x1 - TILES.x0 + 1) * T, H = (TILES.y1 - TILES.y0 + 1) * T;
const elev = new Float32Array(W * H);
for (let ty = TILES.y0; ty <= TILES.y1; ty++) for (let tx = TILES.x0; tx <= TILES.x1; tx++) {
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`;
  const r = await fetch(url); if (!r.ok) throw new Error(`${url} → ${r.status}`);
  const img = await loadImage(Buffer.from(await r.arrayBuffer()));
  const c = createCanvas(T, T), g = c.getContext("2d"); g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, T, T).data;
  const ox = (tx - TILES.x0) * T, oy = (ty - TILES.y0) * T;
  for (let py = 0; py < T; py++) for (let px = 0; px < T; px++) {
    const k = (py * T + px) * 4;
    elev[(oy + py) * W + ox + px] = d[k] * 256 + d[k + 1] + d[k + 2] / 256 - 32768;
  }
}

const n = 2 ** Z;
const tileToLat = (y) => Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
const tileToLon = (x) => x / n * 360 - 180;
const lat = tileToLat(VIEW_TILE.y), lon = tileToLon(VIEW_TILE.x);
const mpp = 40075016.7 * Math.cos(lat * Math.PI / 180) / (n * T);

// snap the lookout to the knoll's local maximum (within ~150 m)
let vx = Math.round((VIEW_TILE.x - TILES.x0) * T), vy = Math.round((VIEW_TILE.y - TILES.y0) * T);
const R = Math.round(150 / mpp); let best = -Infinity, bx = vx, by = vy;
for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const v = elev[(vy + dy) * W + vx + dx]; if (v > best) { best = v; bx = vx + dx; by = vy + dy; } }
vx = bx + Math.round(SPUR_OFFSET_M.dx / mpp); vy = by + Math.round(SPUR_OFFSET_M.dz / mpp);
best = elev[vy * W + vx];

const half = Math.round(HALF_KM * 1000 / mpp), S = half * 2 + 1;
if (vx - half < 0 || vy - half < 0 || vx + half >= W || vy + half >= H) throw new Error("crop exceeds fetched tiles");
const out = new Int16Array(S * S);
let mn = Infinity, mx = -Infinity;
for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
  const v = Math.round(elev[(vy - half + y) * W + (vx - half + x)]); out[y * S + x] = v; if (v < mn) mn = v; if (v > mx) mx = v;
}
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "dem.bin"), Buffer.from(out.buffer));
const meta = {
  size: S, mpp: +mpp.toFixed(3), center: half, viewElevation: best, min: mn, max: mx,
  lookout: { lat: +tileToLat(TILES.y0 + vy / T).toFixed(5), lon: +tileToLon(TILES.x0 + vx / T).toFixed(5) },
  place: "Vallée des Aït Bouguemez (« Vallée Heureuse »), Haut Atlas, Maroc",
  attribution: "Relief : AWS Terrain Tiles (Mapzen) — données SRTM, NASA/USGS",
};
await writeFile(join(OUT, "dem.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(`✓ dem.bin ${S}×${S} (${(out.byteLength / 1024).toFixed(0)} KB), ${mpp.toFixed(1)} m/px, lookout ${best} m @ ${meta.lookout.lat}, ${meta.lookout.lon}, range ${mn}–${mx} m`);

if (PREVIEW) { // hillshade preview with the lookout marked (sanity check only)
  const c = createCanvas(S, S), g = c.getContext("2d"), im = g.createImageData(S, S);
  for (let y = 1; y < S - 1; y++) for (let x = 1; x < S - 1; x++) {
    const e = (xx, yy) => out[yy * S + xx];
    const nx = -(e(x + 1, y) - e(x - 1, y)) / (2 * mpp), ny = -(e(x, y + 1) - e(x, y - 1)) / (2 * mpp);
    const sh = Math.max(0, (nx * -0.5 + ny * -0.5 + 0.7) / Math.hypot(nx, ny, 1));
    const k = (y * S + x) * 4, t = (e(x, y) - mn) / (mx - mn);
    const base = t < 0.2 ? [100, 150, 80] : t < 0.55 ? [185, 150, 105] : [160, 135, 115];
    for (let q = 0; q < 3; q++) im.data[k + q] = Math.min(255, base[q] * (0.35 + sh * 0.9)); im.data[k + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  g.strokeStyle = "#ff3b30"; g.lineWidth = 3; g.beginPath(); g.arc(half, half, 10, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(half, half); g.lineTo(half, half - 160); g.stroke(); // view direction: north
  await writeFile(join(PREVIEW, "lookout.png"), await c.encode("png"));
}
