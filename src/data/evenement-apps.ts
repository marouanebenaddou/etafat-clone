// Field applications featured on the borne's "Applications" tile. The APK files
// are bundled in the Android app (android/app/src/main/assets/apks/<apk>) and
// served by the in-app local HTTP server (ApkServer, port 8765). The kiosk shows
// a QR to http://<borne-lan-ip>:8765/apks/<apk> so a visitor on the borne's WiFi
// can install the app — fully offline, no internet needed.
export type BorneApp = {
  key: string;
  name: string;
  icon: string;
  tagline: string;
  apk: string; // filename under /apks/ served locally
  size: string;
  login?: string;
  password?: string;
  demo?: { title: string; note: string; codes: string[] };
};

export const BORNE_APPS: BorneApp[] = [
  {
    key: "procasef",
    name: "PROCASEF",
    icon: "ph:map-trifold-duotone",
    tagline:
      "Sécurisation foncière rurale — enquêtes, délimitation et levé des parcelles (Sénégal).",
    apk: "procasef.apk",
    size: "117 Mo",
    login: "agent.leve@procasef.sn",
    password: "123456",
    demo: {
      title: "Zones de démonstration",
      note: "À scanner dans l'application PROCASEF pour charger une zone (Mermoz / Sacré-Cœur).",
      codes: [
        "/etafat/evenement/apps/demo-1.png",
        "/etafat/evenement/apps/demo-2.png",
        "/etafat/evenement/apps/demo-3.png",
      ],
    },
  },
  {
    key: "presfor",
    name: "PRESFOR",
    icon: "ph:plant-duotone",
    tagline: "Renforcement de la sécurisation foncière rurale (Côte d'Ivoire).",
    apk: "presfor.apk",
    size: "51 Mo",
    login: "agent2@gmail.com",
    password: "123456",
  },
  {
    key: "srm",
    name: "SRM",
    icon: "ph:buildings-duotone",
    tagline: "Suivi et relevé de terrain — projet SRM, Casablanca.",
    apk: "srm.apk",
    size: "84 Mo",
    login: "agent2@gmail.com",
    password: "123456",
  },
];
