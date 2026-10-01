// Stages the VR experience into the offline Quest APK (quest-local/app/src/main/assets/www), keeping
// the site's paths so the on-device server (127.0.0.1) serves them exactly like the website does.
// File list = the VR service worker's PRECACHE (already the complete offline set) + any asset literal
// found in the VR sources, as a safety net (this is what brings in the cinema's films, which the
// service worker deliberately leaves to HTTP range requests). Then build:  cd quest-local && ./gradlew assembleRelease
import { readFile, mkdir, cp, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFile } from "node:fs/promises";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public");
const WWW = join(ROOT, "quest-local/app/src/main/assets/www");
const RES = join(ROOT, "quest-local/app/src/main/res");

const sw = await readFile(join(PUB, "xr/sw.js"), "utf8");
const arr = sw.slice(sw.indexOf("const PRECACHE = [") + "const PRECACHE = ".length, sw.indexOf("];", sw.indexOf("const PRECACHE = [")) + 1);
const precache = new Function(`return ${arr};`)();
const files = new Set(["/xr/sw.js"]);
const norm = (u) => (u.startsWith("./") ? "/xr/" + u.slice(2) : u);
for (const u of precache) files.add(norm(u));
for (const f of ["xr/index.html", "xr/app.js", "xr/world.js", "xr/fx.js", "xr/nav.js", "xr/cinema.js"]) { // safety net: literal asset paths in the sources
  const src = await readFile(join(PUB, f), "utf8");
  for (const m of src.matchAll(/["'`](\.\/[\w\-./]+\.(?:js|json|png|jpe?g|glb|bin|mp3|mp4|webmanifest|html))["'`]/g)) files.add(norm(m[1]));
  for (const m of src.matchAll(/["'`](\/etafat\/[\w\-./]+\.(?:png|jpe?g|json|webmanifest))["'`]/g)) files.add(m[1]);
}

await rm(WWW, { recursive: true, force: true });
let bytes = 0; const missing = [];
for (const f of [...files].sort()) {
  const src = join(PUB, f);
  if (!existsSync(src)) { missing.push(f); continue; }
  await mkdir(dirname(join(WWW, f)), { recursive: true });
  await cp(src, join(WWW, f));
  bytes += (await stat(src)).size;
}

// launcher icon from the kiosk/VR app icon
const icon = await loadImage(await readFile(join(PUB, "etafat/evenement/icon-512.png")));
for (const [dir, px] of [["mipmap-mdpi", 48], ["mipmap-hdpi", 72], ["mipmap-xhdpi", 96], ["mipmap-xxhdpi", 144], ["mipmap-xxxhdpi", 192]]) {
  const c = createCanvas(px, px); c.getContext("2d").drawImage(icon, 0, 0, px, px);
  await mkdir(join(RES, dir), { recursive: true });
  await writeFile(join(RES, dir, "ic_launcher.png"), await c.encode("png"));
}

console.log(`✓ ${files.size - missing.length} files (${(bytes / 1048576).toFixed(1)} MB) → quest-local/app/src/main/assets/www`);
if (missing.length) console.log("✗ missing:", missing.join(", "));
