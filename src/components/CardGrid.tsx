import Image from "next/image";
import Link from "next/link";
import type { ScrapedItem } from "@/lib/content";

interface CardGridProps {
  items: ScrapedItem[];
  cols?: 2 | 3 | 4;
  tag?: string;
}

export function CardGrid({ items, cols = 3, tag }: CardGridProps) {
  const colClass =
    cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid ${colClass} gap-8`}>
      {items.map((item) => (
        <Link key={item.path} href={item.path} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-5 bg-[#e5e7eb]">
            {item.featuredImage && (
              <Image
                src={item.featuredImage}
                alt={item.title}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            {tag && (
              <span className="absolute top-3 left-3 pill pill-teal !py-1 !px-3 !text-[11px]">
                {tag}
              </span>
            )}
          </div>
          <h3 className="text-navy text-xl font-semibold mb-2 leading-tight group-hover:text-[#2ab5b4] transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-body line-clamp-2 text-sm">{item.description}</p>
          )}
        </Link>
      ))}
    </div>
  );
}

export function MiniCardGrid({
  items,
  cols = 3,
}: {
  items: { label: string; href: string }[];
  cols?: 2 | 3 | 4;
}) {
  const colClass =
    cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid ${colClass} gap-4`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-center justify-between px-6 py-5 border border-[#e5e7eb] rounded-md hover:border-[#2ab5b4] hover:shadow-md transition-all text-navy font-medium"
        >
          <span className="group-hover:text-[#2ab5b4]">{item.label}</span>
          <svg viewBox="0 0 14 14" fill="none" width={14} height={14} className="text-[#2ab5b4]">
            <path
              d="M2 7h10m0 0L7.5 2.5M12 7l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ))}
    </div>
  );
}
