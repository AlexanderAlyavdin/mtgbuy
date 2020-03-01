/* eslint-disable @typescript-eslint/explicit-function-return-type */

// 1. import default from the plugin module
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

module.exports = {
  webpack(config) {
    // console.log(JSON.stringify(config.module.rules, null, 2));
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [
                createStyledComponentsTransformer({
                  displayName: true,
                }),
              ],
            }),
          }
        }
      ]
    });
    return config;
  },
};
