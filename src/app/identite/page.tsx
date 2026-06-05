import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Pill } from "@/components/Pill";
import {
  ArrowRightIcon,
  CheckCircleIcon,
} from "@/components/icons";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";
import { IdentiteSubNav } from "./IdentiteSubNav";

export const metadata: Metadata = {
  title: "Notre identité - ETAFAT",
  description:
    "Depuis 1983, ETAFAT accompagne les acteurs publics et privés dans les domaines du foncier, du conseil & ingénierie, de la donnée géospatiale et des SIG.",
};

const VALEURS: { icon: string; title: string; text: string }[] = [
  {
    icon: "ph:medal-duotone",
    title: "Compétence",
    text: "Nous mobilisons des équipes qualifiées, expérimentées et pluridisciplinaires pour répondre aux exigences techniques de chaque projet.",
  },
  {
    icon: "ph:eye-duotone",
    title: "Transparence",
    text: "Nous privilégions une communication claire, un suivi rigoureux et une relation de confiance durable avec nos clients et partenaires.",
  },
  {
    icon: "ph:scales-duotone",
    title: "Intégrité",
    text: "Nous conduisons nos missions avec honnêteté, impartialité et respect des règles professionnelles, notamment dans les projets fonciers, institutionnels et territoriaux.",
  },
  {
    icon: "ph:shield-check-duotone",
    title: "Responsabilité",
    text: "Nous assumons pleinement notre rôle dans la réussite des projets confiés, à travers le respect des délais, la qualité des livrables et la maîtrise des impacts.",
  },
  {
    icon: "ph:lock-key-duotone",
    title: "Confidentialité",
    text: "Nous protégeons les données sensibles, foncières, techniques, géospatiales et institutionnelles traitées dans le cadre de nos missions.",
  },
  {
    icon: "ph:handshake-duotone",
    title: "Loyauté",
    text: "Nous construisons des relations durables fondées sur la confiance, le respect des engagements et la fidélité à nos principes.",
  },
  {
    icon: "ph:users-three-duotone",
    title: "Équité",
    text: "Nous adoptons une approche juste, impartiale et respectueuse des parties prenantes, des contextes locaux et des spécificités de chaque projet.",
  },
];

const CHIFFRES = [
  { value: "+200 000", unit: "km²", label: "Superficie couverte en prises de vues aériennes" },
  { value: "+1 000 000", unit: "ha", label: "Superficie immatriculée" },
  { value: "+35", unit: "", label: "Solutions SIG métier développées" },
  { value: "+10 000", unit: "ha", label: "Accompagnés dans des projets d'aménagement urbain" },
];

const HISTOIRE = [
  { year: "1983", title: "Création d'ETAFAT" },
  { year: "1999", title: "1er Projet à l'International" },
  { year: "2012", title: "Activité de PVA" },
  { year: "2020", title: "Développement à l'échelle Africaine" },
  { year: "2025", title: "1er Projet en Asie" },
];

