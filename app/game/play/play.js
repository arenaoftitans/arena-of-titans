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
import { AssetSource } from '../../services/assets';
import { EventAggregatorSubscriptions } from '../services/utils';
import { Popup } from '../widgets/popups/popup';
import { State } from '../services/state';


@inject(Api, Popup, EventAggregatorSubscriptions, State)
export class Play {
    // Used to keep the selected card in the cards interface in sync with the card used in
    // board.js to play a move.
    selectedCard = null;
    pawnClickable = false;
    onPawnClicked = null;
    onPawnSquareClicked = null;
    pawnsForcedNotClickable = [];
    _game;
    _api;
    _state;

    constructor(api, popup, eas, state) {
        this._api = api;
        this._state = state;
        this._popup = popup;
        this._eas = eas;
        this.assetSource = AssetSource;
        this._logger = LogManager.getLogger('AoTPlay');

        this._eventAggregatorSubscriptions = [];
    }

    activate(params = {}) {
        if (!this.me.name) {
            this._api.joinGame({gameId: params.id});
        }

        this._eas.subscribe('aot:api:special_action_notify', message => {
            this._handleSpecialActionNotify(message);
        });
        this._eas.subscribe('aot:api:special_action_view_possible_actions', message => {
            this._handleSpecialActionViewPossibleActions(message);
        });
        this._eas.subscribe('aot:api:play', () => {
            this._resetPawns();
        });

        this._api.onReconnectDefered.then(message => {
            if (message.special_action_name) {
                this._handleSpecialActionNotify(message);
            }
        });

        this._api.onGameOverDefered.then(winners => {
            return this._popup.display('game-over', {message: winners});
        }).then(location => this._navigateWithRefresh(location));
    }

    _navigateWithRefresh(location) {
        if (!window.jasmine) {
            window.location.replace(location);
        }
    }

    _handleSpecialActionNotify(message) {
        let name = message.special_action_name;
        if (name === null) {
            return;
        }
        switch (name.toLowerCase()) {
            case 'assassination':
                this.pawnClickable = true;
                this.onPawnClicked = index => {
                    this._api.viewPossibleActions({name: name, targetIndex: index});
                };
                this.pawnsForcedNotClickable.push(this.me.index);
                break;
            default:
                message.info = 'Unknow special action';
                this._logger.error(message);
                break;
        }
    }

    _handleSpecialActionViewPossibleActions(message) {
        let name = message.special_action_name;
        switch (name.toLowerCase()) {
            case 'assassination':
                this.onPawnSquareClicked = (squareId, x, y, targetIndex) => {
                    this._api.playSpecialAction({
                        x: x,
                        y: y,
                        name: name,
                        targetIndex: targetIndex,
                    });
                    this._resetPawns();
                };
                break;
            default:
                message.info = 'Unknow special action';
                this._logger.error(message);
                break;
        }
    }

    _resetPawns() {
        this.pawnClickable = false;
        this.onPawnClicked = null;
        this.pawnsForcedNotClickable = [];
        this.onPawnSquareClicked = null;
    }

    deactivate() {
        this._eas.dispose();
    }

    backHome() {
        this._popup.display('back-home', {}).then(
            location => this._navigateWithRefresh(location),
            () => this._logger.debug('cancel back home popup')
        );
    }

    get me() {
        return this._state.me;
    }

    get game() {
        return this._state.game;
    }

    get myName() {
        return this._state.me.name;
    }

    get players() {
        return this._state.game.players;
    }
}
