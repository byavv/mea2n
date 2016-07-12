const __root = require('./helpers'),
    webpackMerge = require('webpack-merge')  
    ;

module.exports =  {
    externals: [__root('node_modules')],
    devtool: 'inline-source-map',
   
    resolve: {
        extensions: ['', '.ts', '.js', '.json', ".scss", ".css", ".less"],
        root: [
            __root('node_modules')
        ],
        cache: false
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "raw" },
            { test: /\.css$/, loader: "raw" },
            { test: /\.scss$/, loader: "raw!sass" },
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
    debug: false,
    node: {
        global: 'window',
        progress: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};
