var fs = require('fs');
var toml = require('toml');
var extend = require('util')._extend;
var argv = require('yargs').argv;


function load(fileName) {
    return toml.parse(fs.readFileSync(fileName, 'utf-8'));
}

function loadConfig(type) {
    var config = load(__dirname + '/config.prod.toml');

    if (type === 'dev') {
        var devConfigFile = __dirname +  '/config.dev.toml';
        if (fs.existsSync(devConfigFile)) {
            extend(config, load(devConfigFile))
        }
    } else if (type === 'test') {
        var prodConfigFile = __dirname +  '/config.test.toml';
        if (fs.existsSync(prodConfigFile)) {
            extend(config, load(prodConfigFile))
        }
    }

    return config;
};


var type = argv.type || 'dev';
var config = loadConfig(type);
fs.writeFileSync(__dirname + '/application.json', JSON.stringify(config));
