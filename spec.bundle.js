/**
 * @author: @AngularClass
 */

Error.stackTraceLimit = Infinity;

require('es6-shim');
require('reflect-metadata');
// Typescript emit helpers polyfill
//require('ts-helpers');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/sync-test');

// RxJS
require('rxjs/Rx');

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
);

Object.assign(global, testing);


var testContext = require.context('./test/client', true, /\.spec\.ts/);
var appContext = require.context('./src/client', true, /\.spec\.ts/);


appContext.keys().forEach(appContext);
testContext.keys().forEach(testContext);