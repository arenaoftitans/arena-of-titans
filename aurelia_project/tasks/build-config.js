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
import logger from "loggy";
import { getApiVersion, getVersion, loadEnvVariables } from "./utils";
import project from "../aurelia.json";
import util from "util";

const writeFile = util.promisify(fs.writeFile);

export default function buildConfig() {
    loadEnvVariables();

    let env = CLIOptions.getEnvironment();
    const environment = require(`../environments/${env}.js`).default;

    let apiHost = environment.api.host;
    let apiPort = environment.api.port;
    if (env === "dev") {
        apiHost = process.env.API_HOST || apiHost;
        apiPort = process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : apiPort;
    } else {
        logger.info("Not in dev, will not read API_POST and API_HOST from environment");
    }

    logger.info(`Using API_HOST=${apiHost} and API_POST=${apiPort}`);

    environment.version = getVersion();
    environment.api.host = apiHost;
    environment.api.port = apiPort;
    environment.api.version = getApiVersion();
    environment.sentry_dsn = process.env.SENTRY_DSN;
    environment.env = env;

    return writeFile(
        path.resolve(project.paths.config, `environment.${env}.json`),
        JSON.stringify(environment),
    );
}
