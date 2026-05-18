import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { QuestionCTA } from "@/components/QuestionCTA";
import { findByPath, pages } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Culture d'entreprise - ETAFAT",
  description: "Découvrez la culture d'entreprise du Groupe ETAFAT.",
};

export default function CulturePage() {
  const page = findByPath(pages, "/nous-rejoindre/culture-entreprise/");
  if (!page)
    return (
      <PageHero
        title="Culture d'entreprise"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Nous rejoindre", href: "/nous-rejoindre/" },
          { label: "Culture d'entreprise" },
        ]}
      />
    );
  return (
    <>
      <PageHero
        title={page.title}
        description={page.paragraphs[0]}
        image={page.featuredImage}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Nous rejoindre", href: "/nous-rejoindre/" },
          { label: page.title },
        ]}
      />
      <PageBody item={page} />
      <QuestionCTA />
    </>
  );
}
