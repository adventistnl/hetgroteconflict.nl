import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from bundling native Node.js addons used by `ws`.
      // Without this, bufferutil/utf-8-validate are inlined as broken JS stubs,
      // causing "bufferUtil.mask is not a function" at runtime.
      const externals = Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean);
      config.externals = [...externals, "bufferutil", "utf-8-validate"];
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "esda-instituut.nl",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
