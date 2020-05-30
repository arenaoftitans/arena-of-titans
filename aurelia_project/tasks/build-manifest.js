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

import process from "process";
import stdGlob from "glob";
import child_process from "child_process";
import fs from "fs";
import { Configuration } from "aurelia-cli";
import project from "../aurelia.json";
import { getVersion } from "./utils";
import Promise from "bluebird";
import util from "util";

const exec = util.promisify(child_process.exec);
const glob = util.promisify(stdGlob);
const writeFile = util.promisify(fs.writeFile);

export default function writeManifest() {
    const buildOptions = new Configuration(project.build.options);
    if (buildOptions.isApplicable("manifest")) {
        const version = getVersion();

        process.chdir(project.platform.output);

        return Promise.all([glob(`**/*`, { nodir: true }), exec("git rev-parse HEAD")])
            .then(data => ({
                files: data[0],
                commitHash: data[1].stdout,
            }))
            .then(({ files, commitHash }) => ({
                commitHash,
                version,
                files,
            }))
            .then(manifest => JSON.stringify(manifest, null, 4))
            .then(manifest => writeFile(`./manifest-${version}.json`, manifest));
    }

    return Promise.resolve();
}
