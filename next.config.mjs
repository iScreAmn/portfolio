/**
 * Хостинг — свой сервер (timeweb.cloud): Node-процесс за nginx, поэтому сборка
 * standalone. Vercel-специфика (vercel.json, rewrite на index.html) не нужна:
 * маршрутизацию теперь держит сам Next.
 */

// Куда уходит /api в dev — раньше это делал proxy из vite.config.js.
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
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
