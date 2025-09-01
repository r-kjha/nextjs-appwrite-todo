/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Appwrite Pages deployment
  output: 'export',
  
  // Disable server-side features for static export
  trailingSlash: true,
  
  // Handle images for static export
  images: {
    unoptimized: true
  },

  // Optional: Add base path if deploying to subdirectory
  // basePath: '/your-app-name',
  
  // Optional: Asset prefix for CDN
  // assetPrefix: 'https://your-cdn.com',
};

export default nextConfig;
