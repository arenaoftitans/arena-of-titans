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

import { inject } from 'aurelia-framework';
import { EventAggregatorSubscriptions } from '../../services/utils';


@inject(EventAggregatorSubscriptions)
export class Popover {
    constructor(eas) {
        this._eas = eas;

        this.type = null;
        this._popovers = [];
        this._displayedPopoverDefered = null;

        this._popoverReadyDefered = {};
        this._popoverReadyDefered.promise = new Promise(resolve => {
            this._popoverReadyDefered.resolve = resolve;
        });
        this._eas.subscribe('aot:popover:ready', () => {
            this._popoverReadyDefered.resolve();
        });
    }

    display(type, text) {
        let defered = {};
        defered.promise = new Promise(resolve => (defered.resolve = resolve));

        this._popovers.push({
            defered,
            type,
            text,
        });
        // Since services are instanciated first, we need to wait for aot-popover to be attached
        // before trying to display a popover.
        this._popoverReadyDefered.promise.then(() => {
            this._displayNext();
        });

        return defered.resolve;
    }

    _displayNext() {
        if (this._displayedPopoverDefered === null && this._popovers.length > 0) {
            let popover = this._popovers.shift();

            this._displayedPopoverDefered = popover.defered;

            this._eas.publish('aot:popover:display', popover);
        } else if (this._displayedPopoverDefered !== null) {
            let cb = () => {
                this._displayedPopoverDefered = null;
                this._displayNext();
            };
            this._displayedPopoverDefered.promise.then(cb, cb);
        }
    }
}


@inject(EventAggregatorSubscriptions)
export class AotPopoverCustomElement {
    constructor(eas) {
        this._eas = eas;

        this._eas.subscribe('aot:popover:display', message => {
            this.type = message.type;
            this.text = message.text;

            let cb = () => this._hide();
            message.defered.promise.then(cb, cb);
        });
    }

    attached() {
        this._eas.publish('aot:popover:ready');
    }

    _hide() {
        this.type = null;
        this.text = '';
    }

    unbind() {
        this._eas.dispose();
    }
}
