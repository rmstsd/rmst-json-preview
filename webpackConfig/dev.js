/**
 * @type {import('webpack').Configuration}
 */

const path = require('path')
const Hwb = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

const baseConfig = require('./base.js') // 引用公共的配置

const devConfig = {
  entry: './demo/index.js', // 入口文件
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../docs')
  },
  stats: 'errors-only',
  mode: 'development', // 打包为开发模式
  devtool: 'inline-source-map',
  devServer: {
    port: 3008,
    hot: true
  },
  plugins: [new Hwb({ template: './demo/public/index.html' })],
  module: {
    rules: [
      {
        test: /\.less$/,
        exclude: '/node_modules/',
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' }]
      }
    ]
  }
}

module.exports = merge(devConfig, baseConfig)
