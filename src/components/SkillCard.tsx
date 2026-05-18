import Link from "next/link";
import { ArrowRightIcon } from "./icons";

interface SkillCardProps {
  index: number;
  title: string;
  short: string;
  href?: string;
}

export function SkillCard({ index, title, short, href }: SkillCardProps) {
  const cardInner = (
    <>
      <div className="flex items-baseline gap-3 mb-3">
        <span
          className="text-teal text-3xl font-semibold leading-none"
          style={{ fontFamily: "var(--font-figtree)" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="text-navy text-xl font-semibold leading-tight">{title}</h3>
      </div>
      <p className="text-body text-sm leading-relaxed mb-5">{short}</p>
      {href && (
        <span className="text-teal text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
          Explorer
          <span className="arrow-circle">
            <ArrowRightIcon width={11} height={11} />
          </span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block bg-white p-7 border border-[#e5e7eb] rounded-md hover:border-[#00669d] hover:shadow-md transition-all h-full"
      >
        {cardInner}
      </Link>
    );
  }
  return (
    <div className="bg-white p-7 border border-[#e5e7eb] rounded-md h-full">
      {cardInner}
    </div>
  );
}
