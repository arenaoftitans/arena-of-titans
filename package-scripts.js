const {series, crossEnv, concurrent, rimraf} = require('nps-utils');


module.exports = {
    scripts: {
        default: 'nps',
        clean: rimraf('dist'),
        build: {
            dev: series(
                rimraf('dist'),
                'au run --watch',
            ),
            prod: series(
                rimraf('dist'),
                'au build',
            ),
            sprites: 'glue -s assets/game/cards/movement -o style/sprites --img assets/game/sprites/',
        },
        update: {
            defaultnames: 'au update-external --kind default-names',
            translations: 'au update-external --kind translations',
        },
        lint: series(
            'au lint',
            'stylelint "app/**/*.scss"',
            'eslint "app/**/*.js" "test/**/*.js"'
        ),
        test: {
            default: series(
                rimraf('test/coverage-jest'),
                'jest',
            ),
        },
    },
};
