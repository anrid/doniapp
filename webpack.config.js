'use strict'

const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')

const paths = {
  build: path.join(__dirname, 'build'),
  app: path.join(__dirname, 'app'),
  entry: path.join(__dirname, 'app', 'index.js')
}

module.exports = {
  entry: {
    app: paths.entry
  },
  output: {
    path: paths.build,
    pathinfo: true,
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer]
  }
}
