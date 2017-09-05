/* 
 * Copyright (C) 2017 by Arena of Titans Contributors.
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

/**
 * This is meant to detect compatible browsers and display a message if Aurelia
 * fails to load. In order to work in as many browsers as possible, it must be
 * written in ES5.
 */
(function () {
    /**
     * Inspired by https://github.com/aurelia/protractor-plugin/blob/master/index.js#L59.
     */
    function aureliaFailedToLoad () {
        // 5 minutes in milliseconds.
        var APP_FAILS_TO_LOAD_TIMEOUT = 5 * 1000;
        var app = document.querySelector('[aurelia-app]');
        var loadTimeout = setTimeout(function () {
            var messagesContainer = document.querySelector('.application-load-errors');
            messagesContainer.style.display = '';

            var aureliaFailedToLoadContainer = document.querySelector('.aurelia-load-errors');
            aureliaFailedToLoadContainer.style.display = '';
        }, APP_FAILS_TO_LOAD_TIMEOUT);

        // Aurelia is already loaded.
        if (app && app.aurelia) {
            clearTimeout(loadTimeout);
        } else {
            document.addEventListener('aurelia-composed', function () {
                clearTimeout(loadTimeout);
            }, false);
        }
    }

    function detectUnsupportedBrowsers() {
        var ua = navigator.userAgent;
        var msie = +((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
        if (isNaN(msie)) {
            msie = +((/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1]);
        }
        msie = !isNaN(msie);

        if (msie) {
            document.getElementsByTagName('body')[0].removeAttribute('aurelia-app');

            var messagesContainer = document.querySelector('.application-load-errors');
            messagesContainer.style.display = '';

            var unsupportedBrowserContainer = document.querySelector('.unsupported-browser-error');
            unsupportedBrowserContainer.style.display = '';

            return true;
        }

        return false;
    }

    // Only launch the part about aurelia failed to load on supported browsers.
    if (!detectUnsupportedBrowsers()) {
        aureliaFailedToLoad();
    }
})();
