import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@iconify/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités - ETAFAT",
  description:
    "Suivez les actualités, projets et événements du Groupe ETAFAT sur LinkedIn.",
};

type LinkedInPost = {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  url: string;
};

// Latest posts pulled from the ETAFAT LinkedIn page
// (https://www.linkedin.com/company/5160946). Each card links to the
// original post; images are stored locally in /public/etafat/actualites.
const POSTS: LinkedInPost[] = [
  {
    title: "Aïd Al-Adha Moubarak",
    date: "27 mai 2026",
    excerpt:
      "ETAFAT vous souhaite Aïd Moubarak Saïd et meilleurs vœux à vous et à votre famille à l'occasion de l'Aïd Al-Adha.",
    image: "/etafat/actualites/etafat-post-01.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7465300947804610561/",
  },
  {
    title: "Fête du Travail",
    date: "1 mai 2026",
    excerpt:
      "Nous célébrons celles et ceux qui, par leur engagement et leur savoir-faire, contribuent chaque jour à bâtir un avenir meilleur.",
    image: "/etafat/actualites/etafat-post-02.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7455902195071315968/",
  },
  {
    title: "Rétrospective 2025, cap sur 2026",
    date: "16 avril 2026",
    excerpt:
      "Des projets concrétisés, des collaborations solides et une progression continue. Le meilleur ne s'attend pas, il se construit.",
    image: "/etafat/actualites/etafat-post-03.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7450445511595081728/",
  },
  {
    title: "Aïd el Fitr Moubarak",
    date: "20 mars 2026",
    excerpt:
      "ETAFAT vous présente ses meilleurs vœux à l'occasion de l'Aïd el Fitr.",
    image: "/etafat/actualites/etafat-post-04.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7440683514863214592/",
  },
  {
    title: "PRESFOR Bafing : premier Certificat Foncier",
    date: "11 mars 2026",
    excerpt:
      "Le premier Certificat Foncier signé dans le cadre du PRESFOR en Côte d'Ivoire, à l'actif de l'opérateur foncier GEC ETAFAT – CGEA2TF.",
    image: "/etafat/actualites/etafat-post-05.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7437432636152889344/",
  },
  {
    title: "Journée des Droits des Femmes",
    date: "8 mars 2026",
    excerpt:
      "Chez ETAFAT, nous célébrons les femmes qui innovent, inspirent et participent chaque jour à construire l'avenir.",
    image: "/etafat/actualites/etafat-post-06.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7436359588037275648/",
  },
  {
    title: "R&D : projet SmartDrone4PV",
    date: "25 février 2026",
    excerpt:
      "Une R&D appliquée à impact concret : intégrer l'intelligence artificielle et les drones au service du terrain.",
    image: "/etafat/actualites/etafat-post-07.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7432447669094068224/",
  },
  {
    title: "SIG pour la Direction du Génie Rural",
    date: "19 février 2026",
    excerpt:
      "Mise en place d'un Système d'Information Géographique pour la Direction Nationale du Génie Rural et formation de ses cadres.",
    image: "/etafat/actualites/etafat-post-08.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7430236962013425664/",
  },
  {
    title: "Ramadan Karim",
    date: "18 février 2026",
    excerpt:
      "ETAFAT vous présente ses meilleurs vœux à l'occasion du mois sacré de Ramadan.",
    image: "/etafat/actualites/etafat-post-09.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7429998850158977024/",
  },
  {
    title: "Réunion AFOR – Banque Mondiale",
    date: "3 février 2026",
    excerpt:
      "Réunion de travail à l'AFOR sur l'avancement des activités de sécurisation foncière menées par ETAFAT dans le cadre du PRESFOR.",
    image: "/etafat/actualites/etafat-post-10.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7424470244875866112/",
  },
  {
    title: "CAN 2025 : direction la finale",
    date: "15 janvier 2026",
    excerpt:
      "Félicitations aux Lions de l'Atlas pour leur superbe qualification en finale de la CAN 2025.",
    image: "/etafat/actualites/etafat-post-11.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7417477563658174465/",
  },
  {
    title: "Yennayer 2976",
    date: "13 janvier 2026",
    excerpt:
      "ETAFAT célèbre l'identité amazigh, symbole de résilience, d'enracinement et de renouveau. Bonne année amazighe.",
    image: "/etafat/actualites/etafat-post-12.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7416902299597385732/",
  },
  {
    title: "CAN 2025 : qualification en demi-finale",
    date: "9 janvier 2026",
    excerpt:
      "Félicitations aux Lions de l'Atlas pour leur superbe qualification en demi-finale de la CAN 2025.",
    image: "/etafat/actualites/etafat-post-13.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7415515116470988801/",
  },
  {
    title: "Meilleurs vœux 2026",
    date: "31 décembre 2025",
    excerpt:
      "À l'aube de 2026, un nouveau cycle commence : faire mieux, voir plus loin et donner davantage de sens à ce que nous construisons.",
    image: "/etafat/actualites/etafat-post-14.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7412166265575780352/",
  },
  {
    title: "Ouverture de la CAN 2025",
    date: "21 décembre 2025",
    excerpt:
      "Le Maroc au sommet du football africain : coup d'envoi de la CAN 2025, le Royaume vibre au rythme de la fête continentale.",
    image: "/etafat/actualites/etafat-post-15.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7408497838386532353/",
  },
];

export default function ActualitesPage() {
  return (
    <>
      <PageHero
        title="Actualités"
        description="Suivez l'actualité du Groupe ETAFAT : projets phares, événements et temps forts, directement depuis notre page LinkedIn."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        variant="centered"
      />

      <section className="container-etafat py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.url} delay={(i % 3) * 100}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.title} — voir le post sur LinkedIn`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-[#e5e7eb]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#0a66c2] backdrop-blur">
                    <Icon icon="mdi:linkedin" width={14} height={14} />
                    LinkedIn
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-teal">
                    {post.date}
                  </p>
                  <h3 className="mb-2 text-lg font-semibold leading-tight text-navy transition-colors line-clamp-2 group-hover:text-[#00669d]">
                    {post.title}
                  </h3>
                  <p className="text-body line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#00669d]">
                    Voir sur LinkedIn
                    <Icon
                      icon="tabler:arrow-up-right"
                      width={15}
                      height={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <QuestionCTA />
    </>
  );
}
