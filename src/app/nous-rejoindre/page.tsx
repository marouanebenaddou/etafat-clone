import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ArrowRightIcon } from "@/components/icons";
import { NousRejoindreSubNav } from "./NousRejoindreSubNav";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous rejoindre - ETAFAT",
  description:
    "Rejoindre ETAFAT, c'est intégrer une entreprise à taille humaine, portée par la passion du terrain et la précision des données.",
};

const YOUTUBE = "https://www.youtube.com/@etafatgroup";

const POURQUOI: { icon: string; title: string; text: string }[] = [
  {
    icon: "ph:globe-hemisphere-west-duotone",
    title: "Des projets à impact",
    text: "Contribuez à des projets concrets qui accompagnent la transition écologique et l'aménagement des territoires.",
  },
  {
    icon: "tabler:drone",
    title: "Des métiers techniques et innovants",
    text: "Travaillez avec des technologies de pointe et des expertises reconnues.",
  },
  {
    icon: "ph:mountains-duotone",
    title: "Une culture terrain",
    text: "Le terrain fait partie de notre ADN. Nous valorisons la proximité, l'autonomie et le sens du concret.",
  },
  {
    icon: "ph:trend-up-duotone",
    title: "Une évolution professionnelle",
    text: "Nous accompagnons vos envies d'évoluer et de développer vos compétences.",
  },
];

const PROCESSUS: { title: string; text: string }[] = [
  {
    title: "Je candidate",
    text: "Je consulte nos offres et j'envoie ma candidature en ligne.",
  },
  {
    title: "Je rencontre l'équipe RH ou un manager",
    text: "Un premier échange pour mieux se connaître.",
  },
  {
    title: "Ma candidature est retenue",
    text: "Nous vous faisons un retour et discutons des prochaines étapes.",
  },
  {
    title: "J'intègre ETAFAT",
    text: "Bienvenue ! Un parcours d'intégration personnalisé vous attend.",
  },
];

