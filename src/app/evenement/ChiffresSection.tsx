"use client";

import React, { useEffect, useState } from "react";
import { PROCASEF, PAMOFOR, type FunnelStep, type Stat } from "@/data/evenement-chiffres";

const CARD = "shadow-[0_8px_28px_rgba(8,20,36,0.10)]";
const FIG: React.CSSProperties = { fontFamily: "var(--font-figtree)" };
const EASE = "cubic-bezier(.22,1,.36,1)";

// French grouping ("475 900"); use a regular no-break space, which every font has.
const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ");

const reduceMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target: number, duration = 1600, delay = 0) {
  const [v, setV] = useState(() => (reduceMotion() ? target : 0));
  useEffect(() => {
    if (reduceMotion()) return;
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.max(0, Math.min(1, (now - t0) / duration));
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return v;
}

// flips to true right after mount so CSS transitions (bars, ring, fades) play
function useEntered(delay = 60) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return on;
}

function CountUp({ value, delay = 0, duration, prefix = "", suffix = "" }: { value: number; delay?: number; duration?: number; prefix?: string; suffix?: string }) {
  const v = useCountUp(value, duration, delay);
  return <span className="tabular-nums">{prefix}{fmt(v)}{suffix}</span>;
}

/* ------------------------------ glyph ------------------------------ */
export function ChartGlyph() {
  return (
    <svg width={38} height={38} viewBox="0 0 24 24" fill="none" className="text-white">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M4 7l6-4 6 6 5-3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
    </svg>
  );
}

/* ---------------------------- building blocks ---------------------------- */
function Hero({ country, name, tagline, children }: { country: string; name: string; tagline: string; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1e30] via-[#0a3d62] to-[#00669d] p-7 text-white md:p-10 ${CARD}`}>
      {/* soft glow + topographic contour lines — a nod to ETAFAT's trade */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#2ab5b4]/30 blur-3xl" />
      <svg className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 text-white/10" viewBox="0 0 200 200" fill="none">
        {[90, 74, 58, 42, 26].map((r, i) => (
          <path key={r} d={`M${100 - r} ${100 + i * 3} C ${100 - r} ${40 - i * 4}, ${100 + r} ${30 + i * 2}, ${100 + r} ${100 - i * 3} S ${100 - r * 0.4} ${170 - i * 5}, ${100 - r} ${100 + i * 3}Z`} stroke="currentColor" strokeWidth={1.5} />
        ))}
      </svg>
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8ee6e4] md:text-sm">{country}</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-white md:text-5xl" style={FIG}>{name}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">{tagline}</p>
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2ab5b4] md:text-sm">{kicker}</p>
      <h3 className="mt-1 text-xl font-semibold leading-tight text-[var(--k-text)] md:text-3xl" style={FIG}>{title}</h3>
    </div>
  );
}

function StatCard({ stat, delay = 0 }: { stat: Stat; delay?: number }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] p-5 md:p-6 ${CARD}`}>
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00669d] to-[#2ab5b4]" />
      <p className="text-3xl font-bold leading-none text-[#00669d] md:text-5xl" style={FIG}>
        <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} delay={delay} />
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--k-text)] md:text-lg">{stat.label}</p>
      {stat.detail && <p className="mt-1 text-xs leading-snug text-[var(--k-muted)] md:text-sm">{stat.detail}</p>}
    </div>
  );
}

function Closing({ text }: { text: string }) {
  return (
    <blockquote className="rounded-2xl border-l-4 border-[#2ab5b4] bg-[var(--k-chip)] px-6 py-5 text-base italic leading-relaxed text-[var(--k-text)] md:text-xl">
      {text}
    </blockquote>
  );
}

const FUNNEL_BG = [
  "linear-gradient(90deg,#0a2a44,#0a3d62)",
  "linear-gradient(90deg,#0a3d62,#00669d)",
  "linear-gradient(90deg,#00669d,#0a7fae)",
  "linear-gradient(90deg,#0a7fae,#1a9bb3)",
  "linear-gradient(90deg,#2ab5b4,#1f9e9d)",
];

function FunnelRow({ step, i, pct, on, final }: { step: FunnelStep; i: number; pct: number; on: boolean; final: boolean }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center justify-center gap-2 text-center text-sm font-semibold text-[var(--k-text)] md:text-lg">
        <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white md:h-7 md:w-7 md:text-sm ${final ? "bg-[#2ab5b4]" : "bg-[#00669d]"}`}>
          {final ? "✓" : i + 1}
        </span>
        {step.label}
      </p>
      <div className="relative h-14 w-full md:h-[4.5rem]">
        <div
          className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center justify-center overflow-hidden rounded-xl shadow-[0_6px_18px_rgba(0,102,157,0.25)]"
          style={{ width: on ? `${pct}%` : "0%", background: FUNNEL_BG[i] ?? FUNNEL_BG[1], transition: `width 1.3s ${EASE} ${0.15 + i * 0.18}s` }}
        >
          <span className="whitespace-nowrap text-2xl font-bold text-white md:text-4xl" style={FIG}>
            <CountUp value={step.value} delay={150 + i * 180} />
          </span>
        </div>
      </div>
      <p className="mt-1.5 text-center text-xs text-[var(--k-muted)] md:text-sm">{step.detail}</p>
    </div>
  );
}

