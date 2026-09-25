// Add a LinkedIn post to the Actualités page in one command.
//
//   node scripts/add-actualite.mjs \
//     --image ~/Downloads/mon-post.jpg \
//     --url "https://www.linkedin.com/feed/update/urn:li:activity:XXXX" \
//     --title "Titre du post" \
//     --category Projet \
//     --date "5 septembre 2026" \
//     --excerpt "Une ou deux phrases de résumé."
//
// It optimises the image into /public/etafat/actualites/etafat-post-NN.jpg and
// inserts a ready-made entry at the TOP of linkedinPosts (most-recent first).
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, "public/etafat/actualites");
const DATA = path.join(ROOT, "src/data/linkedin-posts.ts");
const CATEGORIES = ["Divers", "Engagements", "Groupe", "Presse", "Projet"];

// --- parse --key value args ------------------------------------------------
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args[a.slice(2)] = process.argv[++i];
}
const need = ["image", "url", "title", "category", "date", "excerpt"];
const missing = need.filter((k) => !args[k]);
if (missing.length) {
  console.error("Missing: " + missing.map((m) => "--" + m).join(", "));
  console.error("See the header of this file for usage.");
  process.exit(1);
}
if (!CATEGORIES.includes(args.category)) {
  console.error(`--category must be one of: ${CATEGORIES.join(", ")}`);
  process.exit(1);
}
const imgSrc = args.image.replace(/^~/, process.env.HOME || "~");
if (!existsSync(imgSrc)) {
  console.error("Image not found: " + imgSrc);
  process.exit(1);
}

// --- next image number -----------------------------------------------------
const nums = readdirSync(IMG_DIR)
  .map((f) => /^etafat-post-(\d+)\.jpg$/.exec(f))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const next = String((nums.length ? Math.max(...nums) : 0) + 1).padStart(2, "0");
const imgName = `etafat-post-${next}.jpg`;

// --- optimise + place image ------------------------------------------------
await sharp(imgSrc)
  .rotate()
  .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(IMG_DIR, imgName));

// --- insert entry at top of the array --------------------------------------
const S = (v) => JSON.stringify(v); // safe double-quoted TS string literal
const entry =
  "  {\n" +
  `    title: ${S(args.title)},\n` +
  `    date: ${S(args.date)},\n` +
  `    category: ${S(args.category)},\n` +
  `    excerpt: ${S(args.excerpt)},\n` +
  `    image: ${S(`/etafat/actualites/${imgName}`)},\n` +
  `    url: ${S(args.url)},\n` +
  "  },";

const marker = "export const linkedinPosts: LinkedInPost[] = [";
const src = readFileSync(DATA, "utf8");
if (!src.includes(marker)) {
  console.error("Could not find the linkedinPosts array marker in " + DATA);
  process.exit(1);
}
writeFileSync(DATA, src.replace(marker, `${marker}\n${entry}`));

console.log(`✓ Added "${args.title}" (${args.category}) as the newest post.`);
console.log(`  image  → public/etafat/actualites/${imgName}`);
console.log(`  data   → src/data/linkedin-posts.ts (top of the list)`);
console.log(`  Next:  npm run build  (then commit & push to publish)`);
