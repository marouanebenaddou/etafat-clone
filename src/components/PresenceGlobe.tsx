"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  geoOrthographic,
  geoPath,
  geoGraticule10,
  geoCentroid,
  geoDistance,
  geoContains,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature, merge } from "topojson-client";
import worldRaw from "@/data/world-110m.json";
import { PRESENCE_BY_ISO, type PresenceCountry } from "@/data/presence";

type Colors = {
  glow: string;
  ocean1: string; // sphere gradient centre
  ocean2: string; // sphere gradient edge
  land: string;
  landStroke: string;
  active: string;
  activeStroke: string;
  hover: string;
  marker: string;
  label: string;
  graticule: string;
};

const DEFAULT_COLORS: Colors = {
  glow: "rgba(0,102,157,0.35)",
  ocean1: "#f2f7fb",
  ocean2: "#d6e5f0",
  land: "#c3d2df",
  landStroke: "#ffffff",
  active: "#00669d",
  activeStroke: "#ffffff",
  hover: "#2ab5b4",
  marker: "#2ab5b4",
  label: "#0a1e30",
  graticule: "rgba(10,30,48,0.06)",
};

// world-atlas topojson → GeoJSON features (numeric ISO id per country)
type Feat = { id?: string | number; geometry: unknown; type: string; properties?: { name?: string } };
const WORLD = worldRaw as unknown as { objects: { countries: unknown } };
const COUNTRIES = (feature(WORLD as never, (WORLD.objects.countries as never)) as unknown as {
  features: Feat[];
}).features;

