"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { PresenceGlobe, type GlobeOverlay } from "@/components/PresenceGlobe";
import { PRESENCE_COUNT, PRESENCE_PROJECT_COUNT, type PresenceCountry } from "@/data/presence";
import { projetsForCountry } from "@/data/projets-site";
import { AAGP_COUNTRIES, AAGP_ROUTE, AAGP_FOCUS } from "@/data/aagp";

// AAGP (Gazoduc Afrique Atlantique) layer: the countries it crosses in green, its route dashed on top
const AAGP_OVERLAY: GlobeOverlay = {
  isos: AAGP_COUNTRIES.map((c) => c.iso),
  route: AAGP_ROUTE,
  fill: "#2e9b4f",
  stroke: "#145c2c",
  line: "#d9480f",
  focus: AAGP_FOCUS,
};

/**
 * "Notre présence" — the interactive globe (same data as the borne's): touch a country to see ETAFAT's projects
 * there (projets phares link to their page), plus the Gazoduc Afrique Atlantique layer. Used on the home page and
 * on Identité.
 */
export function PresenceExplorer({ kicker = "Notre présence" }: { kicker?: string }) {
  const [sel, setSel] = useState<PresenceCountry | null>(null);
  const [aagp, setAagp] = useState(false);
  const phares = useMemo(() => (sel ? projetsForCountry(sel.iso) : []), [sel]);

  return (
    <section className="relative overflow-hidden bg-[#0a1e30] py-20 text-white md:py-28">
      <div className="container-etafat grid items-center gap-10 lg:grid-cols-5 lg:gap-12">
        {/* text + country panel */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-[#3ea7e0]">{kicker}</span>
          <h2 className="mb-5 leading-tight" style={{ color: "#fff" }}>
            {PRESENCE_COUNT} pays, 4 continents
          </h2>
          <p className="mb-6 leading-relaxed text-white/80">
            Du Maroc à l&apos;Afrique de l&apos;Ouest et centrale, jusqu&apos;en Europe, au Moyen-Orient, en Asie et en
            Amérique latine : {PRESENCE_PROJECT_COUNT} références à ce jour. Touchez un pays sur le globe pour découvrir
            nos projets.
          </p>
          <button
            type="button"
            onClick={() => setAagp((v) => !v)}
            aria-pressed={aagp}
            className={`mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              aagp ? "border-transparent bg-[#2e9b4f] text-white" : "border-white/30 text-white hover:border-[#2e9b4f]"
            }`}
          >
            <Icon icon="ph:pipe-duotone" width={20} height={20} />
            Gazoduc Afrique Atlantique
          </button>

          {aagp && (
            <div className="mb-6 rounded-md border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Gazoduc Afrique Atlantique (AAGP)</p>
              <p className="mt-1 text-sm text-white/70">Nigéria → Maroc · {AAGP_COUNTRIES.length} pays traversés</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {AAGP_COUNTRIES.map((c) => (
                  <span key={c.iso} className="rounded-full bg-[#2e9b4f]/25 px-2.5 py-0.5 text-xs font-medium text-[#bff0cc]">{c.fr}</span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/70">
                <span className="flex items-center gap-2"><span className="h-3 w-5 rounded-sm bg-[#2e9b4f]" />Pays traversés</span>
                <span className="flex items-center gap-2"><span className="w-5 border-t-[3px] border-dashed border-[#d9480f]" />Tracé du gazoduc (en projet)</span>
              </div>
            </div>
          )}

          {sel ? (
            <div className="overflow-hidden rounded-md bg-white text-navy shadow-xl">
              <div className="relative aspect-[3/1] bg-[#0d3350]">
                <Image src={`/etafat/presence/banners/${sel.iso}.jpg`} alt="" fill sizes="480px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081726]/85 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#bff6f4]">
                    {sel.region}
                    {sel.projects.length > 0 && ` · ${sel.projects.length} référence${sel.projects.length > 1 ? "s" : ""}`}
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight" style={{ color: "#fff" }}>{sel.name}</h3>
                </div>
                <button type="button" onClick={() => setSel(null)} aria-label="Fermer" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white hover:bg-black/55">
                  <Icon icon="ph:x-bold" width={14} height={14} />
                </button>
              </div>
              <div className="max-h-[340px] overflow-y-auto overscroll-contain p-5">
                {phares.length > 0 && (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal">Projets phares</p>
                    <ul className="mb-5 space-y-1.5">
                      {phares.map((p) => (
                        <li key={p.slug}>
                          <Link href={p.href} className="group flex items-start gap-2 rounded-md bg-[#eef3f8] px-3 py-2 text-sm font-medium leading-snug hover:bg-[#e1ecf6]">
                            <span className="flex-1">{p.title}</span>
                            <Icon icon="ph:arrow-right-bold" width={14} height={14} className="mt-1 shrink-0 text-[#00669d] transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {sel.projects.length > 0 ? (
                  <>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal">Nos références dans ce pays</p>
                    <ul className="space-y-1 text-sm leading-snug text-body">
                      {sel.projects.map((p, i) => (
                        <li key={i} className="border-b border-[#eef1f4] py-1.5 last:border-0">
                          {p.title}
                          {p.place && <span className="text-[#8a96a3]"> — {p.place}</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  phares.length === 0 && <p className="text-sm text-body">ETAFAT est intervenu dans ce pays ; la liste des projets sera bientôt disponible.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-white/60">
              <Icon icon="ph:hand-tap-duotone" width={20} height={20} />
              Touchez un pays en bleu pour voir nos projets.
            </p>
          )}
        </div>

        {/* globe */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          {/* zoomed in on the AAGP the sphere is larger than the box: keep it round */}
          <div className={`relative mx-auto aspect-square w-full max-w-[680px] ${aagp ? "overflow-hidden rounded-full" : ""}`}>
            <PresenceGlobe
              className="absolute inset-0"
              onSelect={setSel}
              overlay={aagp ? AAGP_OVERLAY : null}
              colors={{ glow: "rgba(62,167,224,0.35)" }}
              embedded
            />
          </div>
        </div>
      </div>
    </section>
  );
}
