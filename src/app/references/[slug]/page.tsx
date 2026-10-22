import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { QuestionCTA } from "@/components/QuestionCTA";
import { Reveal } from "@/components/Reveal";
import { ProjetGallery } from "@/components/ProjetGallery";
import { SITE_PROJETS, projetBySlug, projetsForDomain } from "@/data/projets-site";

// One page per projet phare (the borne's projects, src/data/evenement.ts via src/data/projets-site.ts).
export function generateStaticParams() {
  return SITE_PROJETS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projetBySlug(slug);
  return {
    title: p ? `${p.title} - ETAFAT` : "ETAFAT",
    description: p?.description,
    openGraph: p?.photo ? { images: [p.photo] } : undefined,
  };
}

export default async function ProjetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projetBySlug(slug);
  if (!p) notFound();
  const gallery = [...p.images, ...(p.media?.plans ?? [])];
  const videos = p.media?.videos ?? [];
  const others = projetsForDomain(p.domain).filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      {/* HERO — same look as the Références page */}
      <section className="relative overflow-hidden bg-[#0a1e30]">
        {p.photo && <Image src={p.photo} alt="" fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e30] via-[#0a1e30]/88 to-[#0a1e30]/25" />
        <div className="container-etafat relative pt-[148px] pb-14 md:pb-20">
          <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2">›</span>
            <Link href="/references/" className="hover:text-white">Références</Link>
            <span className="mx-2">›</span>
            <Link href={`/references/?domaine=${p.domain}`} className="hover:text-white">{p.domainLabel}</Link>
          </nav>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3ea7e0]">
            {p.domainLabel} · {p.countryName}
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-[1.1] md:text-5xl" style={{ color: "#fff" }}>
            {p.title}
          </h1>
        </div>
      </section>

      {/* PROJECT */}
      <section className="bg-white py-14 md:py-20">
        <div className="container-etafat grid gap-10 lg:grid-cols-3 lg:gap-14">
          <Reveal className="lg:col-span-2">
            <h2 className="mb-5 text-2xl font-semibold leading-tight text-navy md:text-3xl">Le projet</h2>
            <p className="text-lg leading-relaxed text-body">{p.description}</p>
            {p.subThemes.length > 0 && (
              <>
                <h3 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wider text-teal">Expertises mobilisées</h3>
                <ul className="flex flex-wrap gap-2">
                  {p.subThemes.map((s) => (
                    <li key={s} className="rounded-full bg-[#eef3f8] px-4 py-2 text-sm font-medium text-navy">{s}</li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>
          <Reveal delay={120}>
            <dl className="space-y-5 rounded-md bg-[#f5f7f9] p-7">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-teal">Pays</dt>
                <dd className="mt-1 text-lg font-semibold text-navy">{p.countryName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-teal">Domaine</dt>
                <dd className="mt-1 text-lg font-semibold text-navy">
                  <Link href={`/domaines-activite/${p.domain}/`} className="hover:text-[#00669d]">{p.domainLabel}</Link>
                </dd>
              </div>
              <div className="border-t border-[#dfe5ec] pt-5">
                <p className="mb-4 text-sm leading-relaxed text-body">Un projet similaire ? Nos équipes vous répondent.</p>
                <Link href="/contact/" className="pill pill-teal">Nous contacter</Link>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="bg-white pb-14 md:pb-20">
          <div className="container-etafat">
            <h2 className="mb-6 text-2xl font-semibold leading-tight text-navy md:text-3xl">En images</h2>
            <ProjetGallery images={gallery} title={p.title} />
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section className="bg-white pb-14 md:pb-20">
          <div className="container-etafat grid gap-6 md:grid-cols-2">
            {videos.map((v) => (
              <video key={v} src={v} controls preload="metadata" poster={p.photo ?? undefined} className="w-full rounded-md bg-black" />
            ))}
          </div>
        </section>
      )}

      {/* OTHER PROJECTS IN THE DOMAIN */}
      {others.length > 0 && (
        <section className="bg-[#f5f7f9] py-14 md:py-20">
          <div className="container-etafat">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold leading-tight text-navy md:text-3xl">Autres projets — {p.domainLabel}</h2>
              <Link href={`/references/?domaine=${p.domain}`} className="pill pill-outline-teal">Toutes les références</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {others.map((o) => (
                <Link key={o.slug} href={o.href} className="group overflow-hidden rounded-md border border-[#e5e7eb] bg-white transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#eef3f8]">
                    {o.photo && <Image src={o.photo} alt={o.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal">{o.countryName}</p>
                    <h3 className="text-base font-semibold leading-snug text-navy group-hover:text-[#00669d]">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuestionCTA />
    </>
  );
}