// Morocco is shown as a single country: dissolve the Morocco (504) + Western
// Sahara (732) border by merging their topojson geometries into one feature, so
// there's no grey seam between them.
const MOROCCO_ISO = 504;
const WSAHARA_ISO = 732;
const MOROCCO_MERGED: Feat = (() => {
  const geoms = (worldRaw as unknown as {
    objects: { countries: { geometries: Array<{ id?: string | number }> } };
  }).objects.countries.geometries;
  const parts = geoms.filter((g) => Number(g.id) === MOROCCO_ISO || Number(g.id) === WSAHARA_ISO);
  const plain = COUNTRIES.find((f) => Number(f.id) === MOROCCO_ISO);
  if (parts.length < 2) return plain as Feat;
  return {
    type: "Feature",
    id: MOROCCO_ISO,
    geometry: merge(worldRaw as never, parts as never) as unknown,
    properties: { name: "Maroc" },
  } as Feat;
})();

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
// shortest signed angular delta a→b in degrees
function angleDelta(a: number, b: number) {
  let d = (b - a) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export function PresenceGlobe({
  onSelect,
  colors: colorsProp,
  className,
}: {
  onSelect?: (c: PresenceCountry) => void;
  colors?: Partial<Colors>;
  className?: string;
}) {
  const colors = { ...DEFAULT_COLORS, ...colorsProp };
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // active countries (ETAFAT presence) with their feature + centroid
  const active = useMemo(() => {
    const list: { country: PresenceCountry; feature: Feat; centroid: [number, number] }[] = [];
    for (const f of COUNTRIES) {
      const iso = Number(f.id);
      if (iso === WSAHARA_ISO) continue; // merged into Morocco
      const country = PRESENCE_BY_ISO.get(iso);
      if (!country) continue;
      const feat = iso === MOROCCO_ISO ? MOROCCO_MERGED : f;
      list.push({ country, feature: feat, centroid: geoCentroid(feat as unknown as GeoPermissibleObjects) as [number, number] });
    }
    return list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const rotation: [number, number] = [-10, -12]; // start over Africa
    let width = 0, height = 0, radius = 0;
    let dragging = false;
    let downAt = 0;
    let last = { x: 0, y: 0, moved: 0 };
    let hoveredIso: number | null = null;
    let lastInteract = performance.now(); // hold on the start view briefly before drifting
    let flyTarget: [number, number] | null = null;
    let zoom = 1;                                        // pinch / wheel zoom factor
    const ZOOM_MIN = 1, ZOOM_MAX = 6;
    const pointers = new Map<number, { x: number; y: number }>(); // active touch/mouse points
    let pinchStartDist = 0, pinchStartZoom = 1;
    let introStart = Infinity;                          // set when the globe first scrolls into view
    const INTRO_MS = reduce ? 0 : 1400;                 // entrance "assemble" animation
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const projection = geoOrthographic().precision(0.4);
    const path = geoPath(projection, ctx);

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) / 2 - 8;
      projection.scale(radius).translate([width / 2, height / 2]);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Kick off the entrance animation only once the globe is actually in view
    // (immediately on the full-screen kiosk; on scroll on the website).
    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          if (introStart === Infinity && entries.some((en) => en.isIntersecting)) {
            introStart = performance.now();
            io?.disconnect();
          }
        }, { threshold: 0.25 })
      : null;
    if (io) io.observe(wrap); else introStart = performance.now();

    const isVisible = (lonlat: [number, number]) => {
      const center: [number, number] = [-rotation[0], -rotation[1]];
      return geoDistance(center, lonlat) < Math.PI / 2 - 0.02;
    };

    const draw = () => {
      // entrance: the globe scales up, fades in and spins to rest before it settles
      const ip = INTRO_MS ? clamp((performance.now() - introStart) / INTRO_MS, 0, 1) : 1;
      const e = easeOut(ip);
      const introScale = 0.35 + 0.65 * e;
      const introSpin = (1 - e) * -150;
      const R = radius * zoom * introScale;
      projection.scale(R).rotate([rotation[0] + introSpin, rotation[1]]);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = e;
      const cx = width / 2, cy = height / 2;

      // atmosphere glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.18);
      glow.addColorStop(0, colors.glow);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.18, 0, 2 * Math.PI);
      ctx.fill();

      // ocean sphere (radial gradient for a soft 3D feel)
      const oc = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      oc.addColorStop(0, colors.ocean1);
      oc.addColorStop(1, colors.ocean2);
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = oc;
      ctx.fill();

      // graticule
      ctx.beginPath();
      path(geoGraticule10());
      ctx.strokeStyle = colors.graticule;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // inactive land
      ctx.beginPath();
      for (const f of COUNTRIES) {
        const iso = Number(f.id);
        if (iso === WSAHARA_ISO) continue; // drawn as part of Morocco
        if (PRESENCE_BY_ISO.has(iso)) continue; // active, drawn below
        path((iso === MOROCCO_ISO ? MOROCCO_MERGED : f) as unknown as GeoPermissibleObjects);
      }
      ctx.fillStyle = colors.land;
      ctx.fill();
      ctx.strokeStyle = colors.landStroke;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      // active countries
      for (const a of active) {
        const isHover = hoveredIso === a.country.iso;
        ctx.beginPath();
        path(a.feature as unknown as GeoPermissibleObjects);
        ctx.fillStyle = isHover ? colors.hover : colors.active;
        ctx.fill();
        ctx.strokeStyle = colors.activeStroke;
        ctx.lineWidth = isHover ? 1.1 : 0.6;
        ctx.stroke();
      }

      // hovered country name chip (centroid dots removed)
      if (hoveredIso != null) {
        const a = active.find((x) => x.country.iso === hoveredIso);
        const p = a && isVisible(a.centroid) ? projection(a.centroid) : null;
        if (a && p) {
          ctx.font = "600 13px var(--font-figtree, system-ui, sans-serif)";
          const text = a.country.name;
          const tw = ctx.measureText(text).width;
          const bx = p[0] + 10, by = p[1] - 22;
          ctx.fillStyle = "rgba(255,255,255,0.92)";
          ctx.beginPath();
          (ctx as CanvasRenderingContext2D & { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect?.(bx - 6, by - 14, tw + 12, 22, 6);
          ctx.fill();
          ctx.fillStyle = colors.label;
          ctx.fillText(text, bx, by);
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const tick = () => {
      // fly-to animation
      if (flyTarget) {
        const dl = angleDelta(rotation[0], flyTarget[0]);
        const dp = flyTarget[1] - rotation[1];
        rotation[0] += dl * 0.12;
        rotation[1] += dp * 0.12;
        if (Math.abs(dl) < 0.2 && Math.abs(dp) < 0.2) { rotation[0] = flyTarget[0]; rotation[1] = flyTarget[1]; flyTarget = null; }
      } else if (!dragging && !reduce && performance.now() - lastInteract > 3000) {
        rotation[0] += 0.08; // gentle idle auto-rotate
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // ── interaction ──────────────────────────────────────────
    const pointer = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const hitTest = (pt: [number, number]): PresenceCountry | null => {
      const inv = projection.invert?.(pt);
      if (!inv) return null;
      for (const a of active) {
        if (!isVisible(a.centroid)) continue;
        if (geoContains(a.feature as unknown as GeoPermissibleObjects, inv as [number, number])) return a.country;
      }
      return null;
    };

    const skipIntro = () => { if (INTRO_MS) introStart = performance.now() - INTRO_MS; };

    const onDown = (e: PointerEvent) => {
      const [x, y] = pointer(e);
      pointers.set(e.pointerId, { x, y });
      canvas.setPointerCapture?.(e.pointerId);
      lastInteract = performance.now();
      skipIntro();
      if (pointers.size === 1) {
        dragging = true;
        downAt = performance.now();
        last = { x, y, moved: 0 };
      } else if (pointers.size === 2) {
        dragging = false; // second finger down -> pinch to zoom
        const [a, b] = [...pointers.values()];
        pinchStartDist = Math.hypot(a.x - b.x, a.y - b.y);
        pinchStartZoom = zoom;
      }
    };

    const onMove = (e: PointerEvent) => {
      const [x, y] = pointer(e);
      // hover (no button pressed) -> highlight the country under the cursor
      if (!pointers.has(e.pointerId)) {
        const c = hitTest([x, y]);
        const iso = c ? c.iso : null;
        if (iso !== hoveredIso) { hoveredIso = iso; canvas.style.cursor = iso ? "pointer" : "grab"; }
        return;
      }
      pointers.set(e.pointerId, { x, y });
      lastInteract = performance.now();
      if (pointers.size >= 2) { // pinch-zoom
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchStartDist > 0) zoom = clamp(pinchStartZoom * (dist / pinchStartDist), ZOOM_MIN, ZOOM_MAX);
        flyTarget = null;
        return;
      }
      if (dragging) { // one-finger spin
        const dx = x - last.x, dy = y - last.y;
        last.moved += Math.abs(dx) + Math.abs(dy);
        rotation[0] += dx * 0.28;
        rotation[1] = clamp(rotation[1] - dy * 0.28, -85, 85);
        last.x = x; last.y = y;
        flyTarget = null;
      }
    };

    const endPointer = (e: PointerEvent) => {
      const tap = dragging && pointers.size === 1 && last.moved < 6 && performance.now() - downAt < 400;
      const tapPt = pointer(e);
      pointers.delete(e.pointerId);
      canvas.releasePointerCapture?.(e.pointerId);
      lastInteract = performance.now();
      if (pointers.size < 2) pinchStartDist = 0;
      if (pointers.size === 1) {
        // one finger remains after a pinch -> resume dragging from it (no tap)
        const [only] = [...pointers.values()];
        last = { x: only.x, y: only.y, moved: 999 };
        dragging = true;
        return;
      }
      dragging = false;
      if (pointers.size === 0 && tap) {
        const c = hitTest(tapPt);
        if (c) {
          const a = active.find((x) => x.country.iso === c.iso);
          if (a) flyTarget = [-a.centroid[0], -a.centroid[1]];
          onSelectRef.current?.(c);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom = clamp(zoom * Math.exp(-e.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX);
      lastInteract = performance.now();
      skipIntro();
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerleave", () => { hoveredIso = null; });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", endPointer);
      canvas.removeEventListener("pointercancel", endPointer);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [active, colors.active, colors.activeStroke, colors.glow, colors.graticule, colors.hover, colors.label, colors.land, colors.landStroke, colors.marker, colors.ocean1, colors.ocean2]);

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
