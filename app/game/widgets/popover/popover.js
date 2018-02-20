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
import { CssAnimator } from 'aurelia-animator-css';
import { EventAggregatorSubscriptions } from '../../services/utils';


@inject(EventAggregatorSubscriptions, CssAnimator)
export class AotPopoverCustomElement {
    // Referenced in the template.
    popover;

    constructor(eas, animator) {
        this._eas = eas;
        this._animator = animator;

        this._eas.subscribe('aot:popover:display', message => {
            this.type = message.type;
            this.text = message.text;
            this._display();

            let cb = () => this._hide();
            let emitHidden = () => this._eas.publish('aot:popover:hidden');
            message.defered.promise.then(cb, cb)
                .then(emitHidden, emitHidden);
        });
    }

    attached() {
        this._eas.publish('aot:popover:ready');
    }

    _display() {
        return this._animator.addClass(this.popover, 'popover-display');
    }

    _hide() {
        return this._animator.removeClass(this.popover, 'popover-display').then(() => {
            this.text = '';
        });
    }

    unbind() {
        this._eas.dispose();
    }
}
