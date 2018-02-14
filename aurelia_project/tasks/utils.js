import dotenv from 'dotenv';
import stringify from 'json-stable-stringify';
import gulp from 'gulp';
import transform from 'gulp-transform';
import logger from 'loggy';
import {CLIOptions} from 'aurelia-cli';
import project from '../aurelia.json';


export function buildObjectWithKeys(keys) {
    return keys
        .map(key => ({ [key]: {} }))
        .reduce((acc, current) => Object.assign(acc, current), {});
}


export function dumpAsExportedData(data) {
    return 'export default ' + stringify(data, { space: 4 }) + ';\n';
}


export function flattenArray(array) {
    return array.reduce((acc, current) => acc.concat(current), []);
}


export function getManifest() {
    const manifestPath = `${project.assets.manifest.output}/${project.assets.manifest.name}`;
    const manifest = gulp.src(manifestPath)
        .pipe(transform('utf-8', content => content.replace('export default ', '')))
        .pipe(transform('utf-8', content => content.replace(';', '')));
    return manifest;
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
    if (!process.env.ROLLBAR_ACCESS_TOKEN) {
        logger.warn('Rollbar token was not supplied.');
        return {};
    }

    return {
        accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    };
}


export function getTemplatesVariables() {
    return {
        env: CLIOptions.getEnvironment(),
        rollbar: getRollbar(),
        version: getVersion(),
    };
}


export function loadEnvVariables() {
    const ALLOWED_VARIABLES = ['API_HOST', 'API_PORT', 'API_VERSION', 'ROLLBAR_ACCESS_TOKEN'];
    dotenv.load();
    const overrides = Object.keys(process.env)
        .filter(variableName => ALLOWED_VARIABLES.includes(variableName));
    if (overrides.length > 0) {
        logger.info(`Using overridden values for ${overrides}`);
    }
}


export function insertInto(obj, path, value) {
    const insertPath = path.split('.');
    const insertKey = insertPath.pop();
    obj = getObjectAtPath(obj, insertPath);
    obj[insertKey] = value;
}
