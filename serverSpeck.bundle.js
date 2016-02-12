Error.stackTraceLimit = Infinity;
var testContext = require.context('./test/server', true, /\.spec\.ts/);
testContext.keys().forEach(testContext);
