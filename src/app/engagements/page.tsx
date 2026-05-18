import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos engagements - ETAFAT",
  description: "Découvrez les engagements du Groupe ETAFAT.",
};

export default function EngagementsPage() {
  const page = miscPageBySlug("engagements");
  if (!page) return <PageHero title="Engagements" breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Engagements" }]} />;
  return (
    <>
      <PageHero
        title={page.title}
        description={page.paragraphs[0]}
        image={page.featuredImage}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Engagements" }]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
