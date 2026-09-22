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
// Optional root file (referenced by the page <head>; avoids a console 404).
for (const file of ["evenement.webmanifest"]) {
  const src = path.join(out, file);
  if (existsSync(src)) cpSync(src, path.join(www, file));
}

// The kiosk page IS the root document. Capacitor's WebView serves basePath +
// "/index.html" for "/" and for any extension-less path, so a redirect/subdir
// would loop or 404 → white screen. The exported HTML uses only root-absolute
// asset paths (/_next, /etafat, /vendor), so it works unchanged at the root.
cpSync(path.join(out, "evenement/index.html"), path.join(www, "index.html"));

console.log("✓ cap-www/ ready — now: npx cap sync android && (cd android && ./gradlew assembleDebug)");
