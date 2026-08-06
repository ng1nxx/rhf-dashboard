import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Photos uploaded from the admin panel live on Cloudinary, and `next/image`
     * refuses any remote host it has not been told about. Without this entry
     * every uploaded image renders as an error instead of a photo.
     *
     * `images.domains` was removed in Next 16 — `remotePatterns` replaces it,
     * and it is narrower: the host is pinned rather than a whole domain.
     */
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
