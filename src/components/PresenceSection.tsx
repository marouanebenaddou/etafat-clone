"use client";

import { useState } from "react";
import { PresenceGlobe } from "./PresenceGlobe";
import { Reveal } from "./Reveal";
import {
  PRESENCE_COUNT,
  PRESENCE_PROJECT_COUNT,
  type PresenceCountry,
} from "@/data/presence";

// Dark "Notre présence" section for the website — the interactive globe plus a
// panel that reveals a country's projects on hover / click.
export function PresenceSection() {
  const [sel, setSel] = useState<PresenceCountry | null>(null);
  return (
    <section className="overflow-hidden bg-[#0a1e30] py-20 text-white md:py-28">
      <div className="container-etafat">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#7ab3d9]">
            Notre présence
          </p>
          <h2 className="mb-4 leading-tight" style={{ color: "#fff" }}>
            Une expertise déployée sur 4 continents
          </h2>
          <p className="max-w-2xl leading-relaxed text-white/70">
            De l&apos;Afrique à l&apos;Amérique latine, ETAFAT accompagne les territoires
            dans {PRESENCE_COUNT} pays. Explorez le globe — survolez ou cliquez un pays
            pour découvrir nos projets.
          </p>
        </Reveal>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <Reveal variant="zoom-out">
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              <PresenceGlobe
                onSelect={setSel}
                colors={{
                  glow: "rgba(42,181,180,0.28)",
                  ocean1: "#103150",
                  ocean2: "#0a1e30",
                  land: "#1e3d58",
                  landStroke: "#0a1e30",
                  active: "#2ab5b4",
                  activeStroke: "#0a1e30",
                  hover: "#8ee6e4",
                  marker: "#8ee6e4",
                  graticule: "rgba(255,255,255,0.06)",
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            {sel ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#7ab3d9]">{sel.region}</p>
                <h3 className="mb-4 mt-1 text-2xl font-semibold md:text-3xl" style={{ color: "#fff" }}>{sel.name}</h3>
                {sel.projects.length ? (
                  <ul className="space-y-2">
                    {sel.projects.map((p, i) => (
                      <li key={i} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm leading-snug text-white/90">
                        {p.title}
                        {p.place && <span className="text-white/45"> — {p.place}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-white/60">Présence ETAFAT — projets en cours de référencement.</p>
                )}
                <button
                  type="button"
                  onClick={() => setSel(null)}
                  className="mt-5 text-sm font-medium text-[#7ab3d9] hover:text-white"
                >
                  ← Retour à la vue d&apos;ensemble
                </button>
              </div>
            ) : (
              <div>
                <p className="text-5xl font-semibold leading-none text-white" style={{ fontFamily: "var(--font-figtree)" }}>{PRESENCE_COUNT}</p>
                <p className="mt-2 text-lg text-white/80">pays d&apos;intervention</p>
                <p className="mt-1 text-sm text-white/50">{PRESENCE_PROJECT_COUNT}+ projets référencés · Afrique, Europe, Moyen-Orient, Amérique latine</p>
                <p className="mt-6 max-w-sm text-sm text-white/50">
                  Les pays en surbrillance sur le globe sont ceux où ETAFAT a réalisé des missions. Survolez-en un — ou cliquez — pour voir le détail.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
