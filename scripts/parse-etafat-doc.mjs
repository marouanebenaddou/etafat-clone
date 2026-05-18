#!/usr/bin/env node
/*
 * Parse the ETAFAT content doc (already extracted to /tmp/etafat-content.md by python script)
 * into structured JSON: 6 domains + 10 universal savoir-faire definitions.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const text = readFileSync("/tmp/etafat-content.md", "utf-8");
const lines = text.split("\n");

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[''`]/g, "")
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// First pass: split into sections by Heading lines
// Top-level sections we care about:
//   "## Aménagement du territoire"  → first domain (has 10 savoir-faire with FULL detail text)
//   "# 1. Topographie & géodésie" through "# 10. ..." → savoir-faire detail pages (compétences only)
//   "# Énergie & Mines"  → 2nd domain
//   "## Bâtiment & Patrimoine"      → 3rd domain
//   "# Infrastructures"             → 4th domain
//   "# Foncier"                     → 5th domain
//   "# Agriculture & Eau"           → 6th domain

// Collect 10 universal savoir-faire from "Aménagement du territoire" section:
//   They have: title, "Texte court pour la carte : ..." and "Texte détaillé après clic : ..."
// Then the matching "# N. <Name>" sections list "Compétences métier" bullets.

// Strategy: scan top-to-bottom, identify regions.

const domains = [];
const skills = []; // 10 universal savoir-faire definitions

// State machine
let i = 0;
const N = lines.length;

function isHeading(line) {
  if (line.startsWith("# ")) return { level: 1, text: line.slice(2).trim() };
  if (line.startsWith("## ")) return { level: 2, text: line.slice(3).trim() };
  return null;
}

function findNextHeading(start) {
  for (let j = start; j < N; j++) {
    const h = isHeading(lines[j]);
    if (h) return { idx: j, ...h };
  }
  return null;
}

// ---------- Find "Aménagement du territoire" block ----------
function buildAmenagementDomain() {
  // Start at "## Aménagement du territoire"
  const startIdx = lines.findIndex((l) => l.trim() === "## Aménagement du territoire");
  if (startIdx < 0) throw new Error("Aménagement section not found");
  // intro is the paragraphs until first "## 1. Topographie & géodésie"
  let j = startIdx + 1;
  const introParas = [];
  while (j < N && !lines[j].startsWith("## 1.")) {
    const t = lines[j].trim();
    if (t && !t.startsWith("Savoir-faire associés")) introParas.push(t);
    j++;
  }
  // 10 savoir-faire cards: ## N. Name + "Texte court pour la carte : ..." + "Texte détaillé après clic : ..."
  const cards = [];
  for (let n = 1; n <= 10; n++) {
    const re = new RegExp(`^## ${n}\\. (.+)$`);
    const idx = lines.findIndex((l) => re.test(l));
    if (idx < 0) continue;
    const m = lines[idx].match(re);
    const name = m[1].trim();
    // collect lines until next ## or end of section
    let k = idx + 1;
    let short = "";
    let detail = "";
    while (k < N) {
      const l = lines[k].trim();
      if (l.startsWith("## ") || l.startsWith("# ")) break;
      if (l.startsWith("Texte court pour la carte :")) short = l.replace(/^Texte court pour la carte\s*:\s*/, "");
      else if (l.startsWith("Texte détaillé après clic :")) detail = l.replace(/^Texte détaillé après clic\s*:\s*/, "");
      k++;
    }
    cards.push({ index: n, name, short, detail });
  }
  return { introParas, cards };
}

const amenagement = buildAmenagementDomain();

// ---------- Collect competences for the 10 universal savoir-faire ----------
// They appear as `# 1. Name` through `# 10. Name` with `## Compétences métier` and a bullet list
const universalCompetences = [];
for (let n = 1; n <= 10; n++) {
  const re = new RegExp(`^# ${n}\\. (.+)$`);
  const idx = lines.findIndex((l) => re.test(l));
  if (idx < 0) continue;
  const name = lines[idx].match(re)[1].trim();
  // find "## Compétences métier" right after
  let k = idx + 1;
  while (k < N && !lines[k].startsWith("## Compétences")) k++;
  if (k >= N) continue;
  k++;
  const competences = [];
  while (k < N) {
    const l = lines[k].trim();
    if (!l) { k++; continue; }
    if (l.startsWith("# ") || l.startsWith("## ")) break;
    competences.push(l);
    k++;
  }
  universalCompetences.push({ index: n, name, competences });
}

// Build 10 universal savoir-faire definitions
for (let n = 0; n < 10; n++) {
  const card = amenagement.cards[n];
  const comp = universalCompetences[n];
  if (!card || !comp) continue;
  skills.push({
    index: n + 1,
    title: card.name,
    slug: slugify(card.name),
    short: card.short,
    detail: card.detail,
    competences: comp.competences,
  });
}

// Build Aménagement du territoire domain entry
domains.push({
  title: "Aménagement du territoire",
  slug: "amenagement-du-territoire",
  accroche: "Mieux planifier, sécuriser, aménager et valoriser les territoires grâce à des données géospatiales fiables.",
  intro: amenagement.introParas,
  skillSlugs: skills.map((s) => s.slug),
});

