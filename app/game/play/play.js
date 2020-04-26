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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { Storage } from "../services/storage";
import { Popup } from "../services/popup";
import { Notify } from "../services/notify";

@inject(Store, Storage, Popup, Notify)
export class Play {
    constructor(store, storage, popup, notify) {
        this._store = store;
        this._storage = storage;
        this._logger = LogManager.getLogger("AoTPlay");
        this._popup = popup;
        this._notify = notify;

        this._activateDefered = {};

        this._mayReconnect = true;
        this.currentPlayerName = "";
        this.me = {};
        this.players = {};
    }

    activate(params = {}) {
        this._activateDefered.pending = true;
        this._activateDefered.promise = new Promise(resolve => {
            this._activateDefered.resolve = resolve;
        });
        const playerId = this._storage.retrievePlayerId(params.id);

        this._subscription = this._store.state.subscribe(state => {
            this.me = state.me || {};
            this.players = state.game.players ? state.game.players : {};
            this.trumpInfosData = state.currentTurn.trumpInfosData;
            if (this.players[state.game.currentPlayerIndex]) {
                this.currentPlayerName = this.players[state.game.currentPlayerIndex].name;
            }
            if (state.game.isOver) {
                this._popup
                    .display("game-over", { message: state.game.winners })
                    .then(location => this._navigateWithRefresh(location));
                this._notify.notifyGameOver();
            }

            if (this._activateDefered.pending && Object.keys(this.players).length > 0) {
                this._activateDefered.resolve();
            } else if (playerId && this._mayReconnect) {
                this._logger.debug("Reconnecting to game.");
                this._store.dispatch("reconnect", params.id, playerId);
                this._mayReconnect = false;
            }
        });

        return this._activateDefered.promise;
    }

    _navigateWithRefresh(location) {
        if (!window.jasmine) {
            window.location.replace(location);
        }
    }

    deactivate() {
        this._mayReconnect = true;
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    get playerIndexes() {
        return Object.keys(this.players).map(index => parseInt(index, 10));
    }
}
