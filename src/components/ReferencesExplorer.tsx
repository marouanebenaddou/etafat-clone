"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

type Project = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon?: string;
};

type Stat = { icon: string; value: string; unit: string; desc: string };

type DomainData = {
  key: string;
  label: string;
  navIcon: string;
  heroWord: string;
  heroDesc: string;
  heroImage: string;
  domainSlug: string;
  projects: Project[];
  stats: Stat[];
  ctaQuestion: string;
  ctaText: string;
};

const SK = (name: string) => `/etafat/skills/${name}.jpg`;

const DOMAINS: DomainData[] = [
  {
    key: "Foncier",
    label: "Foncier",
    navIcon: "ph:map-trifold-duotone",
    heroWord: "FONCIER",
    heroDesc:
      "ETAFAT accompagne les États, institutions et collectivités dans la sécurisation, la gestion et la valorisation du foncier. De la délimitation des territoires à la formalisation des droits, nous déployons des solutions géospatiales fiables, innovantes et adaptées aux contextes locaux.",
    heroImage: "/etafat/references/hero-foncier.jpg",
    domainSlug: "foncier",
    projects: [
      {
        title: "PRESFOR",
        subtitle: "Côte d'Ivoire — AFOR",
        description:
          "Sécurisation foncière rurale, consolidation des droits concédés et délimitation des territoires de villages.",
        image: SK("assistance-fonciere"),
      },
      {
        title: "PROCASEF",
        subtitle: "Sénégal",
        description:
          "Sécurisation foncière en milieu rural, formalisation des droits sur les parcelles et dématérialisation du registre foncier.",
        image: SK("cadastre-et-securisation-fonciere"),
      },
      {
        title: "PAMOFOR",
        subtitle: "Côte d'Ivoire",
        description:
          "Modernisation cadastrale et sécurisation foncière rurale à grande échelle.",
        image: SK("systemes-d-information-geographique"),
      },
      {
        title: "Immatriculation Foncière d'Ensemble",
        subtitle: "Maroc",
        description:
          "Délimitation parcellaire, recensement des droits réels et établissement des dossiers cadastraux et juridiques.",
        image: SK("topographie-et-geodesie"),
      },
    ],
    stats: [
      { icon: "ph:house-line-duotone", value: "+1 000", unit: "villages", desc: "accompagnés dans la sécurisation foncière rurale." },
      { icon: "ph:map-trifold-duotone", value: "+1 000 000", unit: "ha", desc: "de territoires délimités et cartographiés." },
      { icon: "ph:squares-four-duotone", value: "+500 000", unit: "parcelles", desc: "formalisées et intégrées dans des systèmes d'information foncière." },
    ],
    ctaQuestion: "Vous avez un projet foncier ?",
    ctaText:
      "Nos équipes mobilisent des expertises complémentaires et des technologies géospatiales de pointe pour sécuriser les droits, structurer l'information foncière et valoriser durablement les territoires.",
  },
  {
    key: "Aménagement du territoire",
    label: "Aménagement du territoire",
    navIcon: "ph:buildings-duotone",
    heroWord: "AMÉNAGEMENT DU TERRITOIRE",
    heroDesc:
      "ETAFAT accompagne les collectivités et les acteurs publics dans la planification territoriale et le développement urbain durable. Grâce à la donnée géospatiale et aux outils numériques, nous concevons des solutions fiables pour mieux planifier, décider et aménager les territoires.",
    heroImage: "/etafat/references/hero-amenagement-du-territoire.jpg",
    domainSlug: "amenagement-du-territoire",
    projects: [
      {
        title: "Maquette numérique 3D de Laâyoune",
        subtitle: "Maroc — Agence Urbaine de Laâyoune",
        description:
          "Réalisation de prises de vues aériennes LiDAR, production d'une maquette 3D détaillée et mise en place d'un géoportail 3D pour la planification urbaine.",
        image: SK("modelisation-3d-et-bim"),
      },
      {
        title: "Plans d'urbanisme de N'Djaména",
        subtitle: "Tchad — PILIER",
        description:
          "Réalisation des Plans de Villes Augmentés (PVA) et mise à jour des plans d'urbanisme et cadastraux pour accompagner la planification et la résilience urbaine.",
        image: SK("cartographie"),
      },
      {
        title: "ZUN de Bouskoura",
        subtitle: "Maroc — GIE ZUN Bouskoura",
        description:
          "Études techniques et géospatiales pour l'aménagement de la Zone d'Urbanisation Nouvelle — ZUN : mobilité, voiries, réseaux VRD et plan d'aménagement sur 1200 ha.",
        image: SK("etudes-territoriales"),
      },
      {
        title: "Corniche de Dar Bouazza",
        subtitle: "Maroc — Casa Aménagement",
        description:
          "Étude, ingénierie et suivi pour la requalification des espaces publics, la promenade littorale et la valorisation du paysage côtier.",
        image: SK("conseil-et-audit-geospatial"),
      },
    ],
    stats: [
      { icon: "ph:buildings-duotone", value: "+100", unit: "villes", desc: "accompagnées dans la planification et le développement urbain." },
      { icon: "ph:globe-hemisphere-west-duotone", value: "+20", unit: "géoportails", desc: "déployés pour la planification et la gestion territoriale." },
      { icon: "ph:database-duotone", value: "+50", unit: "bases de données", desc: "urbaines et territoriales produites et mises à jour." },
    ],
    ctaQuestion: "Vous avez un projet d'aménagement ?",
    ctaText:
      "Nos équipes mobilisent des expertises complémentaires et des technologies géospatiales de pointe pour concevoir des solutions sur mesure, faciliter la décision et accompagner le développement durable de vos territoires.",
  },
  {
    key: "Énergie & Mines",
    label: "Énergie & Mines",
    navIcon: "ph:sun-duotone",
    heroWord: "ÉNERGIE & MINES",
    heroDesc:
      "ETAFAT sécurise les sites industriels, les emprises minières et les infrastructures énergétiques grâce à des données géospatiales fiables et des solutions sur mesure pour optimiser la planification, la gestion des actifs et la conformité réglementaire.",
    heroImage: "/etafat/references/hero-energie-mines.jpg",
    domainSlug: "energie-mines",
    projects: [
      {
        title: "SIG des opérations minières",
        subtitle: "Mauritanie — MAADEN",
        description:
          "Mise en place d'une plateforme SIG de gestion des opérations minières : digitalisation des données terrain, suivi des actifs et reporting en temps réel.",
        image: SK("systemes-d-information-geographique"),
      },
      {
        title: "Pipeline PETROCI",
        subtitle: "Côte d'Ivoire — PETROCI",
        description:
          "Détection et géoréférencement des réseaux PETROCI le long de l'autoroute Abidjan — Yamoussoukro, afin de sécuriser les travaux et les exploitations.",
        image: SK("releves-geospatiaux"),
      },
      {
        title: "Détection de réseaux enterrés",
        subtitle: "Maroc — JESA",
        description:
          "Campagne GPR, marquage au sol et production de plans géoréférencés pour la détection des réseaux enterrés sur plusieurs sites industriels.",
        image: SK("releves-geospatiaux"),
      },
      {
        title: "Maquette BIM de l'usine Sidi Ali",
        subtitle: "Maroc — Les Eaux Minérales d'Oulmès",
        description:
          "Réalisation d'un scan 3D et d'une maquette BIM LOD 350 de l'usine Sidi Ali pour la gestion des actifs et la maintenance via une plateforme collaborative.",
        image: SK("modelisation-3d-et-bim"),
      },
    ],
    stats: [
      { icon: "ph:flow-arrow-duotone", value: "+300 km", unit: "de réseaux", desc: "détectés et géoréférencés sur plusieurs projets." },
      { icon: "ph:desktop-duotone", value: "+1", unit: "plateforme métier", desc: "déployée pour la gestion des opérations et des actifs." },
      { icon: "ph:users-three-duotone", value: "+4", unit: "expertises mobilisées", desc: "pour des solutions intégrées et sur mesure." },
    ],
    ctaQuestion: "Vous avez un projet énergie ou mines ?",
    ctaText:
      "Nos équipes mobilisent des expertises complémentaires et des technologies géospatiales de pointe pour sécuriser vos infrastructures, optimiser vos opérations et valoriser durablement vos actifs énergétiques et miniers.",
  },
  {
    key: "Bâtiment & Patrimoine",
    label: "Bâtiment & Patrimoine",
    navIcon: "ph:bank-duotone",
    heroWord: "BÂTIMENT & PATRIMOINE",
    heroDesc:
      "ETAFAT accompagne les institutions et collectivités dans la documentation, la préservation et la valorisation des bâtiments et du patrimoine. Grâce au scan 3D, au HBIM, au SIG et à des solutions digitales sur mesure, nous produisons des données fiables pour mieux connaître, gérer et transmettre ces biens d'exception.",
    heroImage: "/etafat/references/hero-batiment-patrimoine.jpg",
    domainSlug: "batiment-patrimoine",
    projects: [
      {
        title: "HBIM de la Capitainerie d'Azemmour",
        subtitle: "Maroc — Agence Urbaine d'El Jadida",
        description:
          "Numérisation avancée du site par scan 3D, production de nuages de points et développement d'un modèle HBIM détaillé pour la gestion patrimoniale.",
        image: SK("modelisation-3d-et-bim"),
      },
      {
        title: "Bâtiments menaçant ruine",
        subtitle: "Maroc — ANRUR",
        description:
          "Mise en place d'une solution digitale intégrée : collecte terrain, base de données, géoportail et application mobile pour le suivi et la gestion des bâtiments.",
        image: SK("systemes-d-information-geographique"),
      },
      {
        title: "Hôtel Harmattan",
        subtitle: "Côte d'Ivoire — PFO",
        description:
          "Relevé complet par scanner laser 3D et élaboration d'un modèle BIM LOD 3 pour la rénovation et la gestion technique de l'ouvrage.",
        image: SK("conseil-et-audit-geospatial"),
      },
      {
        title: "Palais Présidentiel",
        subtitle: "Côte d'Ivoire — PFO",
        description:
          "Réalisation d'un relevé 3D détaillé et développement d'un modèle BIM pour la gestion, la maintenance et la prise de décision.",
        image: SK("geospatial-intelligence"),
      },
    ],
    stats: [
      { icon: "ph:buildings-duotone", value: "+30 000", unit: "m² BIM", desc: "modélisés pour la documentation et la gestion de bâtiments et de sites patrimoniaux." },
      { icon: "ph:bank-duotone", value: "+4", unit: "projets patrimoniaux", desc: "menés à bien pour la préservation et la valorisation du patrimoine." },
      { icon: "ph:monitor-duotone", value: "+1", unit: "système de veille", desc: "déployé pour le suivi et la gestion du patrimoine bâti." },
    ],
    ctaQuestion: "Vous avez un projet bâtiment ou patrimoine ?",
    ctaText:
      "Nos équipes mobilisent des expertises complémentaires et des technologies digitales de pointe pour documenter, préserver et valoriser votre patrimoine bâti, dans le respect de son histoire et des normes actuelles.",
  },
  {
    key: "Infrastructures",
    label: "Infrastructures",
    navIcon: "ph:road-horizon-duotone",
    heroWord: "INFRASTRUCTURES",
    heroDesc:
      "ETAFAT accompagne les maîtres d'ouvrage, entreprises et collectivités dans la sécurisation, la conception et la documentation de leurs projets d'infrastructures grâce à la topographie, à la 3D, aux drones et à l'ingénierie géospatiale.",
    heroImage: "/etafat/references/hero-infrastructures.jpg",
    domainSlug: "infrastructures",
    projects: [
      {
        title: "Autoroute Tit Mellil – Berrechid – Casablanca",
        subtitle: "Maroc — Autoroutes du Maroc",
        description:
          "Modélisation 3D de l'axe autoroutier sur 27 km : plateforme, ouvrages d'art, équipements et environnement.",
        image: SK("topographie-et-geodesie"),
      },
      {
        title: "Autoroute Sidi Allal El Bahraoui – Rabat",
        subtitle: "Maroc — ADM",
        description:
          "Visualisation et simulation 3D pour la conception et le suivi du projet autoroutier.",
        image: SK("modelisation-3d-et-bim"),
      },
      {
        title: "Ligne de tramway T2 de Casablanca",
        subtitle: "Maroc — Casa Transport",
        description:
          "PVA drone, visualisation 3D et suivi de l'intégration du tramway dans son environnement urbain.",
        image: SK("releves-geospatiaux"),
      },
      {
        title: "BHNS L5 et L6",
        subtitle: "Maroc — Casa Transport",
        description:
          "Synthèse des réseaux concessionnaires et production des livrables pour la coordination technique.",
        image: SK("conseil-et-audit-geospatial"),
      },
    ],
    stats: [
      { icon: "ph:road-horizon-duotone", value: "+27 km", unit: "modélisés", desc: "de linéaires d'infrastructures routières en 3D." },
      { icon: "ph:buildings-duotone", value: "+5", unit: "projets d'infrastructure", desc: "accompagnés de la conception à la livraison." },
      { icon: "tabler:drone", value: "+1", unit: "orthophoto 4 cm", desc: "pour un suivi précis et une meilleure aide à la décision." },
    ],
    ctaQuestion: "Vous avez un projet d'infrastructure ?",
    ctaText:
      "Nos équipes mobilisent des expertises complémentaires et des technologies géospatiales de pointe pour sécuriser vos infrastructures, optimiser les études, faciliter la coordination et garantir la performance de vos projets.",
  },
  {
    key: "Agriculture & Eau",
    label: "Agriculture & Eau",
    navIcon: "ph:drop-duotone",
    heroWord: "AGRICULTURE & EAU",
    heroDesc:
      "ETAFAT accompagne les acteurs publics et privés dans la réussite de leurs projets agricoles, ruraux et hydrauliques grâce à la topographie, au LiDAR, à la bathymétrie, à la cartographie et à des solutions digitales innovantes au service d'une gestion durable de l'eau et des territoires.",
    heroImage: "/etafat/references/hero-agriculture-eau.jpg",
    domainSlug: "agriculture-eau",
    projects: [
      {
        title: "Plan topographique de Sousse",
        subtitle: "Tunisie — Commune de Sousse",
        description:
          "Acquisition LiDAR aéroporté, production d'orthophotos haute résolution et réalisation d'un plan topographique détaillé avec transfert de compétences.",
        image: SK("topographie-et-geodesie"),
      },
      {
        title: "Baie de Cocody",
        subtitle: "Côte d'Ivoire — SGTM",
        description:
          "Levés bathymétriques et topographiques pour la caractérisation du milieu et l'optimisation technique, environnementale et financière du projet.",
        image: SK("releves-geospatiaux"),
      },
      {
        title: "Zoo d'Aïn Sebaâ",
        subtitle: "Maroc — Casa Aménagement",
        description:
          "Études topographiques et modélisation 3D pour les travaux VRD, les réseaux d'eau, les bassins et l'aménagement paysager du parc zoologique.",
        image: SK("etudes-territoriales"),
      },
      {
        title: "Solution web MAMDA",
        subtitle: "Maroc — MAMDA",
        description:
          "Mise en œuvre d'une solution digitale intégrant notre expertise agricole pour le multirisque climatique à travers une application web et mobile.",
        image: SK("systemes-d-information-geographique"),
      },
    ],
    stats: [
      { icon: "ph:globe-hemisphere-west-duotone", value: "+12", unit: "pays couverts", desc: "en Afrique, au Moyen-Orient et en Europe." },
      { icon: "ph:airplane-tilt-duotone", value: "+200 000", unit: "km² PVA & LiDAR", desc: "acquis et traités pour des projets agricoles et hydrauliques." },
      { icon: "ph:globe-duotone", value: "+20", unit: "géoportails web", desc: "développés pour le suivi, la gestion et la valorisation des territoires." },
    ],
    ctaQuestion: "Vous avez un projet agriculture ou eau ?",
    ctaText:
      "Nos équipes mobilisent des expertises complémentaires et des technologies de pointe pour sécuriser vos décisions, optimiser vos ressources en eau et valoriser durablement vos territoires agricoles et ruraux.",
  },
];

