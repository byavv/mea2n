var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    BowerWebpackPlugin = require("bower-webpack-plugin")
    ;

var common = {
    devServer: {
        stats: 'errors-only',
    },
    resolve: {
        extensions: ['', '.ts', '.json', '.js', ".less", ".sass"]
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less$/, loader: "style!css!less" },
            { test: /\.scss$/, loader: "style!css!sass" },
            { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
            { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file" },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: ['node_modules'],
                query: {
                    ignoreDiagnostics: [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                    ]
                },
            }
        ],
    }
};

var client_in_browser_ui_config = {
    target: 'web',
    entry: {
        main_ui: ['./src/client/client_browser.ts'],
        assets: ['./src/client/client_assets.ts']
    },
    output: {
        path: __dirname + '/dist/client',
        filename: "[name].js",
        pathinfo: false,
        publicPath: '/dist/client/',
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            sourceType: 'var',
            get manifest() {
                return require(path.join(__dirname, "dist/client", "vendors-manifest.json"));
            }
        }),
        new webpack.DefinePlugin({

        }),
        new webpack.ProvidePlugin({
            _: "lodash",
            $: "jquery",
            jQuery: "jquery"
        }),
        new BowerWebpackPlugin({
            modulesDirectories: ["client/vendor"],
            manifestFiles: ["bower.json", ".bower.json"],
            searchResolveModulesDirectories: false
        })
    ]
};

//var client_in_webworker_config = {/*soon*/}

var vendors_config = {
    target: 'web',
    entry: {
        vendors: [
            "es6-shim",
            "es6-promise",
            "reflect-metadata",
            "zone.js/dist/zone-microtask",
            "zone.js/dist/long-stack-trace-zone",
            "rxjs",
            "angular2/core",
            "angular2/router",
            "angular2/common",
            "angular2/http",
            "lodash"
        ]
    },
    output: {
        path: __dirname + '/dist/client',
        filename: "[name].js",
        library: "vendors",
        libraryTarget: 'var'
    },

    plugins: [
        new webpack.DllPlugin({
            name: "vendors",
            path: path.join(__dirname, "dist/client", "vendors-manifest.json"),
        })
    ]
};

var server_config = {
    target: 'node',
    entry: {
        server: ['./src/server/server']
    },
    output: {
        path: __dirname + '/dist/server',
        filename: "[name].js",
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    externals: [nodeExternals()],
    node: {
        global: true,
        self: true,
        __dirname: true,
        __filename: true,
        process: true,
        Buffer: true
    }
};

var test_server_config = {
    target: 'node',
    resolve: {
        cache: false
    },
    entry: {
        test: ['./serverSpeck.bundle.js']
    },
    output: {
        path: __dirname + '/test',
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

var test_client_config = {
    resolve: {
        cache: false
    },
    devtool: 'inline-source-map',
    module: {
        postLoaders: [
            {
                test: /\.(js|ts)$/,
                include: path.join(__dirname, 'src/client'),
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /\.e2e\.ts$/,
                    /node_modules/
                ]
            }
        ],
        noParse: [
            /zone\.js\/dist\/.+/,
            /angular2\/bundles\/.+/
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

module.exports = function (env) {
    var environment = env || process.env.NODE_ENV || "development";
    var productionTools = {
        plugins: [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: {
                    warnings: false
                }
            })
        ]
    }
    var devTools = {
        devtool: "source-map",
        debug: true,
        plugins: [new webpack.HotModuleReplacementPlugin()]
    }
    
    var client, server, vendors, test, test_server;
    if (environment === 'development') {
        client = webpackMerge(common, client_in_browser_ui_config, devTools);
        server = webpackMerge(common, server_config, devTools);
        vendors = webpackMerge(common, vendors_config, {/*dev specific config */ });
    }
    if (environment === 'production') {
        client = webpackMerge(common, client_in_browser_ui_config, Object.assign({}, productionTools));
        server = webpackMerge(common, server_config, {/*production specific config */ });
        vendors = webpackMerge(common, vendors_config, Object.assign({}, productionTools));
    }
    test = webpackMerge(common, test_client_config);
    test_server = webpackMerge(common, test_server_config);
    return {
        server: server,
        client: client,
        vendors: vendors,
        test: test,
        test_server: test_server
    }
}
