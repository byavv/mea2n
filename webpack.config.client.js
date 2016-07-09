'use strict';
const webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin')
    ;

module.exports = function (env) {

    const client = {
        target: 'web',
        module: {
            loaders: [
                { test: /\.css$/, loader: "raw!postcss" },
                // all styles for the application will be bundled into css file
                {
                    test: /\.scss$/,
                    include: path.join(__dirname, 'src', 'client', 'assets'),
                    loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
                },
                // all styles which are required for componenets will be bundled within javascript via raw loader
                { test: /\.scss$/, include: path.join(__dirname, 'src', 'client', 'app'), loader: 'raw!postcss!sass' }
            ]
        },
        entry: {
            main: [path.join(__dirname, './src/client/bootstrap.ts')],
            vendors: [path.join(__dirname, './src/client/vendors.ts')]
        },
        resolve: {
            cache: true
        },
        postcss: () => {
            return [
                autoprefixer({ browsers: ['last 2 versions'] }),
                precss
            ];
        },
        output: {
            path: path.join(__dirname + '/build/client'),
            filename: (env == 'development') ? "[name].js" : "[name].[hash].js",
            pathinfo: false,
            publicPath: '/static',
        },
        plugins: [
            /*
             * Plugin: ExtractTextPlugin
             * Description: Extracts required entry into separate file. Used to avoid 'inline' css in javascript code.
             * See: https://github.com/webpack/extract-text-webpack-plugin
             */
            new ExtractTextPlugin((env == 'development') ? 'assets/styles/[name].css' : 'assets/styles/[name].[hash].css'),
            /*
             * Plugin: HtmlWebpackPlugin
             * Description: Automatically adds generated bundles paths to your html file.
             * See: https://github.com/ampedandwired/html-webpack-plugin
             */
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src/client', 'index.html')
            }),
            /*
             * Plugin: CommonsChunkPlugin
             * Description: To make common bundle for all entries. Moves all dependencies from "main" chunk into "vendors"
             * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
             */
            new webpack.optimize.CommonsChunkPlugin({
                name: ['vendors']
            }),
            /*
             * Plugin: CopyWebpackPlugin
             * Description: Copy files
             * See: https://github.com/kevlened/copy-webpack-plugin
             */
            new CopyWebpackPlugin([
                { from: 'src/client/assets/images', to: 'assets/images' }
            ]),
            /*
             * Plugin: DefinePlugin
             * Description:  Define user's variables. 
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            new webpack.DefinePlugin({
                'ENV': env,
            })
        ],
        // node polyfills
        node: {
            global: 'window',
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };

    const client_test = {
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
                    include: path.join(__dirname, 'client'),
                    loader: 'istanbul-instrumenter-loader',
                    exclude: [
                        /\.e2e\.ts$/,
                        /node_modules/
                    ]
                }
            ]
        },
        stats: { colors: true, reasons: true },
        debug: false,
        // we need this due to problems with es6-shim
        node: {
            global: 'window',
            progress: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    }
    return env == 'test' ? client_test : client;
}