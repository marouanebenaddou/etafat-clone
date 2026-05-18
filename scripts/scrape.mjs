#!/usr/bin/env node
/*
 * ETAFAT content scraper — HTML-first approach.
 * Pulls every page from the sitemap, parses with cheerio, saves to JSON.
 */
import { mkdir, writeFile, readFile, stat } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { load } from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src/data");
const CACHE_DIR = join(ROOT, ".cache/scrape");
const ORIGIN = "https://geofit.fr";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36";
const CONCURRENCY = 6;

async function ensureDir(p) {
  await mkdir(p, { recursive: true }).catch(() => {});
}

function safeKey(s) {
  return s.replace(/[^a-z0-9._-]/gi, "_");
}

async function cachedGet(url) {
  const cacheFile = join(CACHE_DIR, safeKey(url) + ".html");
  try {
    const s = await stat(cacheFile);
    if (Date.now() - s.mtimeMs < 1000 * 60 * 60 * 24 * 3) {
      return readFile(cacheFile, "utf-8");
    }
  } catch {}
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9" } });
  if (!res.ok) {
    console.warn(`  ! ${url} → ${res.status}`);
    return "";
  }
  const text = await res.text();
  await writeFile(cacheFile, text, "utf-8");
  return text;
}

async function parallel(items, fn, conc = CONCURRENCY) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        results[i] = await fn(items[i], i);
      } catch (e) {
        console.warn(`  ! item ${i} failed:`, e.message);
        results[i] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: conc }, worker));
  return results;
}

/* ---------- text helpers ---------- */

function decode(s = "") {
  return s
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8230;/g, "…")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function clean(t = "") {
  return decode(t.replace(/\s+/g, " ")).trim();
}

function getPath(url) {
  return new URL(url).pathname;
}

function slugFromUrl(url) {
  return new URL(url).pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean).pop() || "";
}

/* ---------- sitemap parsing ---------- */

async function getSitemapUrls(sitemapPath) {
  const xml = await cachedGet(`${ORIGIN}${sitemapPath}`);
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))].filter(
    (u) => u.startsWith(ORIGIN),
  );
}

/* ---------- page extraction ---------- */

