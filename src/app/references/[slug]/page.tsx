import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { pageDescription, portfolio, portfolioBySlug } from "@/lib/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = portfolioBySlug(slug);
  return { title: page ? `${page.title} - ETAFAT` : "ETAFAT", description: page?.description };
}

export default async function PortfolioDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = portfolioBySlug(slug);
  if (!page) notFound();
  return (
    <>
      <PageHero
        title={page.title}
        description={pageDescription(page)}
        image={page.featuredImage || page.images[0]?.src}
        variant="banner"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Références", href: "/references/" },
          { label: page.title },
        ]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
