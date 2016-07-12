const __root = require('./helpers'),
    webpackMerge = require('webpack-merge'),
    commonConfig = require('./webpack.client.common.js')
    ;

module.exports = {//webpackMerge(commonConfig, {
    resolve: {
        cache: false
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [
            { test: /\.css$/, loader: "raw" },
            { test: /\.scss$/, loader: "raw!sass" }
        ],
        postLoaders: [
            {
                test: /\.(js|ts)$/,
                include: __root('../src/client'),
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /\.e2e\.ts$/,
                    /node_modules/
                ]
            }
        ]
    },
    stats: { colors: true, reasons: true },
    debug: false
}//)