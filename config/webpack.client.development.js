const webpackMerge = require('webpack-merge'),
  webpack = require('webpack'),
  commonConfig = require('./webpack.client.common.js'),
  ExtractTextPlugin = require('extract-text-webpack-plugin')
  ;

module.exports = webpackMerge(commonConfig, { 
  devtool: 'inline-source-map',
  debug: true,  
  output: {
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('client/assets/styles/[name].css'),
  ]
});
