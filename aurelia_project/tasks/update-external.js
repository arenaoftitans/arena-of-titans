import fs from 'fs';
import util from 'util';
import Promise from 'bluebird';
import parseCsv from 'csv-parse/lib/sync.js';
import request from 'request-promise';
import { CLIOptions } from 'aurelia-cli';
import project from '../aurelia.json';
import {
    buildObjectWithKeys,
    dumpAsExportedData,
    flattenArray,
    insertInto,
} from './utils';

const writeFile = util.promisify(fs.writeFile);

// Choose the tasks to export based on the kind of resource to update.
let main;
const kind = CLIOptions.getFlagValue('kind');
switch (kind) {
    case 'default-names':
        main = updateDefaultNames;
        break;
    case 'translations':
        main = updateTranslations;
        break;
    default:
        console.error(`Unsupported kind: ${kind}`);
        process.exit(2);
}

function updateDefaultNames() {
    const resource = project.externalResources.defaultNames;

    return request(resource.source)
        .then(parseCsv)
        .then(flattenArray)
        .then(dumpAsExportedData)
        .then(content => writeFile(resource.dest, content));
}

export { main as default };
