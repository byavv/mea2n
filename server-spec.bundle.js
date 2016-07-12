Error.stackTraceLimit = Infinity;
require('core-js/es6');
require('core-js/es7/reflect');
var testContext = require.context('./test/server', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
