// Builds the fully static, offline kiosk bundle (cap-www/) that gets wrapped in
// the Android APK. Run: node scripts/build-kiosk.mjs
import { execSync } from "node:child_process";
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const www = path.join(root, "cap-www");

if (!process.env.SKIP_BUILD) {
  console.log("▶ Static export (KIOSK_EXPORT=1 next build)…");
  execSync("npx --no-install next build", { stdio: "inherit", env: { ...process.env, KIOSK_EXPORT: "1" } });
}

console.log("▶ Assembling cap-www/ (kiosk-only subset)…");
rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

// Only the parts the kiosk actually loads — keeps the APK lean and free of the
// main site's images/pages. (etafat/ is copied selectively: the whole folder is
// ~80 MB of main-site imagery the kiosk never shows.)
const copies = [
  "evenement", // exported kiosk page
  "_next", // JS/CSS/fonts chunks
  "vendor", // bundled model-viewer (offline BIM .glb)
  "etafat/evenement", // project photos + app icons  (+ future models/tiles)
  "etafat/videos", // intro/aerial videos
  "etafat/logo.png", // brand mark
];
for (const rel of copies) {
  const src = path.join(out, rel);
  if (!existsSync(src)) continue;
  const dst = path.join(www, rel);
  mkdirSync(path.dirname(dst), { recursive: true });
  cpSync(src, dst, { recursive: true });
}
// Optional root files (avoid 404s in the WebView console).
for (const file of ["evenement.webmanifest", "sw-evenement.js"]) {
  const src = path.join(out, file);
  if (existsSync(src)) cpSync(src, path.join(www, file));
}

// Root document just bounces to the kiosk (Capacitor loads index.html at root).
writeFileSync(
  path.join(www, "index.html"),
  '<!doctype html><meta charset="utf-8">' +
    '<meta http-equiv="refresh" content="0; url=./evenement/">' +
    "<title>ETAFAT Borne</title>" +
    '<script>location.replace("./evenement/")</script>'
);

console.log("✓ cap-www/ ready — now: npx cap sync android && (cd android && ./gradlew assembleDebug)");
