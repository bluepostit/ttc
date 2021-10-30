const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'

const plugins = [
  new InjectManifest({
    swSrc: './service-worker.js',
    swDest: 'service-worker.js',
    additionalManifestEntries: [
      { url: '/', revision: null },
      { url: '/offline', revision: null }
    ]
  })
]
if (!devMode) {
  plugins.push(new MiniCssExtractPlugin())
}

module.exports = {
  entry: './client/src/index.js',
  output: {
    filename: 'main.js',
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
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
      }
    ]
  }
}
