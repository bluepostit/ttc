const path = require('path')

module.exports = {
  entry: './client/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'client', 'dist')
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            }
          }
        ]
      }
    ]
  }
}
