const webpack = require('webpack'),
  autoprefixer = require('autoprefixer'),  
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  precss = require('precss'),  
  __root = require('./helpers')
  ;

module.exports = {
  target: 'web',
  entry: {
    main: [__root('../src/client/bootstrap.ts')],
    polyfills: [__root('../src/client/polyfills.ts')],
    vendor: [__root('../src/client/vendors.ts')],
  },
  output: {
    path: __root('../build/client'),
    publicPath: '/static',
    pathinfo: false,
  },
  externals: [__root('node_modules')],
  resolve: {
    root: [__root("node_modules")],
    extensions: ['', '.ts', '.js', '.scss'],
    cache: true
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: "raw" },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
      { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file" },
      { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
      { test: /\.css$/, loader: "raw!postcss" },
      {
        test: /\.scss$/,
        include: __root("../src/client/assets"),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
      },
      { test: /\.scss$/, include: __root("..", 'src', 'client', 'app'), loader: 'raw!postcss!sass' },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [
          /node_modules/
        ],
        query: {
          ignoreDiagnostics: [2403, 2300, 2374, 2375, 2502]
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'polyfills'] }),
    new HtmlWebpackPlugin({
      template: __root('../src/client/index.html'),
      chunksSortMode: 'dependency'
    }),
    new DefinePlugin({
      ENV: JSON.stringify(process.env.NODE_ENV)
    }),
    new CopyWebpackPlugin([
      { from: __root('../src/client/assets/images'), to: 'assets/images' }
    ]),
  ],
  postcss: () => {
    return [
      autoprefixer({ browsers: ['last 2 versions'] }),
      precss
    ];
  },
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
