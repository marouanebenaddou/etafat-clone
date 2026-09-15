import type { Metadata, Viewport } from "next";
import { KioskApp } from "./KioskApp";

export const metadata: Metadata = {
  title: "ETAFAT — Projets phares | Borne tactile",
  description:
    "Présentation interactive des projets phares du Groupe ETAFAT, par thématique.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#eef4f9",
};

export default function EvenementPage() {
  return <KioskApp />;
}
