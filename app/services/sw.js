/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
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

import * as LogManager from "aurelia-logging";
import environment from "../../config/environment.json";

export class SW {
    constructor() {
        this._registration = null;
        this._serviceWorker = null;
        this._registerdDefered = {};
        this._registerdDefered.promise = new Promise(
            resolve => (this._registerdDefered.resolve = resolve),
        );
        this._logger = LogManager.getLogger("aot:service:sw");
    }

    preloadBundles(kind) {
        // Don't try to preload images when testing the application or when debug is true
        // because we are testing or developing the app and want the latest bundles.
        if (!window.caches || environment.debug) {
            this._logger.info("Not preloading bundles, it is disabled in this env.");
            return;
        }

        this._logger.info(`Preloading bundles of kind ${kind}`);
        this._postMessage(`preload.${kind}`);
    }

    _postMessage(message) {
        this._registerdDefered.promise.then(() => {
            this._serviceWorker.postMessage(message);
        });
    }

    set swRegistration(registration) {
        this._registration = registration;

        if (this._registration.active) {
            this._serviceWorker = this._registration.active;
            this._registerdDefered.resolve();
        }
    }
}
