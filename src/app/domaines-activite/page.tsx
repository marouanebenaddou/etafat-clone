import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { domains } from "@/lib/etafat";
import { ArrowRightIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domaines d'activité - ETAFAT",
  description:
    "ETAFAT intervient dans six grands domaines d'activité : aménagement du territoire, énergie & mines, bâtiment & patrimoine, infrastructures, foncier, agriculture & eau.",
};

const ICON_SLUGS = new Set([
  "amenagement-du-territoire",
  "energie-mines",
  "batiment-patrimoine",
  "infrastructures",
  "foncier",
  "agriculture-eau",
]);
const iconSrc = (slug: string) =>
  `/etafat/domaines/icons/${ICON_SLUGS.has(slug) ? slug : "amenagement-du-territoire"}.png`;

const QUESTIONS: Record<string, string> = {
  "amenagement-du-territoire":
    "Comment planifier, sécuriser et valoriser durablement vos territoires ?",
  "energie-mines":
    "Comment développer, exploiter et moderniser vos sites énergétiques et miniers ?",
  "batiment-patrimoine":
    "Comment concevoir, documenter et préserver vos bâtiments et votre patrimoine ?",
  infrastructures:
    "Comment concevoir, déployer et suivre vos grandes infrastructures ?",
  foncier:
    "Comment sécuriser, maîtriser et valoriser durablement votre foncier ?",
  "agriculture-eau":
    "Comment gérer durablement vos ressources agricoles et hydrauliques ?",
};

export default function DomainesPage() {
  return (
    <>
      <PageHero
        title="Nos domaines d'activité"
        description="Notre expertise géospatiale s'applique à six grands domaines stratégiques pour les territoires et leurs acteurs."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Domaines d'activité" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((d) => {
            return (
              <Link
                key={d.slug}
                href={`/domaines-activite/${d.slug}/`}
                className="group relative flex flex-col h-full text-center bg-white border border-[#e5e7eb] rounded-xl px-8 pt-10 pb-8 overflow-hidden hover:border-[#00669d] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <span className="absolute inset-x-0 top-0 h-1.5 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                <Image
                  src={iconSrc(d.slug)}
                  alt=""
                  width={176}
                  height={176}
                  className="mx-auto mb-6 w-40 h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="text-navy text-xl md:text-2xl font-semibold mb-3 leading-tight group-hover:text-[#00669d] transition-colors">
                  {d.title}
                </h3>
                {QUESTIONS[d.slug] && (
                  <p className="text-teal text-sm font-medium leading-snug mb-3">
                    {QUESTIONS[d.slug]}
                  </p>
                )}
                {d.accroche && (
                  <p className="text-body text-sm leading-relaxed mb-6 flex-1">
                    {d.accroche}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center justify-center gap-2 text-teal text-sm font-semibold">
                  Découvrir
                  <span className="arrow-circle">
                    <ArrowRightIcon width={11} height={11} />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <QuestionCTA />
    </>
  );
}
