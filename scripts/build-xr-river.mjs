// River network of the VR valley, from the relief itself: priority-flood (fills SRTM pits so water keeps
// flowing), then D8 flow accumulation. Output: public/xr/terrain/river.bin — one byte per DEM cell,
// 0 = dry … 255 = main river (log of the upstream area), read by the terrain shader (riverbed + water).
//   node scripts/build-xr-river.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../public/xr/terrain");
const meta = JSON.parse(await readFile(join(DIR, "dem.json"), "utf8"));
const buf = await readFile(join(DIR, "dem.bin"));
const S = meta.size, N = S * S, dem = new Int16Array(buf.buffer, buf.byteOffset, N);

// 1. priority-flood (Barnes 2014, +ε): every cell gets a downhill path to the edge
const z = new Float64Array(N), done = new Uint8Array(N);
const heap = []; // [elev, idx] min-heap
const push = (e, i) => { heap.push([e, i]); let k = heap.length - 1; while (k) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top; };
for (let i = 0; i < S; i++) for (const j of [0, S - 1]) { for (const c of [j * S + i, i * S + j]) if (!done[c]) { done[c] = 1; z[c] = dem[c]; push(z[c], c); } }
const NB = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
while (heap.length) {
  const [e, c] = pop(), x = c % S, y = (c / S) | 0;
  for (const [dx, dy] of NB) {
    const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= S || ny >= S) continue;
    const n = ny * S + nx; if (done[n]) continue;
    done[n] = 1; z[n] = Math.max(dem[n], e + 1e-3); push(z[n], n);
  }
}

// 2. D8 receivers on the filled surface, then accumulate from the highest cells down
const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => z[b] - z[a]);
const acc = new Float64Array(N).fill(1);
for (const c of order) {
  const x = c % S, y = (c / S) | 0; let best = -1, drop = 0;
  for (const [dx, dy] of NB) {
    const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= S || ny >= S) continue;
    const n = ny * S + nx, d = (z[c] - z[n]) / Math.hypot(dx, dy);
    if (d > drop) { drop = d; best = n; }
  }
  if (best >= 0) acc[best] += acc[c];
}

// 3. byte mask: log upstream area, 0 below ~4 km², 255 for the main river
const cellKm2 = (meta.mpp * meta.mpp) / 1e6, lo = Math.log(4 / cellKm2), hi = Math.log(120 / cellKm2);
const out = new Uint8Array(N);
let wet = 0;
for (let i = 0; i < N; i++) { const t = (Math.log(acc[i]) - lo) / (hi - lo); out[i] = Math.round(255 * Math.min(1, Math.max(0, t))); if (out[i]) wet++; }
await writeFile(join(DIR, "river.bin"), out);
let maxAcc = 0; for (const a of acc) if (a > maxAcc) maxAcc = a; const maxKm2 = maxAcc * cellKm2;
console.log(`✓ river.bin: ${S}×${S}, ${wet} river cells, largest catchment ≈ ${maxKm2.toFixed(0)} km²`);
