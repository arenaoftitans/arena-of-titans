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

import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { State } from "../../../services/state";

@inject(State, I18N)
export class AotTrumpsCustomElement {
    _state;
    _game;
    _i18n;
    affectingInfos = {};

    constructor(state, i18n) {
        this._state = state;
        this._i18n = i18n;
    }

    get power() {
        return this._state.me.power;
    }

    get trumps() {
        return this._state.me.trumps;
    }

    get affectingTrumps() {
        return this._state.me.affecting_trumps;
    }

    get me() {
        return this._state.me;
    }

    get trumpsStatuses() {
        return this._state.game.trumps_statuses;
    }

    get canPowerBePlayed() {
        return this._state.game.can_power_be_played;
    }
}
