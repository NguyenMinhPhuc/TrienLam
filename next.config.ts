import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || "site-media";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!supabaseUrl) return [];
    const storageBase = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(storageBucket)}`;
    return [
      {
        source: "/uploads/:path*",
        destination: `${storageBase}/uploads/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${storageBase}/media/:path*`,
      },
      {
        source: "/image-placeholder\\.svg",
        destination: `${storageBase}/image-placeholder.svg`,
      },
    ];
  },
};

export default nextConfig;
