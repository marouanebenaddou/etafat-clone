import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Innovation - ETAFAT",
  description: "L'innovation est au cœur de ETAFAT.",
};

export default function InnovationPage() {
  const page = miscPageBySlug("innovation");
  if (!page) {
    return (
      <PageHero
        title="Innovation"
        description="Découvrez nos pôles d'innovation"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Innovation" }]}
      />
    );
  }
  return (
    <>
      <PageHero
        title={page.title}
        description={page.paragraphs[0]}
        image={page.featuredImage}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Innovation" }]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
