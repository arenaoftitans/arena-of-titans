'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var connect = require('gulp-connect');

var config = {
    dev: true,
    srcJS: ['src/main/webapp/inc/js/lib/angular.js',
            'src/main/webapp/inc/js/lib/*.js',
            'src/main/webapp/inc/js/app.js',
            'src/main/webapp/inc/js/app/**/*module.js',
            'src/main/webapp/inc/js/app/**/*.js'
	   ],
    destJS: 'prd/js/',
    outJS: 'game.js',
    watchJS: 'src/main/webapp/inc/js/app/**/*.js',
    srcCSS: ['src/main/webapp/inc/css/*.css'],
    destCSS: 'prd/css/',
    outCSS: 'game.css',
    watchCSS: 'src/main/webapp/inc/css/*.css'
};

gulp.task('set-production', function () {
    config.dev = false;
});

gulp.task('prod', ['set-production', 'build-js', 'build-css']);

gulp.task('build-js', function () {
    return gulp.src(config.srcJS)
        .pipe(gulpif(config.dev, sourcemaps.init()))
	.pipe(concat(config.outJS))
        .pipe(uglify())
        .pipe(gulpif(config.dev, sourcemaps.write()))
        .pipe(gulp.dest(config.destJS));
});

gulp.task('build-css', function () {
    return gulp.src(config.srcCSS)
	.pipe(gulpif(config.dev, sourcemaps.init()))
	.pipe(concatCss(config.outCSS))
	.pipe(minifyCss())
	.pipe(gulpif(config.dev, sourcemaps.write()))
        .pipe(gulp.dest(config.destCSS));
});

gulp.task('watch', ['build-js', 'build-css', 'connect'], function () {
    watch(config.watchJS, function() {
        gulp.start('build-js');
    });
    watch(config.watchCSS, function() {
        gulp.start('build-css');
    });
});

gulp.task('connect', function() {
    connect.server({
	root: 'prd',
	port: 8282
  });
});
