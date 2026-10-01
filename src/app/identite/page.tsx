import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Pill } from "@/components/Pill";
import {
  ArrowRightIcon,
} from "@/components/icons";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";
import { IdentiteSubNav } from "./IdentiteSubNav";

export const metadata: Metadata = {
  title: "Notre identité - ETAFAT",
  description:
    "Depuis 1983, ETAFAT accompagne les acteurs publics et privés dans les domaines du foncier, du conseil & ingénierie, de la donnée géospatiale et des SIG.",
};

const VALEURS: { image: string; title: string; text: string }[] = [
  {
    image: "/etafat/valeurs/transparence.png",
    title: "Transparence",
    text: "Nous privilégions une communication claire, un suivi rigoureux et une relation de confiance durable avec nos clients et partenaires.",
  },
  {
    image: "/etafat/valeurs/responsabilite.png",
    title: "Responsabilité",
    text: "Nous assumons pleinement nos engagements en veillant au respect des délais, à la qualité des livrables et à la maîtrise des impacts.",
  },
  {
    image: "/etafat/valeurs/confidentialite.png",
    title: "Confidentialité",
    text: "Nous garantissons la protection des données sensibles, foncières, techniques, géospatiales et institutionnelles confiées dans le cadre de nos missions.",
  },
];

const V = "/etafat/visuels/identite";

const CHIFFRES = [
  { value: "+200 000", unit: "km²", label: "Superficie couverte en prises de vues aériennes", icon: "tabler:drone", image: `${V}/chiffres-1.jpg` },
  { value: "+1 000 000", unit: "ha", label: "Superficie immatriculée", icon: "tabler:map-pin-2", image: `${V}/chiffres-2.jpg` },
  { value: "+35", unit: "", label: "Solutions SIG métier développées", icon: "ph:stack-duotone", image: `${V}/chiffres-3.jpg` },
  { value: "+10 000", unit: "ha", label: "de projets d'aménagement urbain", icon: "ph:buildings-duotone", image: `${V}/chiffres-4.jpg` },
];

const HISTOIRE = [
  { year: "1983", title: "Création d'ETAFAT", image: `${V}/historique-1.jpg` },
  { year: "1999", title: "1er Projet à l'International", image: `${V}/historique-2.jpg` },
  { year: "2012", title: "Activité de PVA", image: `${V}/historique-3.jpg` },
  { year: "2020", title: "Développement à l'échelle Africaine", image: `${V}/historique-4.jpg` },
  { year: "2025", title: "1er Projet en Asie", image: `${V}/historique-5.jpg` },
];

const FILIALES = [
  {
    slug: "etafat-ingenierie",
    title: "ETAFAT ING",
    subtitle: "Entité ingénierie",
    text: "ETAFAT ING porte les expertises d'ingénierie du Groupe, en accompagnant les projets d'aménagement, d'infrastructure, d'études techniques et de valorisation des territoires.",
    image: "/etafat/visuels/filiales/etafat-ing.jpg",
  },
  {
    slug: "etafat-senegal",
    title: "ETAFAT Sénégal",
    subtitle: "Entité de développement international",
    text: "ETAFAT Sénégal contribue au développement des activités du Groupe en Afrique de l'Ouest, en mobilisant les savoir-faire techniques d'ETAFAT au service des projets territoriaux, fonciers et géospatiaux.",
    image: "/etafat/visuels/filiales/etafat-senegal.jpg",
  },
  {
    slug: "etafat-afrique",
    title: "ETAFAT Afrique",
    subtitle: "Entité de développement international",
    text: "ETAFAT Afrique accompagne le rayonnement du Groupe sur le continent africain, en renforçant sa capacité à intervenir sur des projets d'envergure dans des contextes locaux, institutionnels et techniques variés.",
    image: "/etafat/visuels/filiales/etafat-afrique.jpg",
  },
];

