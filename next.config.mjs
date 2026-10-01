/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', <--- Desactivado para permitir funciones/APIs dinámicas en Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.ucarecdn.com',
      },
    ],
  },
}

export default nextConfig
