import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/Pill";
import {
  TerritoryIcon,
  EnergyIcon,
  BuildingIcon,
  BridgeIcon,
  LandIcon,
  LeafWaterIcon,
  PlayIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@iconify/react";
import postsRaw from "@/data/posts.json";

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
    title: "Accompagnement projet",
    icon: "ph:users-three-duotone",
    items: [
      "Études territoriales",
      "Conseil & audit géospatial",
      "Assistance MOA",
      "Inspection & surveillance d'ouvrage",
      "Formation & transfert de compétences",
    ],
  },
];

const IMG = (path: string) => `https://geofit.fr/wp-content/uploads/${path}`;

const domaines = [
  { label: "Aménagement du territoire", href: "/domaines-activite/amenagement-du-territoire/", Icon: TerritoryIcon },
  { label: "Énergie & Mines", href: "/domaines-activite/energie-mines/", Icon: EnergyIcon },
  { label: "Bâtiment & Patrimoine", href: "/domaines-activite/batiment-patrimoine/", Icon: BuildingIcon },
  { label: "Infrastructures", href: "/domaines-activite/infrastructures/", Icon: BridgeIcon },
  { label: "Foncier", href: "/domaines-activite/foncier/", Icon: LandIcon },
  { label: "Agriculture & Eau", href: "/domaines-activite/agriculture-eau/", Icon: LeafWaterIcon },
];

type Post = {
  path: string;
  title: string;
  featuredImage: string;
  description: string;
  categories?: string[];
};

function PostCard({ post }: { post: Post }) {
  const tag = post.categories?.[0] || (post.path.includes("references") ? "Projet" : "Groupe");
  return (
    <Link href={post.path} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-5">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="bg-[#e5e7eb] w-full h-full" />
        )}
        <span className="absolute top-3 left-3 pill pill-teal !py-1 !px-3 !text-[11px]">
          {tag}
        </span>
      </div>
      <h3 className="text-navy text-xl font-semibold mb-2 leading-tight group-hover:text-[#00669d] transition-colors">
        {post.title}
      </h3>
      <p className="text-body line-clamp-2 text-sm mb-3">{post.description}</p>
    </Link>
  );
}

export default function HomePage() {
  const latestPosts = (postsRaw as Post[]).slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
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
              maîtrise de la donnée géospatiale pour accompagner les projets
              d&apos;aménagement, de foncier, d&apos;infrastructures et de sécurisation
              foncière.
            </p>
            <Pill href="/savoir-faire/" variant="outline-teal" arrow="right">
              Découvrez nos savoir-faire
            </Pill>
          </Reveal>
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
                    Une équipe dédiée d&apos;ingénieurs et de chercheurs développe en permanence
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

      {/* CE QUI DONNE DU SENS */}
      <section className="bg-white py-24 md:py-32">
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
      <section className="bg-[#f5f7f9] py-24 md:py-32">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy mb-12">Nos domaines d&apos;activités</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {domaines.map(({ label, href, Icon }, i) => (
              <Reveal key={href} delay={i * 80}>
                <Link
                  href={href}
                  className="group flex flex-col items-center justify-center py-12 border border-[#e5e7eb] rounded-md hover:border-[#00669d] hover:shadow-md transition-all"
                >
                  <Icon className="w-12 h-12 text-[#00669d] mb-5 transition-transform duration-300 group-hover:-translate-y-1" />
                  <span className="text-navy text-xl font-medium group-hover:text-[#00669d] transition-colors">
                    {label}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLÉMATIQUE FONCIÈRE */}
      <section className="relative bg-white py-24 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#e0eef6]"
        />
        <div className="container-etafat relative">
          <Reveal>
            <h2 className="text-navy text-3xl md:text-5xl font-semibold mb-8 leading-tight">
              Vous avez une
              <br />problématique foncière&nbsp;?
            </h2>
            <div className="flex justify-center">
              <Link
                href="/savoir-faire/cadastre-et-securisation-fonciere/"
                className="text-teal font-semibold inline-flex items-center gap-3 group"
              >
                <span className="underline-offset-4 group-hover:underline">Découvrez nos solutions</span>
                <span className="arrow-circle-outline">
                  <ArrowRightIcon width={11} height={11} />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INNOVATION + ENGAGEMENTS */}
      <section className="bg-white pb-24">
        <div className="container-etafat grid md:grid-cols-2 gap-6 md:gap-8">
          <article className="relative rounded-md overflow-hidden min-h-[480px] flex flex-col justify-end p-10 text-white">
            <Image
              src={IMG("2025/01/Ingenieur-Chercheur.jpg")}
              alt=""
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative">
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4" style={{ color: "#fff" }}>
                Au cœur de l&apos;innovation
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-md">
                Une équipe, composée d&apos;ingénieurs et de chercheurs, se consacre à
                l&apos;élaboration de solutions innovantes afin de répondre aux besoins du
                Groupe et de ses clients.
              </p>
              <Pill href="/innovation/" variant="outline" arrow="right">
                Notre innovation
              </Pill>
            </div>
          </article>

          <article className="relative rounded-md overflow-hidden min-h-[480px] flex flex-col justify-end p-10 text-white">
            <Image
              src={IMG("2024/03/AdobeStock_244344329-scaled.jpeg")}
              alt=""
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative">
              <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4" style={{ color: "#fff" }}>
                Nos engagements
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-md">
                Nous plaçons l&apos;excellence, l&apos;innovation et la responsabilité au
                centre de nos actions. Découvrez comment nos engagements en matière de
                qualité, de durabilité et d&apos;éthique guident chacune de nos réalisations.
              </p>
              <Pill href="/engagements/" variant="outline" arrow="right">
                Les engagements du Groupe
              </Pill>
            </div>
          </article>
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
              le territoire et le foncier, en France et dans le monde.
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
              <PostCard key={post.path} post={post} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Pill href="/actualites/" variant="outline-teal" arrow="right">
              Découvrez tous les articles
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
                  formation et l&apos;opportunité de développer ses compétences, en France
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
            <Pill href="/offres-demploi/" variant="outline" arrow="right" className="!border-white !text-white">
              Consultez les offres d&apos;emploi
            </Pill>
          </div>
        </div>
      </section>
    </div>
  );
}
