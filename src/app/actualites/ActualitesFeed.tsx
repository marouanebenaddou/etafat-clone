"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { linkedinPosts, type LinkedInCategory } from "@/data/linkedin-posts";

const FILTERS: ("All" | LinkedInCategory)[] = [
  "All",
  "Divers",
  "Engagements",
  "Groupe",
  "Presse",
  "Projet",
];

export function ActualitesFeed() {
  const [active, setActive] = useState<"All" | LinkedInCategory>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? linkedinPosts
        : linkedinPosts.filter((p) => p.category === active),
    [active],
  );

  return (
    <div className="container-etafat py-16">
      {/* Category filter */}
      <nav
        aria-label="Filtrer les actualités"
        className="mb-12 border-b border-[#e5e7eb]"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {FILTERS.map((f) => (
            <li key={f}>
              <button
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={active === f}
                className={cn(
                  "relative -mb-px border-b-2 px-1 pb-4 pt-1 text-base transition-colors",
                  active === f
                    ? "border-teal font-semibold text-navy"
                    : "border-transparent text-body hover:text-navy",
                )}
              >
                {f}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-body">
          Aucune actualité dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <Reveal key={post.url} delay={(i % 3) * 100}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.title} — voir le post sur LinkedIn`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-[#e5e7eb]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#0a66c2] backdrop-blur">
                    <Icon icon="mdi:linkedin" width={14} height={14} />
                    LinkedIn
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-teal">
                    {post.date} · {post.category}
                  </p>
                  <h3 className="mb-2 text-lg font-semibold leading-tight text-navy transition-colors line-clamp-2 group-hover:text-[#00669d]">
                    {post.title}
                  </h3>
                  <p className="text-body line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#00669d]">
                    Voir sur LinkedIn
                    <Icon
                      icon="tabler:arrow-up-right"
                      width={15}
                      height={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
