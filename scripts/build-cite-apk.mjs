// Stages the Cité portugaise VR viewer into the offline Quest APK (cite-vr/android/app/src/main/assets/www):
// the viewer files + vendored libs, and the drone model (cite-vr/www/model, ~420 MB) as an APFS clone so
// staging costs no disk space. Also draws the launcher icon from the fortress outline in pois.json.
// Then build:  cd cite-vr/android && ./gradlew assembleRelease
import { readFile, mkdir, cp, rm, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createCanvas } from "@napi-rs/canvas";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "cite-vr/www");
const APP = join(ROOT, "cite-vr/android/app/src/main");
const WWW = join(APP, "assets/www");

if (!existsSync(join(SRC, "model/tileset.json"))) throw new Error("cite-vr/www/model is missing (unzip cite_portugaise.zip there)");
await rm(WWW, { recursive: true, force: true });
await mkdir(WWW, { recursive: true });
for (const f of ["index.html", "app.js", "pois.json"]) await cp(join(SRC, f), join(WWW, f));
await cp(join(SRC, "vendor"), join(WWW, "vendor"), { recursive: true });
execFileSync("cp", ["-Rc", join(SRC, "model"), join(WWW, "model")]); // copy-on-write clone

async function du(dir) { let n = 0, b = 0; for (const e of await readdir(dir, { withFileTypes: true, recursive: true })) if (e.isFile()) { n++; b += (await stat(join(e.parentPath ?? e.path, e.name))).size; } return { n, b }; }
const { n, b } = await du(WWW);

// launcher icon: the star fort, drawn from the OpenStreetMap rampart outline
const { walls } = JSON.parse(await readFile(join(SRC, "pois.json"), "utf8"));
const lat0 = walls.reduce((a, p) => a + p[0], 0) / walls.length, lon0 = walls.reduce((a, p) => a + p[1], 0) / walls.length;
const pts = walls.map(([la, lo]) => [(lo - lon0) * Math.cos(lat0 * Math.PI / 180), -(la - lat0)]);
const ext = Math.max(...pts.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))));
async function icon(px) {
  const c = createCanvas(px, px), x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, px); g.addColorStop(0, "#0d2740"); g.addColorStop(1, "#081726");
  x.fillStyle = g; x.beginPath(); x.roundRect(0, 0, px, px, px * 0.22); x.fill();
  const s = (px * 0.34) / ext;
  x.beginPath(); pts.forEach(([X, Y], i) => (i ? x.lineTo : x.moveTo).call(x, px / 2 + X * s, px * 0.47 + Y * s)); x.closePath();
  x.fillStyle = "rgba(42,181,180,0.35)"; x.fill();
  x.lineWidth = Math.max(1.5, px * 0.028); x.lineJoin = "round"; x.strokeStyle = "#8ee6e4"; x.stroke();
  x.fillStyle = "#ffffff"; x.font = `700 ${Math.round(px * 0.15)}px Arial`; x.textAlign = "center";
  x.fillText("VR", px / 2, px * 0.9);
  return c.encode("png");
}
for (const [dir, px] of [["mipmap-mdpi", 48], ["mipmap-hdpi", 72], ["mipmap-xhdpi", 96], ["mipmap-xxhdpi", 144], ["mipmap-xxxhdpi", 192]]) {
  await mkdir(join(APP, "res", dir), { recursive: true });
  await writeFile(join(APP, "res", dir, "ic_launcher.png"), await icon(px));
}
console.log(`✓ ${n} files (${(b / 1048576).toFixed(0)} MB) → cite-vr/android/app/src/main/assets/www`);
