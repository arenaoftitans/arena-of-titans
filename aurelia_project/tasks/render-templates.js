import gulp from 'gulp';
import nunjucks from 'gulp-nunjucks';
import data from 'gulp-data';
import project from '../aurelia.json';
import {getTemplatesVariables} from './utils';

export default function renderTemplates() {
    return gulp.src(project.templates.source)
        .pipe(data(() => getTemplatesVariables()))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('.'));
}
