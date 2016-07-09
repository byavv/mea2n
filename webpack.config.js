var webpackMerge = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals')   
    ;

var common = {
    externals: [path.join(__dirname, 'node_modules')],
    resolve: {
        extensions: ['', '.ts', '.js', '.json', ".scss", ".css", ".less"],
        root: [
            path.join(__dirname, 'node_modules')
        ],
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.json$/, loader: 'json' },
            { test: /\.(png|jpg)$/, loader: "url?limit=25000" },
            { test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$|\.otf$/, loader: "file" },
            { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/
                ],
                query: {
                    ignoreDiagnostics: [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                        2502  // 2502 -> Referenced directly or indirectly
                    ]
                },
            }
        ],
        postLoaders: []
    },
    plugins: [
    ]
};

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

    var client, server, test_client, test_server;
    if (environment === 'development') {
        client = webpackMerge(common, require('./webpack.config.client')(environment), devTools);
        server = webpackMerge(common, require('./webpack.config.server')(environment), devTools);
    }
    if (environment === 'production') {
        client = webpackMerge(common, require('./webpack.config.client')(environment), productionTools);
        server = webpackMerge(common, require('./webpack.config.server')(environment), {});
    }
    test_client = webpackMerge(common, require('./webpack.config.client')(environment), {});
    test_server = webpackMerge(common, require('./webpack.config.server')(environment), {});
    return {
        server: server,
        client: client,       
        test: test_client,
        test_server: test_server       
    }
}
