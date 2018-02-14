import Promise from 'bluebird';
import fs from 'fs';
import child_process from 'child_process';
import util from 'util';
import stdGlob from 'glob';
import { Configuration } from 'aurelia-cli';
import gulp from 'gulp';
import rev from 'gulp-rev';
import transform from 'gulp-transform';
import { dumpAsExportedData, getVersion } from './utils';
import project from '../aurelia.json';

const exec = util.promisify(child_process.exec);
const glob = util.promisify(stdGlob);
const chmod = util.promisify(fs.chmod);
const writeFile = util.promisify(fs.writeFile);

function hashFiles() {
    return gulp.src(project.assets.source)
        .pipe(rev())
        .pipe(gulp.dest('dist/assets'))
        .pipe(rev.manifest(project.assets.manifest.name))
        .pipe(transform('utf-8', content => {
            const data = JSON.parse(content);
            const assets = {};
            for (let src in data) {
                assets[`/assets/${src}`] = `/${project.assets.output}/${data[src]}`;
            }

            return dumpAsExportedData(assets);
        }))
        .pipe(gulp.dest(project.assets.manifest.output));
}

function fixPermissions() {
    return glob(`${project.assets.output}/**/*`, { nodir: true })
        .then(files => Promise.map(files, file => chmod(file, '0644')));
}

export function writeManifest() {
    const buildOptions = new Configuration(project.build.options);
    if (buildOptions.isApplicable('manifest')) {
        const version = getVersion();

        return Promise.all([
            glob(`dist/**/*`, { nodir: true }),
            exec('git rev-parse HEAD'),
        ])
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
            .then(manifest => writeFile(`dist/manifest-${version}.json`, manifest));
    }

    return Promise.resolve();
}

export default gulp.series(
    hashFiles,
    // Some assets are copied from a symlink and thus are executable.
    // We fix this here.
    fixPermissions
);
