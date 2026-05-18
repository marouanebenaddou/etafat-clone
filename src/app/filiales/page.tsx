import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos filiales - ETAFAT",
  description: "Découvrez les filiales du Groupe ETAFAT.",
};

export default function FilialesPage() {
  const page = miscPageBySlug("filiales");
  if (!page) return <PageHero title="Filiales" breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Filiales" }]} />;
  return (
    <>
      <PageHero
        title={page.title}
        description={page.paragraphs[0]}
        image={page.featuredImage}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Filiales" }]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
