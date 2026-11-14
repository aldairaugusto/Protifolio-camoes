/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Uploads de foto/CV via Server Action (a Vercel limita o pedido a ~4,5 MB)
    serverActions: { bodySizeLimit: "5mb" },
  },
};
export default nextConfig;
