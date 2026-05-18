import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre identité - ETAFAT",
  description: "Découvrez l'identité du Groupe ETAFAT.",
};

export default function IdentitePage() {
  const page = miscPageBySlug("identite");
  if (!page) return <PageHero title="Identité" breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Identité" }]} />;
  return (
    <>
      <PageHero
        title={page.title}
        description={page.paragraphs[0]}
        image={page.featuredImage}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Identité" }]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
