// @AngularClass inspired (https://github.com/AngularClass/angular2-webpack-starter)

Error.stackTraceLimit = Infinity;
require('phantomjs-polyfill');
require('es6-shim');
require('es7-reflect-metadata/dist/browser');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/jasmine-patch');

require('lodash');


var testContext = require.context('./test/client', true, /\.spec\.ts/);
var appContext = require.context('./src/client', true, /\.spec\.ts/);


appContext.keys().forEach(appContext);
testContext.keys().forEach(testContext);

var domAdapter = require('angular2/src/platform/browser/browser_adapter');
domAdapter.BrowserDomAdapter.makeCurrent();