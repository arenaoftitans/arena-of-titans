var fs = require('fs');
var toml = require('toml');
var extend = require('util')._extend;
var argv = require('yargs').argv;

var confDir = 'config';


function load(fileName) {
    return toml.parse(fs.readFileSync(fileName, 'utf-8'));
}

function loadConfig(type) {
    var config = load(confDir + '/config.prod.toml');

    if (type === 'dev') {
        var devConfigFile = confDir +  '/config.dev.toml';
        if (fs.existsSync(devConfigFile)) {
            extend(config, load(devConfigFile));
        }
    } else if (type === 'test') {
        var prodConfigFile = confDir +  '/config.test.toml';
        if (fs.existsSync(prodConfigFile)) {
            extend(config, load(prodConfigFile));
        }
    }

    return config;
};


var type = argv.type || 'dev';
var config = loadConfig(type);
fs.writeFileSync(confDir + '/application.js', 'export default ' + JSON.stringify(config) + ';');
