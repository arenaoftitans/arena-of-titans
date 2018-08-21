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


export class AnimationsStub {
    enable() {
    }

    disable() {
    }
}


export class ErrorsReporterStub {
    enable() {
    }

    disable() {
    }
}


export class ApiStub {
    _gameOverDeferred = {};
    _reconnectDeferred = {};

    constructor() {
        this._gameOverDeferred.promise = new Promise(resolve => {
            this._gameOverDeferred.resolve = resolve;
        });
        this._reconnectDeferred.promise = new Promise((resolve, reject) => {
            this._reconnectDeferred.resolve = resolve;
            this._reconnectDeferred.reject = reject;
        });
    }

    initializeGame(data) {
    }

    init() {
    }

    updateMe() {
    }

    joinGame() {
        return this._reconnectDeferred.promise;
    }

    createGame() {
    }

    viewPossibleMovements() {
    }

    viewPossibleActions() {
    }

    play() {
    }

    playSpecialAction() {
    }

    playTrump() {
    }

    pass() {
    }

    passSpecialAction() {
    }

    discard() {
    }

    updateSlot() {
    }

    get onGameOverDeferred() {
        return this._gameOverDeferred.promise;
    }

    get onReconnectDeferred() {
        return this._reconnectDeferred.promise;
    }

    createGameDebug() {
    }
}


export class StateStub {
    _game = {
        slots: [],
    };
    _me = {};

    createGame() {
    }

    initializeGame() {
    }

    reconnect() {
    }

    reset() {
    }

    updateAfterPlay() {
    }

    updateAfterTrumpPlayed() {
    }

    updateMe() {
    }

    updateSlot() {
    }

    get game() {
        return this._game;
    }

    get me() {
        return this._me;
    }
}


export class PopupStub {
    display(type, data) {
        this.popupPromise = new Promise((resolve, reject) => {
            resolve({name: 'Tester', hero: 'daemon'});
        });

        return this.popupPromise;
    }
}


export class PopoverStub {
    display(type, data) {
        return () => {};
    }
}


export class SoundsStub {
    play(sound) {
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
            'cards.king': 'played',
        };

        return key in translations ? translations[key] : key;
    }
}


export class StorageStub {
    saveGameData() {
    }

    retrievePlayerId() {
    }

    clearGameData() {
    }

    saveOptions() {
    }

    loadOptions() {
        return {};
    }

    loadPlayerInfos() {
        return {name: '', hero: ''};
    }

    savePlayerInfos() {
    }
}


export class LocalStorageStub {
    setItem() {
    }

    getItem() {
    }
}


export class WsStub {
    send(data) {
    }

    onmessage(cb) {
    }

    sendDeferred() {
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

    unsubscribe() {
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


export class EventAggregatorStub {
    constructor() {
        this.cbs = {};
    }

    subscribe(signal, fn) {
        if (!(signal in this.cbs)) {
            this.cbs[signal] = [];
        }

        this.cbs[signal].push(fn);
    }

    publish(signal, message) {
        if (signal in this.cbs) {
            for (let fn of this.cbs[signal]) {
                fn(message);
            }
        }
    }
}


export class BindingEngineStub {
    propertyObserver(object, property) {
        this.propertyObserverObj = jasmine.createSpyObj('propertyObserver', ['subscribe']);
        return this.propertyObserverObj;
    }
}


export class EventAggregatorSubscriptionsStub {
    constructor() {
        this.ea = new EventAggregatorStub();
    }

    subscribe(signal, fn) {
        this.ea.subscribe(signal, fn);
    }

    subscribeMultiple(signals, fn) {
        for (let signal of signals) {
            this.subscribe(signal, fn);
        }
    }

    dispose() {
    }

    publish(signal, message) {
        this.ea.publish(signal, message);
    }
}


export class BindingEngineSubscriptionsStub {
    subscribe(object, property, fn) {
    }

    dispose() {
    }
}


export class HistoryStub {
    init() {
    }
}


export class WebsocketSub {
    send() {
    }
}


export class OptionsStub {
    mustViewInGameHelp() {
    }

    markInGameOptionSeen() {
    }
}


export class CssAnimatorStub {
    addClass() {
        return new Promise(resolve => resolve());
    }

    removeClass() {
        return new Promise(resolve => resolve());
    }
}
