const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const devMode = process.env.NODE_ENV !== 'production'

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/views/base.html'),
    filename: path.resolve(__dirname, 'src/views/base.njk'),
    publicPath: '/client/dist/'
  }),
  new MiniCssExtractPlugin({
    filename: devMode ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
  }),
  new InjectManifest({
    swSrc: './service-worker.js',
    swDest: 'service-worker.js',
    additionalManifestEntries: [
      { url: '/', revision: null },
      { url: '/offline', revision: null }
    ]
  }),
  new VueLoaderPlugin()
]

module.exports = {
  entry: './client/src/index.js',
  output: {
    filename: devMode ? 'main.js' : 'main.[contenthash].js',
    path: path.resolve(__dirname, 'client', 'dist')
  },
  plugins,
  watch: false,
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
