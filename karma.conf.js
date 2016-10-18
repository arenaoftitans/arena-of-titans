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
const externalFiles = require('./test/karma-vendor-files.json');
const CLIOptions = require('aurelia-cli').CLIOptions;

let tdd = CLIOptions.hasFlag('source');
let argv = require('minimist')(process.argv.slice(2));

let testSrc = [];
let files = [];
let exclude = [];
let preprocessors = {};
let proxies = {};

let browsers = [];
if (Array.isArray(argv.b)) {
    browsers = browsers.concat(argv.b);
} else if (argv.b) {
    browsers.push(argv.b);
}
if (browsers.length === 0) {
    browsers = ['Chrome', 'Firefox'];
}

if (tdd) {
    // Note: When serving up the node_modules, the amount of files in folder will affect how long it takes for Karma to start up.
    // If you want better startup times, find some way to create a tree of only the node_modules that are used and use that list instead of a blanket include of all node_modules
    testSrc = [
        {pattern: project.markupProcessor.source, included: false},
    ];

    for (let source of project.transpiler.source) {
        testSrc.push({pattern: source, included: false});
        //Since we are now including source code, we need babel to transpile our source files on the fly
        preprocessors[source] = [project.transpiler.id];
    }

    testSrc = testSrc.concat([
        {pattern: project.unitTestRunner.source, included: false},

        // This file is automatically generated from the `test.js` task. It is the compiled loader config used for the application
        'test/karma-require-config.js',
        'test/aurelia-karma.js',
    ]);

    files = ['scripts/require.js'].concat(externalFiles).concat(testSrc);
    // Node modules sometimes publish their test files, we want to exclude any test file that might be caught up in our tests
    exclude = ['node_modules/**/*{test,Test,spec,Spec}.js']; 
    preprocessors[project.unitTestRunner.source] = [project.transpiler.id];
} else {
    let output = project.build.targets[0].output;
    let appSrc = project.build.bundles.map(x => path.join(output, x.name));
    let entryIndex = appSrc.indexOf(path.join(output, project.build.loader.configTarget));
    let entryBundle = appSrc.splice(entryIndex, 1)[0];

    testSrc = [
        {pattern: project.unitTestRunner.source, included: false},
        'test/aurelia-karma.js',
    ];
    files = [entryBundle].concat(testSrc).concat(appSrc);
    preprocessors = {
        [project.unitTestRunner.source]: [project.transpiler.id],
    };
}


module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: [project.testFramework.id],
        files: files,
        exclude: exclude,
        preprocessors: preprocessors,
        babelPreprocessor: {options: project.transpiler.options},
        proxies: proxies,
        reporters: ['progress'],
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
