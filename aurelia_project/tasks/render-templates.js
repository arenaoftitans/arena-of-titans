import gulp from "gulp";
import nunjucks from "gulp-nunjucks";
import data from "gulp-data";
import revReplace from "gulp-rev-replace";
import project from "../aurelia.json";
import { getManifest, getTemplatesVariables } from "./utils";

export function renderIndex() {
    const variables = getTemplatesVariables();

    return gulp
        .src(project.templates.sources.index)
        .pipe(data(() => variables))
        .pipe(nunjucks.compile())
        .pipe(revReplace({ manifest: getManifest() }))
        .pipe(gulp.dest("."));
}

export function renderSw() {
    const variables = getTemplatesVariables();

    return gulp
        .src(project.templates.sources.sw)
        .pipe(data(() => variables))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest("."));
}
