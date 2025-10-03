/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io', 'cdn.builder.io', 'i.postimg.cc'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;