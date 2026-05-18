import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - ETAFAT",
};

export default function PolitiquePage() {
  const page = miscPageBySlug("politique-confidentialite");
  return (
    <>
      <PageHero
        title="Politique de confidentialité"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Politique de confidentialité" }]}
        variant="centered"
      />
      {page && <PageBody item={page} />}
    </>
  );
}
