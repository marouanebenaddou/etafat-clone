import pagesRaw from "@/data/pages.json";
import postsRaw from "@/data/posts.json";
import portfolioRaw from "@/data/portfolio.json";
import jobsRaw from "@/data/jobs.json";

export type ScrapedItem = {
  url: string;
  path: string;
  slug: string;
  lang: string;
  title: string;
  description: string;
  featuredImage: string;
  headings: { level: string; text: string }[];
  paragraphs: string[];
  lists: string[][];
  images: { src: string; alt: string; width: number | null; height: number | null }[];
  videos: string[];
  ctas: { text: string; href: string }[];
  contentHtml: string;
  links: { href: string; text: string }[];
};

export const pages = pagesRaw as ScrapedItem[];
export const posts = postsRaw as ScrapedItem[];
export const portfolio = portfolioRaw as ScrapedItem[];
export const jobs = jobsRaw as ScrapedItem[];

export function findBySlug(items: ScrapedItem[], slug: string) {
  return items.find((p) => p.slug === slug);
}

/** Filter out breadcrumb-like or junk paragraphs */
export function cleanParagraphs(item: ScrapedItem): string[] {
  return item.paragraphs.filter((p) => {
    const t = p.trim();
    if (!t || t.length < 40) return false;
    if (t.startsWith("Accueil »") || t.startsWith("Accueil>")) return false;
    if (/^Accueil\s*»\s*/.test(t)) return false;
    if (/^\s*»\s*/.test(t)) return false;
    if (t.includes("Previous Project") || t.includes("Next Project")) return false;
    return true;
  });
}

/** Get a description for the page (skip breadcrumbs) */
export function pageDescription(item: ScrapedItem | undefined | null) {
  if (!item) return "";
  const para = cleanParagraphs(item)[0];
  return para || item.description || "";
}

export function findByPath(items: ScrapedItem[], path: string) {
  const norm = path.endsWith("/") ? path : path + "/";
  return items.find((p) => p.path === norm);
}

export function savoirFairePages() {
  return pages
    .filter(
      (p) =>
        p.path.startsWith("/savoir-faire/") && p.path !== "/savoir-faire/" && p.slug,
    )
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function domainesPages() {
  return pages
    .filter(
      (p) =>
        p.path.startsWith("/domaines-activite/") &&
        p.path !== "/domaines-activite/" &&
        p.slug,
    )
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function agencyPages() {
  return pages
    .filter((p) => /^\/etafat-[a-z-]+\/$/.test(p.path))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function miscPageBySlug(slug: string) {
  return pages.find((p) => p.slug === slug && p.path === `/${slug}/`);
}

export function postBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function portfolioBySlug(slug: string) {
  return portfolio.find((p) => p.slug === slug);
}

export function jobBySlug(slug: string) {
  return jobs.find((p) => p.slug === slug);
}

export function safeImage(url: string | undefined | null) {
  if (!url) return null;
  if (url.startsWith("/")) return null;
  // Strip CDN sizes like -300x200
  return url;
}

/** Format a date like "2026-04-04T..." → "4 avril 2026" */
export function formatFrDate(iso: string | undefined | null) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
