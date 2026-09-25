"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const groupLinks = [
  { label: "Identité", href: "/identite/" },
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

// "Le Groupe" and "Notre offre" read as the main section titles, with their
// entries below as sub-items (clear hierarchy, per Camille's note).
const columns = [
  { title: "Le Groupe", links: groupLinks },
  { title: "Notre offre", links: offerLinks },
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
          {columns.map((col) => (
            <section key={col.title}>
              <h2
                className="text-white text-3xl md:text-4xl font-semibold"
                style={{ color: "#fff", fontFamily: "var(--font-figtree)" }}
              >
                {col.title}
              </h2>
              <div className="mt-3 mb-8 h-0.5 w-12 bg-[#00669d]" />
              <ul className="space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="text-white/80 hover:text-[#00669d] transition-colors text-lg md:text-xl font-medium"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
