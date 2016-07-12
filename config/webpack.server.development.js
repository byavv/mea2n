const __root = require('./helpers'),
    webpackMerge = require('webpack-merge'),
    commonConfig = require('./webpack.server.common.js');


module.exports = webpackMerge(commonConfig, {  
    entry: {
        server: [__root('../src/server/server.ts')]
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "raw" },
            { test: /\.scss$/, loader: "raw!sass" },
            { test: /\.less$/, loader: "raw!less" }
        ]
    },
    output: {
        path: __root('../build/server'),
        filename: "[name].js",
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    }
})