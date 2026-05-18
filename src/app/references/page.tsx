import { PageHero } from "@/components/PageHero";
import { CardGrid } from "@/components/CardGrid";
import { QuestionCTA } from "@/components/QuestionCTA";
import { portfolio } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Références - ETAFAT",
  description:
    "Découvrez les références et projets phares menés par le Groupe ETAFAT en France et à l'international.",
};

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        title="Nos références"
        description="Des projets d'envergure menés en France et à l'international, témoignant de notre expertise géospatiale."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Références" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <CardGrid items={portfolio} cols={3} tag="Projet" />
      </section>
      <QuestionCTA />
    </>
  );
}
