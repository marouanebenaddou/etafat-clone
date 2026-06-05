"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Item =
  | { label: string; id: string }
  | { label: string; href: string };

const ITEMS: Item[] = [
  { label: "Pourquoi nous rejoindre", id: "pourquoi" },
  { label: "Processus de recrutement", id: "processus" },
  { label: "Témoignages", id: "temoignages" },
  { label: "Vision", id: "vision" },
  { label: "Offres d'emploi", href: "/offres-demploi/" },
];

export function NousRejoindreSubNav() {
  const [active, setActive] = useState<string>("pourquoi");

  useEffect(() => {
    const ids = ITEMS.filter((i): i is { label: string; id: string } => "id" in i).map(
      (i) => i.id,
    );
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-180px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 170;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Sections de la page"
      className="sticky top-[116px] z-30 border-b border-[#e5e7eb] bg-white/95 backdrop-blur"
    >
      <div className="container-etafat">
        <ul className="flex items-center gap-6 overflow-x-auto whitespace-nowrap py-4 text-sm md:gap-10">
          {ITEMS.map((item) =>
            "id" in item ? (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "transition-colors hover:text-navy",
                    active === item.id ? "font-semibold text-navy" : "text-body",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-body transition-colors hover:text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  );
}
