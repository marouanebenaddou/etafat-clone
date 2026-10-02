// Field applications featured on the borne's "Applications" tile: their WEB versions. On the borne they open in a
// Chrome Custom Tab over the kiosk (window.BorneApps.openUrl in MainActivity; its ✕ comes back to the borne),
// elsewhere in a new browser tab. Logins are typed on the spot — never stored or shown here (public repo, and
// the apps are consulted only: nothing is created or modified from the borne).
export type BorneApp = {
  key: string;
  name: string;
  icon: string;
  tagline: string;
  url: string; // web app
  legacyUrl?: string; // previous version, still online
};

export const BORNE_APPS: BorneApp[] = [
  {
    key: "procasef",
    name: "PROCASEF",
    icon: "ph:map-trifold-duotone",
    tagline:
      "Sécurisation foncière rurale — enquêtes, délimitation et levé des parcelles (Sénégal).",
    url: "http://81.192.142.205:5056/",
    legacyUrl: "http://81.192.142.205:93/",
  },
  {
    key: "presfor",
    name: "PRESFOR",
    icon: "ph:plant-duotone",
    tagline: "Renforcement de la sécurisation foncière rurale (Côte d'Ivoire).",
    url: "http://81.192.142.205:8987/",
  },
  {
    key: "srm",
    name: "SRM",
    icon: "ph:buildings-duotone",
    tagline: "Suivi et relevé de terrain — projet SRM, Casablanca.",
    url: "https://srm-casa.etafat.ma:8443/login",
  },
];
