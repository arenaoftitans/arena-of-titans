var paths = require('../paths');
var compilerOptions = require('../babel-options');

var browserSync = require('browser-sync');
var gulp = require('gulp');
var to5 = require('gulp-babel');
var changed = require('gulp-changed');
var concatCss = require('gulp-concat-css');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');


gulp.task('build', function (done) {
    return runSequence(
            'clean',
            ['bundle', 'build-html', 'build-css', 'build-system'],
            done);
});


gulp.task('build-html', function () {
    return gulp.src(paths.html)
            .pipe(changed(paths.output, {extension: '.html'}))
            .pipe(gulp.dest(paths.output));
});


gulp.task('build-css', function () {
    return gulp.src(paths.css)
            .pipe(changed(paths.output, {extension: '.css'}))
            .pipe(concatCss('style.css'))
            .pipe(gulp.dest(paths.output))
            .pipe(browserSync.stream());
});


gulp.task('build-system', function () {
    return gulp.src(paths.source)
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(changed(paths.output, {extension: '.ts'}))
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(to5(compilerOptions))
            .pipe(rename({extensions: 'js'}))
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(paths.output));
});
