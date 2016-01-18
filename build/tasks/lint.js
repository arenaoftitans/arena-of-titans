var gulp = require('gulp');
var paths = require('../paths');
var eslint = require('gulp-eslint');
var recess = require('gulp-recess');


// runs eslint on all .js files
gulp.task('lint', function() {
  return gulp.src(paths.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('csslint', function () {
  return gulp.src(['!style/board.css', 'style/**/*.css'])
      .pipe(recess({
        noIDs: false
      }))
      .pipe(recess.reporter());
});
