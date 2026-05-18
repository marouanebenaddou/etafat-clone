"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const groupLinks = [
  { label: "Identité", href: "/identite/" },
  { label: "Agences", href: "/agences/" },
  { label: "Filiales", href: "/filiales/" },
  { label: "Engagements", href: "/engagements/" },
  { label: "Actualités", href: "/actualites/" },
  { label: "Nous rejoindre", href: "/nous-rejoindre/" },
];

const offerLinks = [
  { label: "Domaines d'activité", href: "/domaines-activite/" },
  { label: "Savoir-faire", href: "/savoir-faire/" },
  { label: "Références", href: "/references/" },
  { label: "Innovation", href: "/innovation/" },
];

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-opacity duration-300 overflow-hidden",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      style={{ backgroundColor: "#313c4e" }}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/etafat/icon.png"
          alt=""
          aria-hidden
          width={1834}
          height={1608}
          priority={false}
          className="absolute opacity-[0.06]"
          style={{
            width: "min(70vw, 900px)",
            height: "auto",
            left: "10%",
            top: "8%",
          }}
        />
      </div>

      <div className="container-etafat pt-[160px] pb-20 relative">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <section>
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-8" style={{ color: "#fff" }}>
              Le Groupe
            </h2>
            <ul className="space-y-5">
              {groupLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="text-white/90 hover:text-[#00669d] transition-colors text-2xl md:text-3xl font-medium"
                    style={{ fontFamily: "var(--font-figtree)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-8" style={{ color: "#fff" }}>
              Notre offre
            </h2>
            <ul className="space-y-5">
              {offerLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="text-white/90 hover:text-[#00669d] transition-colors text-2xl md:text-3xl font-medium"
                    style={{ fontFamily: "var(--font-figtree)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
