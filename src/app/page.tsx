import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/Pill";
import {
  EnergyIcon,
  BuildingIcon,
  BridgeIcon,
  LockIcon,
  FactoryIcon,
  MapPinIcon,
  PlayIcon,
  ArrowRightIcon,
} from "@/components/icons";
import postsRaw from "@/data/posts.json";

const IMG = (path: string) => `https://geofit.fr/wp-content/uploads/${path}`;

const domaines = [
  { label: "Énergie et réseaux", href: "/domaines-activite/energie-et-reseaux/", Icon: EnergyIcon },
  { label: "Bâtiment", href: "/domaines-activite/batiment/", Icon: BuildingIcon },
  { label: "Infrastructure", href: "/domaines-activite/infrastructure/", Icon: BridgeIcon },
  { label: "Défense et sécurité", href: "/domaines-activite/defense-et-securite/", Icon: LockIcon },
  { label: "Industrie", href: "/domaines-activite/industrie/", Icon: FactoryIcon },
  { label: "Territoire", href: "/domaines-activite/territoire/", Icon: MapPinIcon },
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
      <h3 className="text-navy text-xl font-semibold mb-2 leading-tight group-hover:text-[#2ab5b4] transition-colors">
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
          <Image
            src={IMG("2024/05/dsc6186-scaled-1.jpg")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>
        <div className="container-etafat relative z-10 pt-32">
          <h1 className="text-white max-w-4xl text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-6" style={{ color: "#fff" }}>
            Donnons du pouvoir
            <br />à vos données
          </h1>
          <p className="max-w-xl text-white/95 text-base md:text-lg leading-relaxed">
            Notre métier consiste à mesurer, quantifier et analyser les données géospatiales
            afin de les transformer en véritables outils d&apos;aide à la décision.
          </p>
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
          <div>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Nos expertises
            </span>
            <h2 className="text-navy mb-6 leading-tight">
              Acquérir, analyser et exploiter
              <br />vos données géospatiales
            </h2>
          </div>
          <div>
            <p className="text-body mb-8 leading-relaxed">
              Nos équipes, nos technologies de pointe et notre capacité d&apos;innovation nous
              permettent d&apos;intervenir sur les projets les plus ambitieux,{" "}
              <Link href="/agences/" className="underline text-navy hover:text-[#2ab5b4]">
                dans le monde entier
              </Link>
              , et d&apos;accompagner nos clients dans leurs décisions.
            </p>
            <Pill href="/savoir-faire/" variant="outline-teal" arrow="right">
              Découvrez nos savoir-faire
            </Pill>
          </div>
        </div>
      </section>

      {/* CE QUI DONNE DU SENS */}
      <section className="bg-[#f5f7f9] py-24 md:py-32">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-navy mb-8 leading-tight">
              Ce qui donne
              <br />du sens à nos métiers
            </h2>
            <p className="text-body mb-8 leading-relaxed max-w-md">
              Nous plaçons l&apos;excellence, l&apos;innovation et la responsabilité au centre
              de nos actions.
            </p>
            <Pill href="/identite/" variant="outline-teal" arrow="right">
              Notre vision
            </Pill>
          </div>
          <div className="relative aspect-[16/10] rounded-md overflow-hidden">
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
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/90 backdrop-blur text-[#2ab5b4] hover:scale-105 transition-transform flex items-center justify-center"
            >
              <PlayIcon width={28} height={28} />
            </button>
          </div>
        </div>
      </section>

      {/* DOMAINES */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-etafat">
          <h2 className="text-navy mb-12">Nos domaines d&apos;activités</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {domaines.map(({ label, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center justify-center py-12 border border-[#e5e7eb] rounded-md hover:border-[#2ab5b4] hover:shadow-md transition-all"
              >
                <Icon className="w-12 h-12 text-[#2ab5b4] mb-5" />
                <span className="text-navy text-xl font-medium group-hover:text-[#2ab5b4] transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLÉMATIQUE FONCIÈRE */}
      <section className="relative bg-white py-24 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#e8f5f4]"
        />
        <div className="container-etafat relative">
          <h2 className="text-navy text-3xl md:text-5xl font-semibold mb-8 leading-tight">
            Vous avez une
            <br />problématique foncière&nbsp;?
          </h2>
          <div className="flex justify-center">
            <Link
              href="/savoir-faire/geometre-expert/"
              className="text-teal font-semibold inline-flex items-center gap-3 group"
            >
              <span className="underline-offset-4 group-hover:underline">Découvrez nos solutions</span>
              <span className="arrow-circle-outline">
                <ArrowRightIcon width={11} height={11} />
              </span>
            </Link>
          </div>
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
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/90 backdrop-blur text-[#2ab5b4] hover:scale-105 transition-transform flex items-center justify-center"
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
          <div className="bg-[#2ab5b4] rounded-md p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