function ConversionRing({ rate, on }: { rate: number; on: boolean }) {
  const R = 52, C = 2 * Math.PI * R;
  const tenths = useCountUp(Math.round(rate * 1000), 1600, 1100);
  return (
    <div className="mt-7 flex items-center gap-5 rounded-2xl bg-[var(--k-chip)] p-5 md:gap-7 md:p-6">
      <div className="relative h-28 w-28 shrink-0 md:h-36 md:w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="chiffresRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00669d" />
              <stop offset="1" stopColor="#2ab5b4" />
            </linearGradient>
          </defs>
          <circle cx={64} cy={64} r={R} fill="none" stroke="rgba(0,102,157,0.12)" strokeWidth={12} />
          <circle
            cx={64} cy={64} r={R} fill="none" stroke="url(#chiffresRing)" strokeWidth={12} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={on ? C * (1 - rate) : C}
            style={{ transition: `stroke-dashoffset 1.6s ${EASE} 1.1s` }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[var(--k-text)] md:text-2xl" style={FIG}>
          {(tenths / 10).toFixed(1).replace(".", ",")}&nbsp;%
        </span>
      </div>
      <p className="text-base leading-snug text-[var(--k-text)] md:text-xl">
        des parcelles inventoriées ont <strong className="text-[#1f9e9d]">abouti à un titre d’occupation</strong>
      </p>
    </div>
  );
}

function Chevron() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" className="mb-10 hidden shrink-0 text-[#2ab5b4] sm:block">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------ views ------------------------------ */
function Fade({ children }: { children: React.ReactNode }) {
  const on = useEntered(20);
  return (
    <div className="space-y-6 md:space-y-8" style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(16px)", transition: `opacity .6s ease, transform .7s ${EASE}` }}>
      {children}
    </div>
  );
}

function ProcasefView() {
  const on = useEntered();
  const steps = PROCASEF.steps;
  const max = steps[0].value;
  const rate = steps[steps.length - 1].value / max;
  return (
    <Fade>
      <Hero country={PROCASEF.country} name={PROCASEF.name} tagline={PROCASEF.tagline}>
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur md:p-5">
            <p className="text-3xl font-extrabold leading-none text-white md:text-5xl" style={FIG}><CountUp value={max} /></p>
            <p className="mt-2 text-sm text-white/80 md:text-base">parcelles inventoriées</p>
          </div>
          <div className="rounded-2xl bg-[#2ab5b4]/25 p-4 ring-1 ring-[#8ee6e4]/40 backdrop-blur md:p-5">
            <p className="text-3xl font-extrabold leading-none text-white md:text-5xl" style={FIG}><CountUp value={steps[steps.length - 1].value} delay={250} /></p>
            <p className="mt-2 text-sm text-white/85 md:text-base">titres d’occupation délivrés</p>
          </div>
        </div>
      </Hero>

      <section className={`rounded-3xl border border-[var(--k-border)] bg-[var(--k-surface)] p-6 md:p-9 ${CARD}`}>
        <SectionTitle kicker="La chaîne foncière intégrée" title="De l’inventaire au titre d’occupation" />
        <div className="space-y-4 md:space-y-5">
          {steps.map((s, i) => (
            <FunnelRow key={i} step={s} i={i} pct={(s.value / max) * 100} on={on} final={i === steps.length - 1} />
          ))}
        </div>
        <ConversionRing rate={rate} on={on} />
      </section>

      <section>
        <SectionTitle kicker="Une empreinte territoriale majeure" title="Au plus près des territoires" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {PROCASEF.footprint.map((s, i) => <StatCard key={i} stat={s} delay={200 + i * 150} />)}
        </div>
      </section>

      <Closing text={PROCASEF.closing} />
    </Fade>
  );
}

function PamoforView() {
  const on = useEntered();
  const sizes = [
    "h-14 w-14 sm:h-24 sm:w-24 md:h-32 md:w-32",
    "h-16 w-16 sm:h-28 sm:w-28 md:h-40 md:w-40",
    "h-[4.5rem] w-[4.5rem] sm:h-32 sm:w-32 md:h-48 md:w-48",
  ];
  const fills = ["from-[#0a3d62] to-[#00669d]", "from-[#00669d] to-[#1a9bb3]", "from-[#1a9bb3] to-[#2ab5b4]"];
  return (
    <Fade>
      <Hero country={PAMOFOR.country} name={PAMOFOR.name} tagline={PAMOFOR.tagline}>
        <div className="mt-8">
          <p className="bg-gradient-to-r from-white to-[#8ee6e4] whitespace-nowrap bg-clip-text text-4xl font-extrabold leading-none text-transparent sm:text-7xl md:text-8xl" style={FIG}>
            <CountUp value={PAMOFOR.hero.value} suffix={PAMOFOR.hero.suffix} duration={2000} />
          </p>
          <p className="mt-3 text-lg font-semibold text-white md:text-2xl">{PAMOFOR.hero.label}</p>
          <p className="text-sm text-white/70 md:text-base">{PAMOFOR.hero.detail}</p>
        </div>
      </Hero>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {PAMOFOR.stats.map((s, i) => <StatCard key={i} stat={s} delay={300 + i * 150} />)}
      </div>

      <section className={`rounded-3xl border border-[var(--k-border)] bg-[var(--k-surface)] p-6 md:p-9 ${CARD}`}>
        <SectionTitle kicker="Un déploiement territorial à grande échelle" title="Une couverture structurée" />
        <div className="grid grid-cols-3 items-end gap-2 sm:flex sm:justify-center sm:gap-4 md:gap-6">
          {PAMOFOR.territory.map((t, i) => (
            <React.Fragment key={t.label}>
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={`flex items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-white shadow-[0_10px_28px_rgba(0,102,157,0.3)] sm:text-3xl md:text-5xl ${sizes[i]} ${fills[i]}`}
                  style={{ ...FIG, transform: on ? "scale(1)" : "scale(0.4)", opacity: on ? 1 : 0, transition: `transform .9s ${EASE} ${0.2 + i * 0.2}s, opacity .6s ease ${0.2 + i * 0.2}s` }}
                >
                  <CountUp value={t.value} delay={300 + i * 200} duration={1200} />
                </div>
                <p className="mt-3 text-center text-[11px] font-semibold leading-tight tracking-tight text-[var(--k-text)] sm:text-sm sm:tracking-normal md:text-lg">{t.label}</p>
              </div>
              {i < PAMOFOR.territory.length - 1 && <Chevron />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-[var(--k-muted)] md:text-base">Au plus près des communautés rurales</p>
      </section>

      <Closing text={PAMOFOR.closing} />
    </Fade>
  );
}

/* ------------------------------ section ------------------------------ */
const PROGRAMMES = [
  { key: "procasef" as const, country: PROCASEF.country, name: PROCASEF.name },
  { key: "pamofor" as const, country: PAMOFOR.country, name: "PAMOFOR · PRESFOR" },
];

export function ChiffresContent() {
  const [prog, setProg] = useState<"procasef" | "pamofor">("procasef");
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-4">
        {PROGRAMMES.map((p) => {
          const active = p.key === prog;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setProg(p.key)}
              className={`rounded-2xl border px-5 py-4 text-left transition-all active:scale-[0.98] md:px-6 md:py-5 ${CARD} ${
                active
                  ? "border-transparent bg-gradient-to-br from-[#0a3d62] to-[#00669d] text-white"
                  : "border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text)]"
              }`}
            >
              <span className={`block text-xs font-semibold uppercase tracking-[0.25em] md:text-sm ${active ? "text-[#8ee6e4]" : "text-[#2ab5b4]"}`}>{p.country}</span>
              <span className="mt-1 block text-lg font-semibold leading-tight md:text-2xl" style={FIG}>{p.name}</span>
            </button>
          );
        })}
      </div>
      {prog === "procasef" ? <ProcasefView key="procasef" /> : <PamoforView key="pamofor" />}
    </div>
  );
}
