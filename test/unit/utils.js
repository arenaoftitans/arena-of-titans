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

import { Api } from '../../app/game/services/api';


export class RouterStub {
    options = {};
    baseUrl = '';

    configure(handler) {
        handler(this);
    }

    map(routes) {
        this.routes = routes;
    }

    navigateToRoute(route, params) {
    }

    mapUnknownRoutes() {
    }
}


export class ApiStub {
    _api;
    _cbs = {};
    _errorCbs = [];
    _game = {
        slots: []
    };
    _me = {};
    _gameOverDefered = {};
    _reconnectDefered = {};

    constructor() {
        this._api = new Api(new WsStub);
        this.onReconnectDefered = new Promise(() => {});
        this._gameOverDefered.promise = new Promise(resolve => {
            this._gameOverDefered.resolve = resolve;
        });
        this._reconnectDefered.promise = new Promise((resolve, reject) => {
            this._reconnectDefered.resolve = resolve;
            this._reconnectDefered.reject = reject;
        });
    }

    initializeGame(data) {
        let cbs = this._cbs[this.requestTypes.game_initialized];
        this._game.slots.push({
            index: 0,
            player_name: 'Player 1',
            state: 'TAKEN'
        });
        if (cbs) {
            cbs.forEach(cb => {
                cb(data);
            });
        }
    }

    init() {
    }

    addSlot() {
    }

    updateMe() {
    }

    joinGame() {
        return this._reconnectDefered.promise;
    }

    createGame() {
        let cbs = this._cbs[this.requestTypes.create_game];
        if (cbs) {
            cbs.forEach(cb => {
                cb();
            });
        }
    }

    viewPossibleMovements() {
    }

    play() {
        let cbs = this._cbs[this.requestTypes.play];
        if (cbs) {
            cbs.forEach(cb => {
                cb();
            });
        }
    }

    playTrump() {
    }

    pass() {
    }

    discard() {
    }

    on(rt, fn) {
        if (!(rt in this._cbs)) {
            this._cbs[rt] = [];
        }
        this._cbs[rt].push(fn);
    }

    off() {
    }

    onerror(cb) {
        this._errorCbs.push(cb);
    }

    get requestTypes() {
        return this._api.requestTypes;
    }

    get me() {
        return this._me;
    }


    get game() {
        return this._game;
    }

    get onGameOverDefered() {
        return this._gameOverDefered.promise;
    }

    createGameDebug() {
    }
}


export class GameStub {
    popupPromise;

    popup(type, data) {
        this.popupPromise = new Promise((resolve, reject) => {
            resolve({name: 'Tester', hero: 'daemon'});
        });

        return this.popupPromise;
    }
}


export class I18nStub {
    tr(key) {
        let translations = {
            'game.play.select_trump_target': 'Who should be the target of Trump?',
            'game.play.pass_confirm_message': 'Are you sure you want to pass your turn?',
            'game.play.discard_no_selected_card': 'You must select a card',
            'tower_blue_description': 'played',
            'tower_blue': 'played',
            'cards.king_red': 'played',
            'cards.king': 'played'
        };

        return key in translations ? translations[key] : key;
    }
}


export class StorageStub {
    savePlayerId() {
    }

    retrievePlayerId() {
    }

    saveOptions() {
    }

    loadOptions() {
    }
}


export class WsStub {
    send(data) {
    }

    onmessage(cb) {
    }
}


export class ObserverLocatorStub {
    getObserver() {
        return new ObserverLocatorStubResults();
    }
}


export class ObserverLocatorStubResults {
    subscribe() {
    }
}


export class NotifyStub {
    clearNotifications() {
    }

    notifyYourTurn() {
    }

    notifyGameOver() {
    }
}


export class EventAgregatorStub {
    subscribe() {
    }

    publish() {
    }
}
