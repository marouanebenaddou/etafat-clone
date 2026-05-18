import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { postBySlug, posts, agencyPages, pages, pageDescription } from "@/lib/content";
import type { Metadata } from "next";

const RESERVED = new Set([
  "savoir-faire",
  "domaines-activite",
  "references",
  "actualites",
  "agences",
  "contact",
  "innovation",
  "identite",
  "engagements",
  "filiales",
  "nous-rejoindre",
  "offres-demploi",
  "mentions-legales",
  "politique-confidentialite",
  "plan-du-site",
  "job",
]);

function findItem(slug: string) {
  const post = postBySlug(slug);
  if (post) return { item: post, kind: "post" as const };
  const agencies = agencyPages();
  const ag = agencies.find((p) => p.slug === `etafat-${slug.replace(/^etafat-/, "")}` || p.slug === slug);
  if (ag && /^\/etafat-[a-z-]+\/$/.test(ag.path)) return { item: ag, kind: "agency" as const };
  const misc = pages.find((p) => p.slug === slug && /^\/[^/]+\/$/.test(p.path));
  if (misc) return { item: misc, kind: "misc" as const };
  return null;
}

export function generateStaticParams() {
  const all = new Set<string>();
  posts.forEach((p) => all.add(p.slug));
  agencyPages().forEach((p) => all.add(p.slug));
  pages
    .filter((p) => /^\/[^/]+\/$/.test(p.path))
    .forEach((p) => all.add(p.slug));
  return [...all]
    .filter((s) => s && !RESERVED.has(s))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findItem(slug);
  if (!found) return { title: "ETAFAT" };
  const { item } = found;
  return { title: `${item.title} - ETAFAT`, description: item.description };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const found = findItem(slug);
  if (!found) notFound();
  const { item, kind } = found;

  const breadcrumb =
    kind === "post"
      ? [
          { label: "Accueil", href: "/" },
          { label: "Actualités", href: "/actualites/" },
          { label: item.title },
        ]
      : kind === "agency"
        ? [
            { label: "Accueil", href: "/" },
            { label: "Agences", href: "/agences/" },
            { label: item.title },
          ]
        : [{ label: "Accueil", href: "/" }, { label: item.title }];

  return (
    <>
      <PageHero
        title={item.title}
        description={pageDescription(item)}
        image={item.featuredImage || item.images[0]?.src}
        variant={kind === "post" ? "banner" : "image-right"}
        breadcrumb={breadcrumb}
      />
      <PageBody item={item} />
      <QuestionCTA />
    </>
  );
}
