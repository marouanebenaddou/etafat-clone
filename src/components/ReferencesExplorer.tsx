"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@iconify/react";

type Domain =
  | "Tous"
  | "Aménagement du territoire"
  | "Énergie & Mines"
  | "Bâtiment & Patrimoine"
  | "Infrastructures"
  | "Foncier"
  | "Agriculture & Eau";

type Reference = {
  title: string;
  domain: Exclude<Domain, "Tous">;
  location: string;
  year: string;
  client: string;
  description: string;
  image: string;
};

const REFERENCES: Reference[] = [
  // Foncier
  {
    title: "Immatriculation foncière de zones rurales",
    domain: "Foncier",
    location: "Régions de Fès-Meknès & Souss-Massa",
    year: "2023-2024",
    client: "ANCFCC",
    description:
      "Opérations d'immatriculation foncière sur plusieurs milliers d'hectares, incluant levés topographiques, enquêtes parcellaires et constitution des dossiers fonciers.",
    image: "/etafat/skills/cadastre-et-securisation-fonciere.jpg",
  },
  {
    title: "Sécurisation foncière de périmètres irrigués",
    domain: "Foncier",
    location: "Région du Gharb",
    year: "2022-2023",
    client: "Ministère de l'Agriculture",
    description:
      "Cartographie cadastrale, sécurisation foncière et accompagnement des ayants droit dans un périmètre d'irrigation de 12 000 hectares.",
    image: "/etafat/skills/assistance-fonciere.jpg",
  },
  {
    title: "Plans parcellaires d'emprises routières",
    domain: "Foncier",
    location: "Maroc",
    year: "2024",
    client: "ADM — Autoroutes du Maroc",
    description:
      "Établissement des plans parcellaires et constitution des dossiers d'expropriation pour le doublement de tronçons autoroutiers majeurs.",
    image: "/etafat/skills/topographie-et-geodesie.jpg",
  },
  {
    title: "Cadastre numérique communal",
    domain: "Foncier",
    location: "Sénégal",
    year: "2023",
    client: "Collectivités territoriales",
    description:
      "Création du cadastre numérique de plusieurs communes : levés topographiques, géoréférencement et constitution de la base parcellaire SIG.",
    image: "/etafat/skills/systemes-d-information-geographique.jpg",
  },

  // Aménagement du territoire
  {
    title: "Schéma directeur d'aménagement urbain",
    domain: "Aménagement du territoire",
    location: "Casablanca",
    year: "2023-2024",
    client: "Agence Urbaine",
    description:
      "Études territoriales, diagnostic urbain, modélisation cartographique et accompagnement à l'élaboration du schéma directeur d'aménagement.",
    image: "/etafat/skills/etudes-territoriales.jpg",
  },
  {
    title: "Cartographie de l'occupation des sols",
    domain: "Aménagement du territoire",
    location: "Région de Marrakech-Safi",
    year: "2024",
    client: "Conseil Régional",
    description:
      "Production cartographique multi-échelle et analyse SIG de l'occupation des sols pour orienter la planification territoriale régionale.",
    image: "/etafat/skills/cartographie.jpg",
  },
  {
    title: "Étude d'impact territorial — nouvelle zone industrielle",
    domain: "Aménagement du territoire",
    location: "Tanger-Tétouan-Al Hoceima",
    year: "2023",
    client: "Acteur public",
    description:
      "Diagnostic foncier, étude d'impact et appui à la maîtrise d'ouvrage pour l'implantation d'une nouvelle zone d'activités économiques.",
    image: "/etafat/skills/conseil-et-audit-geospatial.jpg",
  },

  // Infrastructures
  {
    title: "Topographie & relevés LGV",
    domain: "Infrastructures",
    location: "Maroc",
    year: "2023-2024",
    client: "Maître d'ouvrage ferroviaire",
    description:
      "Levés topographiques de précision et plans d'exécution pour un projet ferroviaire à grande vitesse, incluant ouvrages d'art et viaducs.",
    image: "/etafat/skills/topographie-et-geodesie.jpg",
  },
  {
    title: "Auscultation d'ouvrages d'art",
    domain: "Infrastructures",
    location: "Maroc",
    year: "2024",
    client: "Gestionnaires routiers",
    description:
      "Mise en place d'un dispositif d'auscultation topographique de ponts et viaducs avec suivi périodique de la stabilité des ouvrages.",
    image: "/etafat/skills/conseil-et-audit-geospatial.jpg",
  },
  {
    title: "Détection de réseaux enterrés",
    domain: "Infrastructures",
    location: "Plusieurs métropoles",
    year: "2023-2024",
    client: "Concessionnaires & collectivités",
    description:
      "Campagnes de détection multi-technologies (géoradar, électromagnétique) et cartographie des réseaux enterrés sur plusieurs centaines de kilomètres.",
    image: "/etafat/skills/releves-geospatiaux.jpg",
  },
  {
    title: "Modélisation BIM d'un échangeur autoroutier",
    domain: "Infrastructures",
    location: "Maroc",
    year: "2024",
    client: "Bureau d'études partenaire",
    description:
      "Production d'une maquette numérique BIM complète à partir de relevés scanner 3D, intégrée aux études d'exécution de l'échangeur.",
    image: "/etafat/skills/modelisation-3d-et-bim.jpg",
  },

  // Énergie & Mines
  {
    title: "Cartographie de site minier",
    domain: "Énergie & Mines",
    location: "Sud du Maroc",
    year: "2023",
    client: "Opérateur minier",
    description:
      "Production cartographique haute précision, modèles numériques de terrain et suivi topographique périodique d'exploitations à ciel ouvert.",
    image: "/etafat/skills/topographie-et-geodesie.jpg",
  },
  {
    title: "Études géospatiales — parc photovoltaïque",
    domain: "Énergie & Mines",
    location: "Région orientale",
    year: "2023-2024",
    client: "Développeur énergies renouvelables",
    description:
      "Études foncières, cartographie d'emprise, relevés topographiques et accompagnement géospatial pour un parc solaire de grande puissance.",
    image: "/etafat/skills/etudes-territoriales.jpg",
  },
  {
    title: "Relevés LiDAR aérien — corridor électrique",
    domain: "Énergie & Mines",
    location: "Maroc",
    year: "2024",
    client: "Gestionnaire de réseau",
    description:
      "Acquisition LiDAR aéroportée et production de modèles 3D pour l'analyse de gabarit et le dimensionnement d'une ligne haute tension.",
    image: "/etafat/skills/releves-geospatiaux.jpg",
  },

  // Bâtiment & Patrimoine
  {
    title: "Numérisation 3D de monument historique",
    domain: "Bâtiment & Patrimoine",
    location: "Médina de Fès",
    year: "2023",
    client: "Acteur du patrimoine",
    description:
      "Relevé scanner laser 3D haute densité, modélisation et plans architecturaux d'un édifice classé en vue de sa restauration.",
    image: "/etafat/skills/modelisation-3d-et-bim.jpg",
  },
  {
    title: "Inspection structurelle de bâtiments",
    domain: "Bâtiment & Patrimoine",
    location: "Casablanca",
    year: "2024",
    client: "Gestionnaire immobilier",
    description:
      "Inspection technique d'un parc immobilier, relevés 3D et préconisations de mise en conformité structurelle et sécuritaire.",
    image: "/etafat/skills/conseil-et-audit-geospatial.jpg",
  },
  {
    title: "Maquette BIM patrimoniale",
    domain: "Bâtiment & Patrimoine",
    location: "Maroc",
    year: "2023-2024",
    client: "Maître d'ouvrage public",
    description:
      "Production d'une maquette BIM patrimoniale exhaustive à partir de relevés scanner 3D pour la gestion long terme d'un ensemble bâti.",
    image: "/etafat/skills/modelisation-3d-et-bim.jpg",
  },

  // Agriculture & Eau
  {
    title: "Cartographie de périmètres irrigués",
    domain: "Agriculture & Eau",
    location: "Régions agricoles du Maroc",
    year: "2023-2024",
    client: "ORMVA",
    description:
      "Production cartographique, mises à jour SIG et suivi parcellaire de périmètres irrigués couvrant plusieurs dizaines de milliers d'hectares.",
    image: "/etafat/skills/cartographie.jpg",
  },
  {
    title: "Bathymétrie de retenues hydrauliques",
    domain: "Agriculture & Eau",
    location: "Maroc",
    year: "2023",
    client: "Agence de bassin hydraulique",
    description:
      "Levés bathymétriques de barrages et retenues, modèles numériques de fond et estimation des volumes utiles pour la gestion de la ressource.",
    image: "/etafat/skills/releves-geospatiaux.jpg",
  },
  {
    title: "Plateforme SIG de gestion agricole",
    domain: "Agriculture & Eau",
    location: "Côte d'Ivoire",
    year: "2024",
    client: "Coopérative agricole",
    description:
      "Déploiement d'une plateforme webSIG pour le suivi parcellaire, la cartographie des cultures et l'aide à la décision agricole.",
    image: "/etafat/skills/systemes-d-information-geographique.jpg",
  },
];

