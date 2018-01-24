import gulp from 'gulp';
import aureliaTemplateLint from 'gulp-aurelia-template-lint';

let foundLintErrors = false;

const main = gulp.series(
    templateLint,
    failOnErrors
);

function templateLint() {
    function mustIgnoreError(error, file) {
        if (file === '/app/game/play/widgets/trump/trump.html' &&
                error.message.startsWith('duplicated id:')) {
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
