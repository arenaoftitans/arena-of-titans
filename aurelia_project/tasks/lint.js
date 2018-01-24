import gulp from 'gulp';
import aureliaTemplateLint from 'gulp-aurelia-template-lint';
import eslint from 'gulp-eslint';
import gulpStyleLint from 'gulp-stylelint';

let foundLintErrors = false;

const main = gulp.series(
    jsLint,
    styleLint,
    templateLint,
    failOnErrors
);

function jsLint() {
    return gulp.src(['app/**/*.js', 'test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
            if (result.errorCount > 0) {
                foundLintErrors = true;
            }
        }));
}

function styleLint() {
    return gulp.src('app/**/*.scss')
        .pipe(gulpStyleLint({
            reporters: [
                { formatter: 'string', console: true },
                { formatter: lintReport => {
                    if (lintReport.some(fileReport => fileReport.errored)) {
                        foundLintErrors = true;
                    }
                }},
            ],
            failAfterError: false,
        }));
}

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
