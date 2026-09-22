/**
 * Хостинг — свой сервер (timeweb.cloud): Node-процесс в контейнере за nginx,
 * поэтому сборка standalone.
 */

// Куда уходит /api в dev, когда NEXT_PUBLIC_API_URL не задан или указывает
// на localhost. В проде запросы идут прямо на https://api.djcode.ge и этот
// rewrite не используется.
const apiProxyTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:5050';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    // Превью роликов на странице хобби берутся прямо с ютуба.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },

  async rewrites() {
    if (process.env.NODE_ENV === 'production') return [];

    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
