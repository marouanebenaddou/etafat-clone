import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { QuestionCTA } from "@/components/QuestionCTA";
import { ArrowRightIcon } from "@/components/icons";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos filiales - ETAFAT",
  description:
    "Une présence de proximité pour accompagner les projets géospatiaux, fonciers et territoriaux au Maroc et en Afrique.",
};

type Filiale = {
  slug: string;
  title: string;
  city: string;
  country: string;
  text: string;
  address: string;
  phones: string[];
  email: string;
  image: string;
};

const FILIALES: Filiale[] = [
  {
    slug: "etafat-ingenierie",
    title: "ETAFAT INGÉNIERIE",
    city: "Casablanca",
    country: "Maroc",
    text: "ETAFAT Ingénierie accompagne les projets d'aménagement, d'infrastructure, d'études techniques et de valorisation des territoires. Elle intervient aux côtés des maîtres d'ouvrage publics et privés pour concevoir, suivre et sécuriser des projets complexes.",
    address: "Lot 57, Lotissement Salaj, Aïn Diab\n20180 Casablanca — Maroc",
    phones: ["+212 522 79 87 00", "+212 522 79 87 01"],
    email: "contact@etafat.ma",
    image: "/etafat/skills/cadastre-et-securisation-fonciere.jpg",
  },
  {
    slug: "etafat-senegal",
    title: "ETAFAT SÉNÉGAL",
    city: "Dakar",
    country: "Sénégal",
    text: "ETAFAT Sénégal contribue au développement des activités du Groupe en Afrique de l'Ouest. La filiale mobilise les expertises d'ETAFAT pour accompagner les projets territoriaux, fonciers, cartographiques, géospatiaux et institutionnels au Sénégal et dans la sous-région.",
    address: "Adresse en cours de mise à jour\nDakar — Sénégal",
    phones: ["Téléphone en cours de mise à jour"],
    email: "contact@etafat.sn",
    image: "/etafat/skills/cartographie.jpg",
  },
  {
    slug: "etafat-afrique",
    title: "ETAFAT AFRIQUE",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    text: "ETAFAT Afrique accompagne le rayonnement du Groupe sur le continent africain. Implantée en Côte d'Ivoire, la filiale intervient sur des projets territoriaux, fonciers et géospatiaux, avec une approche adaptée aux besoins des institutions, collectivités et bailleurs de fonds.",
    address: "Adresse en cours de mise à jour\nAbidjan — Côte d'Ivoire",
    phones: ["Téléphone en cours de mise à jour"],
    email: "contact@etafat.ci",
    image: "/etafat/skills/etudes-territoriales.jpg",
  },
];

