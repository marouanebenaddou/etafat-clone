"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogoIcon, MenuIcon, CloseIcon, SearchIcon } from "./icons";
import { MegaMenu } from "./MegaMenu";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            : scrolled
              ? "bg-white/95 backdrop-blur shadow-sm"
              : "bg-white/75 backdrop-blur-sm",
        )}
        style={{ height: 116 }}
      >
        <div className="container-etafat h-full flex items-center justify-between">
          <Link href="/" aria-label="ETAFAT — Accueil" className="flex items-center">
            <LogoIcon
              className={cn(
                "h-9 w-auto transition-colors",
                open ? "text-white" : "text-[#313c4e]",
              )}
            />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link
                href="/nous-rejoindre/"
                className={cn(
                  "font-medium hover:text-[#2ab5b4] transition-colors",
                  open ? "text-white" : "text-[#313c4e]",
                )}
              >
                Nous rejoindre
              </Link>
              <Link
                href="/contact/"
                className={cn(
                  "pill",
                  open ? "pill-outline" : "border-2 border-[#313c4e] text-[#313c4e] hover:bg-[#313c4e] hover:text-white",
                )}
              >
                Nous contacter
              </Link>
            </nav>

            <button
              aria-label="Rechercher"
              className={cn(
                "p-2 rounded-full hover:bg-black/5 transition-colors",
                open ? "text-white hover:bg-white/10" : "text-[#313c4e]",
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
