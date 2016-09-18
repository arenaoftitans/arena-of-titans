/*
 * Copyright (C) 2015-2016 by Arena of Titans Contributors.
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

"use strict";

const path = require('path');
const project = require('./aurelia_project/aurelia.json');
let argv = require('minimist')(process.argv.slice(2));

let testSrc = [
    {pattern: project.unitTestRunner.source, included: false},
    'test/aurelia-karma.js',
];

let output = project.build.targets[0].output;
let appSrc = project.build.bundles.map(x => path.join(output, x.name));
let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
let entryBundle = appSrc.splice(entryIndex, 1)[0];
let files = [entryBundle].concat(testSrc).concat(appSrc);

let browsers = [];
if (Array.isArray(argv.b)) {
    browsers = browsers.concat(argv.b);
} else if (argv.b) {
    browsers.push(argv.b);
}
if (browsers.length === 0) {
    browsers = ['Chrome', 'Firefox'];
}

module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: [project.testFramework.id],
        files: files,
        exclude: [],
        preprocessors: {
            [project.unitTestRunner.source]: [project.transpiler.id],
            'dist/**/*.js': ['coverage'],
        },
        babelPreprocessor: {options: project.transpiler.options},
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            dir: 'coverage/',
            type: 'html',
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: browsers,
        singleRun: false,
        // client.args must be a array of string.
        // Leave 'aurelia-root', project.paths.root in this order so we can find
        // the root of the aurelia project.
        client: {
            args: ['aurelia-root', project.paths.root]
        }
    });
};
