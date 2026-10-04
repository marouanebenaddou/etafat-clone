"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon, addCollection } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  EVENEMENT_THEMES,
  EVENEMENT_PROJETS,
  type EvenementProjet,
  type EvenementTheme,
} from "@/data/evenement";
import evenementIcons from "@/data/evenement-icons.json";
import { BORNE_APPS, type BorneApp } from "@/data/evenement-apps";
import { PresenceGlobe } from "@/components/PresenceGlobe";
import { PRESENCE_COUNT, PRESENCE_PROJECT_COUNT, type PresenceCountry } from "@/data/presence";
import { ChiffresContent, ChartGlyph } from "./ChiffresSection";
import { LangProvider, LangToggle, useI18n } from "./i18n";

// Register the kiosk's icons offline so they render WITHOUT the Iconify API
// (the borne must work with no internet connection).
addCollection(evenementIcons as Parameters<typeof addCollection>[0]);

/* ----------------------------- helpers ----------------------------- */

const projetsForTheme = (slug: string) =>
  EVENEMENT_PROJETS.filter((p) => p.theme === slug).sort((a, b) => a.n - b.n);

function mediaTiles(p: EvenementProjet, labels: Record<MediaKind, string>) {
  const m = p.media ?? {};
  const tiles: { key: MediaKind; label: string; icon: string; count: number }[] = [];
  if (m.images?.length) tiles.push({ key: "images", label: labels.images, icon: "ph:images-duotone", count: m.images.length });
  if (m.videos?.length) tiles.push({ key: "videos", label: labels.videos, icon: "ph:play-circle-duotone", count: m.videos.length });
  if (m.model) tiles.push({ key: "model", label: labels.model, icon: "ph:cube-duotone", count: 1 });
  if (m.plans?.length) tiles.push({ key: "plans", label: labels.plans, icon: "ph:blueprint-duotone", count: m.plans.length });
  return tiles;
}

type MediaKind = "images" | "videos" | "model" | "plans";
type View = "intro" | "themes" | "projects" | "detail" | "apps" | "globe" | "chiffres";
type Mode = "dark" | "light";

const PALETTE: Record<Mode, React.CSSProperties> = {
  dark: {
    ["--k-text" as string]: "#ffffff",
    ["--k-muted" as string]: "rgba(255,255,255,0.64)",
    ["--k-surface" as string]: "rgba(255,255,255,0.07)",
    ["--k-surface-2" as string]: "rgba(255,255,255,0.14)",
    ["--k-border" as string]: "rgba(255,255,255,0.14)",
    ["--k-accent" as string]: "#2ab5b4",
    ["--k-chip" as string]: "rgba(255,255,255,0.09)",
  },
  light: {
    ["--k-text" as string]: "#12293f",
    ["--k-muted" as string]: "rgba(18,41,63,0.62)",
    ["--k-surface" as string]: "#ffffff",
    ["--k-surface-2" as string]: "#ffffff",
    ["--k-border" as string]: "rgba(18,41,63,0.10)",
    ["--k-accent" as string]: "#00669d",
    ["--k-chip" as string]: "rgba(0,102,157,0.08)",
  },
};

const CARD = "shadow-[0_8px_28px_rgba(8,20,36,0.10)]";

/* --------------------------- 3D model viewer ------------------------ */
function ModelViewer({ src }: { src: string }) {
  useEffect(() => {
    if (!document.querySelector("script[data-model-viewer]")) {
      const s = document.createElement("script");
      s.type = "module";
      // Bundled locally (no CDN) so BIM .glb maquettes render fully offline on the borne.
      s.src = "/vendor/model-viewer-3.5.0.min.js";
      s.setAttribute("data-model-viewer", "");
      document.head.appendChild(s);
    }
  }, []);
  return React.createElement("model-viewer", {
    src,
    "camera-controls": true,
    "touch-action": "pan-y",
    "auto-rotate": true,
    "shadow-intensity": "1",
    exposure: "1.1",
    style: { width: "100%", height: "100%", background: "transparent" },
  });
}

/* ------------------------------ main ------------------------------- */

export function KioskApp() {
  return (
    <LangProvider>
      <Kiosk />
    </LangProvider>
  );
}

