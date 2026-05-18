import { PageHero } from "@/components/PageHero";
import { CardGrid } from "@/components/CardGrid";
import { QuestionCTA } from "@/components/QuestionCTA";
import { savoirFairePages, findByPath } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savoir-faire - ETAFAT",
  description:
    "Découvrez l'ensemble des savoir-faire du Groupe ETAFAT : topographie, cartographie, modélisation 3D, géomètre-expert et bien plus.",
};

export default function SavoirFairePage() {
  const items = savoirFairePages();
  const meta = findByPath(items.length ? items : [], "/savoir-faire/");
  return (
    <>
      <PageHero
        title="Savoir-faire"
        description={
          meta?.description ||
          "Le Groupe ETAFAT met à votre disposition une large palette d'expertises géospatiales pour répondre à vos projets les plus exigeants."
        }
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Savoir-faire" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <CardGrid items={items} cols={3} />
      </section>
      <QuestionCTA />
    </>
  );
}
