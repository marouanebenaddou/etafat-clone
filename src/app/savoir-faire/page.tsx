import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Pill } from "@/components/Pill";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos savoir-faire - ETAFAT",
  description:
    "Quatre piliers d'expertise — foncier, acquisition de données, ingénierie de données et accompagnement projet — pour répondre à tous vos besoins géospatiaux.",
};

type Skill = {
  title: string;
  icon: string;
  slug?: string;
};

type Pillar = {
  letter: "A" | "B" | "C" | "D";
  anchor: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  skills: Skill[];
};

const PILLARS: Pillar[] = [
  {
    letter: "A",
    anchor: "expertise-fonciere",
    title: "Expertise foncière",
    short:
      "Clarifier, structurer et sécuriser les données foncières pour accompagner les projets territoriaux.",
    description:
      "ETAFAT accompagne les acteurs publics et privés dans la maîtrise du foncier, la sécurisation des emprises et la structuration des données cadastrales.",
    icon: "ph:map-pin-area-duotone",
    skills: [
      { title: "Assistance foncière", icon: "ph:handshake-duotone", slug: "assistance-fonciere" },
      {
        title: "Cadastre & sécurisation foncière",
        icon: "ph:shield-check-duotone",
        slug: "cadastre-et-securisation-fonciere",
      },
      { title: "Plans parcellaires & emprises", icon: "ph:grid-four-duotone" },
      { title: "Cartographie foncière", icon: "ph:map-trifold-duotone" },
      { title: "SIG foncier & bases cadastrales", icon: "ph:database-duotone" },
    ],
  },
  {
    letter: "B",
    anchor: "acquisition-de-donnees",
    title: "Acquisition de données",
    short:
      "Collecter des données géospatiales précises grâce aux technologies terrestres, aériennes, hydrographiques et numériques.",
    description:
      "ETAFAT mobilise des technologies avancées pour acquérir des données géospatiales fiables, précises et adaptées aux besoins de chaque projet.",
    icon: "ph:drone-duotone",
    skills: [
      { title: "Topographie & géodésie", icon: "ph:mountains-duotone", slug: "topographie-et-geodesie" },
      { title: "Relevés géospatiaux", icon: "ph:crosshair-simple-duotone", slug: "releves-geospatiaux" },
      { title: "Relevés aériens & LiDAR", icon: "ph:airplane-tilt-duotone" },
      { title: "Scanner laser 3D & MMS", icon: "ph:scan-duotone" },
      { title: "Bathymétrie & hydrographie", icon: "ph:waves-duotone" },
      { title: "Géoradar & détection de réseaux", icon: "tabler:radar-2" },
    ],
  },
  {
    letter: "C",
    anchor: "ingenierie-de-donnees",
    title: "Ingénierie de données",
    short:
      "Transformer les données brutes en cartes, modèles, bases SIG et outils d'aide à la décision.",
    description:
      "ETAFAT transforme les données collectées en livrables exploitables, structurés et utiles à la décision.",
    icon: "ph:stack-duotone",
    skills: [
      { title: "Cartographie", icon: "ph:map-trifold-duotone", slug: "cartographie" },
      {
        title: "Systèmes d'information géographique",
        icon: "ph:stack-duotone",
        slug: "systemes-d-information-geographique",
      },
      { title: "Modélisation 3D & BIM", icon: "ph:cube-duotone", slug: "modelisation-3d-et-bim" },
      { title: "Géospatial Intelligence", icon: "ph:globe-hemisphere-west-duotone", slug: "geospatial-intelligence" },
      { title: "Webmapping & plateformes géospatiales", icon: "ph:network-duotone" },
      { title: "Dématérialisation & structuration de données", icon: "ph:folder-open-duotone" },
    ],
  },
  {
    letter: "D",
    anchor: "accompagnement-projet",
    title: "Accompagnement projet",
    short:
      "Conseiller, auditer et accompagner les maîtres d'ouvrage dans la réussite de leurs projets géospatiaux.",
    description:
      "ETAFAT accompagne ses clients dans la définition, la conduite et la sécurisation de leurs projets géospatiaux.",
    icon: "ph:users-three-duotone",
    skills: [
      { title: "Études territoriales", icon: "ph:chart-bar-duotone", slug: "etudes-territoriales" },
      {
        title: "Conseil & audit géospatial",
        icon: "ph:magnifying-glass-plus-duotone",
        slug: "conseil-et-audit-geospatial",
      },
      { title: "Assistance à maîtrise d'ouvrage", icon: "ph:user-check-duotone" },
      { title: "Inspection & surveillance d'ouvrage", icon: "ph:hard-hat-duotone" },
      { title: "Formation & transfert de compétences", icon: "ph:graduation-cap-duotone" },
    ],
  },
];