function extractPage($, url) {
  // Salient/wordpress wraps content in #ajax-content-wrap
  const main = $("#ajax-content-wrap").first();
  const wrap = main.length ? main : $("body");

  // Strip nav/footer/scripts/cookie
  wrap.find("header, footer, nav, script, style, .cky-consent-container, #header-outer, #footer-outer").remove();

  // Extract main metadata
  const title = clean($("h1").first().text()) || clean($('meta[property="og:title"]').attr("content") || "");
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const description = clean(
    $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "",
  );
  const lang = $("html").attr("lang") || "fr-FR";

  // Heading hierarchy
  const headings = [];
  wrap.find("h1, h2, h3, h4").each((_, h) => {
    const text = clean($(h).text());
    if (text && text.length < 200) headings.push({ level: h.tagName.toLowerCase(), text });
  });

  // Images (img tags + background-image + Salient data-bg attributes)
  const images = [];
  function pushImg(src, alt = "") {
    if (!src) return;
    const clean = src.replace(/&amp;/g, "&").replace(/[")]/g, "").trim();
    if (!clean.includes("uploads")) return;
    // strip dimensional variants like -1024x768 from end
    const normalized = clean
      .replace(/-\d+x\d+(\.(jpe?g|png|webp))$/i, "$1")
      .replace(/^\/\//, "https://");
    if (images.find((i) => i.src === normalized)) return;
    images.push({ src: normalized, alt, width: null, height: null });
  }
  wrap.find("img").each((_, img) => {
    const $img = $(img);
    const src = $img.attr("data-src") || $img.attr("src") || $img.attr("data-nectar-img-src");
    pushImg(src, clean($img.attr("alt") || ""));
  });
  // Salient column-image-bg uses data-bgimage on .column-image-bg
  wrap.find("[data-bgimage], [data-img-bg], [data-bg]").each((_, el) => {
    const $el = $(el);
    pushImg($el.attr("data-bgimage") || $el.attr("data-img-bg") || $el.attr("data-bg"));
  });
  // Inline style background-image
  wrap.find("[style*='background-image']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const m = style.match(/background-image:\s*url\(['"]?([^'")]+)/i);
    if (m) pushImg(m[1]);
  });
  // Salient parallax sections may store image in style block / data-bg-image
  wrap.find(".parallax_section, .nectar-parallax-scene, .full-width-section, .row-bg").each((_, el) => {
    const $el = $(el);
    pushImg($el.attr("data-bgimage") || $el.attr("data-bg-image"));
  });
  // Search whole HTML for any uploads URL that wasn't caught (last resort)
  if (images.length === 0) {
    const rawHtml = wrap.html() || "";
    const matches = rawHtml.match(/https?:\/\/etafat\.fr\/wp-content\/uploads\/[a-z0-9/_.-]+\.(?:jpe?g|png|webp)/gi) || [];
    for (const u of matches.slice(0, 8)) pushImg(u);
  }

  // Internal links
  const links = [];
  wrap.find("a[href]").each((_, a) => {
    const href = $(a).attr("href");
    const text = clean($(a).text());
    if (href && text && href.startsWith("http") && href.includes("geofit.fr")) {
      links.push({ href, text });
    }
  });

  // CTAs (pill buttons)
  const ctas = [];
  wrap.find('.nectar-cta, a.nectar-button, .button.solid_color').each((_, el) => {
    const $el = $(el);
    const text = clean($el.text());
    const href = $el.is("a") ? $el.attr("href") : $el.find("a").first().attr("href");
    if (text && href) ctas.push({ text, href });
  });

  // Video URLs
  const videos = [];
  wrap.find("video source").each((_, s) => {
    const src = $(s).attr("src");
    if (src) videos.push(src);
  });
  wrap.find('iframe[src*="youtube"], iframe[src*="vimeo"]').each((_, iframe) => {
    const src = $(iframe).attr("src");
    if (src) videos.push(src);
  });

  // Body content (for posts, portfolio, jobs)
  let bodyHtml = "";
  const bodySelectors = [
    ".wpb_text_column .wpb_wrapper",
    ".entry-content",
    ".portfolio-content",
    ".project-content",
    ".job_description",
    "article .wpb_wrapper",
  ];
  for (const sel of bodySelectors) {
    const el = wrap.find(sel).first();
    if (el.length && el.text().trim().length > 200) {
      bodyHtml = el.html() || "";
      break;
    }
  }
  if (!bodyHtml) bodyHtml = wrap.html()?.slice(0, 80000) || "";

  // Paragraphs (cleaned text representation)
  const paragraphs = [];
  wrap.find("p").each((_, p) => {
    const text = clean($(p).text());
    if (text.length > 30) paragraphs.push(text);
  });

  // Lists (filter nav-menu lists out)
  const NAV_LIKE = new Set([
    "Accueil",
    "Nous rejoindre",
    "Nous contacter",
    "Identité",
    "Agences",
    "Filiales",
    "Engagements",
    "Actualités",
    "Domaines d'activité",
    "Savoir-faire",
    "Références",
    "Innovation",
    "Le Groupe",
    "Notre offre",
    "Menu",
    "Mentions légales",
    "Politique de confidentialité",
    "Plan du site",
    "search",
    "Search",
  ]);
  const lists = [];
  wrap.find("ul.iwithtext, ul.bullet_list, ul.checklist, ul.list-with-icons").each((_, ul) => {
    const items = $(ul)
      .children("li")
      .map((_, li) => clean($(li).text()))
      .get()
      .filter((t) => t.length > 8 && !NAV_LIKE.has(t));
    if (items.length >= 2 && items.length < 50) lists.push(items);
  });
  // Fallback: scan regular ULs but skip any whose items look like nav
  if (lists.length === 0) {
    wrap.find("ul").each((_, ul) => {
      const items = $(ul)
        .children("li")
        .map((_, li) => clean($(li).text()))
        .get()
        .filter((t) => t.length > 8 && !NAV_LIKE.has(t));
      const navMatches = $(ul)
        .children("li")
        .map((_, li) => NAV_LIKE.has(clean($(li).text())))
        .get()
        .filter(Boolean).length;
      if (items.length >= 2 && items.length < 50 && navMatches === 0) lists.push(items);
    });
  }

  return {
    url,
    path: getPath(url),
    slug: slugFromUrl(url),
    lang,
    title,
    description,
    featuredImage: ogImage,
    headings,
    paragraphs: paragraphs.slice(0, 50),
    lists: lists.slice(0, 10),
    images: images.slice(0, 30),
    videos,
    ctas: ctas.slice(0, 20),
    contentHtml: bodyHtml,
    links: links.slice(0, 80),
  };
}

/* ---------- scrape grouped ---------- */

async function scrapeGroup(label, sitemap, filter = () => true) {
  console.log(`→ Scraping ${label}...`);
  const urls = (await getSitemapUrls(sitemap)).filter(filter);
  console.log(`  ${urls.length} URLs`);
  const items = [];
  let done = 0;
  await parallel(urls, async (url) => {
    const html = await cachedGet(url);
    done++;
    process.stdout.write(`\r  ${label} ${done}/${urls.length}`);
    if (!html) return;
    const $ = load(html);
    const data = extractPage($, url);
    items.push(data);
  });
  console.log("");
  return items.sort((a, b) => a.path.localeCompare(b.path));
}

async function main() {
  await ensureDir(DATA_DIR);
  await ensureDir(CACHE_DIR);

  // === Pages ===
  const allPages = await scrapeGroup(
    "pages",
    "/wp-sitemap-posts-page-1.xml",
    (u) => !u.includes("/en/") && !u.endsWith(".xsl"),
  );
  await writeFile(join(DATA_DIR, "pages.json"), JSON.stringify(allPages, null, 2));

  // Group pages into types based on URL
  const pageGroups = {
    home: allPages.filter((p) => p.path === "/"),
    savoirFaire: allPages.filter((p) => p.path.startsWith("/savoir-faire/")),
    domaines: allPages.filter((p) => p.path.startsWith("/domaines-activite/")),
    agencies: allPages.filter((p) => /^\/etafat-[a-z-]+\/$/.test(p.path)),
    misc: allPages.filter(
      (p) =>
        p.path !== "/" &&
        !p.path.startsWith("/savoir-faire/") &&
        !p.path.startsWith("/domaines-activite/") &&
        !/^\/etafat-[a-z-]+\/$/.test(p.path),
    ),
  };
  await writeFile(join(DATA_DIR, "page-groups.json"), JSON.stringify(Object.fromEntries(Object.entries(pageGroups).map(([k, v]) => [k, v.map((p) => p.path)])), null, 2));

  // === Posts ===
  const posts = await scrapeGroup("posts", "/wp-sitemap-posts-post-1.xml");
  await writeFile(join(DATA_DIR, "posts.json"), JSON.stringify(posts, null, 2));

  // === Portfolio ===
  const portfolio = await scrapeGroup("portfolio", "/wp-sitemap-posts-portfolio-1.xml");
  await writeFile(join(DATA_DIR, "portfolio.json"), JSON.stringify(portfolio, null, 2));

  // === Jobs ===
  const jobs = await scrapeGroup("jobs", "/wp-sitemap-posts-job-1.xml");
  await writeFile(join(DATA_DIR, "jobs.json"), JSON.stringify(jobs, null, 2));

  // === Categories (from posts) ===
  const cats = new Map();
  for (const p of posts) {
    // try to extract from URL/breadcrumb but most posts share /actualites/ root
  }

  console.log("\n✓ Scrape complete");
  console.log(`  Pages: ${allPages.length}`);
  console.log(`     home/savoir-faire/domaines/agencies/misc:`,
    pageGroups.home.length, pageGroups.savoirFaire.length, pageGroups.domaines.length,
    pageGroups.agencies.length, pageGroups.misc.length);
  console.log(`  Posts: ${posts.length}`);
  console.log(`  Portfolio: ${portfolio.length}`);
  console.log(`  Jobs: ${jobs.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
