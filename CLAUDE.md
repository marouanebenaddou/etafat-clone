@AGENTS.md
@HANDOFF.md

# Project: ETAFAT clone

A pixel-faithful clone of https://geofit.fr/, rebranded to ETAFAT. Built with Next.js 16 (App Router, Turbopack), Tailwind v4, TypeScript strict.

## What's already done

- **229 static routes** generated, covering every page on the source site:
  - `/` (full-fidelity home page with all sections)
  - `/savoir-faire/` + 16 expertise detail pages
  - `/domaines-activite/` + 6 domain detail pages
  - `/references/` + 46 portfolio projects
  - `/actualites/` + 90 blog posts (routed via root catch-all `[slug]`)
  - `/agences/` + 15 agency pages at `/etafat-<city>/`
  - `/offres-demploi/` + 35 jobs at `/job/<slug>`
  - Static pages: `/contact/`, `/identite/`, `/innovation/`, `/engagements/`, `/filiales/`, `/nous-rejoindre/`, `/nous-rejoindre/culture-entreprise/`, `/mentions-legales/`, `/politique-confidentialite/`, `/plan-du-site/`

- **Layout shell**: header (scroll-aware), navy mega-menu, footer with 4 columns, floating cookie button — in `src/components/`.

- **Design tokens** in `src/app/globals.css`:
  - Body: Open Sans 16/26, `#676767`
  - Headings: Figtree 42/52 weight 600, `#313c4e` (navy)
  - Primary CTA: `#2ab5b4` (teal)
  - Utility classes: `.container-etafat`, `.pill`, `.pill-teal`, `.pill-outline`, `.pill-outline-teal`, `.arrow-circle`, `.arrow-circle-outline`, `.text-navy/teal/body`, `.bg-navy/teal/light`.

- **Content**: scraped from geofit.fr into `src/data/*.json` (committed). Body text rebranded GEOFIT → ETAFAT; image filenames preserved (they point to the real geofit.fr CDN, which is allow-listed in `next.config.ts`).

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # 229 static pages
```

## Key files

- Routes: `src/app/**/page.tsx`
- Shared UI: `src/components/{SiteHeader,SiteFooter,MegaMenu,Pill,PageHero,PageBody,CardGrid,Breadcrumb,QuestionCTA,CookieButton,icons}.tsx`
- Content helpers: `src/lib/content.ts` (`pages`, `posts`, `portfolio`, `jobs`, `findByPath`, `pageDescription`, `cleanParagraphs`, …)
- Scraped data: `src/data/{pages,posts,portfolio,jobs,page-groups,categories}.json`
- Scripts: `scripts/scrape.mjs` (re-scrape from geofit.fr), `scripts/rebrand.mjs` (the historical GEOFIT→ETAFAT pass), `scripts/fix-image-urls.mjs` (image URL repair after rebrand)

## House rules

- This is **NOT the Next.js you know from training data** — Next 16, Turbopack, async `params: Promise<{ slug: string }>` in route handlers. Read `node_modules/next/dist/docs/` for the relevant API before writing routes.
- Do not edit `next.config.ts` to add domains for the brand — the allow-list is intentionally `geofit.fr` because that's where the images live.
- When rebranding text, never touch `wp-content/uploads/...` filenames (they 404 if changed). See `scripts/fix-image-urls.mjs` for the recovery pattern.
- Prefer editing `src/lib/content.ts` + `src/components/PageBody.tsx` over duplicating logic in individual route files.
- Build must always pass before committing.

## What's NOT done (good first tasks)

See `HANDOFF.md` for the full list and rationale.
