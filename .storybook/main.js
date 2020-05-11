const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader')
      // options: {
      //   presets: [['react-app', { flow: false, typescript: true }]]
      // }
    });
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  }
};
