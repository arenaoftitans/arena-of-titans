/*
 * Copyright (C) 2016 by Arena of Titans Contributors.
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

if (/.*last-run\.(com|fr)/.test(window.location.host)) {
    function privacyCnil(_paq) {
        // From https://www.cnil.fr/sites/default/files/typo/document/Configuration_piwik.pdf
        _paq.push([
            function() {
                var self = this;

                function getOriginalVisitorCookieTimeout() {
                    var now = new Date(),
                        nowTs = Math.round(now.getTime() / 1000),
                        visitorInfo = self.getVisitorInfo();
                    var createTs = parseInt(visitorInfo[2]);
                    var cookieTimeout = 33696000; // 13 mois en secondes
                    var originalTimeout = createTs + cookieTimeout - nowTs;
                    return originalTimeout;
                }

                this.setVisitorCookieTimeout(getOriginalVisitorCookieTimeout());
            },
        ]);
    }

    var _paq = _paq || [];

    privacyCnil(_paq);

    var siteId;
    var domains;
    if (/^www/.test(window.location.host)) {
        siteId = 3;
        domains = ["*.www.last-run.fr", "*.www.last-run.com"];
    } else {
        siteId = 4;
        domains = ["*.dev.last-run.com"];
    }
    (function() {
        var u = "//piwik.jujens.eu/";
        if (siteId === undefined) {
            return;
        }

        _paq.push(["setDomains", domains]);
        _paq.push(["setTrackerUrl", u + "piwik.php"]);
        _paq.push(["setSiteId", siteId]);
        _paq.push(["trackPageView"]);
        _paq.push(["enableLinkTracking"]);
    })();
}
