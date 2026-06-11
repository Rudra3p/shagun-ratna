/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false, // Security: Hides tech stack details
  
  // Updated Image configuration for Cloudflare R2
  // images: {
  //   loader: 'custom',
  //   loaderFile: './lib/image-loader.js',
  // },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  experimental: {
    // Keep this false to save RAM on your Render 512MB tier
    preloadEntriesOnStart: false, 
  },
};

module.exports = nextConfig;