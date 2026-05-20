import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos engagements - ETAFAT",
  description:
    "Agir avec rigueur, éthique et responsabilité pour des projets géospatiaux fiables et durables.",
};

const ENGAGEMENTS: { icon: string; title: string; text: string }[] = [
  {
    icon: "ph:shield-check-duotone",
    title: "Une gouvernance responsable et indépendante",
    text: "Nous préservons notre indépendance pour garantir des analyses objectives, des recommandations fiables et des décisions fondées sur des critères techniques et réglementaires.",
  },
  {
    icon: "ph:target-duotone",
    title: "L'excellence technique au cœur de nos missions",
    text: "Nous mobilisons des expertises pointues et des technologies de pointe pour produire des données précises, fiables et exploitables, répondant aux exigences des projets les plus complexes.",
  },
  {
    icon: "ph:bank-duotone",
    title: "Le respect des exigences des bailleurs de fonds",
    text: "Nous respectons les politiques éthiques, sociales, environnementales et opérationnelles des bailleurs de fonds et partenaires institutionnels.",
  },
  {
    icon: "ph:lock-key-duotone",
    title: "La confidentialité et la sécurité des données",
    text: "Nous protégeons les informations sensibles et mettons en place des accords de confidentialité pour sécuriser les échanges, livrables et données traitées.",
  },
  {
    icon: "ph:scales-duotone",
    title: "Un code d'éthique et de déontologie",
    text: "Nous agissons avec intégrité, loyauté et transparence dans toutes nos missions, et entretenons des relations de confiance durables avec nos clients, partenaires et collaborateurs.",
  },
  {
    icon: "ph:hard-hat-duotone",
    title: "Une politique HSE intégrée à nos interventions",
    text: "Nous veillons à la santé et à la sécurité de nos équipes et partenaires, tout en limitant les impacts environnementaux de nos activités.",
  },
  {
    icon: "ph:leaf-duotone",
    title: "Une démarche RSE au service des territoires",
    text: "Nous contribuons durablement au développement des territoires, au bien-être de nos collaborateurs et au respect des parties prenantes.",
  },
  {
    icon: "ph:medal-duotone",
    title: "Un système qualité orienté amélioration continue",
    text: "Nous mettons en œuvre des processus de contrôle et d'amélioration continue pour garantir la qualité, la traçabilité et la performance de nos prestations.",
  },
];

const CHIFFRES = [
  { value: "95%", label: "Taux de satisfaction client" },
  { value: "+5 000", label: "Heures de formation par an" },
  { value: "100%", label: "Collaborateurs formés HSE" },
  { value: "+80", label: "Projets soumis à des exigences bailleurs" },
  { value: "+25", label: "Audits qualité réalisés" },
  { value: "+120", label: "Accords de confidentialité signés" },
];

const ACTIONS: { icon: string; title: string; text: string }[] = [
  {
    icon: "ph:clipboard-text-duotone",
    title: "Qualité et contrôle des livrables",
    text: "Procédures et outils de contrôle qualité à chaque étape pour garantir la cohérence, la précision et l'exploitabilité des données.",
  },
  {
    icon: "ph:hard-hat-duotone",
    title: "Sécurité des missions terrain",
    text: "Application de consignes HSE adaptées aux contextes d'intervention pour protéger nos équipes et nos partenaires.",
  },
  {
    icon: "ph:file-lock-duotone",
    title: "Protection des données",
    text: "Encadrement des échanges et gestion documentaire sécurisée pour garantir la confidentialité des informations.",
  },
  {
    icon: "ph:buildings-duotone",
    title: "Respect des exigences institutionnelles",
    text: "Alignement de nos méthodes avec les exigences des maîtres d'ouvrage, administrations et partenaires techniques.",
  },
  {
    icon: "ph:graduation-cap-duotone",
    title: "Transfert de compétences",
    text: "Accompagnement des équipes, partenaires et institutions pour renforcer l'appropriation des outils et des données géospatiales.",
  },
];

export default function EngagementsPage() {
  return (
    <>
      <PageHero
        title="Nos engagements"
        description="Agir avec rigueur, éthique et responsabilité pour des projets géospatiaux fiables et durables."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Le Groupe", href: "/identite/" },
          { label: "Nos engagements" },
        ]}
        variant="banner"
        image="/etafat/skills/conseil-et-audit-geospatial.jpg"
      />

      {/* Intro paragraphs */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-etafat max-w-4xl">
          <Reveal>
            <p className="text-body text-base md:text-lg leading-relaxed mb-5">
              ETAFAT inscrit ses missions dans une démarche d&apos;exigence, d&apos;éthique et de responsabilité.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body text-base md:text-lg leading-relaxed">
              Dans chacun de ses projets, l&apos;entreprise s&apos;engage à fournir des données fiables, des livrables de qualité et des solutions adaptées aux besoins de ses clients et partenaires.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 8 engagement cards */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy text-center mb-14">Nos engagements</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ENGAGEMENTS.map((e, i) => (
              <Reveal key={e.title} delay={i * 60}>
                <div className="group relative bg-white p-8 rounded-md border border-[#e5e7eb] h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="w-16 h-16 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon icon={e.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-base md:text-lg font-semibold mb-3 leading-tight">
                    {e.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">{e.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy text-center mb-3">Nos engagements en chiffres</h2>
            <p className="text-body text-center text-sm mb-12">* Chiffres indicatifs — données 2023-2024</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {CHIFFRES.map((c, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="bg-[#f5f7f9] rounded-md p-6 text-center h-full flex flex-col justify-center">
                  <p
                    className="text-teal text-3xl md:text-4xl font-semibold mb-2"
                    style={{ fontFamily: "var(--font-figtree)" }}
                  >
                    {c.value}
                  </p>
                  <p className="text-body text-xs md:text-sm leading-snug">{c.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Actions concrètes */}
      <section className="bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <h2 className="text-navy text-center mb-14">Nos actions concrètes</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {ACTIONS.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <div className="group relative bg-white p-8 rounded-md border border-[#e5e7eb] h-full text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#00669d] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  <div className="mx-auto w-16 h-16 rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon icon={a.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="text-navy text-base font-semibold mb-3 leading-tight">{a.title}</h3>
                  <p className="text-body text-sm leading-relaxed">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
