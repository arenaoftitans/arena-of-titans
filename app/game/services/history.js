/*
* Copyright (C) 2016 by Arena of Titans Contributors.
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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import { inject } from 'aurelia-framework';
import { Api } from './api';


@inject(Api)
export class History {
    _api;

    constructor(api) {
        this._api = api;
        this.init();
    }

    init() {
        this._api.on(this._api.requestTypes.player_played, message => {
            this._addEntry(message.last_action);
        });

        this._api.onReconnectDefered.then(message => {
            let history = message.history;
            for (let playerHistory of history) {
                for (let action of playerHistory) {
                    this._addEntry(action);
                }
            }
        });

        // Map each players to his/her two last played cards.
        this._history = {};
    }

    _addEntry(action) {
        let lastAction = action || {};
        let playerIndex = lastAction.player_index;
        let hist = this._getHistoryForPlayer(playerIndex);

        if (lastAction.card) {
            if (hist.length >= 2) {
                // Remove oldest element
                hist.shift();
            }
            hist.push(lastAction.card);
        }
    }

    _getHistoryForPlayer(index) {
        if (!this._history.hasOwnProperty(index)) {
            this._history[index] = [];
        }

        return this._history[index];
    }

    getLastPlayedCards(index) {
        return this._history[index] || [];
    }
}