// ---------- Other domains ----------
function buildDomainFromHeading(headingLine, slugOverride) {
  const startIdx = lines.findIndex((l) => l === headingLine);
  if (startIdx < 0) throw new Error(`${headingLine} not found`);
  const name = headingLine.replace(/^#+\s*/, "");

  // Collect accroche + intro
  let j = startIdx + 1;
  let accroche = "";
  const intro = [];
  let inIntro = false;
  while (j < N) {
    const l = lines[j].trim();
    if (l.startsWith("# Nos savoir-faire associés") || l === "Savoir-faire associés" || /^## \d+\./.test(l)) break;
    if (l.startsWith("## Accroche courte")) { /* next non-empty line */ }
    else if (l.startsWith("## Texte d")) { inIntro = true; }
    else if (l) {
      if (!accroche) accroche = l;
      else if (inIntro || true) intro.push(l);
    }
    j++;
  }
  // If accroche/intro logic didn't pick up properly (for Énergie & Mines which doesn't have explicit Accroche heading),
  // use first line as accroche and rest as intro
  if (intro.length === 0 && accroche) {
    intro.push(accroche);
    accroche = "";
  }

  // Collect savoir-faire cards: "## N. Name", then "Texte court pour la carte : ..." and "Compétences métier :"
  const cards = [];
  for (let n = 1; n <= 15; n++) {
    const re = new RegExp(`^## ${n}\\. (.+)$`);
    const idx = lines.findIndex((l, i2) => i2 >= startIdx && re.test(l));
    if (idx < 0 || idx > startIdx + 600) continue;
    const name2 = lines[idx].match(re)[1].trim();
    let k = idx + 1;
    let short = "";
    const competences = [];
    let inComp = false;
    while (k < N) {
      const l = lines[k].trim();
      if (l.startsWith("# ") || /^## \d+\./.test(l)) break;
      if (l.startsWith("Texte court pour la carte :")) short = l.replace(/^Texte court pour la carte\s*:\s*/, "");
      else if (l.startsWith("Compétences métier")) inComp = true;
      else if (l === "Bouton : Explorer") {/* skip */}
      else if (inComp && l) competences.push(l);
      k++;
    }
    cards.push({ index: n, name: name2, short, competences });
  }

  return { title: name, slug: slugOverride || slugify(name), accroche, intro, cards };
}

// Énergie & Mines uses "# Énergie & Mines" then paragraphs (no Accroche/Texte heading)
{
  const startIdx = lines.findIndex((l) => l === "# Énergie & Mines");
  let j = startIdx + 1;
  const intro = [];
  while (j < N) {
    const l = lines[j].trim();
    if (l.startsWith("Savoir-faire associés") || /^## \d+\./.test(l)) break;
    if (l) intro.push(l);
    j++;
  }
  // collect cards
  const cards = [];
  for (let n = 1; n <= 10; n++) {
    const re = new RegExp(`^## ${n}\\. (.+)$`);
    const idx = lines.findIndex((l, i2) => i2 >= startIdx && i2 < startIdx + 500 && re.test(l));
    if (idx < 0) continue;
    const name2 = lines[idx].match(re)[1].trim();
    let k = idx + 1;
    let short = "";
    const competences = [];
    let inComp = false;
    while (k < N) {
      const l = lines[k].trim();
      if (l.startsWith("# ") || /^## \d+\./.test(l)) break;
      if (l.startsWith("Texte court pour la carte :")) short = l.replace(/^Texte court pour la carte\s*:\s*/, "");
      else if (l.startsWith("Compétences métier")) inComp = true;
      else if (l === "Bouton : Explorer") {/* skip */}
      else if (inComp && l) competences.push(l);
      k++;
    }
    cards.push({ index: n, name: name2, short, competences });
  }
  domains.push({
    title: "Énergie & Mines",
    slug: "energie-mines",
    accroche: "Des données géospatiales fiables pour développer, exploiter et moderniser les sites énergétiques et miniers.",
    intro,
    cards,
  });
}

// Bâtiment & Patrimoine, Infrastructures, Foncier, Agriculture & Eau
const otherDomains = [
  { heading: "## Bâtiment & Patrimoine", slug: "batiment-patrimoine" },
  { heading: "# Infrastructures", slug: "infrastructures" },
  { heading: "# Foncier", slug: "foncier" },
  { heading: "# Agriculture & Eau", slug: "agriculture-eau" },
];
for (const od of otherDomains) {
  domains.push(buildDomainFromHeading(od.heading, od.slug));
}

// ---------- Save ----------
const outPath = join(process.cwd(), "src/data/etafat-content.json");
writeFileSync(outPath, JSON.stringify({ domains, skills }, null, 2));
console.log(`✓ Wrote ${outPath}`);
console.log(`  domains: ${domains.length}`);
domains.forEach((d) => console.log(`    - ${d.title} (${d.slug})`));
console.log(`  universal skills: ${skills.length}`);
skills.forEach((s) => console.log(`    ${s.index}. ${s.title} (${s.slug})`));
