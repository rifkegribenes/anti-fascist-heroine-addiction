const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production' && process.argv.indexOf('-p') === -1;

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/src/index.html'),
  filename: 'index.html',
  inject: 'body',
});

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

// const UglifyJsPluginConfig = new webpack.optimize.UglifyJsPlugin({
//   beautify: false,
//   mangle: {
//     screw_ie8: true,
//   },
//   compress: {
//     screw_ie8: true,
//   },
//   comments: false,
// });

module.exports = {
  devtool: 'cheap-module-source-map',
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, '/src/index.jsx'),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
      {
        test:/\.(jpg|png|gif|bmp|svg|woff|woff2|ttf|eot)$/,
        loader: require.resolve("file-loader"),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build'),
  },
  images: {
    assetsPath: path.join(__dirname, '/src/img'),
    rewritePath: 'img/',
    ignore: ['.DS_Store', 'share_*', '*-icon-*', 'favicon*'],
  },
  plugins: dev ?
  [
    HTMLWebpackPluginConfig,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ] :
  [HTMLWebpackPluginConfig, DefinePluginConfig],
};
