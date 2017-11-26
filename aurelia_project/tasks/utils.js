import {CLIOptions} from 'aurelia-cli';


export function getVersion() {
    return CLIOptions.getFlagValue('version') || 'latest';
}


export function getRollbar() {
    const configPath = CLIOptions.getFlagValue('rollbar');
    const env = CLIOptions.getEnvironment();

    if (!configPath) {
        console.warn('Rollbar configuration was not supplied.');
        return {};
    }

    const rollbar = require(configPath);
    const envConfiguration = rollbar[env];
    if (!envConfiguration) {
        console.warn(`Rollbar is not available for ${env}`);
        return {};
    }

    return envConfiguration.front;
}


export function getTemplatesVariables() {
    return {
        env: CLIOptions.getEnvironment(),
        rollbar: getRollbar(),
        version: getVersion(),
    };
}
