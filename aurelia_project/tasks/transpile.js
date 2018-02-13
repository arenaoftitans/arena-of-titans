import gulp from 'gulp';
import changedInPlace from 'gulp-changed-in-place';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import transform from 'gulp-transform';
import project from '../aurelia.json';
import {CLIOptions, build} from 'aurelia-cli';
import {getVersion, dumpAsExportedData} from './utils';

function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.json`)
    .pipe(transform('utf8', content => {
      const data = JSON.parse(content);
      data.version = getVersion();
      data.api.host = process.env.API_HOST || data.api.host;
      data.api.port = process.env.API_PORT || data.api.port;
      data.api.port = parseInt(data.api.port, 10);
      data.api.version = process.env.API_VERSION || data.api.version;

      return dumpAsExportedData(data);
    }))
    .pipe(changedInPlace({firstPass: true}))
    .pipe(rename('environment.js'))
    .pipe(gulp.dest(project.paths.root));
}

function buildJavaScript() {
  let transpiler;
  if (CLIOptions.hasFlag('coverage')) {
      transpiler = project.coverageTranspiler;
  } else {
      transpiler = project.transpiler;
  }

  return gulp.src(transpiler.source)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(changedInPlace({firstPass: true}))
    .pipe(sourcemaps.init())
    .pipe(babel(transpiler.options))
    .pipe(build.bundle());
}

export default gulp.series(
  configureEnvironment,
  buildJavaScript
);
