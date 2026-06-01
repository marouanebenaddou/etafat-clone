import data from "@/data/etafat-content.json";

export type EtafatSkill = {
  index: number;
  title: string;
  slug: string;
  short: string;
  detail: string;
  competences: string[];
};

export type EtafatDomainCard = {
  index: number;
  name: string;
  short: string;
  competences: string[];
};

export type EtafatDomain = {
  title: string;
  slug: string;
  accroche?: string;
  intro: string[];
  // Aménagement uses the 10 universal skills, others embed cards inline
  skillSlugs?: string[];
  cards?: EtafatDomainCard[];
};

export const domains = data.domains as EtafatDomain[];
export const skills = data.skills as EtafatSkill[];

export function domainBySlug(slug: string): EtafatDomain | undefined {
  return domains.find((d) => d.slug === slug);
}

export function skillBySlug(slug: string): EtafatSkill | undefined {
  return skills.find((s) => s.slug === slug);
}

/**
 * Photo to display on a savoir-faire detail page hero.
 * The 10 original skills have a matching JPG; the 12 newer skills
 * (added from the docx content) borrow a thematically related image.
 */
const SKILL_IMAGE_FALLBACKS: Record<string, string> = {
  "plans-parcellaires-et-emprises": "cadastre-et-securisation-fonciere",
  "cartographie-fonciere": "cartographie",
  "sig-foncier-et-bases-cadastrales": "systemes-d-information-geographique",
  "releves-aeriens-et-lidar": "releves-geospatiaux",
  "scanner-laser-3d-et-mms": "modelisation-3d-et-bim",
  "bathymetrie-et-hydrographie": "releves-geospatiaux",
  "georadar-et-detection-de-reseaux": "releves-geospatiaux",
  "webmapping-et-plateformes-geospatiales": "systemes-d-information-geographique",
  "dematerialisation-et-structuration-de-donnees": "systemes-d-information-geographique",
  "assistance-a-maitrise-d-ouvrage": "conseil-et-audit-geospatial",
  "inspection-et-surveillance-d-ouvrage": "conseil-et-audit-geospatial",
  "formation-et-transfert-de-competences": "etudes-territoriales",
};
export function skillImage(slug: string): string {
  const resolved = SKILL_IMAGE_FALLBACKS[slug] ?? slug;
  return `/etafat/skills/${resolved}.jpg`;
}

/** Hero video for a domain detail page. */
export function domainVideo(slug: string): string {
  return `/etafat/domains/${slug}.mp4`;
}

/** Get the savoir-faire cards to display for a given domain. */
export function cardsForDomain(domain: EtafatDomain): EtafatDomainCard[] {
  if (domain.cards && domain.cards.length) return domain.cards;
  if (domain.skillSlugs) {
    return domain.skillSlugs
      .map((slug, i) => {
        const s = skillBySlug(slug);
        if (!s) return null;
        return {
          index: i + 1,
          name: s.title,
          short: s.short,
          competences: s.competences,
        };
      })
      .filter(Boolean) as EtafatDomainCard[];
  }
  return [];
}
