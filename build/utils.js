var fs = require('fs');
var toml = require('toml');
var extend = require('util')._extend;


function load(fileName) {
    return toml.parse(fs.readFileSync(fileName, 'utf-8'));
}

module.exports = function loadConfig(type) {
    var config = load(__dirname + '/../config/config.dist.toml');

    if (type === 'dev') {
        var devConfigFile = __dirname +  '/../config/config.dev.toml';
        if (fs.existsSync(devConfigFile)) {
            extend(config, load(devConfigFile))
        }
    }

    return config;
};