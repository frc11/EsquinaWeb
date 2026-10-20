import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Next 16 solo acepta las calidades de esta lista (`qualities`, por defecto
    // `[75]`): un `quality` fuera de ella se lleva a la más cercana. 75 sigue
    // siendo el valor de todo `<Image>` sin `quality`; 82 lo piden solo las
    // imágenes de proyecto (R4, ver `ProjectContentRenderer.tsx`).
    qualities: [75, 82],
  },
};

export default nextConfig;
