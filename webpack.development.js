const HtmlWebpackPlugin = require('html-webpack-plugin')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const base = require('./webpack.config')
const path = require('path')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: 'localhost',
    port: '40992',
    hot: true,
    compress: true,
    contentBase: base.output.path,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
    }),
    new CspHtmlWebpackPlugin({
      'base-uri': ['\'self\''],
      'object-src': ['\'none\''],
      'script-src': ['\'self\'', 'maps.googleapis.com'],
      'style-src': ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com'],
      'frame-src': ['\'none\''],
      'worker-src': ['\'none\''],
    }),
  ],
})