/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
        util: false,
        crypto: false,
        stream: false,
        buffer: false,
        url: false,
        querystring: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;