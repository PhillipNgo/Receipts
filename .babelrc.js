const path = require("path");

module.exports = {
  presets: ["next/babel"],
  plugins: [
    "babel-plugin-syntax-hermes-parser",
    "babel-plugin-transform-flow-enums",
    "transform-flow-strip-types",
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV === "development",
        runtimeInjection: true,
        genConditionalClasses: true,
        treeshakeCompensation: true,
        aliases: {
          "@/*": [path.join(__dirname, "*")],
        },
        unstable_moduleResolution: {
          type: "commonJS",
          rootDir: __dirname,
        },
      },
    ],
  ],
};
