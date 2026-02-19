/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next Image optimizer'ı kapatıyoruz
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'theempower.org',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

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