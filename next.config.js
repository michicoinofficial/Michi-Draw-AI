/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "*.replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "upcdn.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/replicate/scribble-diffusion",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js/scribble-diffusion",
        permanent: false,
      },
    ];
  },
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    imageKitPK: process.env.imageKitPK,
    imageKitSK: process.env.imageKitSK,
    imageKitUE: process.env.imageKitUE,
    DATABASE_URL: process.env.DATABASE_URL,
    NGROK_HOST: process.env.NGROK_HOST
  }
};

module.exports = nextConfig;
