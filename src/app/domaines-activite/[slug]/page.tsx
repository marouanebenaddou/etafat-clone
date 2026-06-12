import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SkillCard } from "@/components/SkillCard";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Pill } from "@/components/Pill";
import { Reveal } from "@/components/Reveal";
import {
  domains,
  domainBySlug,
  cardsForDomain,
  skillBySlug,
  skillImage,
  domainVideo,
} from "@/lib/etafat";
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

// Domaines with a dedicated intro photo in /public/etafat/domaines/intro/.
const DOMAIN_INTRO_PHOTOS = new Set([
  "amenagement-du-territoire",
  "energie-mines",
  "batiment-patrimoine",
  "infrastructures",
  "foncier",
  "agriculture-eau",
]);

// Domain cards use domain-specific wording (e.g. "SIG & bases de données
// géographiques") that doesn't map 1:1 to one of the 22 canonical savoir-faire
// slugs. This aliases each variant — keyed by its nameToSlug() output — to the
// closest real skill so every "savoir-faire associé" card gets an Explorer link.
const SKILL_NAME_ALIASES: Record<string, string> = {
  "sig-et-bases-de-donnees-geographiques": "systemes-d-information-geographique",
  "sig-et-bases-de-donnees-d-infrastructures": "systemes-d-information-geographique",
  "sig-et-gestion-patrimoniale": "systemes-d-information-geographique",
  "sig-agricole-et-bases-de-donnees-rurales": "systemes-d-information-geographique",
  "foncier-et-securisation-des-emprises": "cadastre-et-securisation-fonciere",
  "foncier-rural-et-securisation-des-emprises": "cadastre-et-securisation-fonciere",
  "scanner-laser-3d-et-nuages-de-points": "scanner-laser-3d-et-mms",
  "inspection-des-structures": "inspection-et-surveillance-d-ouvrage",
  "cartographie-et-plans-du-bati": "cartographie",
  "cartographie-et-plans-techniques": "cartographie",
  "cartographie-agricole-et-occupation-du-sol": "cartographie",
  "conseil-et-audit-foncier-geospatial": "conseil-et-audit-geospatial",
  "modelisation-3d-et-bim-infrastructure": "modelisation-3d-et-bim",
  "modeles-numeriques-et-analyse-du-relief": "modelisation-3d-et-bim",
  "etudes-foncieres-et-diagnostics-territoriaux": "etudes-territoriales",
  "geospatial-intelligence-fonciere": "geospatial-intelligence",
  "geospatial-intelligence-agricole-et-hydrique": "geospatial-intelligence",
  "gestion-de-l-eau-et-ouvrages-hydrauliques": "bathymetrie-et-hydrographie",
  "bathymetrie-et-releves-hydrographiques": "bathymetrie-et-hydrographie",
};

/** Resolve a domain card name to its canonical savoir-faire, if any. */
function cardSkillSlug(name: string): string | undefined {
  const slug = nameToSlug(name);
  if (skillBySlug(slug)) return slug;
  const alias = SKILL_NAME_ALIASES[slug];
  return alias && skillBySlug(alias) ? alias : undefined;
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
  // First skill's photo is used as the secondary intro image
  const introImage = (() => {
    const firstSkill =
      d.skillSlugs?.[0] ||
      (d.cards?.[0]?.name ? nameToSlug(d.cards[0].name) : undefined);
    return firstSkill ? skillImage(firstSkill) : null;
  })();
  // Dedicated domaine photo for the intro section (hero keeps its video).
  const introPhoto = DOMAIN_INTRO_PHOTOS.has(d.slug)
    ? `/etafat/domaines/intro/${d.slug}.jpg`
    : introImage;

  return (
    <>
      <PageHero
        title={d.title}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Domaines d'activité", href: "/domaines-activite/" },
          { label: d.title },
        ]}
        variant="video-banner"
        video={domainVideo(d.slug)}
        image={introImage}
      />

      {/* Two-column intro (text left, image right) — geofit pattern */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-etafat">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              {d.intro.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="text-body text-base md:text-lg leading-relaxed mb-5">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
            {introPhoto && (
              <Reveal variant="zoom-out" duration={1200} delay={150}>
                <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                  <Image
                    src={introPhoto}
                    alt={d.title}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Savoir-faire grid — compact icon-only layout, 5 cols at lg */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal variant="line" duration={1000}>
            <h2 className="text-navy mb-14">Les savoir-faire associés</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12">
            {cards.map((c, i) => {
              const slug = cardSkillSlug(c.name);
              return (
                <Reveal key={c.index} delay={i * 60}>
                  <SkillCard
                    title={c.name}
                    href={slug ? `/savoir-faire/${slug}/` : "/savoir-faire/"}
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
