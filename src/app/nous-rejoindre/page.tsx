import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { Pill } from "@/components/Pill";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous rejoindre - ETAFAT",
  description: "Rejoignez le Groupe ETAFAT.",
};

export default function NousRejoindrePage() {
  const page = miscPageBySlug("nous-rejoindre");
  return (
    <>
      <PageHero
        title="Nous rejoindre"
        description={
          page?.paragraphs[0] ||
          "Découvrez l'expérience collaborateur ETAFAT et nos opportunités de carrière."
        }
        image={page?.featuredImage}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Nous rejoindre" }]}
      />
      {page && <PageBody item={page} />}
      <section className="bg-[#2ab5b4] py-20 text-center text-white">
        <div className="container-etafat">
          <h2 className="text-white mb-6 text-3xl md:text-4xl font-semibold" style={{ color: "#fff" }}>
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Découvrez les offres d&apos;emploi du Groupe ETAFAT et postulez en quelques clics.
          </p>
          <div className="flex justify-center">
            <Pill href="/offres-demploi/" variant="outline" arrow="right" className="!border-white !text-white">
              Voir les offres d&apos;emploi
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}
