import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/Pill";
import { PlayIcon, ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { VideoGate } from "@/components/VideoGate";
import { Icon } from "@iconify/react";
import { linkedinPosts } from "@/data/linkedin-posts";

const PILLARS: {
  letter: string;
  title: string;
  icon: string;
  items: string[];
}[] = [
  {
    letter: "A",
    title: "Expertise foncière",
    icon: "ph:map-pin-area-duotone",
    items: [
      "Assistance foncière",
      "Cadastre & sécurisation foncière",
      "Plans parcellaires & emprises",
      "Cartographie foncière",
      "SIG foncier & bases cadastrales",
    ],
  },
  {
    letter: "B",
    title: "Acquisition de données",
    icon: "ph:drone-duotone",
    items: [
      "Topographie & géodésie",
      "Relevés géospatiaux",
      "Relevés aériens & LiDAR",
      "Scanner laser 3D & MMS",
      "Bathymétrie & hydrographie",
      "Géoradar & détection de réseaux",
    ],
  },
  {
    letter: "C",
    title: "Ingénierie de données",
    icon: "ph:stack-duotone",
    items: [
      "Cartographie",
      "Systèmes d'information géographique",
      "Modélisation 3D & BIM",
      "Géospatial Intelligence",
      "Webmapping & plateformes géospatiales",
      "Dématérialisation & structuration de données",
    ],
  },
  {
    letter: "D",
    title: "Ingénierie Conseil",
    icon: "ph:compass-tool-duotone",
    items: [
      "Études de faisabilité & diagnostics",
      "Études techniques : APS, APD & PRO",
      "Assistance à maîtrise d'ouvrage",
      "Contrôle & surveillance des travaux",
      "Maîtrise d'œuvre & pilotage de projets",
    ],
  },
];

const IMG = (path: string) => `https://geofit.fr/wp-content/uploads/${path}`;

const domaines = [
  { label: "Aménagement du territoire", slug: "amenagement-du-territoire" },
  { label: "Énergie & Mines", slug: "energie-mines" },
  { label: "Bâtiment & Patrimoine", slug: "batiment-patrimoine" },
  { label: "Infrastructures", slug: "infrastructures" },
  { label: "Foncier", slug: "foncier" },
  { label: "Agriculture & Eau", slug: "agriculture-eau" },
];

export default function HomePage() {
  const latestPosts = linkedinPosts.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center text-white overflow-hidden">
        <VideoGate />
        <div className="absolute inset-0">
          <video
            data-hero-video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={IMG("2024/05/dsc6186-scaled-1.jpg")}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/etafat/globe.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="container-etafat relative z-10 pt-32">
          <Reveal y={40}>
            <h1 className="text-white max-w-4xl text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-6" style={{ color: "#fff" }}>
              Révélons le potentiel
              <br />de vos territoires
            </h1>
          </Reveal>
          <Reveal y={30} delay={250}>
            <p className="max-w-xl text-white/95 text-base md:text-lg leading-relaxed">
              Nous mesurons, analysons et valorisons les données géospatiales pour aider nos
              clients à mieux comprendre leurs territoires, sécuriser leurs projets et prendre
              des décisions fiables.
            </p>
          </Reveal>
        </div>
        <svg
          className="absolute bottom-[-2px] left-0 right-0 w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ height: 80 }}
          aria-hidden
        >
          <path d="M0,80 Q720,0 1440,80 L1440,80 L0,80 Z" fill="#ffffff" />
        </svg>
      </section>

      {/* INTRO */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-etafat grid md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Nos expertises
            </span>
            <h2 className="text-navy mb-6 leading-tight">
              Acquérir, analyser et exploiter
              <br />vos données géospatiales
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body mb-8 leading-relaxed">
              ETAFAT mobilise son expertise terrain, ses technologies de mesure et sa
              maîtrise de la donnée géospatiale pour accompagner, à travers le monde, des
              projets d&apos;aménagement, de gestion foncière, d&apos;infrastructures et de
              sécurisation foncière.
            </p>
            <Pill href="/savoir-faire/" variant="outline-teal" arrow="right">
              Découvrez nos savoir-faire
            </Pill>
          </Reveal>
        </div>
      </section>

      {/* CE QUI DONNE DU SENS */}
      <section className="bg-[#f5f7f9] py-24 md:py-32">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <h2 className="text-navy mb-8 leading-tight">
              Ce qui guide
              <br />notre expertise
            </h2>
            <p className="text-body mb-8 leading-relaxed max-w-md">
              Nous plaçons l&apos;excellence, l&apos;innovation et la responsabilité au centre
              de nos actions.
            </p>
            <Pill href="/identite/" variant="outline-teal" arrow="right">
              Découvrir notre vision
            </Pill>
          </Reveal>
          <Reveal delay={150} className="relative aspect-[16/10] rounded-md overflow-hidden">
            <Image
              src={IMG("2026/01/26-VIDEO-GROUPE-Video_Vision-Miniature_YT.jpg")}
              alt="Vidéo - Notre vision"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <button
              type="button"
              aria-label="Lecture vidéo"
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/90 backdrop-blur text-[#00669d] hover:scale-105 transition-transform flex items-center justify-center"
            >
              <PlayIcon width={28} height={28} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* DOMAINES */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy mb-12">Nos domaines d&apos;activités</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {domaines.map(({ label, slug }, i) => (
              <Reveal key={slug} delay={i * 80}>
                <Link
                  href={`/domaines-activite/${slug}/`}
                  className="group flex flex-col items-center justify-center py-12 border border-[#e5e7eb] rounded-md hover:border-[#00669d] hover:shadow-md transition-all"
                >
                  <Image
                    src={`/etafat/domaines/icons/${slug}.png`}
                    alt=""
                    width={128}
                    height={128}
                    className="w-24 h-24 md:w-28 md:h-28 mb-5 object-contain transition-transform duration-300 group-hover:-translate-y-1"
                  />
                  <span className="text-navy text-xl font-medium group-hover:text-[#00669d] transition-colors">
                    {label}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUEL EST VOTRE BESOIN ? */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block text-center">
              Nos savoir-faire
            </span>
            <h2 className="text-navy text-center mb-4 leading-tight">
              Quel est votre besoin&nbsp;?
            </h2>
            <p className="text-body text-center max-w-3xl mx-auto mb-14 leading-relaxed">
              ETAFAT mobilise quatre piliers d&apos;expertise complémentaires pour accompagner
              vos projets, depuis la sécurisation foncière jusqu&apos;à l&apos;exploitation
              avancée de la donnée géospatiale.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.letter} delay={i * 100}>
                <article className="group relative bg-white p-8 rounded-md border border-[#e5e7eb] h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon icon={p.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-lg font-semibold mb-4 leading-tight">
                    {p.title}
                  </h3>
                  <ul className="space-y-2 text-body text-sm">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#00669d] mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#00669d]" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="mt-10 bg-[#00669d] rounded-md p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                  <Icon icon="ph:lightbulb-filament-duotone" width={26} height={26} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl md:text-2xl font-semibold mb-2" style={{ color: "#fff" }}>
                    L&apos;innovation chez ETAFAT
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                    Une équipe dédiée, d&apos;ingénieurs et de chercheurs, développe en permanence
                    des solutions sur mesure pour répondre aux enjeux techniques de nos clients
                    et anticiper les nouveaux usages de la donnée géospatiale.
                  </p>
                </div>
              </div>
              <Pill href="/innovation/" variant="outline" arrow="right" className="!border-white !text-white shrink-0">
                Découvrir nos innovations
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* À PROPOS (dark) */}
      <section className="bg-[#313c4e] text-white py-24 md:py-32">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-white mb-6" style={{ color: "#fff" }}>
              À propos
            </h2>
            <p className="text-white/80 leading-relaxed mb-8 max-w-md">
              Depuis sa création, le Groupe n&apos;a cessé d&apos;évoluer. En s&apos;appuyant
              sur ses équipes engagées, ETAFAT contribue chaque jour à aménager et sécuriser
              le territoire et le foncier, au Maroc et dans le monde.
            </p>
            <Pill href="/identite/" variant="outline" arrow="right">
              Notre identité
            </Pill>
          </div>
          <div className="relative aspect-[16/10] rounded-md overflow-hidden">
            <Image
              src={IMG("2024/09/miniature-histoire-geofit.jpg")}
              alt="Vidéo - Le voyage de Etafat"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <button
              type="button"
              aria-label="Lecture vidéo"
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/90 backdrop-blur text-[#00669d] hover:scale-105 transition-transform flex items-center justify-center"
            >
              <PlayIcon width={28} height={28} />
            </button>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-etafat">
          <h2 className="text-navy mb-12">Nos dernières actualités</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.title} — voir le post sur LinkedIn`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-5 bg-[#e5e7eb]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#0a66c2] backdrop-blur">
                    <Icon icon="mdi:linkedin" width={14} height={14} />
                    LinkedIn
                  </span>
                </div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-teal">
                  {post.date}
                </p>
                <h3 className="text-navy text-xl font-semibold mb-2 leading-tight group-hover:text-[#00669d] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-body line-clamp-2 text-sm">{post.excerpt}</p>
              </a>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Pill href="/actualites/" variant="outline-teal" arrow="right">
              Voir toutes nos actualités
            </Pill>
          </div>
        </div>
      </section>

      {/* CULTURE + EXPÉRIENCE + REJOIGNEZ */}
      <section className="bg-[#f5f7f9] py-24 md:py-32">
        <div className="container-etafat grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <article className="relative rounded-md overflow-hidden min-h-[420px] flex flex-col justify-center p-10 text-white">
            <Image
              src={IMG("2024/05/DSC03880-scaled.jpg")}
              alt=""
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative">
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-5" style={{ color: "#fff" }}>
                Notre culture d&apos;entreprise
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-md">
                Le Groupe ETAFAT se distingue par la transmission de valeurs humaines fortes
                au sein de ses équipes, la relation de confiance entretenue avec ses
                clients, ainsi que par sa maîtrise des techniques les plus innovantes en
                acquisition et traitement de données géospatiales.
              </p>
              <Pill href="/nous-rejoindre/culture-entreprise/" variant="teal" arrow="right">
                Découvrez notre culture d&apos;entreprise
              </Pill>
            </div>
          </article>

          <article className="bg-white rounded-md p-10 flex flex-col justify-center">
            <h3 className="text-navy text-2xl md:text-3xl font-semibold mb-5">
              L&apos;expérience collaborateur
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className="text-body text-sm leading-relaxed mb-6">
                  Nous avons à cœur de conserver un management de proximité dans nos
                  agences, en mettant un accent tout particulier sur l&apos;accès à la
                  formation et l&apos;opportunité de développer ses compétences, au Maroc
                  comme à l&apos;International.
                </p>
                <Pill href="/nous-rejoindre/" variant="outline-teal" arrow="right">
                  Découvrez l&apos;expérience collaborateur
                </Pill>
              </div>
              <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
                <Image
                  src={IMG("2023/12/illustration-formation.png")}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </div>
            </div>
          </article>
        </div>

        <div className="container-etafat mt-8">
          <div className="bg-[#00669d] rounded-md p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-3" style={{ color: "#fff" }}>
                Rejoignez-nous
              </h3>
              <p className="text-white/90 max-w-md leading-relaxed text-sm">
                Chez ETAFAT, vous aurez l&apos;opportunité de monter en compétences et de
                les mettre en valeur sur des projets à impact.
              </p>
            </div>
            <Pill href="/nous-rejoindre/" variant="outline" arrow="right" className="!border-white !text-white">
              Rejoignez ETAFAT
            </Pill>
          </div>
        </div>
      </section>
    </div>
  );
}
