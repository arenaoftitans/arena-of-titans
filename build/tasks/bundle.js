var gulp = require('gulp');
var bundler = require('aurelia-bundler');
var bundles = require('../bundles.json');
var bundlesProd = require('../bundles-prod.json');

var config = {
  force: true,
  packagePath: '.'
};


gulp.task('bundle', function() {
  config.bundles = bundles.bundles;
  return bundler.bundle(config);
});


gulp.task('bundle-prod', function() {
  config.bundles = bundlesProd.bundles;
  return bundler.bundle(config);
});


gulp.task('unbundle', function() {
  config.bundles = bundles.bundles;
  return bundler.unbundle(config);
});
