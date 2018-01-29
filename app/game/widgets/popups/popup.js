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

import * as LogManager from 'aurelia-logging';
import { inject, BindingEngine } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';


@inject(I18N, EventAggregator)
export class Popup {
    _popups;
    _displayedPopupDefered;
    _displayedPopupData;

    constructor(i18n, ea) {
        this._i18n = i18n;
        this._ea = ea;

        this._logger = LogManager.getLogger('AoTPopup');
        this._popups = [];
        this._displayedPopupData = null;
        this._displayedPopupDefered = {};
        this._displayedPopupDefered.promise = null;
        // Initialize with an empty function to prevent the code to crash when the first
        // transition popup is displayed.
        this._displayedPopupDefered.reject = () => {};
        // Just for testing.
        this._displayedPopupDefered.resolve = () => {};

        this._popupReadyDefered = {};
        this._popupReadyDefered.promise = new Promise(resolve => {
            this._popupReadyDefered.resolve = resolve;
        });
        this._ea.subscribe('aot:popup:ready', () => {
            this._popupReadyDefered.resolve();
        });
        this._ea.subscribe('i18n:locale:changed', () => {
            this._translatePopup();
        });
    }

    display(type, data, {timeout = 0} = {}) {
        if (type === 'transition') {
            this._closeAllWithoutTimeout();
        }

        let popupDefered = {};
        popupDefered.promise = new Promise((resolve, reject) => {
            popupDefered.resolve = resolve;
            popupDefered.reject = reject;
        });

        let startCounter = () => {
            this._ea.publish('aot:game:counter_start');
        };
        popupDefered.promise.then(startCounter, startCounter);

        this._popups.push({
            type: type,
            data: data,
            defered: popupDefered,
            timeout: timeout,
        });
        // Since services are instanciated first, we need to wait for aot-popup to be attached
        // before trying to display a popup.
        this._popupReadyDefered.promise.then(() => {
            this._displayNext();
        });

        return popupDefered.promise;
    }

    _closeAllWithoutTimeout() {
        this._logger.debug('Closing all popups that require user interaction');
        this._popups = this._popups.filter(popup => popup.timeout);
        if (this._displayedPopupData !== null && !this._displayedPopupData.meta.timeout) {
            this._displayedPopupDefered.reject(new Error('Closed automatically'));
            this._displayedPopupData = null;
        }
    }

    _displayNext() {
        // We check that we have popup to display: if we are in the recursion, this._popups
        // may be an empty array.
        if (this._displayedPopupDefered.promise === null && this._popups.length > 0) {
            let popup = this._popups.shift();
            this._displayedPopupData = popup.data;
            this._displayedPopupData.meta = {
                timeout: popup.timeout,
            };
            this._translatePopup();

            if (popup.timeout) {
                let closeTimeout = setTimeout(() => {
                    popup.defered.resolve();
                }, popup.timeout);
                let cancelCloseTimeout = () => {
                    clearTimeout(closeTimeout);
                };
                popup.defered.promise.then(cancelCloseTimeout, cancelCloseTimeout);
            }

            this._ea.publish('aot:popup:display', {
                type: popup.type,
                data: popup.data,
                defered: popup.defered,
            });

            this._displayedPopupDefered.promise = popup.defered.promise;
            // We need to be able to reject the promise to close all popup
            // displayed on the screen.
            this._displayedPopupDefered.reject = popup.defered.reject;
            // Just for testing.
            this._displayedPopupDefered.resolve = popup.defered.resolve;
        } else if (this._displayedPopupDefered.promise !== null) {
            this._displayedPopupData = null;
            // As soon as the current popup is closed, we display the next one.
            this._displayedPopupDefered.promise.then(() => {
                this._displayedPopupDefered.promise = null;
                // Reset to an empty function not to reject a already fullfiled promise.
                this._displayedPopupDefered.reject = () => {};
                this._displayedPopupDefered.resolve = () => {};
                this._displayNext();
            }, () => {
                this._displayedPopupDefered.promise = null;
                this._displayedPopupDefered.reject = () => {};
                this._displayedPopupDefered.resolve = () => {};
                this._displayNext();
            });
        }
    }

    _translatePopup() {
        if (!this._canTranslatePopup()) {
            return;
        }

        let translateData = this._displayedPopupData.translate;
        let params = translateData.params || {};
        this._translateObj(params, translateData.paramsToTranslate);
        this._translateObj(this._displayedPopupData, translateData.messages, params);
    }

    _canTranslatePopup() {
        return this._displayedPopupData !== null &&
            this._displayedPopupData.translate &&
            this._displayedPopupData.translate.messages;
    }

    _translateObj(dest, source, params = {}) {
        for (let key in source) {
            dest[key] = this._i18n.tr(source[key], params);
        }
    }
}


@inject(BindingEngine, EventAggregator)
export class AotPopupCustomElement {
    data = null;
    type = null;
    defered = null;
    popupModel = {};

    background = '';

    constructor(bindingEngine, ea) {
        this._bindingEngine = bindingEngine;
        this._ea = ea;
        // This will contain the reference to the container element.
        this.container = null;
        this._focusSubscription = null;

        this._eaSubscription = this._ea.subscribe('aot:popup:display', message => {
            this.type = message.type;
            this.popupModel.data = message.data;
            this.popupModel.defered = message.defered;

            this._open();

            message.defered.promise.then(() => {
                this._close();
            }, () => {
                this._close();
            });
        });
    }

    attached() {
        this._ea.publish('aot:popup:ready');
    }

    _open() {
        switch (this.type) {
            case 'assassination-animation':
                this.background = 'popup-assassination-animation';
                break;
            case 'game-over':
                this.background = 'game-over';
                break;
            case 'player-box':
                this.background = 'popup-player-box';
                break;
            case 'transition':
                this.background = 'popup-transition';
                break;
            case 'trump-animation':
                this.background = 'popup-trump-animation';
                break;
            default:
                this.background = 'default';
                break;
        }

        this._focusOnPopup();
    }

    _focusOnPopup() {
        // Since the container is only displayed if type is not null, this.container may be null
        // the first time we enter this function
        // (the time the variable is correctly bound to the element).
        // So we wait for it to change so we can correctly focus on the popup.
        if (this.container === null) {
            this._focusSubscription =
                this._bindingEngine.propertyObserver(this, 'container').subscribe(() => {
                    this._focusOnPopup();
                });
            return;
        }

        this.container.focus();
        if (this._focusSubscription) {
            this._focusSubscription.dispose();
            this._focusSubscription = null;
        }
    }

    _close() {
        this.type = null;
        this.popupModel = {};
    }

    bind() {
        this._keyupEventListener = event => {
            // code doesn't exist on IE, we need to use key.
            let keyCode = event.code || event.key;
            keyCode = keyCode.toLowerCase();

            // The player must validate the game over popup
            if ((keyCode === 'escape' || keyCode === 'esc') && this.type !== 'game-over') {
                this.popupModel.defered.reject();
            }
        };
        window.addEventListener('keyup', this._keyupEventListener);
    }

    unbind() {
        window.removeEventListener('keyup', this._keyupEventListener);
        this._eaSubscription.dispose();
    }
}
