/**
 * @author: @AngularClass
 * see: https://github.com/AngularClass/angular2-webpack-starter
 */
module.exports = function(config) {
  var testWebpackConfig = require('./config/webpack.client');
  config.set({  
    basePath: '',
    frameworks: ['jasmine'],
    exclude: [ ],
    files: [ { pattern: './spec-bundle.js', watched: false } ],
    preprocessors: { './spec-bundle.js': ['coverage', 'webpack'] },
    webpack: testWebpackConfig,
    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'text-summary' },
        { type: 'json' },
        { type: 'html' }
      ]
    },
    webpackServer: { noInfo: true },
    reporters: [ 'mocha', 'coverage' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [
      'Chrome'
    ],
    singleRun: true
  });
};