function Kiosk() {
  const [view, setView] = useState<View>("intro");
  const [theme, setTheme] = useState<EvenementTheme | null>(null);
  const [projet, setProjet] = useState<EvenementProjet | null>(null);
  // Kiosk is locked to day (light) mode — no toggle (it overlapped the media
  // overlay's close button on the borne).
  const mode: Mode = "light";

  const openTheme = useCallback((t: EvenementTheme) => { setTheme(t); setView("projects"); }, []);
  const openProjet = useCallback((p: EvenementProjet) => { setProjet(p); setView("detail"); }, []);

  return (
    <div
      data-mode={mode}
      style={PALETTE[mode]}
      className="relative flex h-[100dvh] w-full flex-col overflow-hidden text-[var(--k-text)] select-none"
    >
      <BackgroundFX mode={mode} />
      {/* FR | EN — on every screen (the media overlay, z-60, covers it) */}
      <LangToggle className="absolute right-6 top-6 z-30 md:right-10 md:top-8" />

      <AnimatePresence mode="wait">
        {view === "intro" && <IntroScreen key="intro" mode={mode} onStart={() => setView("themes")} />}
        {view === "themes" && <ThemesScreen key="themes" onBack={() => setView("intro")} onOpen={openTheme} onApps={() => setView("apps")} onGlobe={() => setView("globe")} onChiffres={() => setView("chiffres")} />}
        {view === "apps" && <AppsScreen key="apps" onBack={() => setView("themes")} />}
        {view === "globe" && <GlobeScreen key="globe" onBack={() => setView("themes")} />}
        {view === "chiffres" && <ChiffresScreen key="chiffres" onBack={() => setView("themes")} />}
        {view === "projects" && theme && (
          <ProjectsScreen key="projects" theme={theme} onBack={() => setView("themes")} onOpen={openProjet} />
        )}
        {view === "detail" && projet && (
          <DetailScreen
            key="detail"
            projet={projet}
            theme={EVENEMENT_THEMES.find((t) => t.slug === projet.theme)}
            onBack={() => setView("projects")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


/* --------------------------- background ---------------------------- */
function BackgroundFX({ mode }: { mode: Mode }) {
  const dark = mode === "dark";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(120% 120% at 50% -10%, #0f3358 0%, #081a2c 55%, #050f1a 100%)"
            : "radial-gradient(120% 120% at 50% -10%, #ffffff 0%, #eef4f9 55%, #dfeaf2 100%)",
        }}
      />
      {/* Static blurred glows — rasterized once (animating a 120px-blur layer
          re-rasterizes every frame and janks weak GPUs like the borne's). */}
      <div
        className="absolute -top-1/3 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: dark ? "rgba(0,102,157,0.20)" : "rgba(0,102,157,0.10)", opacity: 0.7 }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{ background: dark ? "rgba(42,181,180,0.15)" : "rgba(42,181,180,0.12)", opacity: 0.6 }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: dark ? 0.06 : 0.05,
          backgroundImage:
            "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          color: dark ? "#ffffff" : "#12293f",
        }}
      />
    </div>
  );
}

/* --------------------------- logo mark ----------------------------- */
function LogoMark({ className = "", dark }: { className?: string; dark: boolean }) {
  return (
    <Image
      src="/etafat/logo.png"
      alt="ETAFAT"
      width={167}
      height={143}
      priority
      unoptimized
      className={`w-auto ${dark ? "[filter:brightness(0)_invert(1)]" : ""} ${className}`}
    />
  );
}

/* ---------------------------- INTRO -------------------------------- */
function IntroScreen({ onStart, mode }: { onStart: () => void; mode: Mode }) {
  const { t } = useI18n();
  return (
    <motion.button
      type="button"
      onClick={onStart}
      className="relative z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-10 px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <LogoMark dark={mode === "dark"} className="h-28 md:h-40" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="max-w-3xl"
      >
        <p className="text-[var(--k-accent)] text-sm md:text-base font-semibold uppercase tracking-[0.35em]">
          {t.kicker}
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight text-[var(--k-text)]" style={{ fontFamily: "var(--font-figtree)" }}>
          {t.introTitle[0]}
          <br />{t.introTitle[1]}
        </h1>
        <p className="mt-6 text-[var(--k-muted)] text-lg md:text-xl leading-relaxed">
          {t.introText}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-4 flex flex-col items-center gap-3">
        <motion.span
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text)]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon icon="ph:hand-tap-duotone" width={30} height={30} />
        </motion.span>
        <span className="text-[var(--k-muted)] text-sm uppercase tracking-widest">{t.tapToStart}</span>
      </motion.div>
    </motion.button>
  );
}

