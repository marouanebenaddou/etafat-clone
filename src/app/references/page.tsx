import { ReferencesExplorer } from "@/components/ReferencesExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos références - ETAFAT",
  description:
    "Découvrez les projets phares menés par ETAFAT au Maroc, en Afrique et à l'international : aménagement, foncier, infrastructures, énergie, agriculture et patrimoine.",
};

export default function ReferencesPage() {
  return <ReferencesExplorer />;
}
