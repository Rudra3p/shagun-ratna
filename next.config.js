/** @type {import('next').NextConfig} */

// 🧠 Extract just the clean domain string from your full environment URL link
const getR2Hostname = () => {
  const envUrl = process.env.R2_PUBLIC_DOMAIN;
  if (!envUrl) return 'pub-3e6442832e1e4d26bb905e2268326caa.r2.dev'; // Local fallback
  
  return envUrl
    .replace('https://', '')
    .replace('http://', '')
    .split('/')[0]; // Removes any accidental trailing slashes
};

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false, 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // 🚀 Pulls the dynamically cleaned hostname straight from your Render env!
        hostname: getR2Hostname(), 
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