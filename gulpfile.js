var gulp = require('gulp');

// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
require('require-dir')('build/tasks');


gulp.task('default', ['help']);


gulp.task('help', function () {
  showHelp.show(showHelp.taskNames().sort());
});


//gulp.task('dev', function (cb) {
//  runSequence(
//      'load-dev-conf',
//      ['build-js', 'build-css', 'build-html', 'build-partials', 'build-images'],
//      cb);
//}).help = 'build all files for development.';
//
//
//gulp.task('load-dev-conf', function () {
//  config.templates = toml.parse(fs.readFileSync('./config-dev.toml', 'utf-8'));
//});
//
//
//
//
//
//gulp.task('prod', function (cb) {
//  runSequence(
//      'clean',
//      'load-prod-conf',
//      ['build-js', 'build-css', 'build-html', 'build-images', 'build-partials'],
//      cb);
//}).help = 'build all files for production.';
//
//
//gulp.task('load-prod-conf', function (cb) {
//  config.dev = false;
//  config.templates = toml.parse(fs.readFileSync('./config-prod.toml', 'utf-8'));
//
//  cb();
//});
