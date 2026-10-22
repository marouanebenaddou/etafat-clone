"use client";

import { useEffect, useRef } from "react";
import { Pill } from "@/components/Pill";
import { Reveal } from "@/components/Reveal";
import { VideoLightbox } from "@/components/VideoLightbox";
import { PlayIcon } from "@/components/icons";

const FILM = "/etafat/videos/film-institutionnel.mp4";
const TEASER = "/etafat/videos/film-institutionnel-teaser.mp4"; // 16 s silent loop cut from the film
const POSTER = "/etafat/videos/film-institutionnel-poster.jpg";

/**
 * Home "Ce qui guide notre expertise": a wide cinematic panel — a silent loop of the institutional film plays
 * behind the text (only while on screen, never with reduced motion) and "Regarder le film" opens it with sound.
 */
export function FilmPanel() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-[#f5f7f9] py-16 md:py-24">
      <div className="container-etafat">
        <Reveal variant="zoom-out" duration={1100}>
          <div className="relative min-h-[600px] overflow-hidden rounded-xl bg-[#0a1e30] md:aspect-[21/9] md:min-h-[520px]">
            <video
              ref={ref}
              src={TEASER}
              poster={POSTER}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e30] via-[#0a1e30]/70 to-[#0a1e30]/10 md:bg-gradient-to-r md:from-[#0a1e30]/95 md:via-[#0a1e30]/55 md:to-transparent" />

            <div className="relative z-10 flex h-full min-h-[600px] max-w-2xl flex-col justify-end p-8 text-white md:min-h-0 md:justify-center md:p-14 lg:p-16">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8ee6e4] backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2ab5b4]" />
                Film institutionnel
              </span>
              <h2 className="mb-5 leading-tight" style={{ color: "#fff" }}>
                Ce qui guide
                <br />
                notre expertise
              </h2>
              <p className="mb-8 max-w-lg leading-relaxed text-white/85">
                Nous plaçons l&apos;excellence, l&apos;innovation et la responsabilité au centre de nos actions. Du
                terrain à la donnée, découvrez en deux minutes ce qui anime nos équipes.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <VideoLightbox
                  src={FILM}
                  ariaLabel="Film institutionnel ETAFAT"
                  className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white py-2 pl-2 pr-6 font-semibold text-navy shadow-lg transition-transform hover:scale-[1.03]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00669d] text-white transition-colors group-hover:bg-[#2ab5b4]">
                    <PlayIcon width={18} height={18} />
                  </span>
                  Regarder le film
                  <span className="text-sm font-medium text-body">2 min 10</span>
                </VideoLightbox>
                <Pill href="/identite/" variant="outline" arrow="right">
                  Découvrir notre vision
                </Pill>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
