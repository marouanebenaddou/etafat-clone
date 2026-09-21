"use client";

import { useEffect } from "react";

/**
 * Registers the kiosk service worker so the borne works offline once it has
 * been opened online at least once (it precaches the page, media and assets).
 * Registered at root scope so it can cache the immutable /_next/static chunks.
 */
export function OfflineRegister() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw-evenement.js", { scope: "/" })
        .catch(() => {});
    }
  }, []);
  return null;
}
