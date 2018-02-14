import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import changedInPlace from 'gulp-changed-in-place';
import revReplace from 'gulp-rev-replace';
import project from '../aurelia.json';
import {build} from 'aurelia-cli';
import {getManifest} from './utils';

export default function processMarkup() {
  return gulp.src(project.markupProcessor.source)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changedInPlace({firstPass:true}))
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        minifyCSS: true,
        minifyJS: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        ignoreCustomFragments: [/\${.*?}/g] // ignore interpolation expressions
    }))
    .pipe(revReplace({ manifest: getManifest() }))
    .pipe(build.bundle());
}
