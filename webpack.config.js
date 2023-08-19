const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
// const Webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');

module.exports = {
  mode: 'development',
  entry: './src/scripts/controller.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'assets', 'scripts'),
    publicPath: 'assets/scripts/',
  },
  devtool: 'eval-source-map',
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                { useBuiltIns: 'usage', corejs: { version: 3 } },
              ],
            ],
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: './',
    },
  },
  // options: {
  //   presets: [['@babel/preset-env', { targets: 'defaults' }]],
  // },
  // devServer: {
  //   contentBase: './',
  // },
};