function SkillTile({ skill }: { skill: Skill }) {
  const content = (
    <>
      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
        <Icon icon={skill.icon} width={28} height={28} className="text-[#00669d]" />
      </div>
      <h4 className="text-navy text-sm md:text-base font-semibold leading-tight mb-2">
        {skill.title}
      </h4>
      {skill.slug && (
        <span className="text-teal text-xs font-semibold inline-flex items-center gap-1 mt-auto">
          En savoir plus
          <Icon icon="tabler:arrow-right" width={14} height={14} />
        </span>
      )}
    </>
  );

  if (skill.slug) {
    return (
      <Link
        href={`/savoir-faire/${skill.slug}/`}
        className="group relative bg-white p-5 rounded-md border border-[#e5e7eb] h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 hover:border-[#00669d] transition-all duration-300"
      >
        {content}
      </Link>
    );
  }
  return (
    <div className="group relative bg-white p-5 rounded-md border border-[#e5e7eb] h-full flex flex-col">
      {content}
    </div>
  );
}

export default function SavoirFairePage() {
  return (
    <>
      <PageHero
        title="Nos savoir-faire"
        description="Quatre piliers d'expertise complémentaires pour accompagner vos projets, de la sécurisation foncière à l'exploitation avancée de la donnée géospatiale."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Savoir-faire" }]}
        variant="banner"
        image="/etafat/skills/cartographie.jpg"
      />

      {/* QUEL EST VOTRE BESOIN ? — 4 pillar overview cards */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy text-center mb-3">Quel est votre besoin&nbsp;?</h2>
            <div className="w-12 h-0.5 bg-[#00669d] mx-auto mb-14" />
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.letter} delay={i * 90}>
                <a
                  href={`#${p.anchor}`}
                  className="group relative bg-white p-7 rounded-md border border-[#e5e7eb] h-full flex flex-col text-center items-center hover:shadow-lg hover:-translate-y-1 hover:border-[#00669d] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon icon={p.icon} width={44} height={44} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-lg font-semibold mb-3 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed mb-5 flex-1">
                    {p.short}
                  </p>
                  <span className="text-teal text-sm font-semibold inline-flex items-center gap-2 mt-auto">
                    Explorer
                    <Icon icon="tabler:arrow-right" width={16} height={16} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Four pillar sections */}
      {PILLARS.map((p, idx) => {
        const sectionBg = idx % 2 === 0 ? "bg-[#f5f7f9]" : "bg-white";
        return (
          <section
            key={p.letter}
            id={p.anchor}
            className={`${sectionBg} py-20 md:py-24 scroll-mt-32`}
          >
            <div className="container-etafat">
              <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-14 items-start">
                {/* Pillar header */}
                <Reveal>
                  <div className="lg:sticky lg:top-32">
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="w-10 h-10 rounded-full bg-[#00669d] text-white flex items-center justify-center font-bold text-lg"
                        style={{ fontFamily: "var(--font-figtree)" }}
                      >
                        {p.letter}
                      </span>
                      <div className="w-12 h-0.5 bg-[#00669d]/30" />
                    </div>
                    <h2 className="text-navy mb-5 leading-tight text-3xl md:text-4xl">
                      {p.title}
                    </h2>
                    <p className="text-body leading-relaxed mb-6">{p.description}</p>
                    <div className="w-24 h-24 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center">
                      <Icon icon={p.icon} width={56} height={56} className="text-[#00669d]" />
                    </div>
                  </div>
                </Reveal>

                {/* Skills grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {p.skills.map((s, i) => (
                    <Reveal key={s.title} delay={i * 50}>
                      <SkillTile skill={s} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* L'innovation chez ETAFAT banner */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-etafat">
          <Reveal>
            <div className="relative rounded-md overflow-hidden bg-gradient-to-r from-[#00669d] to-[#0a4d7a] p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-5 max-w-3xl">
                <div className="w-14 h-14 rounded-md bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                  <Icon icon="ph:drone-duotone" width={32} height={32} className="text-white" />
                </div>
                <div>
                  <h3
                    className="text-white text-xl md:text-2xl font-semibold mb-2"
                    style={{ color: "#fff" }}
                  >
                    L&apos;innovation chez ETAFAT
                  </h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    GNSS, drones, LiDAR, scanner laser 3D, bathymétrie, SIG, BIM et
                    webmapping&nbsp;: des technologies au service de la précision géospatiale.
                  </p>
                </div>
              </div>
              <Pill
                href="/innovation/"
                variant="outline"
                arrow="right"
                className="!border-white !text-white shrink-0"
              >
                Découvrir nos technologies
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
