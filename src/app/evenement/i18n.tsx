"use client";

// Borne language (FR / EN): the interface strings, the English overlay of the content (themes, projects,
// apps, countries, key figures — src/data/evenement-en.ts) and the FR | EN switch. The choice is kept on
// the device (localStorage) so the borne stays in the language the stand left it in.
import React, { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { EvenementProjet, EvenementTheme } from "@/data/evenement";
import type { BorneApp } from "@/data/evenement-apps";
import type { PresenceCountry } from "@/data/presence";
import { PROCASEF, PAMOFOR } from "@/data/evenement-chiffres";
import { THEMES_EN, PROJETS_EN, APPS_EN, PRESENCE_EN, REGIONS_EN, chiffresEn } from "@/data/evenement-en";

export type Lang = "fr" | "en";
const KEY = "etafat-borne-lang";

const FR = {
  kicker: "Projets phares",
  introTitle: ["Révélons le potentiel", "de vos territoires"],
  introText: "Une sélection de nos réalisations géospatiales à travers l’Afrique et le monde, par thématique.",
  tapToStart: "Toucher pour commencer",
  back: "Retour",
  close: "Fermer",
  prev: "Précédent",
  next: "Suivant",
  themesSub: "Nos réalisations",
  themesLabel: "Choisissez une thématique",
  presenceKicker: "Notre présence",
  presenceTitle: "Nos pays d’intervention",
  presenceLine: (n: number) => `${n} pays sur 4 continents — explorez le globe.`,
  appsKicker: "Applications terrain",
  appsLine: "Ouvrez la version web de nos applications de terrain.",
  chiffresKicker: "Chiffres clés",
  chiffresTitle: "Nos programmes fonciers en chiffres",
  chiffresLine: (a: string, b: string) => `${a} au Sénégal · ${b} en Côte d’Ivoire`,
  parcelsSenegal: "parcelles · Sénégal",
  areaCI: "Côte d’Ivoire",
  explore: "Explorer",
  appsLabel: "Nos applications",
  appsHint: "Touchez une application pour ouvrir sa version web (connexion requise). La croix en haut de l’écran ramène à la borne.",
  launch: "Ouvrir l’application",
  legacyVersion: "Ancienne version",
  webApp: "Application web",
  chiffresLabel: "Nos programmes en chiffres",
  countries: "pays",
  globeStat: (n: number) => `4 continents · ${n}+ projets référencés`,
  touchCountry: "Touchez un pays en surbrillance pour voir les projets",
  projectsN: (n: number) => `${n} projet${n > 1 ? "s" : ""}`,
  bannerAlt: (name: string) => `${name} — drapeau et paysage emblématique`,
  themeSub: "Thématique",
  discover: "Découvrir",
  detailSub: "Projet phare",
  project: "Projet",
  contents: "Contenus à explorer",
  itemsN: (n: number) => `${n} élément${n > 1 ? "s" : ""}`,
  mediaSoon: "Contenus multimédias (photos, vidéos, maquette 3D, plans) bientôt disponibles pour ce projet.",
  media: { images: "Photos", videos: "Vidéos", model: "Maquette 3D", plans: "Plans" },
  zoomIn: "Agrandir",
  zoomInHint: "Touchez l’image pour l’agrandir",
  zoomOutHint: "Glissez pour explorer · touchez pour revenir",
  // key figures
  parcelsInventoried: "parcelles inventoriées",
  titlesIssued: "titres d’occupation délivrés",
  chainKicker: "La chaîne foncière intégrée",
  chainTitle: "De l’inventaire au titre d’occupation",
  ringLead: "des parcelles inventoriées ont",
  ringStrong: "abouti à un titre d’occupation",
  footprintKicker: "Une empreinte territoriale majeure",
  footprintTitle: "Au plus près des territoires",
  deployKicker: "Un déploiement territorial à grande échelle",
  deployTitle: "Une couverture structurée",
  communities: "Au plus près des communautés rurales",
};

const EN: typeof FR = {
  kicker: "Flagship projects",
  introTitle: ["Revealing the potential", "of your territories"],
  introText: "A selection of our geospatial projects across Africa and the world, by theme.",
  tapToStart: "Touch to start",
  back: "Back",
  close: "Close",
  prev: "Previous",
  next: "Next",
  themesSub: "Our projects",
  themesLabel: "Choose a theme",
  presenceKicker: "Our presence",
  presenceTitle: "Where we work",
  presenceLine: (n: number) => `${n} countries on 4 continents — explore the globe.`,
  appsKicker: "Field applications",
  appsLine: "Open the web versions of our field apps.",
  chiffresKicker: "Key figures",
  chiffresTitle: "Our land programmes in figures",
  chiffresLine: (a: string, b: string) => `${a} in Senegal · ${b} in Côte d’Ivoire`,
  parcelsSenegal: "parcels · Senegal",
  areaCI: "Côte d’Ivoire",
  explore: "Explore",
  appsLabel: "Our applications",
  appsHint: "Touch an app to open its web version (sign-in required). The cross at the top of the screen brings you back to the kiosk.",
  launch: "Open the app",
  legacyVersion: "Previous version",
  webApp: "Web application",
  chiffresLabel: "Our programmes in figures",
  countries: "countries",
  globeStat: (n: number) => `4 continents · ${n}+ projects listed`,
  touchCountry: "Touch a highlighted country to see its projects",
  projectsN: (n: number) => `${n} project${n > 1 ? "s" : ""}`,
  bannerAlt: (name: string) => `${name} — flag and landmark`,
  themeSub: "Theme",
  discover: "Discover",
  detailSub: "Flagship project",
  project: "Project",
  contents: "Content to explore",
  itemsN: (n: number) => `${n} item${n > 1 ? "s" : ""}`,
  mediaSoon: "Media (photos, videos, 3D model, plans) coming soon for this project.",
  media: { images: "Photos", videos: "Videos", model: "3D model", plans: "Plans" },
  zoomIn: "Zoom in",
  zoomInHint: "Tap the picture to zoom in",
  zoomOutHint: "Drag to explore · tap to zoom out",
  parcelsInventoried: "parcels inventoried",
  titlesIssued: "occupancy titles issued",
  chainKicker: "The integrated land chain",
  chainTitle: "From inventory to occupancy title",
  ringLead: "of the inventoried parcels have",
  ringStrong: "led to an occupancy title",
  footprintKicker: "A major territorial footprint",
  footprintTitle: "Close to the territories",
  deployKicker: "Large-scale territorial deployment",
  deployTitle: "Structured coverage",
  communities: "Close to rural communities",
};

const CHIFFRES_FR = { procasef: PROCASEF, pamofor: PAMOFOR };
const CHIFFRES_EN = chiffresEn(CHIFFRES_FR);

// the saved choice as an external store: French on the server / first paint, the stored language after
// hydration, and every component re-renders when it changes (falls back to memory in private mode)
const listeners = new Set<() => void>();
let memLang: Lang | null = null;
function readLang(): Lang {
  if (memLang) return memLang;
  try { return localStorage.getItem(KEY) === "en" ? "en" : "fr"; } catch { return "fr"; }
}
function subscribe(cb: () => void) {
  listeners.add(cb); window.addEventListener("storage", cb);
  return () => { listeners.delete(cb); window.removeEventListener("storage", cb); };
}
function setLang(l: Lang) {
  memLang = l;
  try { localStorage.setItem(KEY, l); } catch { /* private mode */ }
  listeners.forEach((f) => f());
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "fr", setLang });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "fr" as Lang);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const { lang, setLang } = useContext(Ctx);
  return useMemo(() => {
    const en = lang === "en";
    // French grouping ("475 900", regular no-break space every font has) / English grouping ("475,900")
    const fmt = (n: number) => (en ? new Intl.NumberFormat("en-US").format(n) : new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " "));
    return {
      lang, setLang, t: en ? EN : FR, fmt,
      pct: (v: number) => (en ? `${v.toFixed(1)}%` : `${v.toFixed(1).replace(".", ",")} %`),
      theme: (t: EvenementTheme): EvenementTheme => (en && THEMES_EN[t.slug] ? { ...t, ...THEMES_EN[t.slug] } : t),
      projet: (p: EvenementProjet): EvenementProjet => {
        const x = en ? PROJETS_EN[p.slug] : undefined;
        return x ? { ...p, title: x.title, subThemes: x.subThemes, description: x.description } : p;
      },
      app: (a: BorneApp): BorneApp => (en && APPS_EN[a.key] ? { ...a, ...APPS_EN[a.key] } : a),
      country: (c: PresenceCountry): PresenceCountry => {
        const x = en ? PRESENCE_EN[c.iso] : undefined;
        if (!x) return c;
        return { ...c, name: x.name, region: (REGIONS_EN[c.region] ?? c.region) as PresenceCountry["region"], projects: x.projects ?? c.projects };
      },
      chiffres: en ? CHIFFRES_EN : CHIFFRES_FR,
    };
  }, [lang, setLang]);
}

/** FR | EN switch (top-right of every screen; the media overlay sits above it). */
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div role="group" aria-label="Langue / Language" className={`flex rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] p-1 shadow-[0_8px_28px_rgba(8,20,36,0.10)] ${className}`}>
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-4 py-2 text-sm font-semibold tracking-wider transition-colors md:px-5 md:py-2.5 ${lang === l ? "bg-[var(--k-accent)] text-white" : "text-[var(--k-muted)] hover:text-[var(--k-text)]"}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
