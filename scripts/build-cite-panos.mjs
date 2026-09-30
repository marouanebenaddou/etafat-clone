// 360° photos of the Cité portugaise (Insta360 One X2, 19 Jan 2022) for the VR viewer.
// The camera recorded no GPS, so each photo was placed by hand from what it shows, walking the route in
// shooting order (landmarks, the rampart outline, what lies in which direction). North is recovered from
// the sun: its computed bearing at the shot time (NOAA solar position) vs. where it sits in the image.
// Only the 19 Jan morning (10:38–12:39) is in the Cité; the rest of the set (downtown, museum, lighthouse,
// parks, Azemmour in April) is left out.
// Input: the extracted "images 360 traités" folder.  Output: cite-vr/www/panos/*.jpg + panos.json
//   node scripts/build-cite-panos.mjs ~/Downloads/images360
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.argv[2] || join(homedir(), "Downloads/images360");
const OUT = join(ROOT, "cite-vr/www/panos");
const { origin } = JSON.parse(await readFile(join(ROOT, "cite-vr/www/pois.json"), "utf8"));

// shot time (HHMMSS, 2022-01-19) → [place, x east, z south] in metres from the survey origin (same frame as
// the viewer's map); "in" = indoor (no sun, orientation unknown)
const PLACE = {
  103843: ["Bastion Saint-Esprit", 12, 330], 103916: ["Bastion Saint-Esprit", 18, 333], 104007: ["Bastion Saint-Esprit", 6, 336],
  104151: ["Bastion Saint-Esprit", 15, 325],
  104302: ["Rempart sud", 40, 319], 104346: ["Rempart sud", 48, 316], 104520: ["Rempart sud", 80, 305], 104550: ["Rempart sud", 105, 294],
  104629: ["Rempart sud", 125, 290], 104717: ["Rempart sud", 150, 285], 104830: ["Rempart sud", 155, 285],
  105018: ["Rempart est", 238, 240], 105054: ["Rempart est", 244, 236], 105208: ["Rempart est", 236, 226],
  105445: ["Bastion de l’Ange", 272, 272], 105509: ["Bastion de l’Ange", 278, 280], 105555: ["Bastion de l’Ange", 284, 286],
  105629: ["Bastion de l’Ange", 287, 289],
  110126: ["Porte de la Mer", 192, 206], 110311: ["Porte de la Mer", 180, 200],
  110734: ["Rempart est", 215, 140], 110940: ["Rempart est", 205, 95],
  111124: ["Bastion Saint-Sébastien", 190, 22], 111248: ["Bastion Saint-Sébastien", 178, 30],
  112057: ["Ruelles de la cité", 160, 65], 112952: ["Ruelles de la cité", 125, 95], 113047: ["Ruelles de la cité", 112, 105],
  113112: ["Ruelles de la cité", 108, 110],
  113140: ["Atelier d’artiste", 104, 114, "in"], 113215: ["Atelier d’artiste", 102, 116, "in"], 113241: ["Atelier d’artiste", 100, 118, "in"],
  114008: ["Bastion du Gouverneur", -38, 228], 114038: ["Bastion du Gouverneur", -42, 224], 114108: ["Bastion du Gouverneur", -36, 221],
  114134: ["Bastion du Gouverneur", -32, 225], 114202: ["Bastion du Gouverneur", -38, 232], 114237: ["Bastion du Gouverneur", -28, 238],
  115304: ["Place de l’église", 42, 243], 115357: ["Place de l’église", 48, 238], 115419: ["Place de l’église", 50, 234],
  115457: ["Place de l’église", 45, 230], 115523: ["Place de l’église", 40, 232], 115547: ["Place de l’église", 36, 238],
  115610: ["Place de l’église", 38, 242],
  120235: ["Rue principale", 78, 238],
  120305: ["Citerne portugaise", 84, 232, "in"], 120329: ["Citerne portugaise", 86, 229, "in"], 120351: ["Citerne portugaise", 88, 226, "in"],
  120452: ["Citerne portugaise", 84, 223, "in"], 120513: ["Citerne portugaise", 86, 220, "in"], 120536: ["Citerne portugaise", 89, 219, "in"],
  120602: ["Citerne portugaise", 92, 215, "in"], 120632: ["Citerne portugaise", 93, 211, "in"], 120657: ["Citerne portugaise", 86, 213, "in"],
  120826: ["Citerne portugaise", 93, 220, "in"], 120856: ["Citerne portugaise", 90, 223, "in"], 120916: ["Citerne portugaise", 87, 216, "in"],
  120950: ["Citerne portugaise", 89, 217, "in"],
  121322: ["Salles du château", 74, 214], 121347: ["Salles du château", 70, 210, "in"], 121411: ["Salles du château", 67, 206, "in"],
  121443: ["Salles du château", 64, 202, "in"], 121508: ["Salles du château", 61, 198, "in"], 121534: ["Salles du château", 58, 202, "in"],
  121555: ["Salles du château", 60, 207, "in"], 121615: ["Salles du château", 63, 210, "in"],
  121756: ["Torre de Rebate", 52, 208], 121843: ["Torre de Rebate", 48, 197],
  121904: ["Cour du château", 60, 190], 121928: ["Cour du château", 66, 186], 122002: ["Cour du château", 72, 184],
  122029: ["Cour du château", 78, 183], 122103: ["Cour du château", 84, 186], 122133: ["Cour du château", 88, 191],
  122153: ["Cour du château", 86, 197], 122220: ["Cour du château", 80, 199], 122333: ["Cour du château", 72, 195],
  122541: ["Cour du château", 66, 196],
  122841: ["Ruelles de la cité", 55, 248], 122902: ["Ruelles de la cité", 50, 252], 122927: ["Ruelles de la cité", 46, 255],
  123439: ["Église de l’Assomption", 40, 250],
  123502: ["Église de l’Assomption", 35, 252, "in"], 123618: ["Église de l’Assomption", 32, 253, "in"], 123642: ["Église de l’Assomption", 30, 255, "in"],
  123702: ["Église de l’Assomption", 28, 257, "in"], 123727: ["Église de l’Assomption", 26, 259, "in"], 123749: ["Église de l’Assomption", 24, 261, "in"],
  123809: ["Église de l’Assomption", 23, 262, "in"], 123920: ["Église de l’Assomption", 31, 252, "in"],
};
// left out on purpose: 104859 / 110745 (duplicates of the previous shot), 111918 / 115709 (people right at the lens),
// 121811 (lens covered)

