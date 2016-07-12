/**
 * @author: @AngularClass
 */

require('ts-node/register');
var path = require('path')

exports.config = {
    baseUrl: 'http://localhost:3030/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // use `npm run e2e`
    specs: [
        path.join(__dirname, 'src/**/**.e2e.ts'),
        path.join(__dirname, 'src/**/*.e2e.ts')
    ],
    exclude: [],
    framework: 'jasmine2',
    allScriptsTimeout: 200000,
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    directConnect: true,
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    },
    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },
    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     */
    useAllAngular2AppRoots: true
};