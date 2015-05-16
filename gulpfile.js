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
    watchCSS: 'src/main/webapp/inc/css/*.css',
    srcHtml: ['src/main/webapp/WEB-INF/game.html'],
    destHtml: 'prd',
    watchHtml: 'src/main/webapp/WEB-INF/game.html',
    scrPartials: ['src/main/webapp/inc/html/game/*.html',
	      'src/main/webapp/inc/html/game/create/*.html'],
    destPartials: 'prd/partials'
};

gulp.task('set-production', function () {
    config.dev = false;
});

gulp.task('prod', ['set-production', 'build-js', 'build-css', 'build-html']);

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

gulp.task('build-html', function () {
    return gulp.src(config.srcHtml)
	.pipe(gulp.dest(config.destHtml));
});

gulp.task('build-partials', function () {
    return gulp.src(config.scrPartials)
	.pipe(gulp.dest(config.destPartials));
});

gulp.task('watch', ['build-js',
		    'build-css',
		    'build-html',
		    'build-partials',
		    'connect'],
	  function () {
    watch(config.watchJS, function() {
        gulp.start('build-js');
    });
    watch(config.watchCSS, function() {
        gulp.start('build-css');
    });
    watch(config.watchHtml, function () {
	gulp.start('build-html');
    });
});

gulp.task('connect', function() {
    connect.server({
	root: 'prd',
	port: 8282
  });
});