// NOAA solar position → azimuth (° from north, clockwise) and elevation, El Jadida
const R = Math.PI / 180;
function sun(date) {
  const jd = date.getTime() / 86400000 + 2440587.5, T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360, M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(M * R) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * R) * 0.000289;
  const lam = L0 + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * R);
  const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos((125.04 - 1934.136 * T) * R);
  const dec = Math.asin(Math.sin(eps * R) * Math.sin(lam * R)) / R, y = Math.tan(eps * R / 2) ** 2;
  const eqt = 4 / R * (y * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) + 4 * e * y * Math.sin(M * R) * Math.cos(2 * L0 * R) - 0.5 * y * y * Math.sin(4 * L0 * R) - 1.25 * e * e * Math.sin(2 * M * R));
  const mins = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const ha = ((mins + eqt + 4 * origin.lon) % 1440) / 4 - 180;
  const zen = Math.acos(Math.sin(origin.lat * R) * Math.sin(dec * R) + Math.cos(origin.lat * R) * Math.cos(dec * R) * Math.cos(ha * R)) / R;
  const az = (Math.atan2(Math.sin(ha * R), Math.cos(ha * R) * Math.sin(origin.lat * R) - Math.tan(dec * R) * Math.cos(origin.lat * R)) / R + 180) % 360;
  return { az, el: 90 - zen };
}
// the sun in the image: the densest cluster of saturated pixels above the horizon (white walls and bright
// clouds also saturate, so only pixels within ±15° of the densest 25° window count), circular mean of columns
function findSun(img) {
  const W = 720, H = 360, c = createCanvas(W, H), x = c.getContext("2d"); x.drawImage(img, 0, 0, W, H);
  const px = x.getImageData(0, 20, W, 160).data, hits = [], bins = new Array(72).fill(0);
  for (let i = 0; i < W * 160; i++) {
    if (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2] < 250) continue;
    const col = i % W; hits.push([col, Math.floor(i / W) + 20]); bins[Math.floor(col / 10)]++;
  }
  let best = 0, bestSum = -1;
  for (let b = 0; b < 72; b++) { let s = 0; for (let k = -2; k <= 2; k++) s += bins[(b + k + 72) % 72]; if (s > bestSum) { bestSum = s; best = b; } }
  const centre = (best + 0.5) * 10; let n = 0, sx = 0, cx = 0, sy = 0;
  for (const [col, row] of hits) {
    const dc = ((col - centre + W * 1.5) % W) - W / 2; if (Math.abs(dc) > 30) continue; // ±15°
    const a = col / W * 2 * Math.PI; sx += Math.sin(a); cx += Math.cos(a); sy += row; n++;
  }
  if (n < 100 || Math.hypot(sx, cx) / n < 0.97) return null;
  return { u: ((Math.atan2(sx, cx) / (2 * Math.PI)) % 1 + 1) % 1, el: 90 - (sy / n) / H * 180 };
}

