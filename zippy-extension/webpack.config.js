const path = require('path');
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

module.exports ={
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
  }, // 진입점
  module : {
    rules : [
      {
        use: 'ts-loader',
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/manifest.json'),
          to: path.resolve('dist')
        }
      ]
    }),
    
    new HtmlPlugin({
      title: '지피지기',
      filename: "popup.html",
      chunks: ['popup'],
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js', // 청크 네임으로 나오는듯..?
    path: path.resolve('dist')
  }
}