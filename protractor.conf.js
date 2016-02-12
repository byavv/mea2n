exports.config =
{
    specs: ['test/e2e/**/*.js'],
    baseUrl: 'http://localhost:3030/',
    seleniumAddress: 'http://localhost:4444/wd/hub',

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
    useAllAngular2AppRoots: true,   
    framework: 'jasmine'
}