export default function IdentitePage() {
  return (
    <>
      <PageHero
        title="Notre identité"
        description={[
          "Depuis 1983, ETAFAT accompagne les acteurs publics et privés dans les domaines du foncier, du conseil & ingénierie, de la donnée géospatiale et des systèmes d'information géographique.",
          "Notre expertise, notre exigence et nos valeurs guident chaque projet pour construire des territoires durables et performants.",
        ]}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Le Groupe", href: "/identite/" },
          { label: "Notre identité" },
        ]}
        variant="banner"
        image="/etafat/skills/etudes-territoriales.jpg"
        video="/etafat/videos/aerial-territory.mp4"
      />

      <IdentiteSubNav />

      {/* NOTRE VISION */}
      <section id="vision" className="bg-white py-20 md:py-28 scroll-mt-[170px]">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <h2 className="text-navy mb-6 leading-tight">
                Révéler la valeur des territoires par la donnée géospatiale
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-body leading-relaxed mb-4">
                Nous croyons que des données fiables, précises et bien structurées permettent de mieux comprendre, planifier, sécuriser et valoriser les territoires.
              </p>
              <p className="text-body leading-relaxed">
                Notre ambition est de mettre notre expertise en topographie, foncier, cartographie, SIG et ingénierie au service de projets durables, utiles et adaptés aux réalités du terrain, au Maroc, en Afrique et partout ailleurs au Monde.
              </p>
            </Reveal>
          </div>
          <Reveal variant="zoom-out" delay={200}>
            <div className="relative aspect-[4/3] rounded-md overflow-hidden">
              <Image
                src={`${V}/vision.jpg`}
                alt="Opérateur ETAFAT et relevé géospatial par drone au-dessus d'un territoire"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section id="valeurs" className="bg-[#f5f7f9] py-20 md:py-28 scroll-mt-[170px]">
        <div className="container-etafat">
          <Reveal variant="line" duration={1000}>
            <h2 className="text-[#00669d] text-2xl md:text-4xl font-bold uppercase tracking-tight mb-14 leading-tight">
              Nos valeurs portées par un collectif
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {VALEURS.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="group h-full rounded-xl bg-white p-8 md:p-10 border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Image
                    src={v.image}
                    alt=""
                    width={160}
                    height={160}
                    className="mx-auto mb-8 h-28 w-28 md:h-36 md:w-36 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <h3 className="text-[#00669d] text-xl font-bold uppercase tracking-wide mb-4 leading-tight text-center">
                    {v.title}
                  </h3>
                  <p className="text-body leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTION GÉNÉRALE */}
      <section id="direction" className="bg-[#0a1e30] text-white py-20 md:py-28 scroll-mt-[170px]">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <span className="text-[#7ab3d9] text-sm font-semibold uppercase tracking-wider mb-3 block">
                La Direction Générale
              </span>
              <h2 className="mb-6 leading-tight" style={{ color: "#fff" }}>
                Une gouvernance engagée pour la précision, l&apos;innovation et la performance
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-white/85 leading-relaxed mb-4">
                Nous portons une vision claire : consolider le rôle de l&apos;entreprise comme acteur de référence dans l&apos;acquisition, le traitement et la valorisation des données géospatiales.
              </p>
              <p className="text-white/85 leading-relaxed mb-8">
                Cette gouvernance s&apos;appuie sur l&apos;expertise des équipes, la modernisation continue des moyens technologiques et une culture d&apos;exigence orientée vers la qualité, l&apos;innovation et la satisfaction client.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <blockquote className="border-l-2 border-[#7ab3d9] pl-6 italic text-lg text-white/95">
                Notre ambition est de mettre la donnée géospatiale au service de décisions plus fiables, de projets mieux maîtrisés et de territoires durablement valorisés.
              </blockquote>
            </Reveal>
          </div>
          <Reveal variant="zoom-out" delay={200}>
            <div className="relative aspect-[4/3] rounded-md overflow-hidden">
              <Image
                src={`${V}/direction.jpg`}
                alt="Équipe ETAFAT analysant des données géospatiales"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ETAFAT EN CHIFFRES */}
      <section id="chiffres-cles" className="bg-white py-20 md:py-24 scroll-mt-[170px]">
        <div className="container-etafat">
          <Reveal>
            <span className="block w-10 h-[3px] rounded bg-[#00669d] mb-3" aria-hidden />
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-10 block">
              ETAFAT en chiffres
            </span>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHIFFRES.map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                {/* photo melting into the ETAFAT blue, icon badge, figure */}
                <div className="group relative h-full overflow-hidden rounded-xl bg-[#0a4c82] text-white shadow-lg">
                  <div className="relative h-40">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a4c82]/0 via-[#0a4c82]/25 to-[#0a4c82]" />
                  </div>
                  <div className="relative -mt-12 px-7 pb-8">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                      <Icon icon={c.icon} width={30} height={30} className="text-[#00669d]" />
                    </div>
                    <p className="text-3xl md:text-4xl font-semibold leading-none" style={{ fontFamily: "var(--font-figtree)", color: "#fff" }}>
                      <CountUp value={c.value} />
                      {c.unit && <span className="text-xl ml-1 font-normal">{c.unit}</span>}
                    </p>
                    <span className="mt-4 mb-3 block h-[3px] w-12 rounded bg-[#5cc8ef]" aria-hidden />
                    <p className="text-white/90 text-sm leading-snug">{c.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORIQUE — 43 ans d'évolution */}
      <section id="historique" className="relative overflow-hidden bg-white pt-20 md:pt-28 pb-40 md:pb-52 scroll-mt-[170px]">
        {/* misty landscape along the bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 md:h-60" aria-hidden>
          <Image src={`${V}/historique-paysage.jpg`} alt="" fill sizes="100vw" className="object-cover object-bottom" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/30 to-transparent" />
        </div>
        <div className="container-etafat relative">
          <Reveal>
            <span className="block w-10 h-[3px] rounded bg-[#00669d] mb-3" aria-hidden />
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Historique
            </span>
            <h2 className="text-navy mb-12 leading-tight">43 ans d&apos;évolution</h2>
          </Reveal>
          <div className="relative">
            {/* timeline through the year dots */}
            <div className="hidden md:block absolute top-[3.6rem] left-[10%] right-[6%] h-px bg-[#7fb3d6]" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
              {HISTOIRE.map((h, i) => (
                <Reveal key={h.year} delay={i * 100}>
                  <div className="text-center">
                    <p className="text-[#0d5a9a] text-2xl md:text-[1.7rem] font-bold mb-3" style={{ fontFamily: "var(--font-figtree)" }}>
                      {h.year}
                    </p>
                    <span className="relative z-10 mx-auto block h-4 w-4 rounded-full bg-[#00669d] ring-4 ring-white" aria-hidden />
                    <div className="relative mx-auto mt-3 h-28 w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ring-[#00669d] transition-transform duration-300 hover:scale-105">
                      <Image src={h.image} alt="" fill sizes="128px" className="object-cover" />
                    </div>
                    <h3 className="mt-4 text-navy text-base font-semibold leading-snug">{h.title}</h3>
                    <span className="mx-auto mt-3 block h-0.5 w-8 rounded bg-[#00669d]" aria-hidden />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOS FILIALES — preview */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Nos filiales
            </span>
            <h2 className="text-navy mb-12 leading-tight">
              Un groupe structuré pour accompagner les projets au Maroc et à l&apos;international
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {FILIALES.map((f, i) => (
              <Reveal key={f.slug} delay={i * 100}>
                <article className="bg-white rounded-md overflow-hidden border border-[#e5e7eb] h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover object-left"
                    />
                  </div>
                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="text-navy text-xl font-semibold mb-1">{f.title}</h3>
                    <p className="text-teal text-sm font-medium uppercase tracking-wider mb-4">
                      {f.subtitle}
                    </p>
                    <p className="text-body text-sm leading-relaxed flex-1">{f.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div className="flex justify-center mt-12">
              <Pill href="/filiales/" variant="outline-teal" arrow="right">
                Découvrir toutes nos filiales
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#00669d] py-16 text-white">
        <div className="container-etafat flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-2 leading-tight" style={{ color: "#fff" }}>
              Vous avez un projet géospatial ou territorial&nbsp;?
            </h2>
            <p className="text-white/85">
              ETAFAT vous accompagne avec des solutions fiables, innovantes et adaptées à vos enjeux.
            </p>
          </div>
          <Link
            href="/contact/"
            className="pill border-2 border-white text-white hover:bg-white hover:text-[#00669d] shrink-0"
          >
            Contactez-nous
            <ArrowRightIcon width={12} height={12} />
          </Link>
        </div>
      </section>
    </>
  );
}