const FILIALES = [
  {
    slug: "etafat-ingenierie",
    title: "ETAFAT ING",
    subtitle: "Entité ingénierie",
    text: "ETAFAT ING porte les expertises d'ingénierie du Groupe, en accompagnant les projets d'aménagement, d'infrastructure, d'études techniques et de valorisation des territoires.",
    image: "/etafat/skills/etudes-territoriales.jpg",
  },
  {
    slug: "etafat-senegal",
    title: "ETAFAT Sénégal",
    subtitle: "Entité de développement international",
    text: "ETAFAT Sénégal contribue au développement des activités du Groupe en Afrique de l'Ouest, en mobilisant les savoir-faire techniques d'ETAFAT au service des projets territoriaux, fonciers et géospatiaux.",
    image: "/etafat/skills/cartographie.jpg",
  },
  {
    slug: "etafat-afrique",
    title: "ETAFAT Afrique",
    subtitle: "Entité de développement international",
    text: "ETAFAT Afrique accompagne le rayonnement du Groupe sur le continent africain, en renforçant sa capacité à intervenir sur des projets d'envergure dans des contextes locaux, institutionnels et techniques variés.",
    image: "/etafat/skills/cadastre-et-securisation-fonciere.jpg",
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
      />

      <IdentiteSubNav />

      {/* NOTRE VISION */}
      <section id="vision" className="bg-white py-20 md:py-28 scroll-mt-[170px]">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
                Notre vision
              </span>
              <h2 className="text-navy mb-6 leading-tight">
                Révéler la valeur des territoires par la donnée géospatiale
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-body leading-relaxed mb-4">
                Nous croyons que des données fiables, précises et bien structurées permettent de mieux comprendre, planifier, sécuriser et valoriser les territoires.
              </p>
              <p className="text-body leading-relaxed">
                Notre ambition est de mettre notre expertise en topographie, foncier, cartographie, SIG et ingénierie au service de projets durables, utiles et adaptés aux réalités du terrain, au Maroc, en Afrique et à l&apos;international.
              </p>
            </Reveal>
          </div>
          <Reveal variant="zoom-out" delay={200}>
            <div className="relative aspect-[4/3] rounded-md overflow-hidden">
              <Image
                src="/etafat/skills/modelisation-3d-et-bim.jpg"
                alt="Vision ETAFAT"
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
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-10 block">
              Nos valeurs portées par un collectif
            </span>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {VALEURS.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="group relative bg-white p-8 rounded-md border border-[#e5e7eb] h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon icon={v.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-lg font-semibold mb-3">{v.title}</h3>
                  <p className="text-body text-sm leading-relaxed">{v.text}</p>
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
                La Direction Générale d&apos;ETAFAT porte une vision claire : consolider le rôle de l&apos;entreprise comme acteur de référence dans l&apos;acquisition, le traitement et la valorisation des données géospatiales.
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
                src="/etafat/skills/conseil-et-audit-geospatial.jpg"
                alt="Direction Générale ETAFAT"
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
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-10 block">
              ETAFAT en chiffres
            </span>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHIFFRES.map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#00669d] text-white rounded-md p-8 h-full">
                  <Icon icon="ph:mountains-duotone" width={36} height={36} className="text-white/80 mb-5" />
                  <p className="text-3xl md:text-4xl font-semibold leading-none mb-2" style={{ fontFamily: "var(--font-figtree)", color: "#fff" }}>
                    {c.value}
                    {c.unit && <span className="text-xl ml-1 font-normal">{c.unit}</span>}
                  </p>
                  <p className="text-white/85 text-sm leading-snug mt-3">{c.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORIQUE — 42 ans d'évolution */}
      <section id="historique" className="bg-[#f5f7f9] py-20 md:py-28 scroll-mt-[170px]">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Historique
            </span>
            <h2 className="text-navy mb-12 leading-tight">42 ans d&apos;évolution</h2>
          </Reveal>
          <div className="relative">
            {/* horizontal connector */}
            <div className="hidden md:block absolute top-7 left-[5%] right-[5%] h-px bg-[#00669d]/30" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {HISTOIRE.map((h, i) => (
                <Reveal key={h.year} delay={i * 100}>
                  <div className="text-center md:text-left">
                    <p className="text-navy text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-figtree)" }}>
                      {h.year}
                    </p>
                    <div className="mx-auto md:mx-0 w-14 h-14 rounded-full bg-[#00669d] flex items-center justify-center mb-4">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-navy text-base font-semibold">{h.title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCALISATION — placeholder */}
      <section id="localisation" className="bg-white py-20 md:py-28 scroll-mt-[170px] border-t border-[#e5e7eb]">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Localisation
            </span>
            <h2 className="text-navy mb-4 leading-tight">Où nous trouver</h2>
            <p className="text-body max-w-3xl">
              Section à compléter — carte, adresses et coordonnées des sites ETAFAT.
            </p>
          </Reveal>
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
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#00669d]/30" />
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
