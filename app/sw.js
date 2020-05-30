/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
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
 *
 */

// This comes from serviceworker-webpack-plugin.
const allAssets = serviceWorkerOption.assets; // eslint-disable-line no-undef

function log(text) {
    console.log(`[SW] ${text}`); // eslint-disable-line no-console
}

function debug(text) {
    console.debug(`[SW] ${text}`); // eslint-disable-line no-console
}

self.addEventListener("install", event => {
    log("Installing Service Worker ...", event);
});

self.addEventListener("fetch", event => {
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                debug(`Responding to ${event.request.url} from the cache.`);
                return response;
            }

            return fetch(event.request);
        }),
    );
});

self.addEventListener("message", event => {
    const [messageType, kind] = event.data.split(".");

    if (messageType !== "preload") {
        return;
    }

    const cacheName = `${kind}Assets`;
    const bundlesToPreload = Object.values(allAssets).filter(bundleSrc => bundleSrc.includes(kind));
    debug(`Preading bundles: ${bundlesToPreload}`);
    addAll(cacheName, bundlesToPreload);
});

function addAll(cacheName, filesList) {
    caches.open(cacheName).then(cache => cache.addAll(filesList));
    caches.open(cacheName).then(cache =>
        cache.keys().then(cacheContent => {
            const requestAndUrls = cacheContent
                .map(request => [request, request.url])
                .map(([request, url]) => [request, new URL(url).pathname]);
            requestAndUrls.forEach(([request, url]) => {
                if (!filesList.includes(url)) {
                    debug(`Deleting request ${request.url}`);
                    cache.delete(request);
                }
            });
        }),
    );
}
