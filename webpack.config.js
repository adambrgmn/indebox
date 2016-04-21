const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const JxaPlugin = require('./plugins/jxa-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  entry: {
    app: path.join(__dirname, 'src'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
};

const common = {
  entry: PATHS.entry,
  resolve: {
    extensions: ['', '.js'],
  },
  output: PATHS.output,
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    plugins: [
      new JxaPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),
    ],
  });
}

if (TARGET === 'build') {
  common.output.filename = '[name].min.js';
  module.exports = merge(common, {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false, screw_ie8: true },
      }),
      new JxaPlugin(),
      new CleanPlugin([path.join(__dirname, 'build')]),
    ],
  });
}