/* ---------------------------- TOP BAR ------------------------------ */
function TopBar({ onBack, crumb }: { onBack: () => void; crumb: { label: string; sub?: string } }) {
  const { t } = useI18n();
  return (
    <div className="relative z-10 flex shrink-0 items-center gap-4 px-6 md:px-10 pt-6 md:pt-8 pr-40 md:pr-48">
      <button
        type="button"
        onClick={onBack}
        className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text)] transition-colors hover:bg-[var(--k-surface-2)] active:scale-95 ${CARD}`}
        aria-label={t.back}
      >
        <Icon icon="ph:arrow-left-bold" width={22} height={22} />
      </button>
      <div className="min-w-0 flex-1">
        {crumb.sub && (
          <p className="truncate text-[var(--k-accent)] text-xs md:text-sm font-semibold uppercase tracking-[0.25em]">{crumb.sub}</p>
        )}
        <p className="truncate text-[var(--k-text)] text-lg md:text-2xl font-semibold" style={{ fontFamily: "var(--font-figtree)" }}>
          {crumb.label}
        </p>
      </div>
    </div>
  );
}

const screenMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/* --------------------------- THEMES -------------------------------- */
function ThemesScreen({ onBack, onOpen, onApps, onGlobe, onChiffres }: { onBack: () => void; onOpen: (t: EvenementTheme) => void; onApps: () => void; onGlobe: () => void; onChiffres: () => void }) {
  const { t: tr, fmt, theme: L, chiffres } = useI18n();
  const { procasef: PROCASEF, pamofor: PAMOFOR } = chiffres;
  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: tr.themesSub, label: tr.themesLabel }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        {/* Main tiles — presence globe + field applications */}
        <div className="mx-auto mb-6 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
          <motion.button
            type="button"
            onClick={onGlobe}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            className={`group flex items-center gap-5 overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-[#0a3d62] to-[#00669d] p-6 md:p-7 text-left text-white ${CARD}`}
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <GlobeGlyph />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{tr.presenceKicker}</p>
              <h2 className="mt-1 text-xl md:text-2xl font-semibold leading-tight text-white" style={{ fontFamily: "var(--font-figtree)" }}>
                {tr.presenceTitle}
              </h2>
              <p className="mt-1 text-sm text-white/85">{tr.presenceLine(PRESENCE_COUNT)}</p>
            </div>
          </motion.button>

          <motion.button
            type="button"
            onClick={onApps}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            className={`group flex items-center gap-5 overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-[#00669d] to-[#2ab5b4] p-6 md:p-7 text-left text-white ${CARD}`}
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Icon icon="ph:map-trifold-duotone" width={38} height={38} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{tr.appsKicker}</p>
              <h2 className="mt-1 text-xl md:text-2xl font-semibold leading-tight text-white" style={{ fontFamily: "var(--font-figtree)" }}>
                PROCASEF · PRESFOR · SRM
              </h2>
              <p className="mt-1 text-sm text-white/85">{tr.appsLine}</p>
            </div>
          </motion.button>

          <motion.button
            type="button"
            onClick={onChiffres}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            className={`group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-[#0a1e30] via-[#0a3d62] to-[#00669d] p-6 md:col-span-2 md:flex-row md:items-center md:p-7 text-left text-white ${CARD}`}
          >
            <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#2ab5b4]/25 blur-3xl" />
            <div className="relative flex min-w-0 flex-1 items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <ChartGlyph />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8ee6e4]">{tr.chiffresKicker}</p>
                <h2 className="mt-1 text-xl md:text-2xl font-semibold leading-tight text-white" style={{ fontFamily: "var(--font-figtree)" }}>
                  {tr.chiffresTitle}
                </h2>
                <p className="mt-1 text-sm text-white/85">{tr.chiffresLine(PROCASEF.name, PAMOFOR.name)}</p>
              </div>
            </div>
            <div className="relative flex shrink-0 flex-wrap gap-3">
              <span className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <span className="block text-xl md:text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-figtree)" }}>{fmt(PROCASEF.steps[0].value)}</span>
                <span className="mt-1 block text-xs text-white/75">{tr.parcelsSenegal}</span>
              </span>
              <span className="rounded-xl bg-[#2ab5b4]/25 px-4 py-3 ring-1 ring-[#8ee6e4]/40 backdrop-blur">
                <span className="block text-xl md:text-2xl font-bold leading-none" style={{ fontFamily: "var(--font-figtree)" }}>{fmt(PAMOFOR.hero.value)} ha</span>
                <span className="mt-1 block text-xs text-white/75">{tr.areaCI}</span>
              </span>
            </div>
          </motion.button>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENEMENT_THEMES.map(L).map((t, i) => (
              <motion.button
                key={t.slug}
                type="button"
                onClick={() => onOpen(t)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                className={`group relative flex h-full flex-col items-start gap-5 overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] p-7 text-left transition-colors hover:border-[var(--k-accent)] hover:bg-[var(--k-surface-2)] ${CARD}`}
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--k-accent)] transition-transform duration-300 group-hover:scale-x-100" />
                <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--k-accent)] to-[#00669d] text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon icon={t.icon} width={38} height={38} />
                </span>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold leading-tight text-[var(--k-text)]" style={{ fontFamily: "var(--font-figtree)" }}>
                    {t.label}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--k-muted)] leading-relaxed">{t.tagline}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--k-accent)]">
                  {tr.explore}
                  <Icon icon="ph:arrow-right-bold" width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------- APPLICATIONS ---------------------------- */