const toLatLon = (x, z) => {
  const Re = 6378137;
  return { lat: +(origin.lat - z / Re / R).toFixed(7), lon: +(origin.lon + x / (Re * Math.cos(origin.lat * R)) / R).toFixed(7) };
};
// marker heights are sampled from the model in the viewer (?debug → CITE.bakePanos()) and kept across re-runs
const prevH = await readFile(join(ROOT, "cite-vr/www/panos.json"), "utf8").then((t) => new Map(JSON.parse(t).panos.filter((p) => p.h != null).map((p) => [p.src, p.h]))).catch(() => new Map());
await mkdir(join(OUT, "thumbs"), { recursive: true });
const files = (await readdir(SRC)).filter((f) => /^IMG_20220119_\d{6}_00_\w+\.jpg$/.test(f)).sort();
const panos = [];
for (const f of files) {
  const hms = +f.slice(13, 19), place = PLACE[hms]; if (!place) continue;
  const [name, x, z, where] = place;
  const img = await loadImage(await readFile(join(SRC, f)));
  let north = null;
  if (where !== "in") {
    const t = new Date(Date.UTC(2022, 0, 19, +f.slice(13, 15) - 1, +f.slice(15, 17), +f.slice(17, 19))); // Morocco = UTC+1 in January
    const s = sun(t), d = findSun(img);
    if (d && Math.abs(d.el - s.el) <= 12) north = +((((d.u - s.az / 360) % 1) + 1) % 1).toFixed(4); // image column facing north
  }
  const id = `c${String(panos.length + 1).padStart(2, "0")}`;
  for (const [w, q, path] of [[4096, 82, `${id}.jpg`], [512, 76, `thumbs/${id}.jpg`]]) {
    const c = createCanvas(w, w / 2); c.getContext("2d").drawImage(img, 0, 0, w, w / 2);
    await writeFile(join(OUT, path), await c.encode("jpeg", q));
  }
  panos.push({ id, place: name, time: `${f.slice(13, 15)}:${f.slice(15, 17)}`, ...toLatLon(x, z), h: prevH.get(f), north, src: f });
  process.stdout.write(`\r${panos.length} photos`);
}
await writeFile(join(ROOT, "cite-vr/www/panos.json"), JSON.stringify({
  date: "2022-01-19", camera: "Insta360 One X2",
  note: "Positions reconstructed from the photos (no GPS on the camera); north from the sun where visible.",
  panos,
}, null, 1) + "\n");
console.log(`\n✓ ${panos.length} panoramas (${panos.filter((p) => p.north != null).length} oriented by the sun) → cite-vr/www/panos/ + panos.json`);
