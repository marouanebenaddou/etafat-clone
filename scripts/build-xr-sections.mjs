// Builds the VR sections file from the kiosk data (src/data/evenement.ts, imported directly —
// Node strips the TS types): per theme, the project list with each project's description,
// sub-themes and photos (only files that exist), plus the theme's photo pool. Selecting a
// tile in VR opens that list; selecting a project opens its details and pictures.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { EVENEMENT_PROJETS, EVENEMENT_THEMES } = await import(pathToFileURL(join(ROOT, "src/data/evenement.ts")).href);
// English overlay (borne + VR share it): each theme / project / app gets an `en` object the VR picks when
// its FR | EN switch is on English
const EN = await import(pathToFileURL(join(ROOT, "src/data/evenement-en.ts")).href);
const exists = (src) => existsSync(join(ROOT, "public", src));
const slugOrder = EVENEMENT_THEMES.map((t) => t.slug);

const sectionsPath = join(ROOT, "public/xr/sections-xr.json");
const sections = JSON.parse(await readFile(sectionsPath, "utf8"));
sections.themes.forEach((t, i) => {
  const projets = EVENEMENT_PROJETS.filter((p) => p.theme === slugOrder[i]);
  // t.projects keeps the tiles' hand-shortened titles (same projects, same order); the pop-up's
  // detail view shows the full title
  t.items = projets.map((p, k) => {
    const en = EN.PROJETS_EN[p.slug];
    return {
      title: p.title, short: t.projects?.[k] || p.title, description: p.description, subThemes: p.subThemes,
      images: [...new Set([p.photo, ...(p.media?.images || [])])].filter(exists).slice(0, 4),
      ...(en ? { en: { title: en.title, short: en.short || en.title, description: en.description, subThemes: en.subThemes } } : {}),
    };
  });
  if (EN.THEMES_EN[slugOrder[i]]) t.en = EN.THEMES_EN[slugOrder[i]];
  t.photos = [...new Set(t.items.flatMap((p) => p.images))].slice(0, 8);
});
sections.apps.en = EN.APPS_SECTION_EN;
for (const it of sections.apps.items) { const en = EN.APPS_EN[it.name.toLowerCase()]; if (en) it.en = en; }
sections.apps.photos = [
  "/etafat/evenement/pool/cadastre-1.jpg",
  "/etafat/evenement/pool/gis-1.jpg",
  "/etafat/evenement/pool/aerial-1.jpg",
];

await writeFile(sectionsPath, JSON.stringify(sections, null, 2) + "\n");

// "Chiffres clés" — same figures as the kiosk (single source: src/data/evenement-chiffres.json)
const chiffres = JSON.parse(await readFile(join(ROOT, "src/data/evenement-chiffres.json"), "utf8"));
await writeFile(join(ROOT, "public/xr/chiffres-xr.json"), JSON.stringify({ ...chiffres, en: EN.chiffresEn(chiffres) }) + "\n");

// presence globe: English names / regions / project lists next to the French ones (presence-xr.json is
// written by build-xr-earth.mjs; this only adds the `en` overlay so the earth textures aren't re-rendered)
const presPath = join(ROOT, "public/xr/presence-xr.json");
const pres = JSON.parse(await readFile(presPath, "utf8"));
for (const c of pres.countries) {
  const en = EN.PRESENCE_EN[c.iso];
  if (en) c.en = { name: en.name, region: EN.REGIONS_EN[c.region] || c.region, projects: en.projects || c.projects };
}
await writeFile(presPath, JSON.stringify(pres));
console.log("✓ presence-xr.json (+ en)");
console.log("✓ chiffres-xr.json");

// distinct image list (for the service-worker precache)
const all = new Set();
sections.themes.forEach((t) => t.photos.forEach((p) => all.add(p)));
sections.apps.photos.forEach((p) => all.add(p));
console.log(sections.themes.map((t) => `${t.label}: ${t.photos.length} photos`).join("\n"));
console.log("\n--- distinct images (" + all.size + ") ---");
console.log([...all].sort().map((p) => `  "${p}",`).join("\n"));
