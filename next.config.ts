import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "geofit.fr",
        pathname: "/wp-content/**",
      },
    ],
  },
  // Allow trailing slashes since the original site uses them
  trailingSlash: true,
};

export default nextConfig;
