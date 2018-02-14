import gulp from 'gulp';
import revReplace from 'gulp-rev-replace';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';
import {getManifest} from './utils';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(revReplace({ manifest: getManifest() }))
    .pipe(build.bundle());
};
