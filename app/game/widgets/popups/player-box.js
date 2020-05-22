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
import { AssetSource } from "../../../services/assets";

@inject(Store)
export class AotPlayerBoxInfosCustomElement {
    constructor(store) {
        this._players = {};
        this._actions = [];
        store.state.subscribe(state => {
            this._players = state.game.players;
            this._actions = state.game.actions;
        });
    }

    activate(model) {
        this.data = model.data;
        this.deferred = model.deferred;
    }

    close() {
        this.deferred.resolve();
    }

    get heroSource() {
        return AssetSource.forCircledHero(this.data.hero);
    }

    get lastPlayedCards() {
        return this._actions
            .filter(action => action.initiator.index === this.data.playerIndex && action.card)
            .slice(-2)
            .map(action => AssetSource.forCard(action.card));
    }

    get activeTrumps() {
        let trumps = this._players[this.data.playerIndex].activeTrumps;
        let images = [];
        for (let trump of trumps) {
            images.push(AssetSource.forTrump(trump));
        }

        return images;
    }
}
