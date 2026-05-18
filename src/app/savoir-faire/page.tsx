import { PageHero } from "@/components/PageHero";
import { SkillCard } from "@/components/SkillCard";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Reveal } from "@/components/Reveal";
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
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12">
            {skills.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <SkillCard title={s.title} href={`/savoir-faire/${s.slug}/`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <QuestionCTA />
    </>
  );
}
