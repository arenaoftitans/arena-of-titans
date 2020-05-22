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
 */

import { inject } from "aurelia-framework";
import { Store } from "aurelia-store";

@inject(Store)
export class AotTrumpsCustomElement {
    constructor(store) {
        this._store = store;
        this.me = null;
    }

    bind() {
        this._subscription = this._store.state.subscribe(state => (this.me = state.me));
    }

    unbind() {
        this._subscription.unsubscribe();
    }

    get power() {
        return this.me.power;
    }

    get trumps() {
        return this.me.availableTrumps;
    }

    get affectingTrumps() {
        if (this.me === null) {
            return [];
        }

        return this.me.activeTrumps;
    }

    get trumpsStatuses() {
        if (this.me === null) {
            return [];
        }

        return this.me.trumpsStatuses;
    }

    get canPowerBePlayed() {
        return this.me.canPowerBePlayed;
    }
}
