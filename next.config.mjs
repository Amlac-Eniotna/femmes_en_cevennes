/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Désactiver l'optimisation d'image
    domains: ["femmes-en-cevennes.fr"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "femmes-en-cevennes.fr",
        pathname: "/uploads/**",
      },
    ],
  },
  // Ajoutez cette configuration
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
