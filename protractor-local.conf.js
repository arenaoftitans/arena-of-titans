it_root = 'src/test/webapp/it/';

exports.config = {
    specs: [it_root + '*.spec.js'],
    baseUrl: 'http://localhost:8080/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    maxSessions: 1,
    multiCapabilities: [
        {browserName: 'chrome'},
        {browserName: 'firefox'}
    ]
};
