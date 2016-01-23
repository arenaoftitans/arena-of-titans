var gulp = require('gulp');
var showHelp = require('gulp-showhelp');

// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
require('require-dir')('build/tasks');


gulp.task('default', ['help']);


gulp.task('help', function () {
  showHelp.show(showHelp.taskNames().sort());
}).help = 'view this help message.';
