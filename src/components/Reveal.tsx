"use client";

import { useEffect, useRef, useState } from "react";

type RevealVariant = "fade" | "zoom-out" | "line" | "flip-up";

interface RevealProps {
  children: React.ReactNode;
  /** ms before animation starts after entering viewport */
  delay?: number;
  /** translate distance in px (used by 'fade') */
  y?: number;
  /** which animation to play (matches Salient theme variants) */
  variant?: RevealVariant;
  /** if true (default), animation plays once on first entry */
  once?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  /** duration in ms */
  duration?: number;
}

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/**
 * Scroll-triggered reveal matching Salient theme animations.
 *
 * Variants:
 * - "fade" (default): fade-in + translateY (matches Salient `fade-in`)
 * - "zoom-out": starts slightly zoomed-in then settles (matches `zoom-out-reveal`)
 * - "line": clip-path reveal from below (matches `line-reveal-by-space` for headings)
 * - "flip-up": 3D rotation up (matches `flip-in-vertical`)
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  variant = "fade",
  once = true,
  className = "",
  as: Tag = "div",
  duration = 800,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    // If the element is ALREADY inside the viewport on mount (e.g. hero title),
    // fire after one frame so the CSS transition still plays.
    const rect = el.getBoundingClientRect();
    const initiallyVisible =
      rect.top < window.innerHeight && rect.bottom > 0;

    let raf = 0;
    if (initiallyVisible) {
      raf = requestAnimationFrame(() => setShown(true));
      if (once) {
        return () => {
          if (raf) cancelAnimationFrame(raf);
        };
      }
    }

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
    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [once, reduced]);

  const style: React.CSSProperties = {
    transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms, clip-path ${duration}ms ${EASE} ${delay}ms`,
    willChange: "opacity, transform",
  };

  if (variant === "fade") {
    style.opacity = shown ? 1 : 0;
    style.transform = shown ? "translateY(0)" : `translateY(${y}px)`;
  } else if (variant === "zoom-out") {
    style.opacity = shown ? 1 : 0;
    style.transform = shown ? "scale(1)" : "scale(1.08)";
  } else if (variant === "line") {
    style.opacity = shown ? 1 : 0;
    style.clipPath = shown
      ? "inset(0 0 0 0)"
      : "inset(0 0 100% 0)";
    style.transform = shown ? "translateY(0)" : "translateY(20px)";
  } else if (variant === "flip-up") {
    style.opacity = shown ? 1 : 0;
    style.transformOrigin = "50% 100%";
    style.transform = shown
      ? "perspective(800px) rotateX(0deg) translateY(0)"
      : "perspective(800px) rotateX(-12deg) translateY(20px)";
  }

  return (
    // @ts-expect-error dynamic intrinsic element
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
