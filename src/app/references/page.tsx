import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { ReferencesExplorer } from "@/components/ReferencesExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos références - ETAFAT",
  description:
    "Découvrez les projets phares menés par ETAFAT au Maroc et en Afrique : aménagement, foncier, infrastructures, énergie, agriculture et patrimoine.",
};

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        title="Nos références"
        description="Des projets d'envergure menés au Maroc et en Afrique, témoignant de notre expertise géospatiale, foncière et territoriale."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Références" }]}
        variant="banner"
        image="/etafat/skills/cartographie.jpg"
      />
      <ReferencesExplorer />
      <QuestionCTA />
    </>
  );
}
