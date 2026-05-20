import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Pill } from "@/components/Pill";
import { Reveal } from "@/components/Reveal";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous rejoindre - ETAFAT",
  description:
    "Rejoignez ETAFAT et participez à des projets géospatiaux à fort impact au Maroc et en Afrique.",
};

const POURQUOI: { icon: string; title: string; text: string }[] = [
  {
    icon: "ph:graduation-cap-duotone",
    title: "Monter en compétences",
    text: "Bénéficier de formations continues, d'un accompagnement managérial de proximité et d'opportunités d'évolution dans nos différents métiers.",
  },
  {
    icon: "ph:globe-hemisphere-west-duotone",
    title: "Travailler à l'international",
    text: "Intervenir sur des projets variés au Maroc et en Afrique, aux côtés d'institutions publiques, de bailleurs de fonds et de partenaires privés.",
  },
  {
    icon: "ph:users-three-duotone",
    title: "Rejoindre des équipes engagées",
    text: "Évoluer au sein d'équipes pluridisciplinaires, mobilisées par le sens des missions et la qualité des livrables.",
  },
  {
    icon: "ph:sparkle-duotone",
    title: "Innover au quotidien",
    text: "Participer au développement de solutions géospatiales avancées, en lien direct avec nos pôles R&D et nos clients.",
  },
];

const PROCESSUS: { icon: string; title: string; text: string }[] = [
  {
    icon: "ph:file-magnifying-glass-duotone",
    title: "Candidature",
    text: "Postulez à une offre ou envoyez une candidature spontanée. Chaque dossier est étudié par notre équipe RH.",
  },
  {
    icon: "ph:chat-circle-text-duotone",
    title: "Échange RH",
    text: "Un premier entretien permet de découvrir votre parcours, vos motivations et de vous présenter notre culture.",
  },
  {
    icon: "ph:handshake-duotone",
    title: "Entretien métier",
    text: "Un échange avec le manager du pôle concerné approfondit les aspects techniques et opérationnels du poste.",
  },
  {
    icon: "ph:rocket-launch-duotone",
    title: "Intégration",
    text: "Un parcours d'intégration personnalisé vous accompagne dès votre arrivée pour une prise de poste sereine.",
  },
];

const TEMOIGNAGES: { name: string; role: string; quote: string }[] = [
  {
    name: "Yassine",
    role: "Ingénieur topographe",
    quote:
      "J'ai rejoint ETAFAT pour la diversité des missions et la richesse technique des projets. Au quotidien, on apprend, on partage et on progresse vraiment ensemble.",
  },
  {
    name: "Salma",
    role: "Chef de projet SIG",
    quote:
      "Travailler sur des projets territoriaux à fort impact, avec des équipes engagées et des technologies de pointe, c'est ce qui me motive chez ETAFAT.",
  },
  {
    name: "Karim",
    role: "Responsable cartographie",
    quote:
      "L'accompagnement managérial, l'accès à la formation continue et la confiance accordée aux équipes font la différence.",
  },
];

export default function NousRejoindrePage() {
  return (
    <>
      <PageHero
        title="Rejoignez ETAFAT"
        description="Participez à des projets géospatiaux à fort impact aux côtés d'équipes engagées, au Maroc et en Afrique."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Nous rejoindre" },
        ]}
        variant="banner"
        image="/etafat/skills/etudes-territoriales.jpg"
      />

      {/* Intro */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-etafat max-w-4xl">
          <Reveal>
            <p className="text-body text-base md:text-lg leading-relaxed mb-5">
              Chez ETAFAT, nous croyons que la qualité de nos missions repose avant tout
              sur l&apos;expertise, l&apos;engagement et la cohésion de nos équipes.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body text-base md:text-lg leading-relaxed">
              Nous accompagnons chacun de nos collaborateurs dans son évolution professionnelle,
              en favorisant la montée en compétences, la mobilité interne et le partage
              d&apos;expériences entre nos filiales.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block text-center">
              Pourquoi nous rejoindre
            </span>
            <h2 className="text-navy text-center mb-14">Une expérience collaborateur unique</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POURQUOI.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group relative bg-white p-8 rounded-md border border-[#e5e7eb] h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon icon={p.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-lg font-semibold mb-3 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Notre processus */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block text-center">
              Notre processus de recrutement
            </span>
            <h2 className="text-navy text-center mb-14">Quatre étapes simples</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESSUS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="group relative bg-[#f5f7f9] p-8 rounded-md h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon icon={p.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-lg font-semibold mb-3 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-[#313c4e] py-20 md:py-28 text-white">
        <div className="container-etafat">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block text-center">
              Témoignages
            </span>
            <h2 className="text-white text-center mb-14" style={{ color: "#fff" }}>
              Ils nous ont rejoints
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-white/5 backdrop-blur p-7 rounded-md h-full flex flex-col border border-white/10">
                  <Icon icon="ph:quotes-duotone" width={32} height={32} className="text-[#00669d] mb-4" />
                  <p className="text-white/90 text-sm leading-relaxed mb-6 italic flex-1">
                    « {t.quote} »
                  </p>
                  <div>
                    <p className="text-white font-semibold" style={{ color: "#fff" }}>
                      {t.name}
                    </p>
                    <p className="text-white/70 text-sm">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-etafat grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <span className="text-teal text-sm font-semibold uppercase tracking-wider mb-3 block">
              Notre vision
            </span>
            <h2 className="text-navy mb-6 leading-tight">
              Construire ensemble l&apos;ETAFAT de demain
            </h2>
            <p className="text-body leading-relaxed mb-5">
              Nous investissons dans nos équipes parce que notre développement repose sur
              leur expertise, leur engagement et leur capacité à innover.
            </p>
            <p className="text-body leading-relaxed mb-8">
              ETAFAT cultive un environnement de travail où chacun trouve sa place,
              monte en responsabilité et contribue à des projets qui transforment durablement
              les territoires.
            </p>
            <Pill href="/offres-demploi/" variant="outline-teal" arrow="right">
              Consulter nos offres
            </Pill>
          </Reveal>
          <Reveal variant="zoom-out" delay={150}>
            <div className="relative aspect-[4/3] rounded-md overflow-hidden">
              <Image
                src="/etafat/skills/etudes-territoriales.jpg"
                alt="Équipe ETAFAT"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#00669d] py-20 text-center text-white">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-white mb-6 text-3xl md:text-4xl font-semibold" style={{ color: "#fff" }}>
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez les offres d&apos;emploi du Groupe ETAFAT et postulez en quelques clics,
              ou envoyez-nous votre candidature spontanée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Pill href="/offres-demploi/" variant="outline" arrow="right" className="!border-white !text-white">
                Voir les offres d&apos;emploi
              </Pill>
              <Link
                href="/contact/"
                className="pill border-2 border-white text-white hover:bg-white hover:text-[#00669d] transition-colors"
              >
                Candidature spontanée
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
