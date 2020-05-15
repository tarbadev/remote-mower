const HtmlWebpackPlugin = require('html-webpack-plugin')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const base = require('./webpack.config')
const path = require('path')

module.exports = merge(base, {
  mode: 'production',
  devtool: 'nosources-source-map',
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index-prod.html'),
      filename: 'index.html',
    }),
    new CspHtmlWebpackPlugin(
      {
        'base-uri': ['\'self\''],
        'object-src': ['\'none\''],
        'script-src': ['\'self\''],
        'style-src': ['\'self\'', '\'unsafe-inline\''],
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
