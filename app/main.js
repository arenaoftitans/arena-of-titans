export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-i18n', (instance) => {
            let language = navigator.language.split('-')[0];

            instance.setup({
                resGetPath: '/locale/__lng__/__ns__.json',
                lng: language,
                attributes: ['t', 'i18n'],
                getAsync: false,
                sendMissing: false,
                fallbackLng: 'en',
                debug: false
            });
        });

    aurelia.start().then(a => a.setRoot());
}
