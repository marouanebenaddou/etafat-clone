import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/icons";
import { Icon } from "@iconify/react";

export type SfAtout = { title: string; text: string };
export type SfReference = {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
};
export type SavoirFaireDetailData = {
  slug: string;
  title: string;
  heroDesc: string;
  competences: string[];
  atouts: SfAtout[];
  references: SfReference[];
  referencesIntro?: string;
  cta: { question: string; text: string };
};

const ATOUT_ICONS = [
  "ph:medal-duotone",
  "ph:puzzle-piece-duotone",
  "ph:file-text-duotone",
  "ph:target-duotone",
];

export function SavoirFaireDetail({
  data,
  heroImage,
}: {
  data: SavoirFaireDetailData;
  heroImage: string;
}) {
  return (
    <>
      <PageHero
        title={data.title.toUpperCase()}
        description={data.heroDesc}
        image={heroImage}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Savoir-faire", href: "/savoir-faire/" },
          { label: data.title },
        ]}
        variant="banner"
      />

      {/* Compétences métier */}
      {data.competences.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-etafat">
            <Reveal>
              <h2 className="mb-3 text-center text-navy">Compétences métier</h2>
              <div className="mx-auto mb-12 h-0.5 w-12 bg-[#00669d]" />
            </Reveal>
            <ul className="mx-auto grid max-w-5xl gap-x-12 gap-y-4 md:grid-cols-2">
              {data.competences.map((c, i) => (
                <Reveal key={i} delay={(i % 8) * 40} as="li">
                  <span className="flex items-start gap-3 leading-relaxed text-body">
                    <span className="mt-0.5 shrink-0 text-teal">
                      <CheckCircleIcon width={20} height={20} />
                    </span>
                    <span>{c}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Nos atouts */}
      {data.atouts.length > 0 && (
        <section className="bg-[#f5f7f9] py-16 md:py-20">
          <div className="container-etafat">
            <Reveal>
              <h2 className="mb-3 text-center text-navy">Nos atouts</h2>
              <div className="mx-auto mb-12 h-0.5 w-12 bg-[#00669d]" />
            </Reveal>
            <div
              className={
                data.atouts.length === 5
                  ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
                  : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              }
            >
              {data.atouts.map((a, i) => (
                <Reveal key={a.title} delay={i * 80}>
                  <div className="group h-full rounded-md border border-[#e5e7eb] bg-white p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e0eef6] to-[#cfe3f0] transition-transform duration-300 group-hover:scale-110">
                      <Icon
                        icon={ATOUT_ICONS[i % ATOUT_ICONS.length]}
                        width={34}
                        height={34}
                        className="text-[#00669d]"
                      />
                    </div>
                    <h3 className="mb-3 text-base font-semibold leading-tight text-navy">
                      {a.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-body">{a.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nos références */}
      {(data.references.length > 0 || data.referencesIntro) && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-etafat">
            <Reveal>
              <h2 className="mb-3 text-center text-navy">Nos références</h2>
              <div className="mx-auto mb-12 h-0.5 w-12 bg-[#00669d]" />
            </Reveal>
            {data.references.length === 0 ? (
              <Reveal>
                <div className="mx-auto max-w-3xl text-center">
                  <p className="mb-8 leading-relaxed text-body">
                    {data.referencesIntro}
                  </p>
                  <Link href="/references/" className="pill pill-outline-teal">
                    Découvrir nos références
                    <ArrowRightIcon width={12} height={12} />
                  </Link>
                </div>
              </Reveal>
            ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {data.references.map((r, i) => (
                <Reveal key={r.title} delay={i * 100}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white transition-shadow hover:shadow-lg">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e5e7eb]">
                      <Image
                        src={r.image ?? heroImage}
                        alt={r.title}
                        fill
                        sizes="(min-width:768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-1.5 text-lg font-semibold leading-tight text-navy">
                        {r.title}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-teal">
                        {r.subtitle}
                      </p>
                      <p className="mb-5 flex-1 text-sm leading-relaxed text-body">
                        {r.description}
                      </p>
                      <Link
                        href="/references/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00669d]"
                      >
                        Voir le projet
                        <ArrowRightIcon width={13} height={13} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#00669d] py-16 text-white">
        <div className="container-etafat flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2
              className="mb-2 text-2xl font-semibold leading-tight md:text-3xl"
              style={{ color: "#fff" }}
            >
              {data.cta.question}
            </h2>
            <p className="text-white/90">{data.cta.text}</p>
          </div>
          <Link
            href="/contact/"
            className="pill shrink-0 border-2 border-white text-white transition-colors hover:bg-white hover:text-[#00669d]"
          >
            Contactez-nous
            <ArrowRightIcon width={12} height={12} />
          </Link>
        </div>
      </section>
    </>
  );
}
