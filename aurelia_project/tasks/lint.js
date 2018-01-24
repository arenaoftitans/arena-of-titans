import gulp from 'gulp';
import aureliaTemplateLint from 'gulp-aurelia-template-lint';

let foundLintErrors = false;

const main = gulp.series(
    failOnErrors
);

function failOnErrors() {
    if (foundLintErrors) {
        process.exit(1);
    }
}

export { main as default };
