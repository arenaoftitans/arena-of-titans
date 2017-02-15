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

import { inject } from 'aurelia-framework';
import { EventAggregatorSubscriptions, Wait } from '../../services/utils';


@inject(EventAggregatorSubscriptions)
export class Popup {
    _popupDefered;

    constructor(eas) {
        this._eas = eas;
    }

    display(type, data, {timeout = 0} = {}) {
        let popupDefered = {};
        popupDefered.promise = new Promise((resolve, reject) => {
            popupDefered.resolve = resolve;
            popupDefered.reject = reject;
        });

        if (timeout) {
            let closeTimeout = setTimeout(() => {
                popupDefered.resolve();
            }, timeout);
            let cancelCloseTimout = () => {
                clearTimeout(closeTimeout);
            };
            popupDefered.promise.then(cancelCloseTimout, cancelCloseTimout);
        }

        let startCounter = () => {
            this._eas.publish('aot:game:counter_start');
        };
        popupDefered.promise.then(startCounter, startCounter);

        this._eas.publish('aot:popup:display', {
            type: type,
            data: data,
            defered: popupDefered,
        });

        return popupDefered.promise;
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
