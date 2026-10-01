import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { iconForSkillTitle, illustrationForSkillTitle } from "./skill-icons";

interface SkillCardProps {
  title: string;
  href?: string;
  /** Explicit picture (e.g. the domain page's own mockup); otherwise looked up by title. */
  illustration?: string;
}

/**
 * Savoir-faire card: illustrated picture on a white card, title, then "Explorer →".
 * Skills that have no illustration keep their line icon in the same card.
 */
export function SkillCard({ title, href, illustration }: SkillCardProps) {
  const picture = illustration ?? illustrationForSkillTitle(title);

  const inner = (
    <>
      {picture ? (
        <Image
          src={picture}
          alt=""
          width={240}
          height={180}
          className="mx-auto h-24 w-auto md:h-28 transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="mx-auto flex h-24 items-center justify-center md:h-28">
          <Icon
            icon={iconForSkillTitle(title)}
            width={52}
            height={52}
            className="text-[#00669d] transition-transform duration-300 group-hover:-translate-y-1"
            aria-hidden
          />
        </div>
      )}
      <h3 className="mt-3 mb-2 text-navy text-sm md:text-[0.95rem] font-semibold leading-snug">
        {title}
      </h3>
      {href && (
        <span className="mt-auto inline-flex items-center gap-1 text-[#00669d] text-xs md:text-sm font-semibold">
          Explorer
          <Icon icon="tabler:arrow-right" width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  const card =
    "group flex h-full flex-col items-center rounded-xl border border-[#e6edf3] bg-white px-3 pt-4 pb-5 text-center shadow-[0_2px_10px_rgba(16,58,96,0.06)] transition-all duration-300";
  if (href) {
    return (
      <Link href={href} className={`${card} hover:-translate-y-1 hover:border-[#bcd6ea] hover:shadow-[0_10px_28px_rgba(16,58,96,0.14)]`}>
        {inner}
      </Link>
    );
  }
  return <div className={card}>{inner}</div>;
}
