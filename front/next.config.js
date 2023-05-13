const withTM = require("next-transpile-modules")([
  "@lens-protocol/widgets-react",
]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.js$/,
      use: [options.defaultLoaders.babel],
      include: [/node_modules\/@lens-protocol/],
    });

    return config;
  },
};

module.exports = withTM(nextConfig);
