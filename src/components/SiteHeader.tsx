"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon, CloseIcon, SearchIcon } from "./icons";
import { MegaMenu } from "./MegaMenu";
import { cn } from "@/lib/utils";

/**
 * Pages whose hero is a full-screen DARK background — header should be
 * transparent + white text when at the top of the page (over the hero).
 * On any other page, the header is white-bg from the start.
 */
function isDarkHeroPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  // Domain detail pages have video heroes: /domaines-activite/<slug>/
  if (/^\/domaines-activite\/[^/]+\/?$/.test(pathname)) return true;
  return false;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hasDarkHero = isDarkHeroPath(pathname);

  // "transparent mode" = on a dark-hero page AND not scrolled past the hero AND menu not open
  const transparent = hasDarkHero && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          open
            ? "bg-transparent"
            : transparent
              ? "bg-transparent"
              : scrolled
                ? "bg-white/95 backdrop-blur shadow-sm"
                : "bg-white shadow-sm",
        )}
        style={{ height: 116 }}
      >
        <div className="container-etafat h-full flex items-center justify-between">
          <Link href="/" aria-label="ETAFAT — Accueil" className="flex items-center">
            <Image
              src="/etafat/logo.png"
              alt="ETAFAT"
              width={167}
              height={143}
              priority
              className={cn(
                "h-14 w-auto transition-[filter] duration-300",
                // when over the dark hero or inside the mega-menu, force the
                // colored logo to render as a pure white silhouette
                open || transparent ? "[filter:brightness(0)_invert(1)]" : "",
              )}
            />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link
                href="/nous-rejoindre/"
                className={cn(
                  "font-medium hover:text-[#00669d] transition-colors",
                  open || transparent ? "text-white" : "text-[#313c4e]",
                )}
              >
                Nous rejoindre
              </Link>
              <Link
                href="/contact/"
                className={cn(
                  "pill",
                  open || transparent
                    ? "pill-outline"
                    : "border-2 border-[#313c4e] text-[#313c4e] hover:bg-[#313c4e] hover:text-white",
                )}
              >
                Nous contacter
              </Link>
            </nav>

            <button
              aria-label="Rechercher"
              className={cn(
                "p-2 rounded-full transition-colors",
                open || transparent
                  ? "text-white hover:bg-white/10"
                  : "text-[#313c4e] hover:bg-black/5",
              )}
            >
              <SearchIcon width={20} height={20} />
            </button>

            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="pill pill-teal min-w-[100px] justify-between"
            >
              <span>{open ? "Fermer" : "Menu"}</span>
              {open ? (
                <CloseIcon width={14} height={14} />
              ) : (
                <MenuIcon width={18} height={12} />
              )}
            </button>
          </div>
        </div>
      </header>

      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