// Thumbnails cropped from the domain mockups (public/etafat/references/<slug>-<n>.jpg)
for (const d of DOMAINS) {
  d.projects.forEach((p, i) => {
    p.image = `/etafat/references/${d.domainSlug}-${i + 1}.jpg`;
  });
}

const ALL: DomainData = {
  key: "Tous",
  label: "Tous les domaines",
  navIcon: "ph:squares-four-duotone",
  heroWord: "",
  heroDesc:
    "Des projets d'envergure menés au Maroc, en Afrique et à l'international, témoignant de l'expertise géospatiale, foncière et territoriale d'ETAFAT au service des territoires et de leurs acteurs.",
  heroImage: SK("cartographie"),
  domainSlug: "",
  projects: DOMAINS.flatMap((d) =>
    d.projects.map((p) => ({ ...p, icon: d.navIcon })),
  ),
  stats: [
    { icon: "ph:globe-hemisphere-west-duotone", value: "+12", unit: "pays d'intervention", desc: "en Afrique, au Moyen-Orient et en Europe." },
    { icon: "ph:squares-four-duotone", value: "6", unit: "domaines d'activité", desc: "couverts par nos expertises géospatiales." },
    { icon: "ph:medal-duotone", value: "+40", unit: "ans d'expérience", desc: "au service des territoires et de leurs acteurs." },
  ],
  ctaQuestion: "Vous avez un projet géospatial ?",
  ctaText:
    "Nos équipes mobilisent des expertises complémentaires et des technologies géospatiales de pointe pour sécuriser, structurer et valoriser durablement vos territoires.",
};

