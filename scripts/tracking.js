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

if (/.*arenaoftitans\.(com|fr)/.test(window.location.host)) {
    var _paq = _paq || [];
    var siteId;
    var domains;
    if (/^www/.test(window.location.host)) {
        siteId = 3;
        domains = ["*.www.arenaoftitans.fr", "*.www.arenaoftitans.com"];
    } else {
        siteId = 4;
        domains = ["*.dev.arenaoftitans.com"]
    }
    (function () {
        var u = "//piwik.jujens.eu/";
        if (siteId === undefined) {
            return;
        }

        _paq.push(["setDomains", domains]);
        _paq.push(['setTrackerUrl', u + 'piwik.php']);
        _paq.push(['setSiteId', siteId]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
    })();
}
