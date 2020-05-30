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

import fs from "fs";
import path from "path";
import { CLIOptions } from "aurelia-cli";
import { getApiVersion, getVersion, loadEnvVariables } from "./utils";
import project from "../aurelia.json";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

export default function buildConfig() {
    loadEnvVariables();

    let env = CLIOptions.getEnvironment();

    const environment = require(`../environments/${env}.js`).default;

    environment.version = getVersion();
    environment.api.host = process.env.API_HOST || environment.api.host;
    environment.api.port = process.env.API_PORT || environment.api.port;
    environment.api.port = parseInt(environment.api.port, 10);
    environment.api.version = process.env.API_VERSION || getApiVersion();
    environment.sentry_dsn = process.env.SENTRY_DSN;
    environment.env = env;

    return writeFile(
        path.resolve(project.paths.config, `environment.${env}.json`),
        JSON.stringify(environment),
    );
}
