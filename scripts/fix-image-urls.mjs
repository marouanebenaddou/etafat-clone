#!/usr/bin/env node
/*
 * Fix image URLs corrupted by rebrand:
 * any "wp-content/uploads/...Geofit..." reverts the "etafat" → "geofit"
 * because those are real files on the geofit.fr CDN.
 */
import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".next", ".cache", ".git"]);
const TARGET_EXT = new Set([".tsx", ".ts", ".json", ".css", ".mjs"]);

function fix(content) {
  // Pattern A: URLs/paths under wp-content/uploads
  let next = content
    .replace(
      /(wp-content\/uploads\/[^"'`\s)]*?)Etafat([^"'`\s)]*?)/g,
      (m, pre, post) => `${pre}Geofit${post}`,
    )
    .replace(
      /(wp-content\/uploads\/[^"'`\s)]*?)etafat([^"'`\s)]*?)/g,
      (m, pre, post) => `${pre}geofit${post}`,
    )
    .replace(
      /(wp-content\/uploads\/[^"'`\s)]*?)ETAFAT([^"'`\s)]*?)/g,
      (m, pre, post) => `${pre}GEOFIT${post}`,
    );

  // Pattern B: bare image paths like "2024/09/miniature-histoire-geofit.jpg" in IMG() calls
  // Year/month/filename pattern with image extension
  next = next.replace(
    /(\d{4}\/\d{2}\/[a-z0-9_-]*?)etafat([a-z0-9_-]*\.(?:jpe?g|png|webp))/gi,
    (m, pre, post) => `${pre}geofit${post}`,
  );

  // Pattern C: standalone "Etafat_" / "etafat_" / "Etafat-" inside filenames (rare)
  next = next.replace(
    /([a-zA-Z0-9_-]+_)etafat(_[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp))/g,
    (m, pre, post) => `${pre}geofit${post}`,
  );

  return next;
}

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) await walk(full, out);
    } else if (e.isFile() && TARGET_EXT.has(extname(e.name))) out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
let changed = 0;
for (const f of files) {
  const c = await readFile(f, "utf-8");
  const n = fix(c);
  if (n !== c) {
    await writeFile(f, n, "utf-8");
    changed++;
    console.log("  fixed", f.replace(ROOT + "/", ""));
  }
}
console.log(`Fixed ${changed} files.`);
