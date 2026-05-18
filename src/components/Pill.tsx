import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ChevronRightIcon } from "./icons";

type Variant = "teal" | "outline" | "outline-teal" | "ghost";
type Arrow = "right" | "chevron" | "none" | "outline";

interface PillProps {
  href?: string;
  variant?: Variant;
  arrow?: Arrow;
  className?: string;
  children: React.ReactNode;
}

export function Pill({
  href,
  variant = "teal",
  arrow = "none",
  className,
  children,
}: PillProps) {
  const variantClass =
    variant === "teal"
      ? "pill pill-teal"
      : variant === "outline"
        ? "pill pill-outline"
        : variant === "outline-teal"
          ? "pill pill-outline-teal"
          : "pill";

  const arrowEl =
    arrow === "right" ? (
      <span className="arrow-circle">
        <ArrowRightIcon width={12} height={12} />
      </span>
    ) : arrow === "outline" ? (
      <span className="arrow-circle-outline">
        <ChevronRightIcon width={10} height={10} />
      </span>
    ) : arrow === "chevron" ? (
      <ChevronRightIcon width={10} height={10} />
    ) : null;

  const inner = (
    <>
      <span>{children}</span>
      {arrowEl}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto");
    if (isExternal) {
      return (
        <a
          href={href}
          className={cn(variantClass, className)}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(variantClass, className)}>
        {inner}
      </Link>
    );
  }

  return <button className={cn(variantClass, className)}>{inner}</button>;
}
