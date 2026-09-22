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
  // In the native Android APK the kiosk is served at the root path ("/"), so the
  // pathname check alone wouldn't catch it — detect the Capacitor WebView too.
  const isNativeApp =
    typeof window !== "undefined" &&
    !!(window as unknown as { Capacitor?: unknown }).Capacitor;
  const isKiosk =
    isNativeApp || pathname === "/evenement" || pathname?.startsWith("/evenement/");

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
