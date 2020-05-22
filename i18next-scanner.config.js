/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
 *
 * This file is part of Arena of Titans.
 *
 * Arena of Titans is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Arena of Titans is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const fs = require("fs");

const path = require("path");

module.exports = {
    input: ["app/**/*.{js,html}"],
    output: "./",
    options: {
        debug: true,
        func: {
            list: ["i18next.t", "i18n.t", "this.i18n.tr", "translationsKey"],
            extensions: [".js"],
        },
        lngs: ["en", "fr"],
        ns: ["translations"],
        defaultLng: "en",
        defaultNs: "translations",
        defaultValue: "__STRING_NOT_TRANSLATED__",
        resource: {
            loadPath: "app/locale/{{lng}}/_translation_keys.json",
            savePath: "app/locale/{{lng}}/_translation_keys.json",
            jsonIndent: 4,
            lineEnding: "\n",
        },
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        interpolation: {
            prefix: "{{",
            suffix: "}}",
        },
        removeUnusedKeys: true,
    },
    transform: function customTransform(file, enc, done) {
        const { ext } = path.parse(file.path);
        const content = fs.readFileSync(file.path, enc);

        if (ext === ".html") {
            this.parser.parseAttrFromString(content, {
                list: ["data-i18n", "data-t", "t", "i18n"],
            });
            // We extra behaviours `${ 'myKey' | t }` and `${ 'myKey' & t }` from the file.
            const extractBehaviours = /\${ *'([a-zA-Z0-9]+)' *[&|] *t *}/g;
            const strContent = content.toString();
            let group;
            while (true) {
                group = extractBehaviours.exec(strContent);
                if (group === null) {
                    break;
                }
                this.parser.set(group[1]);
            }
        }
        done();
    },
};
