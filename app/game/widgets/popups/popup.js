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
import { inject, NewInstance } from 'aurelia-framework';
import { EventAggregatorSubscriptions, Wait } from '../../services/utils';


@inject(NewInstance.of(EventAggregatorSubscriptions))
export class Popup {
    _popups;
    _displayedPopupDefered;

    constructor(eas) {
        this._eas = eas;

        this._logger = LogManager.getLogger('AoTPopup');
        this._popups = [];
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
        this._eas.subscribe('aot:popup:ready', () => {
            this._popupReadyDefered.resolve();
        });
    }

    display(type, data, {timeout = 0} = {}) {
        if (type === 'transition') {
            this._closeAll();
        }

        let popupDefered = {};
        popupDefered.promise = new Promise((resolve, reject) => {
            popupDefered.resolve = resolve;
            popupDefered.reject = reject;
        });

        let startCounter = () => {
            this._eas.publish('aot:game:counter_start');
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

    _closeAll() {
        this._logger.debug('Closing all popups');
        this._popups = [];
        this._displayedPopupDefered.reject(new Error('Closed automatically'));
    }

    _displayNext() {
        // We check that we have popup to display: if we are in the recursion, this._popups
        // may be an empty array.
        if (this._displayedPopupDefered.promise === null && this._popups.length > 0) {
            let popup = this._popups.shift();

            if (popup.timeout) {
                let closeTimeout = setTimeout(() => {
                    popup.defered.resolve();
                }, popup.timeout);
                let cancelCloseTimout = () => {
                    clearTimeout(closeTimeout);
                };
                popup.defered.promise.then(cancelCloseTimout, cancelCloseTimout);
            }

            this._eas.publish('aot:popup:display', {
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
}


@inject(Element, EventAggregatorSubscriptions)
export class AotPopupCustomElement {
    data = null;
    type = null;
    defered = null;

    background = '';

    constructor(element, eas) {
        this._element = element;
        this._eas = eas;

        this._eas.subscribe('aot:popup:display', message => {
            this.data = message.data;
            this.type = message.type;
            this.defered = message.defered;

            this._open();

            this.defered.promise.then(() => {
                this._close();
            }, () => {
                this._close();
            });
        });
    }

    attached() {
        this._eas.publish('aot:popup:ready');
    }

    _open() {
        switch (this.type) {
            case 'game-over':
                this.background = 'game-over';
                break;
            case 'player-box':
                this.background = 'popup-player-box';
                break;
            case 'transition':
                this.background = 'popup-transition';
                break;
            default:
                this.background = 'default';
                break;
        }

        Wait.forClass('popup-container', {
            element: this._element,
            fresh: true,
        }).then(elements => elements[0].focus());
    }

    _close() {
        this.data = null;
        this.type = null;
        this.defered = null;
    }

    bind() {
        this._keyupEventListener = event => {
            let keyCode = event.code.toLowerCase();

            // The player must validate the game over popup
            if ((keyCode === 'escape' || keyCode === 'esc') && this.type !== 'game-over') {
                this.defered.reject();
            }
        };
        window.addEventListener('keyup', event => {
            this._keyupEventListener(event);
        });
    }

    unbind() {
        window.removeEventListener('keyup', this._keyupEventListener);
        this._eas.dispose();
    }
}