export default function NousRejoindrePage() {
  return (
    <>
      <PageHero
        title="Rejoignez ETAFAT !"
        description="Rejoindre ETAFAT, c'est intégrer une entreprise à taille humaine, portée par la passion du terrain et la précision des données, pour des projets qui transforment durablement les territoires."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Nous rejoindre" },
        ]}
        variant="banner"
        image="/etafat/skills/etudes-territoriales.jpg"
        video="/etafat/videos/aerial-territory.mp4"
      />

      <NousRejoindreSubNav />

      {/* NOTRE CULTURE */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-etafat grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <Reveal variant="zoom-out">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image
                src="/etafat/skills/geospatial-intelligence.jpg"
                alt="La culture d'entreprise ETAFAT"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-teal">
                Notre culture
              </span>
              <h2 className="mb-6 leading-tight text-navy">Notre culture d&apos;entreprise</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mb-4 text-lg font-medium leading-relaxed text-navy">
                Chez ETAFAT, l&apos;humain est au cœur de notre réussite.
              </p>
              <p className="mb-4 leading-relaxed text-body">
                Nous cultivons un management de proximité, un esprit d&apos;équipe fort, la rigueur technique et une culture du terrain qui font notre singularité.
              </p>
              <p className="leading-relaxed text-body">
                Curieux, engagés et solidaires, nous innovons chaque jour pour apporter des solutions utiles à nos clients et aux territoires.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS REJOINDRE */}
      <section id="pourquoi" className="scroll-mt-[170px] bg-[#f5f7f9] py-20 md:py-28">
        <div className="container-etafat">
          <Reveal>
            <h2 className="mb-14 text-center leading-tight text-navy">
              Pourquoi nous rejoindre&nbsp;?
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {POURQUOI.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-md border border-[#e5e7eb] bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-[#00669d] transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon icon={p.icon} width={36} height={36} className="text-[#00669d]" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold leading-tight text-navy">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-body">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS DE RECRUTEMENT */}
      <section id="processus" className="scroll-mt-[170px] bg-white py-20 md:py-28">
        <div className="container-etafat grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-teal">
                Processus
              </span>
              <h2 className="mb-10 leading-tight text-navy">Processus de recrutement</h2>
            </Reveal>
            <ol className="relative space-y-8">
              <span className="absolute left-[18px] top-2 bottom-2 w-px bg-[#00669d]/20" aria-hidden />
              {PROCESSUS.map((p, i) => (
                <Reveal key={p.title} delay={i * 100}>
                  <li className="relative flex gap-5">
                    <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00669d] text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="mb-1 text-base font-semibold text-navy">{p.title}</h3>
                      <p className="text-sm leading-relaxed text-body">{p.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal variant="zoom-out" delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image
                src="/etafat/skills/assistance-fonciere.jpg"
                alt="Entretien de recrutement ETAFAT"
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CANDIDATURE SPONTANÉE + TÉMOIGNAGES */}
      <section id="temoignages" className="scroll-mt-[170px] bg-[#f5f7f9] py-20 md:py-24">
        <div className="container-etafat grid gap-6 md:grid-cols-2">
          {/* Candidature spontanée */}
          <Reveal>
            <div className="flex h-full flex-col rounded-md bg-[#00669d] p-9 text-white">
              <Icon
                icon="ph:paper-plane-tilt-duotone"
                width={44}
                height={44}
                className="mb-5 text-white/90"
              />
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-white/80">
                Candidature spontanée
              </span>
              <p className="mb-7 leading-relaxed text-white/90">
                Vous ne trouvez pas d&apos;offre correspondant à votre profil mais vous souhaitez nous rejoindre&nbsp;? Envoyez-nous votre candidature spontanée, nous étudierons votre profil avec attention.
              </p>
              <Link
                href="/contact/"
                className="pill mt-auto self-start border-2 border-white text-white transition-colors hover:bg-white hover:text-[#00669d]"
              >
                Envoyer ma candidature
                <ArrowRightIcon width={12} height={12} />
              </Link>
            </div>
          </Reveal>

          {/* Témoignages */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-md border border-[#e5e7eb] bg-white p-9">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-teal">
                Témoignages
              </span>
              <h3 className="mb-3 text-2xl font-semibold leading-tight text-navy">
                Découvrez les témoignages de nos collaborateurs
              </h3>
              <p className="mb-6 leading-relaxed text-body">
                Ils partagent leur parcours, leurs missions et ce qui fait la richesse de leur expérience chez ETAFAT.
              </p>
              <a
                href={YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mb-6 block aspect-video overflow-hidden rounded-md"
              >
                <Image
                  src="/etafat/skills/topographie-et-geodesie.jpg"
                  alt="Interviews des collaborateurs ETAFAT"
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/25" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#00669d] shadow-lg transition-transform group-hover:scale-110">
                  <Icon icon="ph:play-fill" width={22} height={22} />
                </span>
                <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                  2:18
                </span>
              </a>
              <a
                href={YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-teal mt-auto self-start"
              >
                Regarder les interviews
                <ArrowRightIcon width={12} height={12} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NOTRE VISION */}
      <section id="vision" className="relative scroll-mt-[170px] overflow-hidden">
        <Image
          src="/etafat/skills/releves-geospatiaux.jpg"
          alt="La vision ETAFAT"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e30]/95 via-[#0a1e30]/80 to-[#0a1e30]/30" />
        <div className="container-etafat relative py-24 md:py-32">
          <div className="max-w-xl text-white">
            <Reveal>
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#7ab3d9]">
                Notre vision
              </span>
              <h2 className="mb-6 leading-tight" style={{ color: "#fff" }}>
                Notre vision, votre avenir
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mb-4 leading-relaxed text-white/90">
                Nous transformons les données géospatiales en informations utiles pour éclairer les décisions et façonner des territoires plus durables et mieux connectés.
              </p>
              <p className="mb-8 leading-relaxed text-white/90">
                Rejoindre ETAFAT, c&apos;est mettre vos talents au service d&apos;un avenir qui a du sens.
              </p>
            </Reveal>
            <Reveal delay={250}>
              <a
                href={YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="pill border-2 border-white text-white transition-colors hover:bg-white hover:text-[#00669d]"
              >
                <Icon icon="ph:play-fill" width={14} height={14} />
                Voir la vidéo
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
