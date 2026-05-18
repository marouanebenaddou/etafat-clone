import { PageHero } from "@/components/PageHero";
import { CardGrid } from "@/components/CardGrid";
import { QuestionCTA } from "@/components/QuestionCTA";
import { agencyPages } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos agences - ETAFAT",
  description: "Découvrez le réseau d'agences ETAFAT en France.",
};

export default function AgencesPage() {
  const agencies = agencyPages();
  return (
    <>
      <PageHero
        title="Nos agences"
        description="Le Groupe ETAFAT compte un réseau d'agences réparties en France et dans le monde, pour vous accompagner au plus près de vos projets."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Nos agences" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <CardGrid items={agencies} cols={3} />
      </section>
      <QuestionCTA />
    </>
  );
}
