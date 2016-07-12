const nodeExternals = require('webpack-node-externals'),
    __root = require('./helpers')
    ;

module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['', '.ts', '.js', '.json', ".scss", ".css"]
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/
                ],
                query: {
                    ignoreDiagnostics: [2403, 2300, 2374, 2375, 2502]
                },
            }
        ]
    },
    node: {
        global: true,
        self: true,
        __dirname: true,
        __filename: true,
        process: true,
        Buffer: true
    }
};
