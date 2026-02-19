/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "/uploads/:path*"
            : "/api/local-uploads/:path*",
      },
    ];
  },
};

export default nextConfig;