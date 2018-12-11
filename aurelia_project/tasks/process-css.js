import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
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
    .pipe(autoprefixer())
    .pipe(revReplace({ manifest: getManifest() }))
    .pipe(build.bundle());
};
