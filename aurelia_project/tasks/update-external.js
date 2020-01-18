import fs from "fs";
import util from "util";
import Promise from "bluebird";
import parseCsv from "csv-parse/lib/sync.js";
import request from "request-promise";
import { CLIOptions } from "aurelia-cli";
import project from "../aurelia.json";
import { buildObjectWithKeys, dumpAsExportedData, flattenArray, insertInto } from "./utils";

const writeFile = util.promisify(fs.writeFile);

// Choose the tasks to export based on the kind of resource to update.
let main;
const kind = CLIOptions.getFlagValue("kind");
switch (kind) {
    case "default-names":
        main = updateDefaultNames;
        break;
    case "translations":
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

async function updateTranslations() {
    const resource = project.externalResources.translations;
    const targetLanguages = Object.keys(resource.dest);

    const buildTranslations = rows => {
        const translations = buildObjectWithKeys(targetLanguages);

        for (let row of rows) {
            for (let lang of targetLanguages) {
                insertInto(translations[lang], row.msgid, row[lang]);
            }
        }

        return translations;
    };

    const tabsData = await Promise.map(resource.source, src => request(src.url));
    const nestedRows = tabsData
        .map(data => parseCsv(data, { columns: true }))
        .map(flattenArray)
        .map((tabContent, index) => ({
            tabContent,
            tabName: resource.source[index].tab,
        }))
        .map(({ tabContent, tabName }) => {
            return tabContent.map(row => {
                row.msgid = `${tabName}.${row.msgid}`;
                return row;
            });
        });
    const rows = flattenArray(nestedRows);
    const translations = buildTranslations(rows);
    const translationsBlobsToSave = targetLanguages.map(lang => ({
        data: dumpAsExportedData(translations[lang]),
        file: resource.dest[lang],
    }));

    return Promise.map(translationsBlobsToSave, ({ file, data }) => writeFile(file, data));
}

export { main as default };
