/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
