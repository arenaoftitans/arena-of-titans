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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import { inject } from 'aurelia-framework';
import { Api } from '../services/api';
import { Game } from '../game';


@inject(Api, Game)
export class Play {
    // Used to keep the selected card in the cards interface in sync with the card used in
    // board.js to play a move.
    selectedCard = null;
    _game;
    _api;

    constructor(api, game) {
        this._api = api;
        this._game = game;
    }

    activate(params = {}) {
        if (!this.me.name) {
            this._api.joinGame({gameId: params.id});
        }

        this._api.onGameOverDefered.then(winners => {
            this._game.popup('game-over', {message: winners});
        });
    }

    backHome() {
        this._game.popup('back-home', {});
    }

    get me() {
        return this._api.me;
    }

    get game() {
        return this._api.game;
    }

    get myName() {
        return this._api.me.name;
    }

    get players() {
        return this._api.game.players;
    }
}
