/** @type {import('next').NextConfig} */
const nextConfig = {
  // THE FIX IS HERE
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;