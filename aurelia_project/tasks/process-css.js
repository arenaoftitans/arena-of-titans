import fs from 'fs';
import gulp from 'gulp';
import revReplace from 'gulp-rev-replace';
import sourcemaps from 'gulp-sourcemaps';
import transform from 'gulp-transform';
import sass from 'gulp-sass';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';

export default function processCSS() {
  const manifestPath = `${project.assets.manifest.output}/${project.assets.manifest.name}`;
  const manifest = gulp.src(manifestPath)
    .pipe(transform('utf-8', content => content.replace('export default ', '')))
    .pipe(transform('utf-8', content => content.replace(';', '')));

  return gulp.src(project.cssProcessor.source)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(revReplace({ manifest: manifest }))
    .pipe(build.bundle());
};
