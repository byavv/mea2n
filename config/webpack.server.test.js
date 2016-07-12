const __root = require('./helpers'),
    webpackMerge = require('webpack-merge'),
    commonConfig = require('./webpack.server.common.js');

module.exports = webpackMerge(commonConfig, {
    resolve: {
        cache: false
    },
    entry: {
        test: [__root('../server-spec.bundle.js')]
    },
    postLoaders: [
        {
            test: /\.(js|ts)$/,
            include: __root('../src/server'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [
                /\.e2e\.ts$/,
                /node_modules/
            ]
        }
    ],
    output: {
        path: __root('../test'),
        filename: "[name].spec.js"
    },
    devtool: 'inline-source-map',
    stats: { colors: true, reasons: true },
    debug: false
})
