'use strict'

const precss = require('precss')
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'

let filename = 'bundle.js'
const paths = {
  build: path.join(__dirname, 'build'),
  app: path.join(__dirname, 'app'),
  entry: path.join(__dirname, 'app', 'index.js')
}

const plugins = [ ]

if (isProduction) {
  console.log('=== PRODUCTION BUILD ===')

  filename = 'bundle-[hash].js'
  const ManifestPlugin = require('webpack-manifest-plugin')

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ManifestPlugin()
  )
}

module.exports = {
  entry: {
    app: paths.entry
  },
  output: {
    path: paths.build,
    pathinfo: true,
    publicPath: '/assets/',
    filename
  },
  plugins,
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
      { test: /\.(png|ttf)$/, loader: 'url-loader?limit=500000' },
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
