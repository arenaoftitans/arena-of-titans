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
var toml = require('toml');
var runSequence = require('run-sequence');


var config = {
  dev: true,
  srcJS: ['vendor/angular.js',
    'vendor/*.js',
    'app/app.js',
    'app/**/*module.js',
    'app/**/*.js'
  ],
  destJS: 'public/js',
  outJS: 'game.js',
  srcGameCss: ['style/*.css'],
  outGameCSS: 'game.css',
  srcSiteCSS: ['!style/createGame.css', '!style/gamePage.css', 'style/*.css'],
  outSiteCSS: 'site.css',
  destCSS: 'public/css/',
  srcHtml: ['!app/_*.html', 'app/*.html'],
  destHtml: 'public',
  srcPartials: 'app/**/*.html',
  destPartials: 'public/partials',
  srcImg: 'assets/**/*',
  destImg: 'public/img',
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


gulp.task('dev', function (cb) {
  runSequence(
      'load-dev-conf',
      ['build-js', 'build-css', 'build-html', 'build-partials', 'build-images'],
      cb);
}).help = 'build all files for development.';


gulp.task('load-dev-conf', function () {
  config.templates = toml.parse(fs.readFileSync('./config-dev.toml', 'utf-8'));
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
      .pipe(renameRegex(/index(\/|\\)index.html/, 'index.html'))
      .pipe(gulp.dest(config.destHtml));
});


gulp.task('build-partials', function () {
  return gulp.src(config.srcPartials)
      .pipe(renameRegex(/(\/|\\)partials/, ''))
      .pipe(gulp.dest(config.destPartials));
});


gulp.task('build-images', function () {
  return gulp.src(config.srcImg)
      .pipe(gulp.dest(config.destImg));
});


gulp.task('watch', ['dev', 'serve'], function () {
  watch(config.srcJS, function () {
    gulp.start('build-js');
  });
  watch(config.srcGameCss, function () {
    gulp.start('build-css');
  });
  watch(config.srcHtml, function () {
    gulp.start('build-html');
  });
  watch(config.srcPartials, function () {
    gulp.start('build-partials');
  });
  watch(config.srcImg, function () {
    gulp.start('build-images')
  });
}).help = 'watch files for modification and rebuild them.';


gulp.task('serve', function () {
  connect.server({
    root: 'prd',
    port: 8282
  });
}).help = 'start a small server to ease devolopment of the frontend';


gulp.task('prod', function (cb) {
  runSequence(
      'clean',
      'load-prod-conf',
      ['build-js', 'build-css', 'build-html', 'build-images', 'build-partials'],
      cb);
}).help = 'build all files for production.';


gulp.task('load-prod-conf', function (cb) {
  config.dev = false;
  config.templates = toml.parse(fs.readFileSync('./config-prod.toml', 'utf-8'));

  cb();
});
