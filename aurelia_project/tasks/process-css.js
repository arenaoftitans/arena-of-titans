import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import sassVariables from 'gulp-sass-variables';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';
import {getVersion} from './utils';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(sourcemaps.init())
    .pipe(sassVariables({
      $version: getVersion(),
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
};
