import type { NextConfig } from "next";

// When KIOSK_EXPORT=1 we produce a fully static bundle (out/) for wrapping the
// /evenement kiosk in the offline Android APK. The normal (Vercel) build is
// untouched: no output:export, images stay optimized.
const isKioskExport = process.env.KIOSK_EXPORT === "1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "geofit.fr",
        pathname: "/wp-content/**",
      },
    ],
    // Static export can't run the image optimizer; the kiosk images are already
    // sized and marked unoptimized, so this only affects the export build.
    ...(isKioskExport ? { unoptimized: true } : {}),
  },
  ...(isKioskExport ? { output: "export" as const } : {}),
  // Allow trailing slashes since the original site uses them
  trailingSlash: true,
};

export default nextConfig;
