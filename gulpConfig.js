/*jslint node: true */
'use strict';

var path = require('path');
module.exports = {
    paths: {
        typings: path.join(__dirname, 'typings/index.d.ts'),
    },
    dirs: {
        client: path.join(__dirname, 'src/client'),
        build: path.join(__dirname, 'build'),
        coverage: process.env.CIRCLE_ARTIFACTS || 'coverage',
        temp: path.join(__dirname, '.tmp')
    },
    src: {
        server: [
            path.join(__dirname, 'src/server/**/*.ts')
        ],
        client: [
            path.join(__dirname, 'src/client/**/*.ts'),
            path.join(__dirname, '!src/client/**/*.spec.ts')
        ]
    },
    tests: {
        server: [
            path.join(__dirname, 'test/**/*.spec.ts')
        ],
        client: {
            unit: [
                path.join(__dirname, 'src/client/**/*.spec.ts')
            ],
            e2e: [
                path.join(__dirname, 'src/client/**/*.e2e.ts')
            ]
        }
    },
    options: {
        mocha: {
            reporter: 'spec'
        },
        protractor: {
            configFile: 'protractor.conf.js'
        },
        karma: {

        }
    }
};
