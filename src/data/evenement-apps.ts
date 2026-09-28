// Field applications featured on the borne's "Applications" tile. The apps are
// installed on the borne (Android tablet); tapping a card launches the app
// directly via the native bridge (window.BorneApps.launch(pkg) in MainActivity).
export type BorneApp = {
  key: string;
  name: string;
  icon: string;
  tagline: string;
  pkg: string; // Android package name to launch on the borne
};

export const BORNE_APPS: BorneApp[] = [
  {
    key: "procasef",
    name: "PROCASEF",
    icon: "ph:map-trifold-duotone",
    tagline:
      "Sécurisation foncière rurale — enquêtes, délimitation et levé des parcelles (Sénégal).",
    pkg: "ma.etafat.procasef",
  },
  {
    key: "presfor",
    name: "PRESFOR",
    icon: "ph:plant-duotone",
    tagline: "Renforcement de la sécurisation foncière rurale (Côte d'Ivoire).",
    pkg: "com.devari.etafat.presfor",
  },
  {
    key: "srm",
    name: "SRM",
    icon: "ph:buildings-duotone",
    tagline: "Suivi et relevé de terrain — projet SRM, Casablanca.",
    pkg: "com.srm.collecte.casa",
  },
];
