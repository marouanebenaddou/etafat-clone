"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

/**
 * "Voir la vidéo" button for the Vision section. Clicking opens the self-hosted
 * corporate video full-screen with sound (the click is the user gesture that
 * lets it autoplay). Closes on ✕, backdrop click, or Escape.
 */
export function VisionVideo({ src }: { src: string }) {
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
        className="pill border-2 border-white text-white transition-colors hover:bg-white hover:text-[#00669d]"
      >
        <Icon icon="ph:play-fill" width={14} height={14} />
        Voir la vidéo
      </button>

      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Vidéo — Notre vision"
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
