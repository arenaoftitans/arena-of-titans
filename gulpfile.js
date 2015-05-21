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
var rename = require('gulp-rename');
var proxy = require('proxy-middleware');
var renameRegex = require('gulp-regex-rename');
var data = require('gulp-data');
var ini = require('ini');
var fs = require('fs');
var nunjucksRender = require('gulp-nunjucks-render');


var config = {
    dev: true,
    srcJS: ['src/main/webapp/js/lib/angular.js',
            'src/main/webapp/js/lib/*.js',
            'src/main/webapp/js/app.js',
            'src/main/webapp/js/app/**/*module.js',
            'src/main/webapp/js/app/**/*.js'
	   ],
    destJS: 'prd/js/',
    outJS: 'game.js',
    watchJS: 'src/main/webapp/js/app/**/*.js',
    srcCSS: ['src/main/webapp/css/*.css'],
    destCSS: 'prd/css/',
    outCSS: 'game.css',
    watchCSS: 'src/main/webapp/css/*.css',
    srcHtml: ['src/main/webapp/WEB-INF/game.html'],
    destHtml: 'prd',
    watchHtml: 'src/main/webapp/WEB-INF/game.html',
    scrPartials: 'src/main/webapp/js/app/**/*.html',
    destPartials: 'prd/partials',
    srcImg: 'src/main/webapp/img/**/*',
    destImg: 'prd/img'
};

nunjucksRender.nunjucks.configure({
    tags: {
	variableStart: '${',
	variableEnd: '}',
    },
    watch: false
});

gulp.task('set-production', function () {
    config.dev = false;
});

gulp.task('prod', ['set-production',
		   'build-js',
		   'build-css',
		   'build-html',
		   'build-images'
		  ]);

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
	.pipe(data(function() {
            var nunjucksConfig = {};
            if (config.dev) {
	        nunjucksConfig = ini.parse(fs.readFileSync('./config-dev.ini', 'utf-8'));
            } else {
                nunjucksConfig = ini.parse(fs.readFileSync('./config-prod.ini', 'utf-8'));
            }
	    return nunjucksConfig;
	}))
	.pipe(nunjucksRender())
	.pipe(rename('game/index.html'))
	.pipe(gulp.dest(config.destHtml));
});

gulp.task('build-images', function () {
    return gulp.src(config.srcImg)
	.pipe(gulp.dest(config.destImg));
});

gulp.task('build-partials', function () {
    return gulp.src(config.scrPartials)
	.pipe(renameRegex(/\/partials/, ''))
	.pipe(gulp.dest(config.destPartials));
});

gulp.task('watch', ['build-js',
		    'build-css',
		    'build-html',
		    'build-partials',
		    'build-images',
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
	port: 8282,
	middleware: function(connect, o) {
            return [ (function() {
		var url = require('url');
		var options = url.parse('http://localhost:8080/api');
		options.route = '/api';
		return proxy(options);
            })() ];
	}
    });
});
