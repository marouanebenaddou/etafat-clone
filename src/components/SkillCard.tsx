import Link from "next/link";
import { Icon } from "@iconify/react";
import { iconForSkillTitle } from "./skill-icons";

interface SkillCardProps {
  title: string;
  href?: string;
}

/**
 * Compact savoir-faire card matching the geofit "Les savoir-faire associés" layout:
 * centered icon, title, then an "Explorer" underline link.
 */
export function SkillCard({ title, href }: SkillCardProps) {
  const iconName = iconForSkillTitle(title);

  const inner = (
    <>
      <Icon
        icon={iconName}
        width={48}
        height={48}
        className="mx-auto text-[#00669d] transition-transform duration-300 group-hover:-translate-y-1"
        aria-hidden
      />
      <h3 className="mt-5 text-navy text-base md:text-lg font-medium leading-tight">
        {title}
      </h3>
      {href && (
        <span className="mt-3 inline-block text-[#00669d] text-sm font-medium underline underline-offset-4 decoration-1 group-hover:decoration-2">
          Explorer
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group block text-center px-2 py-4">
        {inner}
      </Link>
    );
  }
  return <div className="block text-center px-2 py-4">{inner}</div>;
}
