"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated number that counts up from 0 to its value when scrolled into view.
 * Accepts the full display string (e.g. "+200 000", "+27 km", "6") and keeps
 * any non-numeric prefix/suffix static while animating the number itself.
 */
export function CountUp({
  value,
  duration = 1700,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(/^(\D*?)([\d\s .,]*\d)(.*)$/);
  const prefix = match ? match[1] : "";
  const numStr = match ? match[2] : "";
  const suffix = match ? match[3] : "";
  const target = numStr ? parseInt(numStr.replace(/[^\d]/g, ""), 10) : NaN;
  const hasNum = !Number.isNaN(target);

  const fmt = (n: number) => n.toLocaleString("fr-FR");

  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(hasNum ? "0" : value);

  useEffect(() => {
    if (!hasNum) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(fmt(target));
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let running = false;

    const run = () => {
      if (running) return;
      running = true;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(fmt(Math.round(target * eased)));
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          running = false;
        }
      };
      raf = requestAnimationFrame(step);
    };

    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      running = false;
      setDisplay("0");
    };

    // Start counting when the number has clearly entered the viewport, and
    // reset once it has fully scrolled out — so the animation replays (and is
    // therefore always seen) each time the numbers come back into view.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.35) run();
          else if (e.intersectionRatio === 0) reset();
        }
      },
      { threshold: [0, 0.35], rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hasNum, target, duration]);

  if (!hasNum) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
