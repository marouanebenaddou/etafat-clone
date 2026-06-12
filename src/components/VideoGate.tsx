"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * One-time loading gate for the hero video.
 *
 * Shows a navy splash (ETAFAT logo + spinner) over the page on the INITIAL
 * site load, holding until the hero <video> — marked `data-hero-video` — can
 * play, then fades out. It is consumed after the first reveal, so client-side
 * navigation between pages never shows the splash again (until a full reload).
 * A 5s safety timeout and media-error handling guarantee it never hangs.
 */
let gateConsumed = false;

export function VideoGate() {
  // On a fresh page load the gate hasn't been consumed → show splash.
  // On in-app navigation it's already consumed → start revealed (no splash).
  const [ready, setReady] = useState(() => gateConsumed);
  // Whether THIS mount is the initial gate (vs a later navigation mount).
  const [isInitialGate] = useState(() => !gateConsumed);

  useEffect(() => {
    if (gateConsumed) {
      setReady(true);
      return;
    }

    const reveal = () => {
      gateConsumed = true;
      setReady(true);
    };

    const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
    if (!video || video.readyState >= 3) {
      reveal();
      return;
    }

    video.addEventListener("canplay", reveal, { once: true });
    video.addEventListener("loadeddata", reveal, { once: true });
    video.addEventListener("error", reveal, { once: true });
    // Safety: never hold the page for more than 5s.
    const timer = window.setTimeout(reveal, 5000);
    return () => {
      video.removeEventListener("canplay", reveal);
      video.removeEventListener("loadeddata", reveal);
      video.removeEventListener("error", reveal);
      window.clearTimeout(timer);
    };
  }, []);

  // Lock page scroll only while the splash is actually covering the page.
  useEffect(() => {
    if (ready) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ready]);

  // Navigation mounts never render the splash; only the initial gate does
  // (and it stays mounted long enough to fade out).
  if (!isInitialGate) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#313c4e] transition-opacity duration-700 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <Image
          src="/etafat/logo.png"
          alt="ETAFAT"
          width={167}
          height={143}
          priority
          className="h-16 w-auto animate-pulse [filter:brightness(0)_invert(1)]"
        />
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      </div>
    </div>
  );
}
