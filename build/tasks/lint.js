var gulp = require('gulp');
var paths = require('../paths');
var eslint = require('gulp-eslint');
var recess = require('gulp-recess');


gulp.task(
    'lint',
    ['jslint', 'csslint']
).help = 'lint all JS and CSS files. Please do this before commiting.';

gulp.task('jslint', function() {
  return gulp.src(paths.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}).help = 'lint all JS files.';

gulp.task('csslint', function () {
  return gulp.src(['!style/board.css', '!style/sprites/*.css', paths.css])
      .pipe(recess({
        noIDs: false,
        noOverqualifying: false
      }))
      .pipe(recess.reporter());
}).help = 'lint all CSS files.';
