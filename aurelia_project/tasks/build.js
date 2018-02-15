import gulp from 'gulp';
import {CLIOptions, build as buildCLI} from 'aurelia-cli';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import copyFiles from './copy-files';
import buildAssets, {writeManifest} from './build-assets';
import renderTemplates from './render-templates';
import watch from './watch';
import project from '../aurelia.json';
import {loadEnvVariables} from './utils';

loadEnvVariables();

let build = gulp.series(
  readProjectConfiguration,
  buildAssets,
  renderTemplates,
  gulp.parallel(
    transpile,
    processMarkup,
    processCSS,
    copyFiles
  ),
  writeBundles,
  writeManifest
);

let main;

if (CLIOptions.taskName() === 'build' && CLIOptions.hasFlag('watch')) {
  main = gulp.series(
    build,
    (done) => { watch(); done(); }
  );
} else {
  main = build;
}

function readProjectConfiguration() {
  return buildCLI.src(project);
}

function writeBundles() {
  return buildCLI.dest();
}

export { main as default };
