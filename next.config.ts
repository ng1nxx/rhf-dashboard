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

  /**
   * Loaded by Node at runtime instead of being bundled.
   *
   * `@libsql/client` ships both a Node build and a browser build in its export
   * map, and the browser one talks to a different transport. Leaving the choice
   * to the bundler is a decision nobody would make deliberately, so it is made
   * here — which is also what Prisma recommends for every driver adapter.
   */
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],
};

export default nextConfig;
