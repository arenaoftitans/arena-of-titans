import {CLIOptions} from 'aurelia-cli';


export function getVersion() {
    return CLIOptions.getFlagValue('version') || 'latest';
}
