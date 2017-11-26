import gulp from 'gulp';
import nunjucks from 'gulp-nunjucks';
import data from 'gulp-data';
import project from '../aurelia.json';
import {getTemplatesVariables} from './utils';

export default function renderTemplates() {
    const variables = getTemplatesVariables();

    return gulp.src(project.templates.source)
        .pipe(data(() => variables))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('.'));
}
