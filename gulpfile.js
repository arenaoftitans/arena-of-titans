'use strict';


var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var connect = require('gulp-connect');
var data = require('gulp-data');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var nunjucksRender = require('gulp-nunjucks-render');
var renameRegex = require('gulp-regex-rename');
var showHelp = require('gulp-showhelp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var ini = require('ini');
var proxy = require('proxy-middleware');


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
    srcGameCss: ['src/main/webapp/css/*.css'],
    outGameCSS: 'game.css',
    srcSiteCSS: ['!src/main/webapp/css/createGame.css', '!src/main/webapp/css/gamePage.css', 'src/main/webapp/css/*.css'],
    outSiteCSS: 'site.css',
    destCSS: 'prd/css/',
    watchCSS: 'src/main/webapp/css/*.css',
    srcHtml: ['!src/main/webapp/WEB-INF/_*.html', 'src/main/webapp/WEB-INF/*.html'],
    destHtml: 'prd',
    watchHtml: 'src/main/webapp/WEB-INF/*.html',
    scrPartials: 'src/main/webapp/js/app/**/*.html',
    destPartials: 'prd/partials',
    srcImg: 'src/main/webapp/img/**/*',
    destImg: 'prd/img',
    templates: {}
};

// We cannot use the default tags since they conflict with angular's
nunjucksRender.nunjucks.configure({
    tags: {
        variableStart: '${',
        variableEnd: '}'
    },
    watch: false
});


gulp.task('default', ['help']);


gulp.task('help', function () {
    showHelp.show(showHelp.taskNames().sort());
});


gulp.task('clean', function (cb) {
    del('prd', cb);
}).help = 'clean production files.';


gulp.task('cleanall', ['clean'], function (cb) {
    del('node_modules', cb);
}).help = 'launch clean and remove all node_modules.';


gulp.task('dev', [
    'load-dev-conf',
    'build-js',
    'build-css',
    'build-html',
    'build-partials',
    'build-images'
]).help = 'build all files for development.';


gulp.task('load-dev-conf', function () {
    config.templates = ini.parse(fs.readFileSync('./config-dev.ini', 'utf-8'));
});


gulp.task('build-js', function () {
    return gulp.src(config.srcJS)
        .pipe(gulpif(config.dev, sourcemaps.init()))
        .pipe(concat(config.outJS))
        .pipe(uglify())
        .pipe(gulpif(config.dev, sourcemaps.write()))
        .pipe(gulp.dest(config.destJS));
});


gulp.task('build-css', ['build-game-css', 'build-site-css']);


gulp.task('build-game-css', function () {
    return gulp.src(config.srcGameCss)
        .pipe(gulpif(config.dev, sourcemaps.init()))
        .pipe(concatCss(config.outGameCSS))
        .pipe(minifyCss())
        .pipe(gulpif(config.dev, sourcemaps.write()))
        .pipe(gulp.dest(config.destCSS));
});


gulp.task('build-site-css', function () {
    return gulp.src(config.srcSiteCSS)
        .pipe(gulpif(config.dev, sourcemaps.init()))
        .pipe(concatCss(config.outSiteCSS))
        .pipe(minifyCss())
        .pipe(gulpif(config.dev, sourcemaps.write()))
        .pipe(gulp.dest(config.destCSS));
});


gulp.task('build-html', function () {
    return gulp.src(config.srcHtml)
        .pipe(data(function () {
            var nunjucksConfig = config.templates;
            return nunjucksConfig;
        }))
        .pipe(nunjucksRender())
        .pipe(renameRegex(/(.*).html/, '$1/index.html'))
        .pipe(renameRegex(/index\/index.html/, 'index.html'))
        .pipe(gulp.dest(config.destHtml));
});


gulp.task('build-partials', function () {
    return gulp.src(config.scrPartials)
        .pipe(renameRegex(/\/partials/, ''))
        .pipe(gulp.dest(config.destPartials));
});


gulp.task('build-images', function () {
    return gulp.src(config.srcImg)
        .pipe(gulp.dest(config.destImg));
});


gulp.task('watch', ['dev', 'serve'], function () {
    watch(config.watchJS, function () {
        gulp.start('build-js');
    });
    watch(config.watchCSS, function () {
        gulp.start('build-css');
    });
    watch(config.watchHtml, function () {
        gulp.start('build-html');
    });
}).help = 'watch files for modification and rebuild them.';


gulp.task('serve', function () {
    connect.server({
        root: 'prd',
        port: 8282,
        middleware: function () {
            return [(function () {
                    var url = require('url');
                    var options = url.parse('http://localhost:8080/api');
                    options.route = '/api';
                    return proxy(options);
                })()];
        }
    });
}).help = 'start a small server to ease devolopment of the frontend';


gulp.task('prod', ['load-prod-conf',
    'build-js',
    'build-css',
    'build-html',
    'build-images'
]).help = 'build all files for production.';


gulp.task('load-prod-conf', function () {
    config.dev = false;
    config.templates = ini.parse(fs.readFileSync('./config-prod.ini', 'utf-8'));
});