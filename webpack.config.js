const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'src/js'),
  style: path.join(__dirname, 'src/css'),
  build: path.join(__dirname, 'dist'),
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.style,
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: PATHS.build,
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.jade$/,
        loader: 'jade',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.jade',
      inject: false,
      appMountId: 'app',
      filename: 'index.html',
      title: 'Indebox',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    output: {
      filename: '[name].js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: PATHS.app,
          loader: 'babel?cacheDirectory',
          query: {
            presets: ['react', 'es2015', 'stage-0', 'react-hmre'],
          },
        },
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass'],
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    output: '[name].[hash].js',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: PATHS.app,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015', 'stage-0'],
          },
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css', 'sass'),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('[name].[hash].min.css'),
      new webpack.optimize.UgilfyJsPlugin({
        compressor: {
          warnings: false,
          screw_ie8: true,
        },
      }),
      new StatsPlugin('webpack.stats.json', {
        source: false,
        modules: false,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  });
}
