import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { CheckIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { skills, skillBySlug, skillImage } from "@/lib/etafat";
import type { Metadata } from "next";

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = skillBySlug(slug);
  if (!s) return { title: "ETAFAT" };
  return { title: `${s.title} - ETAFAT`, description: s.short };
}

export default async function SkillDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = skillBySlug(slug);
  if (!s) notFound();

  return (
    <>
      <PageHero
        title={s.title}
        description={s.detail}
        image={skillImage(s.slug)}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Savoir-faire", href: "/savoir-faire/" },
          { label: s.title },
        ]}
      />

      {/* Compétences métier */}
      <section className="bg-[#f5f7f9] py-16 md:py-20">
        <div className="container-etafat max-w-4xl">
          <Reveal>
            <h2 className="text-navy mb-8">Compétences métier</h2>
          </Reveal>
          <ul className="grid md:grid-cols-2 gap-4">
            {s.competences.map((c, i) => (
              <Reveal key={i} delay={i * 50} as="li">
                <span className="flex items-start gap-3 text-body leading-relaxed">
                  <span className="text-teal mt-1 shrink-0">
                    <CheckIcon width={16} height={16} />
                  </span>
                  <span>{c}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
