import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SkillCard } from "@/components/SkillCard";
import { QuestionCTA } from "@/components/QuestionCTA";
import { domains, domainBySlug, cardsForDomain, skillBySlug } from "@/lib/etafat";
import type { Metadata } from "next";

export function generateStaticParams() {
  return domains.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = domainBySlug(slug);
  if (!d) return { title: "ETAFAT" };
  return {
    title: `${d.title} - ETAFAT`,
    description: d.accroche || d.intro[0]?.slice(0, 160),
  };
}

export default async function DomaineDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = domainBySlug(slug);
  if (!d) notFound();
  const cards = cardsForDomain(d);

  return (
    <>
      <PageHero
        title={d.title}
        description={d.accroche}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Domaines d'activité", href: "/domaines-activite/" },
          { label: d.title },
        ]}
        variant="centered"
      />

      {/* Intro paragraphs */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-etafat max-w-4xl">
          {d.intro.map((p, i) => (
            <p key={i} className="text-body text-base md:text-lg leading-relaxed mb-5">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Savoir-faire grid */}
      <section className="bg-[#f5f7f9] py-16 md:py-24">
        <div className="container-etafat">
          <h2 className="text-navy mb-3">Savoir-faire associés</h2>
          <p className="text-body mb-10 max-w-2xl">
            Les expertises ETAFAT mobilisées sur les projets {d.title.toLowerCase()}.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((c) => {
              const universal = skillBySlug(
                c.name
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[̀-ͯ]/g, "")
                  .replace(/&/g, "et")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, ""),
              );
              return (
                <SkillCard
                  key={c.index}
                  index={c.index}
                  title={c.name}
                  short={c.short}
                  href={universal ? `/savoir-faire/${universal.slug}/` : undefined}
                />
              );
            })}
          </div>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
