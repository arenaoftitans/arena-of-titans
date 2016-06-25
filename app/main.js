/*
* Copyright (C) 2015-2016 by Arena of Titans Contributors.
*
* This file is part of Arena of Titans.
*
* Arena of Titans is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Arena of Titans is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
*/

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
    if (!global.Intl) {
        require.ensure([
            'intl',
            'intl/locale-data/jsonp/en.js',
        ], require => {
            require('intl');
            require('intl/locale-data/jsonp/en.js');
            boot(aurelia);
        });
    } else {
        boot(aurelia);
    }
});


function boot(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-piwik')
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
                fallbackLng: 'en',
                debug: false,
            });
        });

    aurelia.start().then(() => aurelia.setRoot('app', document.body));
}
