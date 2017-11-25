import {CLIOptions} from 'aurelia-cli';


export function getVersion() {
    return CLIOptions.getFlagValue('version') || 'latest';
}


export function getTemplatesVariables() {
    return {
        env: CLIOptions.getEnvironment(),
        version: getVersion(),
    };
}
