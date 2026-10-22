"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

/** Photo grid of a projet phare; a tap opens a full-screen viewer (arrows, swipe, Esc). */
export function ProjetGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i == null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  let touchX = 0;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-md bg-[#eef3f8] ${i === 0 && images.length > 2 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]"}`}
            aria-label={`${title} — image ${i + 1} sur ${images.length}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : "(min-width:768px) 33vw, 50vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Icon icon="ph:arrows-out-bold" width={16} height={16} />
            </span>
          </button>
        ))}
      </div>

      {open != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071524]/95"
          onClick={close}
          onTouchStart={(e) => { touchX = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <div className="relative h-[82vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[open]} alt="" fill sizes="92vw" className="object-contain" />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {open + 1} / {images.length}
          </p>
          <button type="button" onClick={close} aria-label="Fermer" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <Icon icon="ph:x-bold" width={20} height={20} />
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Image précédente" className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <Icon icon="ph:caret-left-bold" width={22} height={22} />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Image suivante" className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <Icon icon="ph:caret-right-bold" width={22} height={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