const DOMAINS: Domain[] = [
  "Tous",
  "Aménagement du territoire",
  "Énergie & Mines",
  "Bâtiment & Patrimoine",
  "Infrastructures",
  "Foncier",
  "Agriculture & Eau",
];

export function ReferencesExplorer() {
  const [active, setActive] = useState<Domain>("Tous");

  const filtered = useMemo(
    () => (active === "Tous" ? REFERENCES : REFERENCES.filter((r) => r.domain === active)),
    [active],
  );

  const stats = useMemo(() => {
    const total = REFERENCES.length;
    const byDomain: Record<string, number> = {};
    for (const r of REFERENCES) {
      byDomain[r.domain] = (byDomain[r.domain] || 0) + 1;
    }
    return { total, byDomain };
  }, []);

  return (
    <section className="bg-[#f5f7f9] py-16 md:py-20">
      <div className="container-etafat">
        {/* Stats summary */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-md p-5 text-center">
              <p
                className="text-teal text-3xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-figtree)" }}
              >
                {stats.total}+
              </p>
              <p className="text-body text-xs leading-snug">Projets référencés</p>
            </div>
            <div className="bg-white rounded-md p-5 text-center">
              <p
                className="text-teal text-3xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-figtree)" }}
              >
                6
              </p>
              <p className="text-body text-xs leading-snug">Domaines d&apos;activité</p>
            </div>
            <div className="bg-white rounded-md p-5 text-center">
              <p
                className="text-teal text-3xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-figtree)" }}
              >
                3
              </p>
              <p className="text-body text-xs leading-snug">Pays d&apos;intervention</p>
            </div>
            <div className="bg-white rounded-md p-5 text-center">
              <p
                className="text-teal text-3xl font-semibold mb-1"
                style={{ fontFamily: "var(--font-figtree)" }}
              >
                42
              </p>
              <p className="text-body text-xs leading-snug">Années d&apos;expérience</p>
            </div>
          </div>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={100}>
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {DOMAINS.map((d) => {
              const count =
                d === "Tous" ? stats.total : stats.byDomain[d] || 0;
              const isActive = d === active;
              return (
                <button
                  key={d}
                  onClick={() => setActive(d)}
                  className={`pill text-xs uppercase transition-colors ${
                    isActive
                      ? "pill-teal"
                      : "border-2 border-[#e5e7eb] bg-white text-[#313c4e] hover:border-[#00669d] hover:text-[#00669d]"
                  }`}
                >
                  <span>{d}</span>
                  <span
                    className={`ml-2 text-[10px] ${
                      isActive ? "text-white/80" : "text-body/60"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <Reveal key={`${r.domain}-${r.title}`} delay={(i % 6) * 60}>
              <article className="bg-white rounded-md overflow-hidden border border-[#e5e7eb] h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 pill pill-teal !py-1 !px-3 !text-[10px] uppercase">
                    {r.domain}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-navy text-lg font-semibold mb-3 leading-tight">
                    {r.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed mb-5 flex-1">
                    {r.description}
                  </p>
                  <div className="space-y-1.5 pt-4 border-t border-[#e5e7eb] text-xs text-body">
                    <p className="flex items-start gap-2">
                      <Icon icon="tabler:map-pin" width={14} height={14} className="text-[#00669d] mt-0.5 shrink-0" />
                      <span>{r.location}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Icon icon="tabler:calendar-event" width={14} height={14} className="text-[#00669d] mt-0.5 shrink-0" />
                      <span>{r.year}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Icon icon="tabler:building" width={14} height={14} className="text-[#00669d] mt-0.5 shrink-0" />
                      <span>{r.client}</span>
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-body text-center py-12">
            Aucune référence dans ce domaine pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
