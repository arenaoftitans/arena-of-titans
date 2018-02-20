/*
* Copyright (C) 2015-2018 by Arena of Titans Contributors.
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
export class AotSoundsCustomElement {
    constructor(eas) {
        this._eas = eas;
        this.sounds = [];

        this._eas.subscribe('aot:sound:play', sound => {
            this.sounds.push(sound);
        });
        this._eas.subscribe('aot:sound:ended', sound => {
            const index = this.sounds.indexOf(sound);
            this.sounds.splice(index, 1);
        });
    }

    attached() {
        this._eas.publish('aot:sound:ready');
    }

    unbind() {
        this._eas.dispose();
    }
}
