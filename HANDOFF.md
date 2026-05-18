# Handoff notes — ETAFAT clone

## Status: working, 229 static pages, build passes, dev server runs.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

## Architecture in one paragraph

This is a static-export-friendly Next.js 16 App Router site. All content lives in `src/data/*.json` (scraped from the live geofit.fr site). Each page type has its own route (`src/app/...`) that imports a helper from `src/lib/content.ts`, finds the matching item by slug, and renders it through a shared `PageHero` + `PageBody` + `QuestionCTA` template. Images are served via `next/image` from the geofit.fr CDN (allow-listed in `next.config.ts`).

## What's solid

- Home page is hand-built section by section — full fidelity.
- Layout shell (header / mega-menu / footer / cookie button) is responsive and matches the source design.
- All 229 routes resolve and render with real content.
- Brand text is uniformly ETAFAT throughout (logo, footer, metadata, body paragraphs).
- Agency URLs follow `/etafat-<city>/` pattern.
- Production build (`npm run build`) succeeds clean.

## Known limitations / good first tasks

1. **Per-page layout fidelity** — Detail pages use one generic template (`PageHero` + `PageBody`). The original site has unique per-page layouts (custom hero variations, multi-column splits, parallax sections, etc.). To improve fidelity per template, study the corresponding `src/data/<type>.json` items and split `PageBody` into typed variants.

2. **Hero image rotation** — The source site rotates between several aerial photos. The clone uses one static image (`2024/05/dsc6186-scaled-1.jpg`). Wire up rotation in `src/app/page.tsx` if desired.

3. **Search panel** — The header search icon is a no-op. Either remove it or wire it to a client-side fuzzy search over `src/data/`.

4. **Cookie banner** — The floating cookie button is a UI placeholder, not a real consent flow. Integrate a real consent library (e.g. `react-cookie-consent`) if you ship publicly.

5. **Scroll animations / parallax** — The source uses Salient theme's parallax + scroll-driven reveals. The clone is plain CSS. Adding Lenis + IntersectionObserver-based fade-ups would close the feel gap.

6. **Mobile responsive QA** — Built mobile-first but only spot-checked at 1440px. Walk through 390px and 768px and tighten any breakpoints that look off.

7. **Forms** — The `/contact/` form is presentational. Submit handler doesn't exist. Wire to Formspree, Resend, or your own backend.

8. **Body content parsing edge cases** — `cleanParagraphs()` filters breadcrumb-like junk, and `PageBody` filters nav-flavored lists. A handful of pages may still show duplicate or fragment paragraphs. Spot-check by clicking through `/plan-du-site/` and fix in `src/lib/content.ts` if you find issues.

## Re-scraping content

If geofit.fr publishes new content:

```bash
rm -rf .cache/scrape   # bust 3-day cache
node scripts/scrape.mjs
```

This pulls all pages/posts/portfolio/jobs from the sitemap, parses them with cheerio, and writes fresh JSON to `src/data/`. Takes ~3 min over normal home internet.

After re-scrape, **you must re-run the rebrand pass** on the new data:

```bash
node scripts/rebrand.mjs
node scripts/fix-image-urls.mjs   # protects CDN filenames from the brand swap
```

## Adding a new page

- **Static page** (e.g. `/about-us/`): create `src/app/about-us/page.tsx` with a `PageHero` + your content.
- **Templated content** (e.g. a new team-members section): add a JSON file in `src/data/`, expose a helper in `src/lib/content.ts`, build a route that consumes it.

## Adding a new route type backed by scraped data

1. Update `scripts/scrape.mjs` to fetch the new sitemap path and call `extractPage` on each URL.
2. Add a typed accessor (`teamMemberBySlug`, etc.) to `src/lib/content.ts`.
3. Create `src/app/<type>/[slug]/page.tsx` with `generateStaticParams` returning the slugs.

## Things to NOT do

- Don't replace `geofit.fr` in `next.config.ts` — image hostname allow-list points to the real CDN.
- Don't rename `wp-content/uploads/...` filenames anywhere — they're real files on geofit.fr. The historical rebrand bug was caused by this and is now fixed by `fix-image-urls.mjs`.
- Don't commit `.cache/` or `.next/` (already gitignored).
- Don't use destructive `git reset --hard` — the work is committed but the scrape takes time to regenerate.

## Project file map

```
src/
  app/                     # one folder per route
    page.tsx               # home (hand-built, full fidelity)
    [slug]/page.tsx        # catch-all: posts / agencies / misc pages
    savoir-faire/...       # list + [slug] detail
    domaines-activite/...
    references/...
    job/[slug]/page.tsx
    actualites/page.tsx
    agences/page.tsx
    offres-demploi/page.tsx
    contact/page.tsx
    identite/page.tsx etc.
    plan-du-site/page.tsx
  components/
    SiteHeader.tsx + MegaMenu.tsx + SiteFooter.tsx + CookieButton.tsx
    PageHero.tsx + PageBody.tsx + Breadcrumb.tsx
    Pill.tsx + CardGrid.tsx + QuestionCTA.tsx
    icons.tsx              # all extracted SVG icons + custom domain icons
  lib/
    content.ts             # data accessors
    utils.ts               # cn()
  data/
    pages.json (55) | posts.json (90) | portfolio.json (46) | jobs.json (35)
scripts/
    scrape.mjs             # main scraper
    rebrand.mjs            # GEOFIT → ETAFAT swap (already applied)
    fix-image-urls.mjs     # restores CDN filenames after rebrand
docs/                      # leftover from template (largely empty)
```

