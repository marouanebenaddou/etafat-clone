import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - ETAFAT",
};

export default function MentionsLegalesPage() {
  const page = miscPageBySlug("mentions-legales");
  return (
    <>
      <PageHero
        title="Mentions légales"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]}
        variant="centered"
      />
      {page && <PageBody item={page} />}
    </>
  );
}
