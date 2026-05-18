import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PageBody } from "@/components/PageBody";
import { Pill } from "@/components/Pill";
import { jobs, jobBySlug, pageDescription } from "@/lib/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = jobBySlug(slug);
  return { title: job ? `${job.title} - ETAFAT Recrute` : "Offre d'emploi - ETAFAT" };
}

export default async function JobDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = jobBySlug(slug);
  if (!job) notFound();
  return (
    <>
      <PageHero
        title={job.title}
        description={pageDescription(job)}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Offres d'emploi", href: "/offres-demploi/" },
          { label: job.title },
        ]}
        variant="centered"
      />
      <PageBody item={job} />
      <section className="bg-[#f5f7f9] py-16">
        <div className="container-etafat text-center">
          <h2 className="text-navy mb-6">Postuler à cette offre</h2>
          <p className="text-body mb-8 max-w-xl mx-auto">
            Envoyez-nous votre candidature en quelques clics. Notre équipe RH vous répondra
            sous quelques jours.
          </p>
          <Pill href="/contact/" variant="teal" arrow="right">
            Postuler
          </Pill>
        </div>
      </section>
    </>
  );
}
