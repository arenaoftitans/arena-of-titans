import gulp from 'gulp';
import aureliaTemplateLint from 'gulp-aurelia-template-lint';
import path from 'path';

// We rely on a global boolean and process.exit to exit the task in error
// in case of lint errors. We need to do this because lint tasks either exit
// with a 0 status code or they display a stacktrace in case of lint errors.
let foundLintErrors = false;

const main = gulp.series(
    templateLint,
    failOnErrors
);

function templateLint() {
    function mustIgnoreError(error, file) {
        if (file.endsWith(path.join('app', 'game', 'play', 'widgets', 'trump', 'trump.html')) &&
                error.message.startsWith('duplicated id:')) {
            return true;
        } else if (
            file.endsWith(path.join('app', 'game', 'play', 'widgets', 'board', 'board.html'))
            && error.message.startsWith('illegal characters detected in id:')
        ) {
            return true;
        }

        return false;
    }

    return gulp.src('./app/**/*.html')
        .pipe(aureliaTemplateLint(null, (error, file) => {
            if (!mustIgnoreError(error, file)) {
                foundLintErrors = true;
                console.log(`[Template lint] ${error.message} [file: ${file} ln: ${error.line} col: ${error.column}]`);
                if (error.detail) console.log(`  * ${error.detail}`);
            }
        }));
}

function failOnErrors() {
    if (foundLintErrors) {
        process.exit(1);
    }
}

export { main as default };
