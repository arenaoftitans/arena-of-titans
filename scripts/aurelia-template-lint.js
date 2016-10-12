const fs = require('fs');
const glob = require('glob');
const process = require('process');
const AureliaLinter = require('aurelia-template-lint').AureliaLinter
const Config = require('aurelia-template-lint').Config

let config = new Config();

let unclosedFromSvg = [
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'rect',
];
config.parserOpts.voids = config.parserOpts.voids.concat(unclosedFromSvg);

let errno = 0;
let lintPromises = [];

for (let htmlpath of glob.sync("./app/**/*.html")) {
    let html = fs.readFileSync(htmlpath, 'utf8');
    let linter = new AureliaLinter(config);
    let promise = linter.lint(html, htmlpath).then((results) => {
        results.forEach(error => {
            errno = 1;
            console.log(`${error.message} [file: ${htmlpath} ln: ${error.line} col: ${error.column}]`);
            if (error.detail) console.log(`  * ${error.detail}`);
        });
    });
    lintPromises.push(promise);
}

Promise.all(lintPromises).then(() => process.exit(errno)).catch(() => process.exit(127));
