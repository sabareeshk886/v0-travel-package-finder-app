/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Fernwayinternal',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig