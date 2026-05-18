#!/usr/bin/env node
/*
 * Swap geofit teal → etafat blue across the codebase.
 * Geofit teal: #00669d (primary) + #04537e (hover)
 * Etafat blue: #00669d (primary, from etafat.ma) + #04537e (darker hover)
 */
import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".next", ".cache", ".git"]);
const TARGET_EXT = new Set([".tsx", ".ts", ".css", ".mjs"]);

const REPLACEMENTS = [
  // hex (lowercase + uppercase variants)
  [/#00669d/gi, "#00669d"],
  [/#04537e/gi, "#04537e"],
  // rgb()
  [/rgb\s*\(\s*42\s*,\s*181\s*,\s*180\s*\)/g, "rgb(0, 102, 157)"],
  [/rgb\s*\(\s*35\s*,\s*154\s*,\s*153\s*\)/g, "rgb(4, 83, 126)"],
  // rgba() — preserve alpha
  [/rgba\s*\(\s*42\s*,\s*181\s*,\s*180\s*,\s*([0-9.]+)\s*\)/g, "rgba(0, 102, 157, $1)"],
  [/rgba\s*\(\s*35\s*,\s*154\s*,\s*153\s*,\s*([0-9.]+)\s*\)/g, "rgba(4, 83, 126, $1)"],
  // the light tint used behind the circle on home page
  [/#e0eef6/gi, "#e0eef6"],
];

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) await walk(full, out);
    } else if (e.isFile() && TARGET_EXT.has(extname(e.name))) {
      out.push(full);
    }
  }
  return out;
}

const files = await walk(ROOT);
let changed = 0;
for (const f of files) {
  const c = await readFile(f, "utf-8");
  let n = c;
  for (const [from, to] of REPLACEMENTS) {
    n = n.replace(from, to);
  }
  if (n !== c) {
    await writeFile(f, n, "utf-8");
    changed++;
    console.log("  fixed", f.replace(ROOT + "/", ""));
  }
}
console.log(`Updated ${changed} files.`);
