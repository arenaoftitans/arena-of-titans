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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { I18N } from "aurelia-i18n";

@inject(I18N, EventAggregator)
export class Popup {
    constructor(i18n, ea) {
        this._i18n = i18n;
        this._ea = ea;

        this._logger = LogManager.getLogger("AoTPopup");
        this._popups = [];
        this._displayedPopupData = null;
        // We initialize the displayed popup deferred to a resolved deferred.
        this._displayedPopupDeferred = this._createDeferred();
        this._displayedPopupDeferred.resolve();

        this._popupReadyDeferred = this._createDeferred();
        this._ea.subscribe("aot:popup:ready", () => {
            this._popupReadyDeferred.resolve();
        });
        this._ea.subscribe("i18n:locale:changed", () => {
            this._translatePopup();
        });
    }

    _createDeferred() {
        const deferred = {};
        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = (...args) => {
                resolve(...args);
                deferred.pending = false;
            };
            deferred.reject = (...args) => {
                reject(...args);
                deferred.pending = false;
            };
            deferred.pending = true;
        });
        return deferred;
    }

    display(type, data, { timeout = 0 } = {}) {
        if (type === "transition") {
            this._closeAllWithoutTimeout();
        }

        let popupDeferred = this._createDeferred();

        let startCounter = () => {
            if (type === "transition") {
                this._ea.publish("aot:game:counter_start");
            }
        };
        popupDeferred.promise.then(startCounter, startCounter);

        this._popups.push({
            type: type,
            data: data,
            deferred: popupDeferred,
            timeout: timeout,
        });
        // Since services are instantiated first, we need to wait for aot-popup to be attached
        // before trying to display a popup.
        this._popupReadyDeferred.promise.then(() => {
            return this._displayedPopupDeferred.promise.then(
                () => this._displayNext(),
                () => this._displayNext(),
            );
        });

        return popupDeferred.promise;
    }

    _closeAllWithoutTimeout() {
        this._logger.debug("Closing all popups that require user interaction");
        this._popups = this._popups.filter(popup => popup.timeout);
        if (this._displayedPopupData !== null && !this._displayedPopupData.meta.timeout) {
            this._displayedPopupDeferred.reject(new Error("Closed automatically"));
            this._displayedPopupData = null;
        }
    }

    _displayNext() {
        // We check that we have popup to display: if we are in the recursion, this._popups
        // may be an empty array.
        if (this._popups.length === 0 || this._displayedPopupDeferred.pending) {
            return;
        }

        let popup = this._popups.shift();
        this._displayedPopupData = popup.data;
        this._logger.debug("Displaying next popup", JSON.stringify(this._displayedPopupData));
        this._displayedPopupData.meta = {
            timeout: popup.timeout,
        };
        this._translatePopup();

        if (popup.timeout) {
            let closeTimeout = setTimeout(() => {
                this._logger.debug("Hit popup time out, closing", popup.timeout);
                popup.deferred.resolve();
            }, popup.timeout);
            let cancelCloseTimeout = () => {
                clearTimeout(closeTimeout);
            };
            popup.deferred.promise.then(cancelCloseTimeout, cancelCloseTimeout);
        }
        this._logger.debug("Displayed popup is now of type", popup.type);
        this._displayedPopupDeferred = popup.deferred;

        this._ea.publish("aot:popup:display", {
            type: popup.type,
            data: popup.data,
            deferred: popup.deferred,
        });

        // As soon as the current popup is closed, we display the next one.
        this._displayedPopupDeferred.promise.then(
            () => {
                this._displayedPopupData = null;
                this._displayNext();
            },
            () => {
                this._displayedPopupData = null;
                this._displayNext();
            },
        );
    }

    _translatePopup() {
        if (!this._canTranslatePopup()) {
            return;
        }

        let translateData = this._displayedPopupData.translate;
        let params = translateData.params || {};
        this._translateObj(params, translateData.paramsToTranslate);
        this._translateObj(this._displayedPopupData, translateData.messages, params);
        this._translateChoices();
    }

    _canTranslatePopup() {
        return (
            this._displayedPopupData !== null &&
            this._displayedPopupData.translate &&
            this._displayedPopupData.translate.messages
        );
    }

    _translateObj(dest, source, params = {}) {
        for (let key in source) {
            dest[key] = this._i18n.tr(source[key], params);
        }
    }

    _translateChoices() {
        if (!this._displayedPopupData.choices) {
            return;
        }

        this._displayedPopupData.choices = this._displayedPopupData.choices.map(choice => ({
            ...choice,
            name: this._i18n.tr(choice.name),
        }));

        this._translateObj(this._displayedPopupData, this._displayedPopupData.choices);
    }
}
