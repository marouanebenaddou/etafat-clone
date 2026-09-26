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
//
// ─── HOW TO ADD A NEW POST ────────────────────────────────────────────────
// Easiest — one command (optimises the image + inserts the entry for you):
//   node scripts/add-actualite.mjs \
//     --image ~/Downloads/mon-post.jpg \
//     --url "https://www.linkedin.com/feed/update/urn:li:activity:XXXX" \
//     --title "Titre du post" \
//     --category Projet \                 // Divers | Engagements | Groupe | Presse | Projet
//     --date "5 septembre 2026" \
//     --excerpt "Une ou deux phrases de résumé."
//
// Or by hand: drop a square-ish image in /public/etafat/actualites/ and paste a
// new object at the TOP of the array below (most-recent first):
//   {
//     title: "…",
//     date: "5 septembre 2026",
//     category: "Projet",
//     excerpt: "…",
//     image: "/etafat/actualites/etafat-post-16.jpg",
//     url: "https://www.linkedin.com/feed/update/urn:li:activity:XXXX",
//   },
// ──────────────────────────────────────────────────────────────────────────
export const linkedinPosts: LinkedInPost[] = [
  {
    title: "#OpenDays2026 — Le foncier rural au service de l'investissement",
    date: "22 septembre 2026",
    category: "Projet",
    excerpt: "Le foncier rural au service de l'investissement, de l'emploi et du développement, à l'occasion des OpenDays 2026 en Côte d'Ivoire.",
    image: "/etafat/actualites/etafat-post-16.jpg",
    url: "https://www.linkedin.com/company/etafat/posts/",
  },
  {
    title: "JFA 2026 — Le futur du foncier se dessine à Abidjan",
    date: "17 septembre 2026",
    category: "Groupe",
    excerpt:
      "ETAFAT aux Journées du Foncier d'Abidjan : échanges et innovations au service de la sécurisation foncière en Afrique.",
    image: "/etafat/actualites/etafat-post-18.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7506259278568030208/",
  },
  {
    title: "Journées du Foncier 2026 — On vous y attend",
    date: "12 septembre 2026",
    category: "Groupe",
    excerpt:
      "Rendez-vous aux Journées du Foncier d'Abidjan : ETAFAT et l'AFOR vous donnent rendez-vous autour du foncier ivoirien.",
    image: "/etafat/actualites/etafat-post-19.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7504478367870545921/",
  },
  {
    title: "ETAFAT au service de la transformation des territoires africains",
    date: "8 septembre 2026",
    category: "Groupe",
    excerpt:
      "De la donnée géospatiale à la décision : ETAFAT accompagne la transformation durable des territoires à travers l'Afrique.",
    image: "/etafat/actualites/etafat-post-20.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7502999312335818752/",
  },
  {
    title: "PRESFOR — Sécurisation foncière rurale en Côte d'Ivoire",
    date: "24 août 2026",
    category: "Projet",
    excerpt:
      "Dans le cadre du PRESFOR, le Groupement ETAFAT/CGEA2TF (GEC) a délimité et levé les parcelles agricoles de Monsieur le Ministre d'État — un signal fort pour la sécurisation du foncier rural dans le Gontougo.",
    image: "/etafat/actualites/etafat-post-17.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7497675055066353664/",
  },
  {
    title: "Fête de la Jeunesse",
    date: "21 août 2026",
    category: "Engagements",
    excerpt:
      "À l'occasion de la Fête de la Jeunesse et du 63e anniversaire de Sa Majesté le Roi Mohammed VI, ETAFAT célèbre la jeunesse marocaine, force vive du Royaume.",
    image: "/etafat/actualites/etafat-post-21.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7496597918167097344/",
  },
  {
    title: "Anniversaire de la Révolution du Roi et du Peuple",
    date: "20 août 2026",
    category: "Divers",
    excerpt:
      "En ce 20 août, ETAFAT commémore le 73e anniversaire de la Révolution du Roi et du Peuple, symbole d'unité et d'engagement national.",
    image: "/etafat/actualites/etafat-post-22.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7496163603448938498/",
  },
  {
    title: "66 ans d'indépendance de la Côte d'Ivoire",
    date: "7 août 2026",
    category: "Divers",
    excerpt:
      "ETAFAT célèbre les 66 ans d'indépendance de la Côte d'Ivoire, terre d'engagement et de projets au service du développement.",
    image: "/etafat/actualites/etafat-post-23.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7491576065224732672/",
  },
  {
    title: "Des images aériennes aux données géospatiales",
    date: "7 août 2026",
    category: "Projet",
    excerpt:
      "Transformer des images aériennes en données géospatiales fiables : au cœur du savoir-faire d'ETAFAT pour éclairer la décision.",
    image: "/etafat/actualites/etafat-post-24.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7491410317902602242/",
  },
  {
    title: "Fête du Trône",
    date: "30 juillet 2026",
    category: "Divers",
    excerpt:
      "À l'occasion de la Fête du Trône, ETAFAT renouvelle son attachement aux valeurs de progrès et de développement du Royaume.",
    image: "/etafat/actualites/etafat-post-25.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7488511219914448897/",
  },
  {
    title: "Accompagner le développement urbain par la donnée géospatiale",
    date: "27 juillet 2026",
    category: "Projet",
    excerpt:
      "De l'imagerie satellite à l'analyse territoriale, ETAFAT accompagne un développement urbain maîtrisé et durable.",
    image: "/etafat/actualites/etafat-post-26.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7487424057219493888/",
  },
  {
    title: "Au service du développement durable des chaînes de valeur",
    date: "24 juin 2026",
    category: "Projet",
    excerpt:
      "Fiers d'accompagner le développement durable des chaînes de valeur agricoles et territoriales par la donnée géospatiale.",
    image: "/etafat/actualites/etafat-post-27.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7475460569274224640/",
  },
  {
    title: "Une nation derrière ses couleurs",
    date: "13 juin 2026",
    category: "Divers",
    excerpt:
      "Plus qu'un match : ETAFAT partage la fierté d'une nation rassemblée derrière ses couleurs.",
    image: "/etafat/actualites/etafat-post-28.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7471497219112689664/",
  },
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
