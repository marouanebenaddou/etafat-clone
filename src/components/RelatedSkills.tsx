import { SkillCard } from "@/components/SkillCard";
import { Pill } from "@/components/Pill";
import { Reveal } from "@/components/Reveal";
import { relatedSkills } from "@/lib/etafat";

/**
 * "Les savoir-faire associés" section shown at the bottom of every
 * savoir-faire detail page. Lists the skills thematically related to the
 * current one (acquisition, foncier, data/SIG, 3D, conseil families),
 * matching the geofit "savoir-faire associés" layout: centered icon cards
 * with an "Explorer" link.
 */
export function RelatedSkills({ currentSlug }: { currentSlug: string }) {
  const related = relatedSkills(currentSlug);
  if (related.length === 0) return null;

  return (
    <section className="bg-[#f5f7f9] py-20 md:py-28">
      <div className="container-etafat">
        <Reveal variant="line" duration={1000}>
          <h2 className="text-navy mb-14">Les savoir-faire associés</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12">
          {related.map((s, i) => (
            <Reveal key={s.slug} delay={i * 60}>
              <SkillCard title={s.title} href={`/savoir-faire/${s.slug}/`} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={related.length * 60 + 100}>
          <div className="flex justify-center mt-14">
            <Pill href="/savoir-faire/" variant="outline-teal" arrow="right">
              Tous nos savoir-faire
            </Pill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
