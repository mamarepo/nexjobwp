/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['staging.nexjob.tech', 'nexjob.tech', 'images.pexels.com'],
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: '/lowongan-kerja',
        destination: '/jobs',
      },
      {
        source: '/lowongan-kerja/',
        destination: '/jobs',
      },
      {
        source: '/lowongan-kerja/:slug',
        destination: '/jobs/:slug',
      },
      {
        source: '/lowongan-kerja/:slug/',
        destination: '/jobs/:slug',
      },
      {
        source: '/artikel',
        destination: '/articles',
      },
      {
        source: '/artikel/',
        destination: '/articles',
      },
      {
        source: '/artikel/:slug',
        destination: '/articles/:slug',
      },
      {
        source: '/artikel/:slug/',
        destination: '/articles/:slug',
      },
      {
        source: '/bookmark',
        destination: '/bookmarks',
      },
      {
        source: '/bookmark/',
        destination: '/bookmarks',
      },
      {
        source: '/admin',
        destination: '/admin',
      },
      {
        source: '/admin/',
        destination: '/admin',
      },
    ];
  },
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
};

module.exports = nextConfig;