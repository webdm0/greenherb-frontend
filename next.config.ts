import type { NextConfig } from "next"

const rawBackendOrigin = process.env.BACKEND_ORIGIN?.trim()
const backendOrigin = rawBackendOrigin
  ? rawBackendOrigin.replace(/\/+$/, "")
  : null

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5187",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
      },
    ],
  },
  async rewrites() {
    if (!backendOrigin) {
      return []
    }

    return [
      {
        source: "/backend/:path*",
        destination: `${backendOrigin}/:path*`,
      },
    ]
  },
}

export default nextConfig
