import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { findByPath, pageDescription, savoirFairePages } from "@/lib/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return savoirFairePages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findByPath(savoirFairePages(), `/savoir-faire/${slug}/`);
  return {
    title: page ? `${page.title} - ETAFAT` : "ETAFAT",
    description: page?.description,
  };
}

export default async function SavoirFaireDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = findByPath(savoirFairePages(), `/savoir-faire/${slug}/`);
  if (!page) notFound();

  return (
    <>
      <PageHero
        title={page.title}
        description={pageDescription(page)}
        image={page.featuredImage || page.images[0]?.src}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Savoir-faire", href: "/savoir-faire/" },
          { label: page.title },
        ]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
