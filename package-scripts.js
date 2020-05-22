const { series, rimraf } = require("nps-utils");

module.exports = {
    scripts: {
        default: "nps",
        clean: rimraf("dist"),
        build: {
            sprites:
                "glue -s assets/game/cards/movement -o style/sprites --img assets/game/sprites/",
        },
        update: {
            defaultnames: "au update-external --kind default-names",
            translations: series(
                'i18next-scanner "app/**/*.{js,html}" > /dev/null 2>&1',
                "au update-external --kind translations",
                "prettier app/locale/**/*.js --write",
            ),
        },
        lint: series("au lint", 'stylelint "app/**/*.scss"', 'eslint "app/**/*.js" "test/**/*.js"'),
    },
};
