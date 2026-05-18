"use client";

import { CookieIcon } from "./icons";

export function CookieButton() {
  return (
    <button
      type="button"
      aria-label="Gérer les cookies"
      className="fixed bottom-4 left-4 w-12 h-12 rounded-full bg-[#1e4d6b] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center z-40"
    >
      <CookieIcon width={22} height={22} />
    </button>
  );
}
