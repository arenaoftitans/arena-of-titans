/*
 * Copyright (C) 2017 by Arena of Titans Contributors.
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
 */

const process = require('process');
const standalone = require("stylelint/lib/standalone");
const formatters = require("stylelint/lib/formatters");

Promise.resolve().then(() => standalone({
    configFile: '.stylelintrc',
    syntax: 'scss',
    files: 'app/**/*.scss',
})).then(linted => {
    console.log(formatters.string(linted.results));
    if (linted.errored) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}).catch(() => process.exit(2));
