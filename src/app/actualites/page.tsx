import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { ActualitesFeed } from "./ActualitesFeed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités - ETAFAT",
  description:
    "Suivez les actualités, projets et événements du Groupe ETAFAT sur LinkedIn.",
};

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        title="Actualités"
        description="Suivez l'actualité du Groupe ETAFAT : projets phares, événements et temps forts, directement depuis notre page LinkedIn."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        variant="centered"
      />

      <ActualitesFeed />

      <QuestionCTA />
    </>
  );
}
