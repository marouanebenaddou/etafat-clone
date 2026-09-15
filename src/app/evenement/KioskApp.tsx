"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  EVENEMENT_THEMES,
  EVENEMENT_PROJETS,
  type EvenementProjet,
  type EvenementTheme,
} from "@/data/evenement";

/* ----------------------------- helpers ----------------------------- */

const projetsForTheme = (slug: string) =>
  EVENEMENT_PROJETS.filter((p) => p.theme === slug).sort((a, b) => a.n - b.n);

function mediaTiles(p: EvenementProjet) {
  const m = p.media ?? {};
  const tiles: { key: MediaKind; label: string; icon: string; count: number }[] = [];
  if (m.images?.length) tiles.push({ key: "images", label: "Photos", icon: "ph:images-duotone", count: m.images.length });
  if (m.videos?.length) tiles.push({ key: "videos", label: "Vidéos", icon: "ph:play-circle-duotone", count: m.videos.length });
  if (m.model) tiles.push({ key: "model", label: "Maquette 3D", icon: "ph:cube-duotone", count: 1 });
  if (m.plans?.length) tiles.push({ key: "plans", label: "Plans", icon: "ph:blueprint-duotone", count: m.plans.length });
  return tiles;
}

type MediaKind = "images" | "videos" | "model" | "plans";
type View = "intro" | "themes" | "projects" | "detail";
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
      s.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js";
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
  const [view, setView] = useState<View>("intro");
  const [theme, setTheme] = useState<EvenementTheme | null>(null);
  const [projet, setProjet] = useState<EvenementProjet | null>(null);
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("etafat-kiosk-mode");
      if (saved === "light" || saved === "dark") setMode(saved);
    } catch {}
  }, []);
  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      try { localStorage.setItem("etafat-kiosk-mode", next); } catch {}
      return next;
    });
  }, []);

  const openTheme = useCallback((t: EvenementTheme) => { setTheme(t); setView("projects"); }, []);
  const openProjet = useCallback((p: EvenementProjet) => { setProjet(p); setView("detail"); }, []);

  return (
    <div
      data-mode={mode}
      style={PALETTE[mode]}
      className="relative flex h-[100dvh] w-full flex-col overflow-hidden text-[var(--k-text)] select-none"
    >
      <BackgroundFX mode={mode} />
      <ModeToggle mode={mode} onToggle={toggleMode} />

      <AnimatePresence mode="wait">
        {view === "intro" && <IntroScreen key="intro" mode={mode} onStart={() => setView("themes")} />}
        {view === "themes" && <ThemesScreen key="themes" onBack={() => setView("intro")} onOpen={openTheme} />}
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

/* --------------------------- mode toggle --------------------------- */
function ModeToggle({ mode, onToggle }: { mode: Mode; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={mode === "dark" ? "Passer en mode jour" : "Passer en mode nuit"}
      className={`fixed right-5 top-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text)] backdrop-blur transition-colors hover:bg-[var(--k-surface-2)] active:scale-95 ${CARD}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Icon icon={mode === "dark" ? "ph:sun-duotone" : "ph:moon-stars-duotone"} width={24} height={24} />
        </motion.span>
      </AnimatePresence>
    </button>
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
      <motion.div
        className="absolute -top-1/3 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: dark ? "rgba(0,102,157,0.20)" : "rgba(0,102,157,0.10)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{ background: dark ? "rgba(42,181,180,0.15)" : "rgba(42,181,180,0.12)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
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
      className={`w-auto ${dark ? "[filter:brightness(0)_invert(1)]" : ""} ${className}`}
    />
  );
}

/* ---------------------------- INTRO -------------------------------- */
function IntroScreen({ onStart, mode }: { onStart: () => void; mode: Mode }) {
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
          Projets phares
        </p>
        <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight text-[var(--k-text)]" style={{ fontFamily: "var(--font-figtree)" }}>
          Révélons le potentiel
          <br />de vos territoires
        </h1>
        <p className="mt-6 text-[var(--k-muted)] text-lg md:text-xl leading-relaxed">
          Une sélection de nos réalisations géospatiales à travers l&apos;Afrique et le monde, par thématique.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-4 flex flex-col items-center gap-3">
        <motion.span
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text)] backdrop-blur"
          animate={{ scale: [1, 1.12, 1], boxShadow: ["0 0 0 0 rgba(42,181,180,0.4)", "0 0 0 18px rgba(42,181,180,0)", "0 0 0 0 rgba(42,181,180,0)"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        >
          <Icon icon="ph:hand-tap-duotone" width={30} height={30} />
        </motion.span>
        <span className="text-[var(--k-muted)] text-sm uppercase tracking-widest">Toucher pour commencer</span>
      </motion.div>
    </motion.button>
  );
}

/* ---------------------------- TOP BAR ------------------------------ */
function TopBar({ onBack, crumb }: { onBack: () => void; crumb: { label: string; sub?: string } }) {
  return (
    <div className="relative z-10 flex shrink-0 items-center gap-4 px-6 md:px-10 pt-6 md:pt-8 pr-20">
      <button
        type="button"
        onClick={onBack}
        className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text)] backdrop-blur transition-colors hover:bg-[var(--k-surface-2)] active:scale-95 ${CARD}`}
        aria-label="Retour"
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
function ThemesScreen({ onBack, onOpen }: { onBack: () => void; onOpen: (t: EvenementTheme) => void }) {
  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: "Nos réalisations", label: "Choisissez une thématique" }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENEMENT_THEMES.map((t, i) => (
              <motion.button
                key={t.slug}
                type="button"
                onClick={() => onOpen(t)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                className={`group relative flex h-full flex-col items-start gap-5 overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] p-7 text-left backdrop-blur transition-colors hover:border-[var(--k-accent)] hover:bg-[var(--k-surface-2)] ${CARD}`}
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
                  Explorer
                  <Icon icon="ph:arrow-right-bold" width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* --------------------------- PROJECTS ------------------------------ */
function ProjectsScreen({ theme, onBack, onOpen }: { theme: EvenementTheme; onBack: () => void; onOpen: (p: EvenementProjet) => void }) {
  const projets = useMemo(() => projetsForTheme(theme.slug), [theme.slug]);
  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: "Thématique", label: theme.label }} />
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
              className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] text-left backdrop-blur transition-colors hover:border-[var(--k-accent)] hover:bg-[var(--k-surface-2)] ${CARD}`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                {p.photo ? (
                  <Image src={p.photo} alt="" fill sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <ThemePlaceholder icon={theme.icon} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <MediaBadges p={p} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold leading-snug text-[var(--k-text)] line-clamp-3" style={{ fontFamily: "var(--font-figtree)" }}>
                  {p.title}
                </h3>
                <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--k-accent)]">
                  Découvrir
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
  const tiles = mediaTiles(p);
  if (!tiles.length) return null;
  return (
    <div className="absolute bottom-3 right-3 flex gap-1.5">
      {tiles.map((t) => (
        <span key={t.key} className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur">
          <Icon icon={t.icon} width={15} height={15} className="text-white" />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------- DETAIL ------------------------------- */
function DetailScreen({ projet, theme, onBack }: { projet: EvenementProjet; theme?: EvenementTheme; onBack: () => void }) {
  const [viewer, setViewer] = useState<MediaKind | null>(null);
  const tiles = mediaTiles(projet);

  return (
    <motion.section {...screenMotion} className="relative z-10 flex h-full w-full flex-col">
      <TopBar onBack={onBack} crumb={{ sub: "Projet phare", label: theme?.label ?? "Projet" }} />
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--k-border)] lg:sticky lg:top-4 ${CARD}`}
          >
            {projet.photo ? (
              <Image src={projet.photo} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
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
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--k-muted)]">Contenus à explorer</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {tiles.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setViewer(t.key)}
                        className={`group flex flex-col items-center gap-3 rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] p-5 text-center backdrop-blur transition-all hover:-translate-y-1 hover:border-[var(--k-accent)] hover:bg-[var(--k-surface-2)] active:scale-95 ${CARD}`}
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--k-accent)] to-[#00669d] text-white transition-transform group-hover:scale-110">
                          <Icon icon={t.icon} width={30} height={30} />
                        </span>
                        <span className="text-sm font-semibold text-[var(--k-text)]">{t.label}</span>
                        <span className="text-xs text-[var(--k-muted)]">{t.count} élément{t.count > 1 ? "s" : ""}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--k-border)] bg-[var(--k-surface)] p-6 text-center text-sm text-[var(--k-muted)]">
                  Contenus multimédias (photos, vidéos, maquette 3D, plans) bientôt disponibles pour ce projet.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewer && <MediaOverlay projet={projet} kind={viewer} onClose={() => setViewer(null)} />}
      </AnimatePresence>
    </motion.section>
  );
}

