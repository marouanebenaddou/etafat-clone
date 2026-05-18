"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  /** translate distance in px (default 24) */
  y?: number;
  /** revisitable: if true, animation replays each time it enters viewport */
  once?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps children in a div that fades + slides up on scroll into view.
 * Uses IntersectionObserver. Respects `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, reduced]);

  const style: React.CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    // @ts-expect-error dynamic intrinsic element
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
