const HtmlWebpackPlugin = require('html-webpack-plugin')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config')
const path = require('path')

module.exports = merge(base, {
  mode: 'ci',
  devtool: 'nosources-source-map',
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /electron\/app\.config\.js/,
      './app.config.ci.js'
    ),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index-prod.html'),
      filename: 'index.html',
    }),
    new CspHtmlWebpackPlugin(
      {
        'base-uri': ['\'self\''],
        'object-src': ['\'none\''],
        'script-src': ['\'self\'', 'maps.googleapis.com'],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com'],
        'frame-src': ['\'none\''],
        'worker-src': ['\'none\''],
      },
      {
        hashEnabled: {
          'style-src': false,
        },
      },
    ),
  ],
})
