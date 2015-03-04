exports.config = {
    specs: ['**/*.spec.js'],
    baseUrl: 'http://localhost:8080/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    maxSessions: 1,
    multiCapabilities: [
        {browserName: 'chrome'},
        {browserName: 'firefox'}
    ]
};
