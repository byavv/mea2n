'use strict';
const webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    path = require("path");

module.exports = function (env) {
    var testConfig = {
        target: 'node',
        resolve: {
            cache: false
        },
        entry: {
            test: [path.join(__dirname, './serverSpec.bundle.js')]
        },
        output: {
            path: path.join(__dirname, '/test'),
            filename: "[name].spec.js"
        },
        devtool: 'inline-source-map',
        stats: { colors: true, reasons: true },
        debug: false,
        externals: [nodeExternals()],
        node: {
            global: true,
            self: true,
            __dirname: true,
            __filename: true,
            process: true,
            Buffer: true
        }
    }
    var devConfig = {
        target: 'node',
        entry: {
            server: [path.join(__dirname, './src/server/server.ts')]
        },
        module: {
            loaders: [
                { test: /\.css$/, loader: "raw" },
                { test: /\.scss$/, loader: "raw!sass" },
                { test: /\.less$/, loader: "raw!less" }
            ]
        },
        output: {
            path: __dirname + '/build/server',
            filename: "[name].js",
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
        },
        externals: [nodeExternals()],
        node: {
            global: true,
            __dirname: true,
            __filename: true,
            process: true,
            Buffer: true
        }
    }
    return env == 'test' ? testConfig : devConfig
}