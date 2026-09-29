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
import { feature } from "topojson-client";
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
      const country = PRESENCE_BY_ISO.get(Number(f.id));
      if (country) list.push({ country, feature: f, centroid: geoCentroid(f as unknown as GeoPermissibleObjects) as [number, number] });
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

    const isVisible = (lonlat: [number, number]) => {
      const center: [number, number] = [-rotation[0], -rotation[1]];
      return geoDistance(center, lonlat) < Math.PI / 2 - 0.02;
    };

    const draw = () => {
      projection.rotate([rotation[0], rotation[1]]);
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2, cy = height / 2;

      // atmosphere glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.18);
      glow.addColorStop(0, colors.glow);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.18, 0, 2 * Math.PI);
      ctx.fill();

      // ocean sphere (radial gradient for a soft 3D feel)
      const oc = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
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
      for (const f of COUNTRIES) if (!PRESENCE_BY_ISO.has(Number(f.id))) path(f as unknown as GeoPermissibleObjects);
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

      // markers + hovered label
      let hoverLabel: { x: number; y: number; text: string } | null = null;
      for (const a of active) {
        if (!isVisible(a.centroid)) continue;
        const p = projection(a.centroid);
        if (!p) continue;
        const isHover = hoveredIso === a.country.iso;
        ctx.beginPath();
        ctx.arc(p[0], p[1], isHover ? 5 : 3, 0, 2 * Math.PI);
        ctx.fillStyle = isHover ? colors.hover : colors.marker;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (isHover) hoverLabel = { x: p[0], y: p[1], text: a.country.name };
      }
      if (hoverLabel) {
        ctx.font = "600 13px var(--font-figtree, system-ui, sans-serif)";
        const tw = ctx.measureText(hoverLabel.text).width;
        const bx = hoverLabel.x + 10, by = hoverLabel.y - 22;
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.beginPath();
        (ctx as CanvasRenderingContext2D & { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void }).roundRect?.(bx - 6, by - 14, tw + 12, 22, 6);
        ctx.fill();
        ctx.fillStyle = colors.label;
        ctx.fillText(hoverLabel.text, bx, by);
      }
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

    const onDown = (e: PointerEvent) => {
      dragging = true;
      downAt = performance.now();
      const [x, y] = pointer(e);
      last = { x, y, moved: 0 };
      lastInteract = performance.now();
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = pointer(e);
      lastInteract = performance.now(); // pointer over the globe pauses auto-rotation
      if (dragging) {
        const dx = x - last.x, dy = y - last.y;
        last.moved += Math.abs(dx) + Math.abs(dy);
        rotation[0] += dx * 0.28;
        rotation[1] = clamp(rotation[1] - dy * 0.28, -85, 85);
        last.x = x; last.y = y;
        lastInteract = performance.now();
        flyTarget = null;
      } else {
        const c = hitTest([x, y]);
        const iso = c ? c.iso : null;
        if (iso !== hoveredIso) {
          hoveredIso = iso;
          canvas.style.cursor = iso ? "pointer" : "grab";
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      const wasTap = dragging && last.moved < 6 && performance.now() - downAt < 400;
      dragging = false;
      lastInteract = performance.now();
      canvas.releasePointerCapture?.(e.pointerId);
      if (wasTap) {
        const c = hitTest(pointer(e));
        if (c) {
          const a = active.find((x) => x.country.iso === c.iso);
          if (a) flyTarget = [-a.centroid[0], -a.centroid[1]];
          onSelectRef.current?.(c);
        }
      }
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", () => { hoveredIso = null; });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, [active, colors.active, colors.activeStroke, colors.glow, colors.graticule, colors.hover, colors.label, colors.land, colors.landStroke, colors.marker, colors.ocean1, colors.ocean2]);

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%", height: "100%", touchAction: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
