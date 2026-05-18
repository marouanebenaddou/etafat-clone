import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { savoirFairePages, domainesPages, agencyPages, posts, portfolio, jobs } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan du site - ETAFAT",
};

export default function PlanDuSitePage() {
  const sections: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Le Groupe",
      links: [
        { label: "Identité", href: "/identite/" },
        { label: "Agences", href: "/agences/" },
        { label: "Filiales", href: "/filiales/" },
        { label: "Engagements", href: "/engagements/" },
        { label: "Actualités", href: "/actualites/" },
        { label: "Nous rejoindre", href: "/nous-rejoindre/" },
        { label: "Contact", href: "/contact/" },
      ],
    },
    {
      title: "Notre offre",
      links: [
        { label: "Domaines d'activité", href: "/domaines-activite/" },
        { label: "Savoir-faire", href: "/savoir-faire/" },
        { label: "Références", href: "/references/" },
        { label: "Innovation", href: "/innovation/" },
      ],
    },
    {
      title: "Savoir-faire",
      links: savoirFairePages().map((p) => ({ label: p.title, href: p.path })),
    },
    {
      title: "Domaines d'activité",
      links: domainesPages().map((p) => ({ label: p.title, href: p.path })),
    },
    {
      title: "Agences",
      links: agencyPages().map((p) => ({ label: p.title, href: p.path })),
    },
    {
      title: "Actualités",
      links: posts.map((p) => ({ label: p.title, href: p.path })),
    },
    {
      title: "Références",
      links: portfolio.map((p) => ({ label: p.title, href: p.path })),
    },
    {
      title: "Offres d'emploi",
      links: jobs.map((j) => ({ label: j.title, href: j.path })),
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "/mentions-legales/" },
        { label: "Politique de confidentialité", href: "/politique-confidentialite/" },
      ],
    },
  ];

  return (
    <>
      <PageHero
        title="Plan du site"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Plan du site" }]}
        variant="centered"
      />
      <section className="container-etafat py-16">
        <div className="grid md:grid-cols-2 gap-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-navy text-xl font-semibold mb-4">{s.title}</h2>
              <ul className="space-y-2 text-body text-sm">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[#2ab5b4] underline-offset-2 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
