import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Pill } from "@/components/Pill";
import {
  ArrowRightIcon,
  CheckCircleIcon,
} from "@/components/icons";
import {
  Award,
  Eye,
  Scale,
  ShieldCheck,
  Lock,
  Handshake,
  Users,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre identité - ETAFAT",
  description:
    "Depuis 1983, ETAFAT accompagne les acteurs publics et privés dans les domaines du foncier, du conseil & ingénierie, de la donnée géospatiale et des SIG.",
};

const VALEURS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Award,
    title: "Compétence",
    text: "Nous mobilisons des équipes qualifiées, expérimentées et pluridisciplinaires pour répondre aux exigences techniques de chaque projet.",
  },
  {
    icon: Eye,
    title: "Transparence",
    text: "Nous privilégions une communication claire, un suivi rigoureux et une relation de confiance durable avec nos clients et partenaires.",
  },
  {
    icon: Scale,
    title: "Intégrité",
    text: "Nous conduisons nos missions avec honnêteté, impartialité et respect des règles professionnelles, notamment dans les projets fonciers, institutionnels et territoriaux.",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilité",
    text: "Nous assumons pleinement notre rôle dans la réussite des projets confiés, à travers le respect des délais, la qualité des livrables et la maîtrise des impacts.",
  },
  {
    icon: Lock,
    title: "Confidentialité",
    text: "Nous protégeons les données sensibles, foncières, techniques, géospatiales et institutionnelles traitées dans le cadre de nos missions.",
  },
  {
    icon: Handshake,
    title: "Loyauté",
    text: "Nous construisons des relations durables fondées sur la confiance, le respect des engagements et la fidélité à nos principes.",
  },
  {
    icon: Users,
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
  { year: "1983", title: "Création d'ETAFAT", text: "Création d'ETAFAT, avec une expertise initiale portée par les métiers du foncier, de la topographie et de la donnée géospatiale." },
  { year: "1999", title: "1er projet à l'international", text: "ETAFAT franchit une nouvelle étape avec le lancement de ses premières interventions à l'international, marquant le début de son ouverture vers de nouveaux marchés." },
  { year: "2012", title: "Activité de PVA", text: "L'entreprise renforce ses capacités en prises de vues aériennes, consolidant son savoir-faire dans l'acquisition massive de données géospatiales." },
  { year: "2020", title: "Développement à l'échelle Africaine", text: "ETAFAT accélère son développement sur le continent africain et accompagne des projets territoriaux, fonciers, cartographiques et institutionnels à plus grande échelle." },
  { year: "2025", title: "1er Projet en Asie", text: "ETAFAT poursuit son ouverture internationale avec un premier projet en Asie, confirmant sa capacité à intervenir dans des contextes variés et exigeants." },
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
        description="Depuis 1983, ETAFAT accompagne les acteurs publics et privés dans les domaines du foncier, du conseil & ingénierie, de la donnée géospatiale et des systèmes d'information géographique."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Le Groupe", href: "/identite/" },
          { label: "Notre identité" },
        ]}
        variant="banner"
        image="/etafat/skills/etudes-territoriales.jpg"
      />

      {/* NOTRE VISION */}
      <section className="bg-white py-20 md:py-28">
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
                Depuis sa création, ETAFAT place la donnée géospatiale au cœur de la compréhension, de la planification et de la valorisation des territoires.
              </p>
              <p className="text-body leading-relaxed mb-4">
                Nous croyons que des données fiables, précises et bien structurées permettent aux institutions, opérateurs publics, aménageurs et entreprises de prendre de meilleures décisions, de sécuriser leurs projets et de maîtriser les enjeux fonciers, techniques et territoriaux.
              </p>
              <p className="text-body leading-relaxed">
                Notre vision est de mettre notre expertise en topographie, foncier, cartographie, SIG, ingénierie et technologies géospatiales au service de projets durables, utiles et adaptés aux réalités du terrain, au Maroc, en Afrique et à l&apos;international.
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
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Nos valeurs portées par un collectif
            </span>
            <h2 className="text-navy mb-4 max-w-2xl leading-tight">
              Nos valeurs guident notre manière de travailler
            </h2>
            <p className="text-body mb-12 max-w-2xl">
              Chez ETAFAT, nos valeurs guident notre manière de travailler, de collaborer et d&apos;accompagner nos clients. Elles traduisent notre exigence professionnelle, notre responsabilité et notre engagement à produire des données fiables, sécurisées et exploitables.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {VALEURS.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 60}>
                  <div className="bg-white p-6 rounded-md border border-[#e5e7eb] h-full">
                    <Icon size={36} strokeWidth={1.5} className="text-[#00669d] mb-4" />
                    <h3 className="text-navy text-lg font-semibold mb-3">{v.title}</h3>
                    <p className="text-body text-sm leading-relaxed">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIRECTION GÉNÉRALE */}
      <section className="bg-[#0a1e30] text-white py-20 md:py-28">
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
              <p className="text-white/85 leading-relaxed mb-4">
                Cette gouvernance s&apos;appuie sur l&apos;expertise des équipes, la modernisation continue des moyens technologiques et une culture d&apos;exigence orientée vers la qualité, l&apos;innovation et la satisfaction client.
              </p>
              <p className="text-white/85 leading-relaxed mb-8">
                À travers ses choix stratégiques, ETAFAT poursuit son développement au Maroc, en Afrique et à l&apos;international, tout en restant fidèle à ses valeurs.
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
      <section className="bg-white py-20 md:py-24">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              ETAFAT en chiffres
            </span>
            <h2 className="text-navy mb-4 leading-tight max-w-2xl">
              Des réalisations concrètes au service des territoires
            </h2>
            <p className="text-body mb-12 max-w-3xl">
              Depuis plus de 40 ans, ETAFAT accompagne des projets d&apos;envergure dans les domaines du foncier, de la cartographie, de l&apos;aménagement, des systèmes d&apos;information géographique et de l&apos;acquisition de données.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHIFFRES.map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#00669d] text-white rounded-md p-8 h-full">
                  <Mountain size={32} strokeWidth={1.5} className="text-white/80 mb-5" />
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
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Historique
            </span>
            <h2 className="text-navy mb-12 leading-tight">42 ans d&apos;évolution</h2>
            <p className="text-body mb-16 max-w-3xl">
              L&apos;histoire d&apos;ETAFAT est celle d&apos;une entreprise marocaine qui a su évoluer avec les besoins des territoires, les exigences des projets et les avancées technologiques du secteur géospatial.
            </p>
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
                    <h3 className="text-navy text-base font-semibold mb-2">{h.title}</h3>
                    <p className="text-body text-sm leading-relaxed">{h.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOS FILIALES — preview */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Nos filiales
            </span>
            <h2 className="text-navy mb-4 leading-tight">
              Un groupe structuré pour accompagner les projets au Maroc et à l&apos;international
            </h2>
            <p className="text-body mb-12 max-w-3xl">
              Le développement d&apos;ETAFAT s&apos;appuie sur des entités complémentaires, capables de répondre aux besoins des projets d&apos;ingénierie, de développement territorial et d&apos;expansion internationale.
            </p>
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
