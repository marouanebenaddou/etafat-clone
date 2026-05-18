#!/usr/bin/env node
/*
 * Rebrand ETAFAT → ETAFAT across the codebase.
 * Preserves: image URLs (geofit.fr CDN), next.config.ts allow-list, external social links.
 */
import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const FROM = "etafat";
const TO = "etafat";
const SKIP_DIRS = new Set(["node_modules", ".next", ".cache", ".git"]);
const TARGET_EXT = new Set([".tsx", ".ts", ".css", ".mjs", ".js", ".md", ".json"]);
// Files we should leave alone entirely
const SKIP_FILES = new Set([
  join(ROOT, "next.config.ts"),
  join(ROOT, "package-lock.json"),
]);

function replaceVariants(s) {
  // Case-preserving replacement
  return s
    .replace(/ETAFAT/g, "ETAFAT")
    .replace(/Etafat/g, "Etafat")
    .replace(/etafat/g, "etafat");
}

/**
 * Replace brand name in text, but protect URL-like patterns that point to the live geofit.fr CDN.
 */
function rebrandLine(line) {
  // Protect: anything that looks like an image URL or domain reference (geofit.fr/wp-content/...)
  // Step 1: extract URL-like substrings as placeholders
  const protectedSpans = [];
  let result = line.replace(
    /https?:\/\/[a-z0-9.-]*etafat\.fr[^\s"'`)]*/gi,
    (m) => {
      protectedSpans.push(m);
      return `__URL_${protectedSpans.length - 1}__`;
    },
  );
  // Also protect the bare "geofit.fr" domain reference
  result = result.replace(/\betafat\.fr\b/gi, (m) => {
    protectedSpans.push(m);
    return `__URL_${protectedSpans.length - 1}__`;
  });

  result = replaceVariants(result);

  // Restore protected substrings
  result = result.replace(/__URL_(\d+)__/g, (_, i) => protectedSpans[+i]);
  return result;
}

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) await walk(full, out);
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const files = await walk(ROOT);
  let changed = 0;
  let scanned = 0;

  for (const file of files) {
    if (SKIP_FILES.has(file)) continue;
    const ext = extname(file);
    if (!TARGET_EXT.has(ext)) continue;
    scanned++;
    const content = await readFile(file, "utf-8");
    const next = rebrandLine(content);
    if (next !== content) {
      await writeFile(file, next, "utf-8");
      changed++;
      console.log("  ✓", file.replace(ROOT + "/", ""));
    }
  }
  console.log(`\nScanned ${scanned} files, modified ${changed}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
