var gulp = require('gulp');
var paths = require('../paths');
var eslint = require('gulp-eslint');
var recess = require('gulp-recess');


gulp.task('lint', ['jslint', 'csslint']);

gulp.task('jslint', function() {
  return gulp.src(paths.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('csslint', function () {
  return gulp.src(['!style/board.css', paths.css])
      .pipe(recess({
        noIDs: false,
        noOverqualifying: false
      }))
      .pipe(recess.reporter());
});
