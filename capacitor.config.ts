import type { CapacitorConfig } from "@capacitor/cli";

/**
 * ETAFAT borne tactile — Android kiosk wrapper.
 * The web assets in cap-www/ are a fully static export of the /evenement kiosk
 * (see scripts/build-kiosk.mjs). Everything is bundled inside the APK, so the
 * tablet needs no internet at all. WebGL is on by default in the Android
 * WebView, so BIM .glb (model-viewer, bundled locally) and Cesium 3D Tiles
 * added later render offline too.
 */
const config: CapacitorConfig = {
  appId: "ma.etafat.borne",
  appName: "ETAFAT Borne",
  webDir: "cap-www",
  android: {
    allowMixedContent: true,
  },
};

export default config;