// The field apps' web versions. On the borne, MainActivity's JS bridge (window.BorneApps.openUrl) opens them in a
// Chrome Custom Tab over the kiosk (its ✕ returns here); in a browser — or an older APK without openUrl — a new tab.
type BorneBridge = { openUrl?: (url: string) => string };

function useBorne(): BorneBridge | null {
  const [bridge, setBridge] = useState<BorneBridge | null>(null);
  useEffect(() => {
    let tries = 0;
    const read = () => {
      const w = window as unknown as { BorneApps?: BorneBridge };
      if (w.BorneApps) { setBridge(w.BorneApps); return true; }
      return false;
    };
    if (read()) return;
    const id = setInterval(() => { if (read() || ++tries > 30) clearInterval(id); }, 500);
    return () => clearInterval(id);
  }, []);
  return bridge;
}

function openWebApp(url: string, borne: BorneBridge | null) {
  if (borne && typeof borne.openUrl === "function") {
    try { if (borne.openUrl(url) === "ok") return; } catch { /* fall back to a tab */ }
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function AppsScreen({ onBack }: { onBack: () => void }) {
  const { t, app: L } = useI18n();
  const borne = useBorne();

  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: t.appsKicker, label: t.appsLabel }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
        <div className="mx-auto max-w-5xl space-y-5">
          <p className="rounded-xl border border-[var(--k-border)] bg-[var(--k-surface)] p-4 text-sm text-[var(--k-muted)]">
            {t.appsHint}
          </p>

          {BORNE_APPS.map(L).map((app: BorneApp, i) => (
            <motion.div
              key={app.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] ${CARD}`}
            >
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--k-accent)] to-[#00669d] text-white">
                      <Icon icon={app.icon} width={32} height={32} />
                    </span>
                    <div>
                      <h2 className="text-2xl font-semibold leading-tight text-[var(--k-text)]" style={{ fontFamily: "var(--font-figtree)" }}>{app.name}</h2>
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--k-accent)]">{t.webApp}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--k-muted)]">{app.tagline}</p>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-2 self-center">
                  <button
                    type="button"
                    onClick={() => openWebApp(app.url, borne)}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--k-accent)] px-8 py-4 text-base font-semibold text-white shadow-lg transition-transform active:scale-95"
                  >
                    {t.launch}
                    <Icon icon="ph:arrow-right-bold" width={18} height={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------------------- CHIFFRES ----------------------------- */
function ChiffresScreen({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: t.chiffresKicker, label: t.chiffresLabel }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <ChiffresContent />
      </div>
    </motion.section>
  );
}

/* --------------------------- PRÉSENCE ------------------------------ */
function GlobeGlyph() {
  return (
    <svg width={38} height={38} viewBox="0 0 24 24" fill="none" className="text-white">
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.6} />
      <ellipse cx={12} cy={12} rx={4} ry={9} stroke="currentColor" strokeWidth={1.6} />
      <path d="M3 12h18M4.6 7.5h14.8M4.6 16.5h14.8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

function GlobeScreen({ onBack }: { onBack: () => void }) {
  const { t, country: L } = useI18n();
  const [picked, setSel] = useState<PresenceCountry | null>(null);
  const sel = picked ? L(picked) : null;
  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: t.presenceKicker, label: t.presenceTitle }} />
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute left-6 top-3 z-10 md:left-10">
          <p className="text-4xl font-semibold leading-none text-[var(--k-text)] md:text-5xl" style={{ fontFamily: "var(--font-figtree)" }}>
            {PRESENCE_COUNT}
            <span className="text-lg text-[var(--k-muted)] md:text-2xl"> {t.countries}</span>
          </p>
          <p className="mt-1 text-sm text-[var(--k-muted)]">{t.globeStat(PRESENCE_PROJECT_COUNT)}</p>
        </div>

        <PresenceGlobe className="absolute inset-0" onSelect={setSel} label={(c) => L(c).name} />

        {!sel && (
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--k-surface)]/80 px-4 py-2 text-xs text-[var(--k-muted)] backdrop-blur">
            {t.touchCountry}
          </p>
        )}

        <AnimatePresence>
          {sel && (
            <motion.div
              key={sel.iso}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute bottom-4 left-1/2 z-20 w-[92%] max-w-md -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] ${CARD}`}
            >
              {/* country banner: flag × landmark (scripts/build-xr-country-banners.mjs, shared with the VR globe) */}
              <div className="relative aspect-[3/1] w-full bg-[#0d3350]">
                <Image
                  src={`/etafat/presence/banners/${sel.iso}.jpg`}
                  alt={t.bannerAlt(sel.name)}
                  fill
                  unoptimized
                  sizes="448px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081726]/85 via-[#081726]/25 to-transparent" />
                <div className="absolute bottom-3 left-4 max-w-[58%]">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#bff6f4] [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
                    {sel.region}
                    {sel.projects.length ? ` · ${t.projectsN(sel.projects.length)}` : ""}
                  </p>
                  <h3
                    className="line-clamp-2 text-2xl font-semibold leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]"
                    style={{ fontFamily: "var(--font-figtree)" }}
                  >
                    {sel.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSel(null)}
                  aria-label={t.close}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55"
                >
                  <Icon icon="ph:x-bold" width={16} height={16} />
                </button>
              </div>
              <div className="h-1 w-full bg-[var(--k-accent)]" />
              {sel.projects.length > 0 && (
              <div className="p-5 pt-4">
                <ul className="max-h-[42vh] space-y-2 overflow-y-auto overscroll-contain">
                  {sel.projects.map((p, i) => (
                    <li key={i} className="rounded-lg bg-[var(--k-chip)] px-3 py-2 text-sm leading-snug text-[var(--k-text)]">
                      {p.title}
                      {p.place && <span className="text-[var(--k-muted)]"> — {p.place}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* --------------------------- PROJECTS ------------------------------ */
function ProjectsScreen({ theme: th, onBack, onOpen }: { theme: EvenementTheme; onBack: () => void; onOpen: (p: EvenementProjet) => void }) {
  const { t, theme: LT, projet: LP } = useI18n();
  const theme = LT(th);
  const projets = useMemo(() => projetsForTheme(theme.slug), [theme.slug]);
  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: t.themeSub, label: theme.label }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projets.map((p, i) => (
            <motion.button
              key={p.slug}
              type="button"
              onClick={() => onOpen(p)}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] text-left transition-colors hover:border-[var(--k-accent)] hover:bg-[var(--k-surface-2)] ${CARD}`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                {p.photo ? (
                  <Image src={p.photo} alt="" fill unoptimized sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <ThemePlaceholder icon={theme.icon} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <MediaBadges p={p} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold leading-snug text-[var(--k-text)] line-clamp-3" style={{ fontFamily: "var(--font-figtree)" }}>
                  {LP(p).title}
                </h3>
                <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--k-accent)]">
                  {t.discover}
                  <Icon icon="ph:arrow-right-bold" width={15} height={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ThemePlaceholder({ icon }: { icon: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f3358] to-[#0a2540]">
      <Icon icon={icon} width={64} height={64} className="text-white/25" />
    </div>
  );
}

function MediaBadges({ p }: { p: EvenementProjet }) {
  const { t } = useI18n();
  const tiles = mediaTiles(p, t.media);
  if (!tiles.length) return null;
  return (
    <div className="absolute bottom-3 right-3 flex gap-1.5">
      {tiles.map((t) => (
        <span key={t.key} className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50">
          <Icon icon={t.icon} width={15} height={15} className="text-white" />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------- DETAIL ------------------------------- */
function DetailScreen({ projet: pr, theme: th, onBack }: { projet: EvenementProjet; theme?: EvenementTheme; onBack: () => void }) {
  const { t, theme: LT, projet: LP } = useI18n();
  const projet = LP(pr), theme = th && LT(th);
  const [viewer, setViewer] = useState<MediaKind | null>(null);
  const tiles = mediaTiles(projet, t.media);

  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: t.detailSub, label: theme?.label ?? t.project }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--k-border)] lg:sticky lg:top-4 ${CARD}`}
          >
            {projet.photo ? (
              <Image src={projet.photo} alt="" fill unoptimized sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <ThemePlaceholder icon={theme?.icon ?? "ph:map-pin-duotone"} />
            )}
          </motion.div>

          <div className="flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="text-2xl md:text-4xl font-semibold leading-tight text-[var(--k-text)]" style={{ fontFamily: "var(--font-figtree)" }}
            >
              {projet.title}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mt-5 flex flex-wrap gap-2">
              {projet.subThemes.map((s) => (
                <span key={s} className="rounded-full border border-[var(--k-border)] bg-[var(--k-chip)] px-3.5 py-1.5 text-xs md:text-sm text-[var(--k-muted)]">{s}</span>
              ))}
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="mt-6 text-[var(--k-muted)] text-base md:text-lg leading-relaxed">
              {projet.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-8">
              {tiles.length > 0 ? (
                <>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--k-muted)]">{t.contents}</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {tiles.map((tile) => (
                      <button
                        key={tile.key}
                        type="button"
                        onClick={() => setViewer(tile.key)}
                        className={`group flex flex-col items-center gap-3 rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] p-5 text-center transition hover:-translate-y-1 hover:border-[var(--k-accent)] hover:bg-[var(--k-surface-2)] active:scale-95 ${CARD}`}
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--k-accent)] to-[#00669d] text-white transition-transform group-hover:scale-110">
                          <Icon icon={tile.icon} width={30} height={30} />
                        </span>
                        <span className="text-sm font-semibold text-[var(--k-text)]">{tile.label}</span>
                        <span className="text-xs text-[var(--k-muted)]">{t.itemsN(tile.count)}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--k-border)] bg-[var(--k-surface)] p-6 text-center text-sm text-[var(--k-muted)]">
                  {t.mediaSoon}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* portal: the screen's transition transform would trap the overlay's z-index under the FR | EN switch */}
      {createPortal(
        <AnimatePresence>
          {viewer && <MediaOverlay projet={projet} kind={viewer} onClose={() => setViewer(null)} />}
        </AnimatePresence>,
        document.body,
      )}
    </motion.section>
  );
}

/* ------------------------- MEDIA OVERLAY --------------------------- */
function MediaOverlay({ projet, kind, onClose }: { projet: EvenementProjet; kind: MediaKind; onClose: () => void }) {
  const { t } = useI18n();
  const m = projet.media ?? {};
  const items: string[] =
    kind === "images" ? m.images ?? [] : kind === "videos" ? m.videos ?? [] : kind === "plans" ? m.plans ?? [] : m.model ? [m.model] : [];
  const [idx, setIdx] = useState(0);
  // tap-to-zoom on pictures: the tapped point (fractions of the picture) is centred in the 2.4× view, drag pans
  const [zoom, setZoom] = useState<{ fx: number; fy: number } | null>(null);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const many = items.length > 1;
  const show = (i: number) => { setIdx(i); setZoom(null); };
  const go = (d: number) => { setIdx((i) => (i + d + items.length) % items.length); setZoom(null); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && many) go(1);
      if (e.key === "ArrowLeft" && many) go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [many, items.length]);

  const label = t.media[kind];
  const picture = kind === "images" || kind === "plans";
  const src = items[idx];
  const ar = aspects[src] ?? 16 / 9;
  // the vertical borne leaves wide bands around landscape pictures: fill them with the picture itself, blurred
  const backdrop = picture ? src : projet.photo;

  const zoomAt = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const w = Math.min(r.width, r.height * ar), h = w / ar; // the contained picture inside the stage
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    setZoom({ fx: clamp((e.clientX - r.left - (r.width - w) / 2) / w), fy: clamp((e.clientY - r.top - (r.height - h) / 2) / h) });
  };
  const focus = (el: HTMLDivElement | null) => {
    if (!el || !zoom) return;
    requestAnimationFrame(() => {
      const c = el.firstElementChild as HTMLElement;
      el.scrollLeft = zoom.fx * c.scrollWidth - el.clientWidth / 2;
      el.scrollTop = zoom.fy * c.scrollHeight - el.clientHeight / 2;
    });
  };

  return (
    <motion.div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <AnimatePresence initial={false}>
        {backdrop && (
          <motion.div key={backdrop} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Image src={backdrop} alt="" fill unoptimized sizes="100vw" className="scale-125 transform-gpu object-cover blur-3xl brightness-[0.45] saturate-150" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/5 to-black/60" />

      <div className="relative z-10 flex shrink-0 items-center justify-between px-6 md:px-10 py-5">
        <div className="min-w-0">
          <p className="text-[#2ab5b4] text-xs font-semibold uppercase tracking-[0.25em]">{label}</p>
          <p className="truncate text-white/80 text-sm md:text-base">{projet.title}</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-colors hover:bg-white/15 active:scale-95" aria-label={t.close}>
          <Icon icon="ph:x-bold" width={22} height={22} />
        </button>
      </div>

      <div className={`relative z-10 flex flex-1 items-center justify-center overflow-hidden pb-4 ${picture ? "" : "px-4 md:px-16"}`}>
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="relative flex h-full w-full items-center justify-center [container-type:size]">
            {kind === "videos" ? (
              <video key={src} src={src} controls autoPlay playsInline className="max-h-full max-w-full rounded-xl shadow-2xl" />
            ) : kind === "model" ? (
              <div className="h-full w-full max-w-5xl"><ModelViewer src={src} /></div>
            ) : zoom ? (
              <div ref={focus} onClick={() => setZoom(null)} className="absolute inset-0 cursor-zoom-out overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-h-full min-w-full w-max items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" draggable={false} className="max-w-none select-none" style={{ width: `calc(min(100cqw, ${ar} * 100cqh) * 2.4)`, aspectRatio: String(ar) }} />
                </div>
              </div>
            ) : (
              <button type="button" onClick={zoomAt} aria-label={t.zoomIn} className="relative h-full w-full cursor-zoom-in">
                <Image
                  src={src} alt="" fill unoptimized sizes="100vw" className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                  onLoad={(e) => { const im = e.currentTarget; if (im.naturalWidth) setAspects((a) => ({ ...a, [src]: im.naturalWidth / im.naturalHeight })); }}
                />
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {picture && (
          <p className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-black/45 px-4 py-2 text-xs text-white/85 backdrop-blur md:text-sm">
            <Icon icon={zoom ? "ph:arrows-out-cardinal-duotone" : "ph:magnifying-glass-plus-duotone"} width={16} height={16} />
            {zoom ? t.zoomOutHint : t.zoomInHint}
          </p>
        )}

        {many && !zoom && (
          <>
            <NavArrow side="left" onClick={() => go(-1)} />
            <NavArrow side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      {many && kind !== "model" && (
        <div className="relative z-10 flex shrink-0 items-center justify-center gap-2 px-6 py-5">
          {items.map((it, i) => (
            <button key={i} type="button" onClick={() => show(i)} className={`relative h-14 w-20 overflow-hidden rounded-lg border-2 transition-colors ${i === idx ? "border-[#2ab5b4]" : "border-white/15 opacity-60 hover:opacity-100"}`}>
              {kind === "videos" ? (
                <span className="flex h-full w-full items-center justify-center bg-white/10"><Icon icon="ph:play-fill" width={18} height={18} className="text-white" /></span>
              ) : (
                <Image src={it} alt="" fill unoptimized sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? t.prev : t.next}
      className={`absolute top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/70 active:scale-95 ${side === "left" ? "left-3 md:left-6" : "right-3 md:right-6"}`}
    >
      <Icon icon={side === "left" ? "ph:caret-left-bold" : "ph:caret-right-bold"} width={24} height={24} />
    </button>
  );
}
