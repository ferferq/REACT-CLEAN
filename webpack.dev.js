const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common')
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  entry: './src/main/index.tsx',
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      },{
        loader: 'css-loader',
        options: {
          modules: true
        }
      },{
        loader: 'sass-loader'
      },]
    }]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    devMiddleware: {
      writeToDisk: true,
    },
    historyApiFallback: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './template.dev.html'
    }),
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify('http://fordevs.herokuapp.com/api'),
    })
  ]
});