const TABS = [ALL, ...DOMAINS];

export function ReferencesExplorer() {
  const [active, setActive] = useState<string>("Tous");
  const data = useMemo(
    () => TABS.find((d) => d.key === active) ?? ALL,
    [active],
  );
  const projects = data.projects.map((p) => ({ ...p, icon: p.icon ?? data.navIcon }));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a1e30]">
        <Image
          src={data.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e30] via-[#0a1e30]/92 to-[#0a1e30]/30" />
        <div className="container-etafat relative pt-[148px] pb-16 md:pb-20">
          <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Accueil
            </Link>
            <span className="mx-2">›</span>
            <span className={data.key === "Tous" ? "text-white" : ""}>Références</span>
            {data.key !== "Tous" && (
              <>
                <span className="mx-2">›</span>
                <span className="text-white">{data.label}</span>
              </>
            )}
          </nav>
          <h1
            className="text-4xl font-semibold leading-[1.05] md:text-6xl"
            style={{ color: "#fff" }}
          >
            NOS RÉFÉRENCES
            {data.heroWord && (
              <>
                <br />
                <span className="text-[#3ea7e0]">{data.heroWord}</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
            {data.heroDesc}
          </p>
        </div>
      </section>

      {/* FILTER NAV */}
      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="container-etafat">
          <ul className="flex items-center gap-3 overflow-x-auto py-6">
            {TABS.map((d) => {
              const isActive = d.key === active;
              return (
                <li key={d.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(d.key)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-[#00669d] bg-[#00669d] text-white"
                        : "border-[#e5e7eb] bg-white text-navy hover:border-[#00669d] hover:text-[#00669d]",
                    )}
                  >
                    <Icon icon={d.navIcon} width={18} height={18} />
                    {d.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* PROJECT CARDS */}
      <section className="bg-white py-14 md:py-16">
        <div className="container-etafat">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p, i) => (
              <Reveal key={`${data.key}-${p.title}`} delay={(i % 4) * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-1.5 text-lg font-semibold leading-tight text-navy">
                      {p.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-teal">{p.subtitle}</p>
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-body">
                      {p.description}
                    </p>
                    <Link
                      href={`/domaines-activite/${
                        TABS.find((d) =>
                          d.projects.some((pr) => pr.title === p.title),
                        )?.domainSlug || ""
                      }/`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00669d]"
                    >
                      Voir le projet
                      <Icon icon="tabler:arrow-right" width={15} height={15} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="container-etafat">
          <div className="grid gap-8 rounded-md bg-[#f5f7f9] p-8 md:grid-cols-3 md:p-10">
            {data.stats.map((s, i) => (
              <Reveal key={s.unit} delay={i * 90}>
                <div className="flex items-start gap-5">
                  <Icon
                    icon={s.icon}
                    width={52}
                    height={52}
                    className="shrink-0 text-[#00669d]"
                  />
                  <div>
                    <p
                      className="text-3xl font-semibold leading-none text-[#00669d] md:text-4xl"
                      style={{ fontFamily: "var(--font-figtree)" }}
                    >
                      <CountUp value={s.value} />
                    </p>
                    <p className="mt-1 font-semibold text-navy">{s.unit}</p>
                    <p className="mt-1 text-sm leading-snug text-body">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#eef3f8] py-14 md:py-16">
        <div className="container-etafat flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-6">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0a3d62] text-white sm:flex">
              <Icon icon="ph:handshake-duotone" width={32} height={32} />
            </div>
            <div className="max-w-2xl">
              <h2 className="mb-2 text-2xl font-semibold leading-tight text-navy md:text-3xl">
                {data.ctaQuestion}
              </h2>
              <p className="text-sm leading-relaxed text-body md:text-base">
                {data.ctaText}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/contact/"
              className="pill pill-teal !bg-[#0a3d62] uppercase"
            >
              <Icon icon="tabler:mail" width={16} height={16} />
              Nous contacter
            </Link>
            <Link
              href="/savoir-faire/"
              className="pill border-2 border-[#0a3d62] uppercase text-[#0a3d62] hover:bg-[#0a3d62] hover:text-white"
            >
              Découvrir nos savoir-faire
              <Icon icon="tabler:arrow-right" width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
