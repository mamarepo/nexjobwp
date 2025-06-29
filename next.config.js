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
        source: '/lowongan-kerja/',
        destination: '/jobs',
      },
      {
        source: '/lowongan-kerja/:slug/',
        destination: '/jobs/:slug',
      },
      {
        source: '/artikel/',
        destination: '/articles',
      },
      {
        source: '/artikel/:slug/',
        destination: '/articles/:slug',
      },
      {
        source: '/bookmark/',
        destination: '/bookmarks',
      },
      {
        source: '/admin/',
        destination: '/admin',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/lowongan-kerja',
        destination: '/lowongan-kerja/',
        permanent: true,
      },
      {
        source: '/artikel',
        destination: '/artikel/',
        permanent: true,
      },
      {
        source: '/bookmark',
        destination: '/bookmark/',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/',
        permanent: true,
      },
    ];
  },
  trailingSlash: true,
  generateEtags: false,
  poweredByHeader: false,
};

module.exports = nextConfig;