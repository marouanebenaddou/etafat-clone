import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { ArrowRightIcon } from "@/components/icons";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Innovation - ETAFAT",
  description:
    "La technologie au service de la précision géospatiale et de la décision : acquisition, modélisation 3D, SIG et transformation digitale.",
};

const YOUTUBE = "https://www.youtube.com/@etafatgroup";

const PILIERS = [
  {
    icon: "ph:target-duotone",
    title: "De l'acquisition à l'analyse",
    text: "Nous innovons à chaque étape de la chaîne de valeur : collecte, traitement, modélisation, analyse et restitution.",
  },
  {
    icon: "ph:users-three-duotone",
    title: "Terrain, usage, impact",
    text: "Nos solutions sont pensées pour le terrain et les décideurs. Elles répondent à des usages concrets et génèrent de l'impact.",
  },
  {
    icon: "ph:lightbulb-duotone",
    title: "Innovation opérationnelle",
    text: "Nous privilégions des technologies matures, évolutives et interopérables pour des résultats fiables et durables.",
  },
];

const ETAPES = [
  { icon: "ph:magnifying-glass-duotone", title: "Comprendre le besoin", text: "Analyse des enjeux et des usages." },
  { icon: "ph:flask-duotone", title: "Tester la solution", text: "Expérimentation et validation de la valeur ajoutée." },
  { icon: "ph:gear-duotone", title: "Industrialiser les méthodes", text: "Standardisation, automatisation et qualité des processus." },
  { icon: "ph:map-pin-duotone", title: "Déployer sur le terrain", text: "Mise en œuvre opérationnelle et accompagnement." },
  { icon: "ph:graduation-cap-duotone", title: "Transférer les compétences", text: "Formations et transfert de savoir-faire." },
];

const AXES = [
  { icon: "tabler:drone", title: "Acquisition intelligente de données" },
  { icon: "ph:gear-six-duotone", title: "Traitement & automatisation" },
  { icon: "ph:stack-duotone", title: "SIG & plateformes métier" },
  { icon: "ph:cube-duotone", title: "Modélisation 3D & BIM" },
  { icon: "ph:globe-hemisphere-west-duotone", title: "Geospatial Intelligence" },
  { icon: "ph:shield-check-duotone", title: "Digitalisation & traçabilité" },
];

const EXPERTISES = [
  { title: "Nuages de points", image: "/etafat/skills/modelisation-3d-et-bim.jpg" },
  { title: "Photogrammétrie", image: "/etafat/skills/cartographie.jpg" },
  { title: "LiDAR & scanner 3D", image: "/etafat/skills/releves-geospatiaux.jpg" },
  { title: "SIG & bases de données spatiales", image: "/etafat/skills/systemes-d-information-geographique.jpg" },
  { title: "Webmapping", image: "/etafat/skills/geospatial-intelligence.jpg" },
  { title: "BIM & jumeaux numériques", image: "/etafat/skills/conseil-et-audit-geospatial.jpg" },
];

const STATS = [
  { icon: "ph:share-network-duotone", value: "+35", label: "Solutions SIG métier développées" },
  { icon: "ph:globe-duotone", value: "+200 000", label: "km² couverts sur le continent africain" },
  { icon: "ph:buildings-duotone", value: "+100", label: "villes couvertes par nos solutions" },
  { icon: "ph:database-duotone", value: "+50", label: "bases de données géospatiales" },
  { icon: "ph:desktop-duotone", value: "+20", label: "géoportails web déployés" },
];

const ARTICLES = [
  {
    title: "La donnée géospatiale au service de la sécurisation foncière",
    text: "Comment les données fiables et à jour renforcent la transparence, préviennent les conflits et sécurisent les droits fonciers.",
    image: "/etafat/references/foncier-1.jpg",
  },
  {
    title: "Du LiDAR au jumeau numérique",
    text: "De la capture 3D à la modélisation intelligente, vers des jumeaux numériques au service de la planification urbaine.",
    image: "/etafat/skills/modelisation-3d-et-bim.jpg",
  },
  {
    title: "Les géoportails comme outils d'aide à la décision",
    text: "Diffuser la bonne information, au bon moment, pour des décisions éclairées et partagées.",
    image: "/etafat/skills/systemes-d-information-geographique.jpg",
  },
];

