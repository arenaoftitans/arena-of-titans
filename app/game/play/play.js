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

import * as LogManager from 'aurelia-logging';
import { inject } from 'aurelia-framework';
import { Api } from '../services/api';
import { Game } from '../game';


@inject(Api, Game)
export class Play {
    // Used to keep the selected card in the cards interface in sync with the card used in
    // board.js to play a move.
    selectedCard = null;
    pawnClickable = false;
    onPawnClicked = null;
    _game;
    _api;
    _specialActionNotifyCb;

    constructor(api, game) {
        this._api = api;
        this._game = game;
        this._logger = LogManager.getLogger('AoTPlay');
    }

    activate(params = {}) {
        if (!this.me.name) {
            this._api.joinGame({gameId: params.id});
        }

        let type = this._api.requestTypes.special_action_notify;
        this._specialActionNotifyCb = this._api.on(type, message => {
            this._handleSpecialActionNotify(message);
        });

        this._api.onGameOverDefered.then(winners => {
            return this._game.popup('game-over', {message: winners});
        }).then(location => this._game.navigateWithRefresh(location));
    }

    _handleSpecialActionNotify(action) {
        switch (action.name) {
            case 'assassination':
                if (this.game.your_turn) {
                    this.pawnClickable = true;
                    this.onPawnClicked = index => {
                        this._api.viewPossibleActions({name: action.name, targetIndex: index});
                    };
                }
                break;
            default:
                action.info = 'Unknow special action';
                this._logger.error(action);
                break;
        }
    }

    deactivate() {
        this._api.off(this._api.requestTypes.special_action_notify, this._specialActionNotifyCb);
    }

    backHome() {
        this._game.popup('back-home', {}).then(
            location => this._game.navigateWithRefresh(location),
            () => this._logger.debug('cancel back home popup')
        );
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
