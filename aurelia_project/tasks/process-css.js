import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import sassVariables from 'gulp-sass-variables';
import project from '../aurelia.json';
import {CLIOptions, build} from 'aurelia-cli';

export default function processCSS() {
  let version = CLIOptions.getFlagValue('version') || 'latest';

  return gulp.src(project.cssProcessor.source)
    .pipe(sourcemaps.init())
    .pipe(sassVariables({
      $version: version
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
};
