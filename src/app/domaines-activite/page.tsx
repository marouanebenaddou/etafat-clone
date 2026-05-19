import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { domains } from "@/lib/etafat";
import {
  TerritoryIcon,
  EnergyIcon,
  BuildingIcon,
  BridgeIcon,
  LandIcon,
  LeafWaterIcon,
  ArrowRightIcon,
} from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domaines d'activité - ETAFAT",
  description:
    "ETAFAT intervient dans six grands domaines d'activité : aménagement du territoire, énergie & mines, bâtiment & patrimoine, infrastructures, foncier, agriculture & eau.",
};

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "amenagement-du-territoire": TerritoryIcon,
  "energie-mines": EnergyIcon,
  "batiment-patrimoine": BuildingIcon,
  infrastructures: BridgeIcon,
  foncier: LandIcon,
  "agriculture-eau": LeafWaterIcon,
};

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((d) => {
            const Icon = ICONS[d.slug] || TerritoryIcon;
            return (
              <Link
                key={d.slug}
                href={`/domaines-activite/${d.slug}/`}
                className="group bg-white p-8 border border-[#e5e7eb] rounded-md hover:border-[#00669d] hover:shadow-md transition-all flex flex-col h-full"
              >
                <Icon className="w-12 h-12 text-[#00669d] mb-5" />
                <h3 className="text-navy text-xl font-semibold mb-3 leading-tight group-hover:text-[#00669d] transition-colors">
                  {d.title}
                </h3>
                {QUESTIONS[d.slug] && (
                  <p className="text-teal text-sm font-medium leading-snug mb-3">
                    {QUESTIONS[d.slug]}
                  </p>
                )}
                {d.accroche && (
                  <p className="text-body text-sm leading-relaxed mb-5 flex-1">
                    {d.accroche}
                  </p>
                )}
                <span className="text-teal text-sm font-semibold inline-flex items-center gap-2">
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
