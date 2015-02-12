exports.config = {
    specs: ['**/*.spec.js'],
    baseUrl: 'http://localhost:8080/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    maxSessions: 1,
    multiCapabilities: [
        {browserName: 'chrome'},
        // Selenium and protractor don't work with firefox 35 yet.
        // See: https://github.com/angular/protractor/issues/1734
        //{browserName: 'firefox'}
    ]
};
