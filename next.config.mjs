/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the dev server to be reached from other devices on the LAN
  // (e.g. testing on a phone/another PC) without cross-origin warnings.
  allowedDevOrigins: ['192.168.1.178', '192.168.1.*', '*.local'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
