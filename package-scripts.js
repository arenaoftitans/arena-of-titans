const { crossEnv, series, rimraf } = require("nps-utils");

module.exports = {
    scripts: {
        default: "nps",
        clean: rimraf("dist"),
        build: {
            config: "au build-config",
            manifest: "au build-manifest",
        },
        test: {
            default: crossEnv("BABEL_TARGET=node jest"),
            coverage: crossEnv("BABEL_TARGET=node jest --coverage"),
            watch: crossEnv("BABEL_TARGET=node jest --watch"),
        },
        update: {
            defaultnames: "au update-external --kind default-names",
            translations: series(
                'i18next-scanner "app/**/*.{js,html}" > /dev/null 2>&1',
                "au update-external --kind translations",
                "prettier app/locale/**/*.js --write",
            ),
        },
        webpack: {
            analyse: "webpack --env.environment=production --analyze",
            devserver: "webpack-dev-server --env.environment=dev --extractCss",
            build: "webpack --extractCss",
        },
        lint: series("au lint", 'stylelint "app/**/*.scss"', 'eslint "app/**/*.js" "test/**/*.js"'),
    },
};
