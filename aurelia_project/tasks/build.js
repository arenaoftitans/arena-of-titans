import gulp from "gulp";
import logger from "loggy";
import { CLIOptions, build as buildCLI } from "aurelia-cli";
import transpile from "./transpile";
import processMarkup from "./process-markup";
import processCSS from "./process-css";
import copyFiles from "./copy-files";
import buildAssets, { buildBundlesList, writeManifest } from "./build-assets";
import renderTemplates from "./render-templates";
import watch from "./watch";
import project from "../aurelia.json";
import { cleanDist, getApiVersion, getVersion, loadEnvVariables } from "./utils";

loadEnvVariables();

let build = gulp.series(
    readProjectConfiguration,
    buildAssets,
    renderTemplates,
    gulp.parallel(transpile, processMarkup, processCSS),
    writeBundles,
    buildBundlesList,
    writeManifest,
    copyFiles,
);

let steps = [cleanDist, build];

if (CLIOptions.taskName() === "build" && CLIOptions.hasFlag("watch")) {
    steps.push(done => {
        watch();
        done();
    });
}

const main = gulp.series(...steps);

function readProjectConfiguration() {
    logger.info(`Using environment: ${CLIOptions.getEnvironment()}`);
    logger.info(`Using version: ${getVersion()}`);
    logger.info(`Using API version: ${getApiVersion()}`);
    return buildCLI.src(project);
}

function writeBundles() {
    return buildCLI.dest();
}

export { main as default };
