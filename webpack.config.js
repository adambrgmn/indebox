const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'src/js'),
  style: path.join(__dirname, 'src/css/main.scss'),
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
    chunkFilename: '[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.jade$/,
        loader: 'jade',
      },
    ],
  },
  postcss: function () {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.jade',
      inject: false,
      appMountId: 'app',
      filename: 'index.html',
      title: 'Indebox',
      subtitle: 'Make InDesign and Dropbox work together',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: false,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT,
    },
    output: {
      filename: '[name].js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: PATHS.app,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0'],
          },
        },
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'postcss', 'sass'],
        },
      ],
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies).filter((v) => v !== ''),
    },
    output: {
      filename: 'js/[name].[hash].js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          include: PATHS.app,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0'],
          },
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('css/[name].[hash].min.css'),
      new webpack.optimize.UglifyJsPlugin({
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
      new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'manifest'],
      }),
      new CleanPlugin(['dist']),
    ],
  });
}
