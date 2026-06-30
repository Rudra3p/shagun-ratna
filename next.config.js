/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false, 
  
  // 🚀 OPTION B ACTIVATED: Custom optimization loader for Cloudflare R2
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js', // 👈 Ensure this matches your file path exactly
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
    ];
  },
  experimental: {
    preloadEntriesOnStart: false, 
  },
};

module.exports = nextConfig;