import gulp from 'gulp';
import nunjucks from 'gulp-nunjucks';
import data from 'gulp-data';
import revReplace from 'gulp-rev-replace';
import project from '../aurelia.json';
import {getManifest, getTemplatesVariables} from './utils';

export default function renderTemplates() {
    const variables = getTemplatesVariables();

    return gulp.src(project.templates.source)
        .pipe(data(() => variables))
        .pipe(nunjucks.compile())
        .pipe(revReplace({ manifest: getManifest() }))
        .pipe(gulp.dest('.'));
}
