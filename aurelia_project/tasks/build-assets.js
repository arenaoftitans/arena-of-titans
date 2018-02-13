import Promise from 'bluebird';
import fs from 'fs';
import util from 'util';
import stdGlob from 'glob';
import gulp from 'gulp';
import rev from 'gulp-rev';
import transform from 'gulp-transform';
import { dumpAsExportedData } from './utils';
import project from '../aurelia.json';

const glob = util.promisify(stdGlob);
const chmod = util.promisify(fs.chmod);

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

export default gulp.series(
    hashFiles,
    // Some assets are copied from a symlink and thus are executable.
    // We fix this here.
    fixPermissions
);
