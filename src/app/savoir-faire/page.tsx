import { PageHero } from "@/components/PageHero";
import { SkillCard } from "@/components/SkillCard";
import { QuestionCTA } from "@/components/QuestionCTA";
import { skills } from "@/lib/etafat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savoir-faire - ETAFAT",
  description:
    "Les 10 savoir-faire d'ETAFAT : topographie, cartographie, modélisation 3D, BIM, SIG, foncier, géospatial intelligence et plus.",
};

export default function SavoirFairePage() {
  return (
    <>
      <PageHero
        title="Nos savoir-faire"
        description="ETAFAT mobilise dix expertises géospatiales complémentaires pour accompagner les projets territoriaux, énergétiques, fonciers et d'infrastructures."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Savoir-faire" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s) => (
            <SkillCard
              key={s.slug}
              index={s.index}
              title={s.title}
              short={s.short}
              href={`/savoir-faire/${s.slug}/`}
            />
          ))}
        </div>
      </section>
      <QuestionCTA />
    </>
  );
}
