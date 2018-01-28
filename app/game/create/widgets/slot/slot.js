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

import { bindable, inject } from 'aurelia-framework';
import environment from '../../../../environment';
import { Api } from '../../../services/api';
import { randomInt } from '../../../services/utils';


const CHOOSABLE_SLOTS_STATES = ['OPEN', 'AI', 'CLOSED'];


@inject(Api)
export class AotSlotCustomElement {
    @bindable player;
    @bindable canAdmin;

    constructor(api) {
        this._api = api;
        this.choosableSlotsStates = CHOOSABLE_SLOTS_STATES;
    }

    updateSlot() {
        if (this.player.state === 'AI') {
            this.player.player_name = `AI ${this.player.index}`;
            this.player.hero = environment.heroes[randomInt(0, environment.heroes.length - 1)];
        }
        this._api.updateSlot(this.player);
    }
}
