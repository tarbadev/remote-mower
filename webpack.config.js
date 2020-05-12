const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const DIST = path.resolve(__dirname, 'build/dist')
const SRC = path.resolve(__dirname, 'src')

module.exports = {
  target: 'web',
  entry: ['./src/index.js'],
  output: {
    path: DIST,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        include: [SRC],
        use: {
          loader: 'html-loader',
          options: {
            attributes: {
              'list': [{
                'tag': 'img',
                'attribute': 'data-src',
                'type': 'src',
              }],
            },
          },
        },
      },
      {
        test: /\.jsx?$/,
        include: [SRC],
        loader: 'babel-loader',
        resolve: {
          extensions: ['.js', '.jsx', '.json'],
        },
      },
      {
        test: /\.css$/,
        include: [SRC],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
        ],
        resolve: {
          extensions: ['.css'],
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: 'url-loader',
      },
    ],
  },
}
