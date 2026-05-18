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

/** Photo to display on a savoir-faire detail page hero. */
export function skillImage(slug: string): string {
  return `/etafat/skills/${slug}.jpg`;
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
