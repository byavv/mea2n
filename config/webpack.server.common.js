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
                    ignoreDiagnostics: [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375, // 2375 -> Duplicate string index signature
                        2502  // 2502 -> Referenced directly or indirectly
                    ]
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












