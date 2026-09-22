"use client";

import { useEffect } from "react";

/**
 * Registers the kiosk service worker so the borne works offline once it has
 * been opened online at least once (it precaches the page, media and assets).
 * Registered at root scope so it can cache the immutable /_next/static chunks.
 */
export function OfflineRegister() {
  useEffect(() => {
    // Inside the native Android APK (Capacitor) everything is already bundled,
    // so skip the SW — it isn't needed and would intercept WebView requests.
    if (typeof window !== "undefined" && (window as unknown as { Capacitor?: unknown }).Capacitor) {
      return;
    }
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw-evenement.js", { scope: "/" })
        .catch(() => {});
    }
  }, []);
  return null;
}
