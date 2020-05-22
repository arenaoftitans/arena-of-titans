import fs from "fs";
import util from "util";
import Promise from "bluebird";
import parseCsv from "csv-parse/lib/sync.js";
import request from "request-promise";
import { CLIOptions } from "aurelia-cli";
import project from "../aurelia.json";
import foundKeys from "../../app/locale/en/_translation_keys.json";
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
    const findAllTranslationKeys = rows => {
        return rows.map(row => row.msgid);
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

    const foundKeysInCode = Object.keys(foundKeys);
    const foundKeysInTranslationFile = findAllTranslationKeys(rows);

    const missingInTranslations = foundKeysInCode
        .filter(key => !foundKeysInTranslationFile.includes(key))
        .filter(key => !key.includes("${"));
    const missingInCode = foundKeysInTranslationFile
        .filter(key => !foundKeysInCode.includes(key))
        // Keys that start with cards or trumps, are often used in string interpolation with the
        // actual name and color of the card or trump. This leads to false positive so we ignore
        // them here. Same for heroes and powers.
        .filter(key => !key.startsWith("cards"))
        .filter(key => !key.startsWith("site.moves"))
        .filter(key => !key.startsWith("trumps"))
        .filter(key => !key.startsWith("heroes"))
        .filter(key => !key.startsWith("site.heroes"))
        .filter(key => !key.startsWith("powers"))
        // Keys under the actions namespace are messages from the API: They are not in the code.
        // Same for errors.
        .filter(key => !key.startsWith("actions"))
        .filter(key => !key.startsWith("errors"));

    if (missingInTranslations.length > 0) {
        console.warn(
            `These translation keys exist in the code but not in our translation file: ${missingInTranslations.join(
                ", ",
            )}`,
        );
    }
    if (missingInCode.length > 0) {
        console.warn(
            `These translation keys exist in the translation file but not in the code: ${missingInCode.join(
                ", ",
            )}`,
        );
    }

    return Promise.map(translationsBlobsToSave, ({ file, data }) => writeFile(file, data));
}

export { main as default };
