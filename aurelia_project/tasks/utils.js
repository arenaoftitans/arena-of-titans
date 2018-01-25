import {CLIOptions} from 'aurelia-cli';


export function buildObjectWithKeys(keys) {
    return keys
        .map(key => ({ [key]: {} }))
        .reduce((acc, current) => Object.assign(acc, current), {});
}


export function dumpAsExportedData(data) {
    return 'export default ' + JSON.stringify(data, null, 4) + ';\n';
}


export function flattenArray(array) {
    return array.reduce((acc, current) => acc.concat(current), []);
}


export function getVersion() {
    return CLIOptions.getFlagValue('version') || 'latest';
}


function getObjectAtPath(obj, path) {
    for (let pathElement of path) {
        if (!(pathElement in obj)) {
            obj[pathElement] = {};
        }
        obj = obj[pathElement];
    }

    return obj;
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


export function insertInto(obj, path, value) {
    const insertPath = path.split('.');
    const insertKey = insertPath.pop();
    obj = getObjectAtPath(obj, insertPath);
    obj[insertKey] = value;
}
