"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

/**
 * Reusable click-to-play video lightbox. `children` is the visible trigger
 * (a pill, or a poster + play button). Clicking opens the self-hosted video
 * full-screen with sound (the click is the user gesture that allows autoplay).
 * The overlay is rendered through a portal to document.body so it is never
 * trapped by a transformed ancestor (e.g. a <Reveal>). Closes on ✕, backdrop
 * click, or Escape, and locks body scroll while open.
 */
export function VideoLightbox({
  src,
  className,
  ariaLabel = "Lecture vidéo",
  children,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </button>

      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <button
            type="button"
            aria-label="Fermer la vidéo"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Icon icon="ph:x-bold" width={22} height={22} />
          </button>
          <video
            src={src}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] w-auto max-w-6xl rounded-lg shadow-2xl"
          />
        </div>,
        document.body,
      )}
    </>
  );
}
