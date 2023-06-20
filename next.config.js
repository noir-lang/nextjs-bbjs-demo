const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(
                __dirname,
                "node_modules/@aztec/bb.js/dest/barretenberg.wasm"
              ),
              to: path.resolve(__dirname, "public/barretenberg.wasm"),
            },
          ],
        })
      );
    }

    console.log(
      "CopyWebpackPlugin executed! Check /public for barretenberg.wasm"
    );

    return config;
  },
};
