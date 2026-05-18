import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { jobs } from "@/lib/content";
import { ArrowRightIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres d'emploi - ETAFAT",
  description: "Découvrez les offres d'emploi du Groupe ETAFAT.",
};

export default function JobsListPage() {
  return (
    <>
      <PageHero
        title="Nos offres d'emploi"
        description="Rejoignez le Groupe ETAFAT et participez à des projets géospatiaux ambitieux en France et à l'international."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Offres d'emploi" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <div className="grid gap-3">
          {jobs.map((j) => (
            <Link
              key={j.path}
              href={j.path}
              className="group flex items-center justify-between gap-6 bg-white border border-[#e5e7eb] rounded-md px-6 py-5 hover:border-[#00669d] hover:shadow-md transition-all"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-navy font-semibold text-base md:text-lg group-hover:text-[#00669d] transition-colors">
                  {j.title}
                </h3>
                {j.description && (
                  <p className="text-body text-sm line-clamp-1 mt-1">{j.description}</p>
                )}
              </div>
              <span className="arrow-circle shrink-0">
                <ArrowRightIcon width={12} height={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <QuestionCTA />
    </>
  );
}
