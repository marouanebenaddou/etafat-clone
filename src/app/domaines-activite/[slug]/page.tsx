import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SkillCard } from "@/components/SkillCard";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Pill } from "@/components/Pill";
import { Reveal } from "@/components/Reveal";
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

function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
            <Reveal key={i} delay={i * 80}>
              <p className="text-body text-base md:text-lg leading-relaxed mb-5">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Savoir-faire grid — compact icon-only layout, 5 cols at lg */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy mb-14">Les savoir-faire associés</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12">
            {cards.map((c, i) => {
              const universal = skillBySlug(nameToSlug(c.name));
              return (
                <Reveal key={c.index} delay={i * 60}>
                  <SkillCard
                    title={c.name}
                    href={universal ? `/savoir-faire/${universal.slug}/` : undefined}
                  />
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={cards.length * 60 + 100}>
            <div className="flex justify-center mt-14">
              <Pill href="/savoir-faire/" variant="outline-teal" arrow="right">
                Tous nos savoir-faire
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
