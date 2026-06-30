/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false, 
  
  images: {
    // ❌ DEACTIVATED: Comment these out completely right now
    // loader: 'custom',
    // loaderFile: './lib/image-loader.js', 
    
    // 🚀 OPTION A ACTIVATED: Pull raw files directly from your R2 bucket link
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Keeps external test placeholders safe
      },
      {
        protocol: 'https',
        // 🧠 Put your exact R2 public domain here (the one from your process.env.R2_PUBLIC_DOMAIN)
        // e.g., "pub-12345abcde.r2.dev" or "assets.yourbrand.com"
        hostname: 'your-r2-public-domain.com', 
      },
    ],
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