const path = require("path");
const stylexPlugin = require("@stylexjs/nextjs-plugin");

module.exports = stylexPlugin({
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  aliases: {
    "@/*": [path.join(__dirname, "*")],
  },
  rootDir: __dirname,
})({});
