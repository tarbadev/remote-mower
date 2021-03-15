const HtmlWebpackPlugin = require('html-webpack-plugin')
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config')
const path = require('path')

module.exports = merge(base, {
  mode: 'production',
  devtool: 'nosources-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.MAPS_KEY': JSON.stringify(process.env.MAPS_KEY)
    }),
    new webpack.NormalModuleReplacementPlugin(
      /src\/shared\/app\.config\.js/,
      './app.config.prod.js'
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
        'script-src': ['\'self\'', 'https://*.googleapis.com'],
        'script-src-elem': ['\'self\'', 'https://*.googleapis.com'],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https://*.googleapis.com'],
        'frame-src': ['\'none\''],
        'worker-src': ['\'none\''],
        'img-src': ['data:', 'maps.gstatic.com', 'https://*.googleapis.com', '*.ggpht'],
      },
      {
        hashEnabled: {
          'style-src': false,
        },
      },
    ),
  ],
})