/* ------------------------- MEDIA OVERLAY --------------------------- */
function MediaOverlay({ projet, kind, onClose }: { projet: EvenementProjet; kind: MediaKind; onClose: () => void }) {
  const m = projet.media ?? {};
  const items: string[] =
    kind === "images" ? m.images ?? [] : kind === "videos" ? m.videos ?? [] : kind === "plans" ? m.plans ?? [] : m.model ? [m.model] : [];
  const [idx, setIdx] = useState(0);
  const many = items.length > 1;
  const go = (d: number) => setIdx((i) => (i + d + items.length) % items.length);

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

  const label = kind === "images" ? "Photos" : kind === "videos" ? "Vidéos" : kind === "plans" ? "Plans" : "Maquette 3D";

  return (
    <motion.div className="fixed inset-0 z-[60] flex flex-col bg-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <div className="flex shrink-0 items-center justify-between px-6 md:px-10 py-5">
        <div className="min-w-0">
          <p className="text-[#2ab5b4] text-xs font-semibold uppercase tracking-[0.25em]">{label}</p>
          <p className="truncate text-white/80 text-sm md:text-base">{projet.title}</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 active:scale-95" aria-label="Fermer">
          <Icon icon="ph:x-bold" width={22} height={22} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 md:px-16 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="relative flex h-full w-full items-center justify-center">
            {kind === "videos" ? (
              <video key={items[idx]} src={items[idx]} controls autoPlay playsInline className="max-h-full max-w-full rounded-xl" />
            ) : kind === "model" ? (
              <div className="h-full w-full max-w-5xl"><ModelViewer src={items[idx]} /></div>
            ) : (
              <div className="relative h-full w-full"><Image src={items[idx]} alt="" fill sizes="100vw" className="object-contain" /></div>
            )}
          </motion.div>
        </AnimatePresence>

        {many && (
          <>
            <NavArrow side="left" onClick={() => go(-1)} />
            <NavArrow side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      {many && kind !== "model" && (
        <div className="flex shrink-0 items-center justify-center gap-2 px-6 py-5">
          {items.map((it, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)} className={`relative h-14 w-20 overflow-hidden rounded-lg border-2 transition-colors ${i === idx ? "border-[#2ab5b4]" : "border-white/15 opacity-60 hover:opacity-100"}`}>
              {kind === "videos" ? (
                <span className="flex h-full w-full items-center justify-center bg-white/10"><Icon icon="ph:play-fill" width={18} height={18} className="text-white" /></span>
              ) : (
                <Image src={it} alt="" fill sizes="80px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Précédent" : "Suivant"}
      className={`absolute top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/70 active:scale-95 ${side === "left" ? "left-3 md:left-6" : "right-3 md:right-6"}`}
    >
      <Icon icon={side === "left" ? "ph:caret-left-bold" : "ph:caret-right-bold"} width={24} height={24} />
    </button>
  );
}
