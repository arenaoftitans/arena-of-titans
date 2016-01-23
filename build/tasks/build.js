var paths = require('../paths');
var compilerOptions = require('../babel-options');
var loadConfig = require('../utils');

var fs = require('fs');
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
            ['bundle', 'build-html', 'build-css', 'build-config', 'build-system'],
            done);
}).help = 'generate all files for the application and save them in ./dist';


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


gulp.task('build-config', function () {
    var config = loadConfig('dev');

    fs.writeFileSync('config/application.json', JSON.stringify(config));
});


gulp.task('build-system', function () {
    return gulp.src(paths.source)
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(changed(paths.output, {extension: '.js'}))
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(to5(compilerOptions))
            .pipe(rename({extensions: 'js'}))
            .pipe(sourcemaps.write('.', {includeContent: true}))
            .pipe(gulp.dest(paths.output));
});
