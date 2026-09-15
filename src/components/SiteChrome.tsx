"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CookieButton } from "./CookieButton";

/**
 * Renders the normal site chrome (header / footer / cookie button) on every
 * page EXCEPT the fullscreen kiosk experience at /evenement, which is meant to
 * run immersively on a touch screen without any site navigation.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isKiosk = pathname === "/evenement" || pathname?.startsWith("/evenement/");

  if (isKiosk) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CookieButton />
    </>
  );
}
