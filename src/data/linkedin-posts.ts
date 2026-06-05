export type LinkedInCategory =
  | "Divers"
  | "Engagements"
  | "Groupe"
  | "Presse"
  | "Projet";

export type LinkedInPost = {
  title: string;
  date: string;
  category: LinkedInCategory;
  excerpt: string;
  image: string;
  url: string;
};

// Latest posts pulled from the ETAFAT LinkedIn page
// (https://www.linkedin.com/company/5160946). Images are stored locally in
// /public/etafat/actualites. Ordered most-recent first.
export const linkedinPosts: LinkedInPost[] = [
  {
    title: "Aïd Al-Adha Moubarak",
    date: "27 mai 2026",
    category: "Divers",
    excerpt:
      "ETAFAT vous souhaite Aïd Moubarak Saïd et meilleurs vœux à vous et à votre famille à l'occasion de l'Aïd Al-Adha.",
    image: "/etafat/actualites/etafat-post-01.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7465300947804610561/",
  },
  {
    title: "Fête du Travail",
    date: "1 mai 2026",
    category: "Engagements",
    excerpt:
      "Nous célébrons celles et ceux qui, par leur engagement et leur savoir-faire, contribuent chaque jour à bâtir un avenir meilleur.",
    image: "/etafat/actualites/etafat-post-02.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7455902195071315968/",
  },
  {
    title: "Rétrospective 2025, cap sur 2026",
    date: "16 avril 2026",
    category: "Groupe",
    excerpt:
      "Des projets concrétisés, des collaborations solides et une progression continue. Le meilleur ne s'attend pas, il se construit.",
    image: "/etafat/actualites/etafat-post-03.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7450445511595081728/",
  },
  {
    title: "Aïd el Fitr Moubarak",
    date: "20 mars 2026",
    category: "Divers",
    excerpt:
      "ETAFAT vous présente ses meilleurs vœux à l'occasion de l'Aïd el Fitr.",
    image: "/etafat/actualites/etafat-post-04.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7440683514863214592/",
  },
  {
    title: "PRESFOR Bafing : premier Certificat Foncier",
    date: "11 mars 2026",
    category: "Projet",
    excerpt:
      "Le premier Certificat Foncier signé dans le cadre du PRESFOR en Côte d'Ivoire, à l'actif de l'opérateur foncier GEC ETAFAT – CGEA2TF.",
    image: "/etafat/actualites/etafat-post-05.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7437432636152889344/",
  },
  {
    title: "Journée des Droits des Femmes",
    date: "8 mars 2026",
    category: "Engagements",
    excerpt:
      "Chez ETAFAT, nous célébrons les femmes qui innovent, inspirent et participent chaque jour à construire l'avenir.",
    image: "/etafat/actualites/etafat-post-06.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7436359588037275648/",
  },
  {
    title: "R&D : projet SmartDrone4PV",
    date: "25 février 2026",
    category: "Projet",
    excerpt:
      "Une R&D appliquée à impact concret : intégrer l'intelligence artificielle et les drones au service du terrain.",
    image: "/etafat/actualites/etafat-post-07.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7432447669094068224/",
  },
  {
    title: "SIG pour la Direction du Génie Rural",
    date: "19 février 2026",
    category: "Projet",
    excerpt:
      "Mise en place d'un Système d'Information Géographique pour la Direction Nationale du Génie Rural et formation de ses cadres.",
    image: "/etafat/actualites/etafat-post-08.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7430236962013425664/",
  },
  {
    title: "Ramadan Karim",
    date: "18 février 2026",
    category: "Divers",
    excerpt:
      "ETAFAT vous présente ses meilleurs vœux à l'occasion du mois sacré de Ramadan.",
    image: "/etafat/actualites/etafat-post-09.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7429998850158977024/",
  },
  {
    title: "Réunion AFOR – Banque Mondiale",
    date: "3 février 2026",
    category: "Projet",
    excerpt:
      "Réunion de travail à l'AFOR sur l'avancement des activités de sécurisation foncière menées par ETAFAT dans le cadre du PRESFOR.",
    image: "/etafat/actualites/etafat-post-10.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7424470244875866112/",
  },
  {
    title: "CAN 2025 : direction la finale",
    date: "15 janvier 2026",
    category: "Divers",
    excerpt:
      "Félicitations aux Lions de l'Atlas pour leur superbe qualification en finale de la CAN 2025.",
    image: "/etafat/actualites/etafat-post-11.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7417477563658174465/",
  },
  {
    title: "Yennayer 2976",
    date: "13 janvier 2026",
    category: "Divers",
    excerpt:
      "ETAFAT célèbre l'identité amazigh, symbole de résilience, d'enracinement et de renouveau. Bonne année amazighe.",
    image: "/etafat/actualites/etafat-post-12.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7416902299597385732/",
  },
  {
    title: "CAN 2025 : qualification en demi-finale",
    date: "9 janvier 2026",
    category: "Divers",
    excerpt:
      "Félicitations aux Lions de l'Atlas pour leur superbe qualification en demi-finale de la CAN 2025.",
    image: "/etafat/actualites/etafat-post-13.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7415515116470988801/",
  },
  {
    title: "Meilleurs vœux 2026",
    date: "31 décembre 2025",
    category: "Groupe",
    excerpt:
      "À l'aube de 2026, un nouveau cycle commence : faire mieux, voir plus loin et donner davantage de sens à ce que nous construisons.",
    image: "/etafat/actualites/etafat-post-14.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7412166265575780352/",
  },
  {
    title: "Ouverture de la CAN 2025",
    date: "21 décembre 2025",
    category: "Divers",
    excerpt:
      "Le Maroc au sommet du football africain : coup d'envoi de la CAN 2025, le Royaume vibre au rythme de la fête continentale.",
    image: "/etafat/actualites/etafat-post-15.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7408497838386532353/",
  },
];