export default function InnovationPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-white pt-[140px] pb-16 md:pb-20">
        <div className="container-etafat grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal variant="line" duration={1000}>
              <h1 className="text-navy text-5xl md:text-6xl font-semibold leading-none mb-5">
                INNOVATION
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-navy text-xl md:text-2xl font-semibold leading-snug mb-6">
                La technologie au service de la précision géospatiale et de la décision.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="space-y-4 text-body leading-relaxed">
                <p>
                  Chez ETAFAT, l&apos;innovation est au cœur de nos méthodes et de notre ADN. Elle nous permet d&apos;apporter des réponses toujours plus précises, fiables et opérationnelles aux enjeux fonciers, territoriaux et environnementaux.
                </p>
                <p>
                  De l&apos;acquisition sur le terrain à la modélisation 3D, du SIG à la transformation digitale, nous mobilisons les meilleures technologies pour transformer la donnée en valeur et en décision.
                </p>
                <p>
                  Notre innovation est utile, concrète et orientée résultats, au service de nos clients et du développement durable des territoires.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal variant="zoom-out" delay={150}>
            <a
              href={YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/3] overflow-hidden rounded-md"
            >
              <Image
                src="/etafat/skills/geospatial-intelligence.jpg"
                alt="L'innovation géospatiale chez ETAFAT"
                fill
                priority
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover ken-burns"
              />
              <span className="absolute inset-0 bg-[#0a1e30]/25" />
              <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#00669d] shadow-lg transition-transform group-hover:scale-110">
                <Icon icon="ph:play-fill" width={30} height={30} />
              </span>
              <span className="absolute bottom-4 right-4 rounded bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                4°03&apos;24&quot;N&nbsp;&nbsp;9°42&apos;18&quot;E
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* L'INNOVATION AU CŒUR DE NOS MÉTIERS */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy mb-3 leading-tight">
              L&apos;innovation au cœur
              <br className="hidden md:block" /> de nos métiers
            </h2>
            <div className="mb-12 h-0.5 w-12 bg-[#00669d]" />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {PILIERS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="flex gap-4">
                  <Icon icon={p.icon} width={40} height={40} className="shrink-0 text-[#00669d]" />
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-navy">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-body">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DE L'EXPÉRIMENTATION À LA SOLUTION */}
      <section className="bg-white pb-20 md:pb-24">
        <div className="container-etafat">
          <Reveal>
            <h2 className="mb-14 text-navy leading-tight text-2xl md:text-3xl">
              De l&apos;expérimentation à la solution opérationnelle
            </h2>
          </Reveal>
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <span className="absolute left-[8%] right-[8%] top-4 hidden h-px bg-[#00669d]/25 lg:block" aria-hidden />
            {ETAPES.map((e, i) => (
              <Reveal key={e.title} delay={i * 90}>
                <div className="relative">
                  <span className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#00669d] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <Icon icon={e.icon} width={34} height={34} className="mb-4 text-[#00669d]" />
                  <h3 className="mb-1.5 text-base font-semibold leading-tight text-navy">{e.title}</h3>
                  <p className="text-sm leading-relaxed text-body">{e.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AXES + EXPERTISES */}
      <section className="bg-white pb-20 md:pb-24">
        <div className="container-etafat grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* Nos axes d'innovation */}
          <div>
            <Reveal>
              <h2 className="mb-8 text-navy leading-tight text-2xl md:text-3xl">
                Nos axes d&apos;innovation
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {AXES.map((a, i) => (
                <Reveal key={a.title} delay={i * 70}>
                  <div className="group flex h-full flex-col items-center justify-start rounded-md border border-[#e5e7eb] bg-[#f5f7f9] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#00669d] hover:shadow-md">
                    <Icon icon={a.icon} width={32} height={32} className="mb-3 text-[#00669d] transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="text-xs font-semibold leading-tight text-navy">{a.title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Expertises technologiques */}
          <div>
            <Reveal>
              <h2 className="mb-8 text-navy leading-tight text-2xl md:text-3xl">
                Expertises technologiques
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {EXPERTISES.map((e, i) => (
                <Reveal key={e.title} delay={i * 70}>
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-md">
                    <Image
                      src={e.image}
                      alt={e.title}
                      fill
                      sizes="(min-width:1024px) 18vw, (min-width:640px) 30vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1e30]/90 to-transparent p-3 pt-8">
                      <span className="text-xs font-semibold leading-tight text-white">
                        {e.title}
                      </span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#00669d] py-14 text-white">
        <div className="container-etafat grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="flex items-start gap-3">
                <Icon icon={s.icon} width={42} height={42} className="shrink-0 text-white/85" />
                <div>
                  <p
                    className="text-3xl font-semibold leading-none md:text-4xl"
                    style={{ fontFamily: "var(--font-figtree)", color: "#fff" }}
                  >
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-white/85">{s.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CAS D'USAGE / ARTICLES */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-etafat">
          <Reveal>
            <h2 className="mb-10 text-navy leading-tight">Cas d&apos;usage / Articles</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {ARTICLES.map((a, i) => (
              <Reveal key={a.title} delay={i * 100}>
                <Link href="/actualites/" className="group block">
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-md bg-[#e5e7eb]">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold leading-tight text-navy transition-colors group-hover:text-[#00669d]">
                    {a.title}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-body">{a.text}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00669d]">
                    Lire l&apos;article
                    <ArrowRightIcon width={13} height={13} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a3d62] py-14 text-white md:py-16">
        <div className="container-etafat flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-white sm:flex">
              <Icon icon="ph:lightbulb-duotone" width={32} height={32} />
            </div>
            <div className="max-w-2xl">
              <h2 className="mb-2 text-2xl font-semibold leading-tight md:text-3xl" style={{ color: "#fff" }}>
                Vous avez un projet innovant&nbsp;?
              </h2>
              <p className="text-sm leading-relaxed text-white/85 md:text-base">
                Nous co-construisons avec vous des solutions géospatiales sur mesure, performantes et durables.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/contact/" className="pill bg-white text-[#0a3d62] hover:bg-white/90">
              Nous contacter
              <ArrowRightIcon width={12} height={12} />
            </Link>
            <Link
              href="/savoir-faire/"
              className="pill border-2 border-white text-white hover:bg-white hover:text-[#0a3d62]"
            >
              Découvrir nos savoir-faire
              <ArrowRightIcon width={12} height={12} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
