"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Notre vision", id: "vision" },
  { label: "Valeurs", id: "valeurs" },
  { label: "Direction", id: "direction" },
  { label: "Chiffres clés", id: "chiffres-cles" },
  { label: "Historique", id: "historique" },
];

export function IdentiteSubNav() {
  const [active, setActive] = useState<string>("vision");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
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
      className="sticky top-[116px] z-30 bg-white/95 backdrop-blur border-b border-[#e5e7eb]"
    >
      <div className="container-etafat">
        <ul className="flex items-center gap-6 md:gap-10 overflow-x-auto whitespace-nowrap py-4 text-sm">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => handleClick(e, l.id)}
                className={cn(
                  "transition-colors hover:text-navy",
                  active === l.id ? "text-navy font-semibold" : "text-body",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
