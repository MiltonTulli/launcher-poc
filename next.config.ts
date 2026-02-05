import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Existing externals
    config.externals.push("pino-pretty", "lokijs", "encoding");

    if (!isServer) {
      // Fix for MetaMask SDK warning about @react-native-async-storage
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "@react-native-async-storage/async-storage": false,
      };
    }

    // Ignore the warning for @react-native-async-storage
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@metamask\/sdk/,
        message: /@react-native-async-storage/,
      },
    ];

    return config;
  },
};

export default nextConfig;
