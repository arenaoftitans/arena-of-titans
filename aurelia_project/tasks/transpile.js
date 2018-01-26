import fs from 'fs';
import util from 'util';
import stdGlob from 'glob';
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

const glob = util.promisify(stdGlob);
const writeFile = util.promisify(fs.writeFile);
// We create the assets list with Promise, therefore we cannot rely on standard
// gulp changes detection. So to prevent an infinite loop with the list being rebuild
// on each changes, we use this variable.
let hasCreatedAssetsToPreload = false;

function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.json`)
    .pipe(transform('utf8', content => {
      const data = JSON.parse(content);
      data.version = getVersion();
      data.api.host = process.env.API_HOST || data.api.host;
      data.api.port = process.env.API_PORT || data.api.port;
      data.api.port = parseInt(data.api.port, 10);

      return dumpAsExportedData(data);
    }))
    .pipe(changedInPlace({firstPass: true}))
    .pipe(rename('environment.js'))
    .pipe(gulp.dest(project.paths.root));
}

function createPreloadAssetsList() {
  if (hasCreatedAssetsToPreload) {
      return Promise.resolve();
  }

  hasCreatedAssetsToPreload = true;
  return glob('assets/game/**/*', { nodir: true })
    .then(assetsList => ({ game: assetsList}))
    .then(dumpAsExportedData)
    .then(data => writeFile('app/assets-list.js', data));
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
  createPreloadAssetsList,
  buildJavaScript
);
