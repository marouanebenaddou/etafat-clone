import { PageHero } from "@/components/PageHero";
import { CardGrid } from "@/components/CardGrid";
import { QuestionCTA } from "@/components/QuestionCTA";
import { domainesPages } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domaines d'activité - ETAFAT",
  description:
    "Le Groupe ETAFAT intervient dans six grands domaines d'activité : énergie, bâtiment, infrastructure, défense, industrie et territoire.",
};

export default function DomainesPage() {
  const items = domainesPages();
  return (
    <>
      <PageHero
        title="Domaines d'activité"
        description="Notre savoir-faire géospatial s'applique à de nombreux domaines d'activité, du bâtiment aux grandes infrastructures, en passant par l'énergie, la défense et le territoire."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Domaines d'activité" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <CardGrid items={items} cols={3} />
      </section>
      <QuestionCTA />
    </>
  );
}
