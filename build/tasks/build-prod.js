var compilerOptions = require('../babel-options');
var loadConfig = require('../utils');
var paths = require('../paths');

var fs = require('fs');
var gulp = require('gulp');
var to5 = require('gulp-babel');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
var mkdirp = require('mkdirp');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;


gulp.task('prod', function (done) {
    runSequence(
        'clean-prod',
        'mkdirs',
        [
            'build-config-prod',
            'copy-files-prod',
            'build-css-prod',
            'build-html-prod',
            'build-system-prod'
        ],
        'chdir-prod',
        'bundle-prod',
        done);
}).help = 'generate all files in ./public for deploy on the server.';


gulp.task('mkdirs', function (done) {
    mkdirp.sync('public/dist/config');
    done();
});


gulp.task('build-config-prod', function (done) {
    var config;
    if (argv.mock) {
        config = loadConfig('prod');
    } else {
        config = loadConfig('dist');
    }

    fs.writeFileSync('public/dist/config/application.json', JSON.stringify(config));

    done();
});


gulp.task('copy-files-prod', function () {
    return gulp.src([
            'index.html',
            'config.js',
            'jspm_packages/**/*',
            'package.json',
            'assets/**/*'
        ], {base: '.'})
        .pipe(gulp.dest(paths.prodOutput));
});


gulp.task('build-css-prod', function () {
    return gulp.src(paths.css)
        .pipe(concatCss('style.css'))
        .pipe(gulp.dest(paths.prodOutputDist));
});


gulp.task('build-html-prod', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.prodOutputDist));
});


gulp.task('build-system-prod', function () {
    return gulp.src(paths.source)
        .pipe(to5(compilerOptions))
        .pipe(rename({extensions: 'js'}))
        .pipe(gulp.dest(paths.prodOutputDist));
});


gulp.task('chdir-prod', function () {
    process.chdir('public');
});
