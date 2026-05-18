import { PageHero } from "@/components/PageHero";
import { CardGrid } from "@/components/CardGrid";
import { QuestionCTA } from "@/components/QuestionCTA";
import { posts } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités - ETAFAT",
  description:
    "Suivez les actualités, projets et événements du Groupe ETAFAT.",
};

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        title="Actualités"
        description="Suivez l'actualité du Groupe ETAFAT : projets phares, événements, vie d'agence et innovation."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <CardGrid items={posts} cols={3} />
      </section>
      <QuestionCTA />
    </>
  );
}