export default function FilialesPage() {
  return (
    <>
      <PageHero
        title="Nos filiales"
        description="Une présence de proximité pour accompagner les projets géospatiaux, fonciers et territoriaux au Maroc et en Afrique."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Le Groupe", href: "/identite/" },
          { label: "Nos filiales" },
        ]}
        variant="banner"
        image="/etafat/skills/assistance-fonciere.jpg"
      />

      {/* Intro */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-etafat max-w-4xl">
          <Reveal>
            <p className="text-body text-base md:text-lg leading-relaxed mb-5">
              ETAFAT déploie son expertise à travers des entités complémentaires, capables d&apos;accompagner les acteurs publics et privés dans leurs projets d&apos;ingénierie, de foncier, de topographie, de SIG, de cartographie et de développement territorial.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body text-base md:text-lg leading-relaxed">
              Ancrées au Maroc et présentes en Afrique de l&apos;Ouest, nos filiales renforcent notre capacité à intervenir au plus près des territoires, avec des équipes mobilisées, des moyens technologiques adaptés et une connaissance fine des contextes locaux.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filiale cards */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
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
                    <div className="absolute inset-0 bg-[#00669d]/45" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="text-navy text-xl font-semibold mb-1">{f.title}</h3>
                    <p className="text-teal text-sm font-medium mb-4">
                      {f.city}, {f.country}
                    </p>
                    <p className="text-body text-sm leading-relaxed mb-5">{f.text}</p>

                    <div className="space-y-2 mb-6 text-sm text-body">
                      <p className="flex items-start gap-2">
                        <MapPin size={16} className="text-[#00669d] mt-0.5 shrink-0" />
                        <span className="whitespace-pre-line">{f.address}</span>
                      </p>
                      {f.phones.map((phone, j) => (
                        <p key={j} className="flex items-start gap-2">
                          <Phone size={16} className="text-[#00669d] mt-0.5 shrink-0" />
                          <span>{phone}</span>
                        </p>
                      ))}
                      <p className="flex items-start gap-2">
                        <Mail size={16} className="text-[#00669d] mt-0.5 shrink-0" />
                        <a
                          href={`mailto:${f.email}`}
                          className="hover:text-[#00669d] transition-colors break-all"
                        >
                          {f.email}
                        </a>
                      </p>
                    </div>

                    <Link
                      href="/contact/"
                      className="pill pill-teal mt-auto self-start uppercase text-[11px]"
                    >
                      Contacter la filiale
                      <ArrowRightIcon width={11} height={11} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Notre présence */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Notre présence
            </span>
            <h2 className="text-navy mb-6 leading-tight">
              Une présence au service des territoires
            </h2>
            <p className="text-body leading-relaxed mb-5">
              De Casablanca à Dakar, en passant par Abidjan, ETAFAT renforce sa présence régionale pour accompagner les projets de développement territorial, de sécurisation foncière, d&apos;aménagement, d&apos;infrastructures et de valorisation de la donnée géospatiale.
            </p>
            <div className="inline-flex items-start gap-3 bg-[#f5f7f9] rounded-md p-5 mt-3 max-w-md">
              <div className="w-10 h-10 rounded-full bg-[#00669d] text-white flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <p className="text-body text-sm leading-snug">
                Des équipes locales, des expertises complémentaires et une connaissance fine des réalités terrain.
              </p>
            </div>
          </Reveal>

          {/* Africa map illustration */}
          <Reveal variant="zoom-out" delay={150}>
            <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-[#f5f7f9] border border-[#e5e7eb] flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full p-8" aria-label="Carte Afrique">
                {/* Simplified Africa outline */}
                <path
                  d="M180 50 Q220 55 240 70 L260 90 Q265 110 255 130 L245 150 L260 170 Q275 185 270 210 L255 240 Q245 280 220 310 L195 340 Q170 360 150 350 L130 335 Q115 315 110 290 L105 260 Q100 230 110 200 L120 175 Q130 150 145 130 L160 110 Q170 85 180 50 Z"
                  fill="#e0eef6"
                  stroke="#00669d"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                {/* Morocco pin (Casablanca, top-left) */}
                <g transform="translate(150, 95)">
                  <circle cx="0" cy="0" r="16" fill="#00669d" />
                  <circle cx="0" cy="0" r="6" fill="#fff" />
                  <text x="20" y="5" className="fill-[#00669d]" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Casablanca
                  </text>
                  <text x="20" y="22" className="fill-[#313c4e]" style={{ fontSize: "11px" }}>
                    ETAFAT Ingénierie
                  </text>
                </g>
                {/* Sénégal pin (Dakar, bottom-left) */}
                <g transform="translate(115, 215)">
                  <circle cx="0" cy="0" r="16" fill="#00669d" />
                  <circle cx="0" cy="0" r="6" fill="#fff" />
                  <text x="-65" y="-22" className="fill-[#00669d]" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Dakar
                  </text>
                  <text x="-65" y="-6" className="fill-[#313c4e]" style={{ fontSize: "11px" }}>
                    ETAFAT Sénégal
                  </text>
                </g>
                {/* CI pin (Abidjan, bottom-middle) */}
                <g transform="translate(175, 270)">
                  <circle cx="0" cy="0" r="16" fill="#00669d" />
                  <circle cx="0" cy="0" r="6" fill="#fff" />
                  <text x="22" y="5" className="fill-[#00669d]" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Abidjan
                  </text>
                  <text x="22" y="22" className="fill-[#313c4e]" style={{ fontSize: "11px" }}>
                    ETAFAT Afrique
                  </text>
                </g>
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
