var path = require('path');
var webpack = require('webpack');

var packageJson = require('./package.json');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    `webpack-dev-server/client?http://localhost:${packageJson[packageJson.name].port}`,
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
      test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      }, {
        test: /\.scss$/,
        exclude: [],
        loaders: [
          'style?singleton',
          'css?modules&localIndentName=[path][name]-[local]---[hash:base64:5]!postcss!sass?sourceMap'
        ],
      }
    ],
  }
};
