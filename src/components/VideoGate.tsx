"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Full-screen loading gate for pages with a hero video.
 *
 * Keeps a navy splash (ETAFAT logo + spinner) over the whole page until the
 * hero <video> — marked with the `data-hero-video` attribute — has buffered
 * enough to start playing, then fades the splash out so the page reveals with
 * the video already running. A 5s safety timeout guarantees the gate never
 * blocks the page, and media errors also release it.
 */
export function VideoGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
    if (!video) {
      setReady(true);
      return;
    }
    // Already buffered enough to play a frame.
    if (video.readyState >= 3) {
      setReady(true);
      return;
    }
    const reveal = () => setReady(true);
    video.addEventListener("canplay", reveal, { once: true });
    video.addEventListener("loadeddata", reveal, { once: true });
    video.addEventListener("error", reveal, { once: true });
    // Safety: never hold the page for more than 5s (slow networks, codec stalls…).
    const timer = window.setTimeout(reveal, 5000);
    return () => {
      video.removeEventListener("canplay", reveal);
      video.removeEventListener("loadeddata", reveal);
      video.removeEventListener("error", reveal);
      window.clearTimeout(timer);
    };
  }, []);

  // Lock page scroll while the splash is covering the page.
  useEffect(() => {
    if (ready) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ready]);

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
