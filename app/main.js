// Promise polyfill for IE11
let Promise = require('bluebird').config({  // eslint-disable-line no-unused-vars
    longStackTraces: false,
    warnings: false,
});

import { bootstrap } from 'aurelia-bootstrapper-webpack';
import XHR from 'i18next-xhr-backend';
import enTranslations from '../locale/en/translation.json';
import frTranslations from '../locale/fr/translation.json';

import '../style/global.css';
import '../style/site.css';


bootstrap(aurelia => {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-i18n', (instance) => {
            let language = navigator.language.split('-')[0];

            // register backend plugin
            instance.i18next.use(XHR);

            function loadLocales(url, options, callback, data) {
                switch (url) {
                    case 'en':
                        callback(enTranslations, { status: '200' });
                        break;
                    case 'fr':
                        callback(frTranslations, { status: '200' });
                        break;
                    default:
                        callback(null, { status: '404' });
                        break;
                }
            }

            instance.setup({
                backend: {
                    loadPath: '{{lng}}',
                    parse: (data) => data,
                    ajax: loadLocales,
                },
                lng: language,
                attributes: ['t', 'i18n'],
                fallbackLng: ['en', 'fr'],
                debug: false,
            });
        });

    aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
