// Attach each theme's project photos (from the kiosk data) to the VR sections file,
// so selecting a tile in VR opens that theme's pictures. Same source as the kiosk,
// so real project photos (once wired into evenement.ts) flow through automatically.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ts = await readFile(join(ROOT, "src/data/evenement.ts"), "utf8");

// group distinct images per theme (project photo + its media.images)
const re = /theme:\s*"([^"]+)"[\s\S]*?photo:\s*"([^"]+)"(?:\s*,\s*media:\s*\{\s*images:\s*\[([^\]]*)\])?/g;
const byTheme = {};
let m;
while ((m = re.exec(ts))) {
  const [, theme, photo, imgs = ""] = m;
  const set = (byTheme[theme] = byTheme[theme] || new Set());
  set.add(photo);
  for (const q of imgs.match(/"([^"]+)"/g) || []) set.add(q.replace(/"/g, ""));
}

const slugOrder = [
  "villes-territoires-patrimoine",
  "foncier-cadastre-si",
  "infrastructures-transports-reseaux",
  "eau-environnement-maritime",
  "batiment-industrie-mines",
  "agriculture-rural",
];

const sectionsPath = join(ROOT, "public/xr/sections-xr.json");
const sections = JSON.parse(await readFile(sectionsPath, "utf8"));
sections.themes.forEach((t, i) => {
  const slug = slugOrder[i];
  t.photos = [...(byTheme[slug] || [])].slice(0, 8);
});
sections.apps.photos = [
  "/etafat/evenement/pool/cadastre-1.jpg",
  "/etafat/evenement/pool/gis-1.jpg",
  "/etafat/evenement/pool/aerial-1.jpg",
];

await writeFile(sectionsPath, JSON.stringify(sections, null, 2) + "\n");

// distinct image list (for the service-worker precache)
const all = new Set();
sections.themes.forEach((t) => t.photos.forEach((p) => all.add(p)));
sections.apps.photos.forEach((p) => all.add(p));
console.log(sections.themes.map((t) => `${t.label}: ${t.photos.length} photos`).join("\n"));
console.log("\n--- distinct images (" + all.size + ") ---");
console.log([...all].sort().map((p) => `  "${p}",`).join("\n"));
