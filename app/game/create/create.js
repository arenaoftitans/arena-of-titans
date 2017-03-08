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

import { inject, ObserverLocator } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { Game } from '../game';
import { Api } from '../services/api';
import { AssetSource } from '../../services/assets';
import { Wait, randomInt, EventAggregatorSubscriptions } from '../services/utils';
import { Storage } from '../../services/storage';
import { History } from '../services/history';
import Config from '../../services/configuration';
import Clipboard from 'clipboard';


@inject(
    Router,
    Api,
    Storage,
    Config,
    ObserverLocator,
    History,
    EventAggregator,
    EventAggregatorSubscriptions
)
export class Create {
    CHOOSABLE_SLOTS_STATES = ['OPEN', 'AI', 'CLOSED']

    _router;
    _api;
    _initGameCb;
    _gameInitializedCb;
    _gameUrl = '';
    _config;
    _observerLocator;
    _myNameObserverCb;
    _history;

    constructor(router, api, storage, config, observerLocator, history, ea, eas) {
        this._router = router;
        this._api = api;
        this._storage = storage;
        this._config = config;
        this._observerLocator = observerLocator;
        this._history = history;
        this._ea = ea;
        this._eas = eas;
        this.assetSource = AssetSource;

        // We preload the board: it is big and can take a while to load on bad connections. So if
        // a player reaches the create game page, we consider he/she will play. So it makes sense
        // to start loading the board.
        require(['game/play/widgets/board/board'], () => {});
    }

    activate(params = {}) {
        this._registerEvents(params);
        this._gameUrl = window.location.href;
        this.init(params);

        if (this._config.test.debug) {
            if (!params.id) {
                this._api.createGameDebug();
            } else {
                this._router.navigateToRoute('play', this._getNavParams(params.id));
            }
        } else if (!params.id) {
            this.playerInfoDefered.promise.then(data => {
                this._api.initializeGame(data.name, data.hero);
            });
        } else {
            this._joinGame(params.id);
        }
    }

    _getNavParams(gameId) {
        return {
            id: gameId,
            version: this._config.version ? this._config.version : 'latest',
        };
    }

    init(params) {
        // Services must only be initialized on first activation: when we create a new game or
        // join a different game.
        if (!params.id || (params.id && params.id !== this._api.game.id)) {
            this._api.init();
            this._history.init();
        }

        Wait.flushCache();
        this.initPlayerInfoDefered();
        this.playerInfo = this._storage.loadPlayerInfos();
        this.editing = false;
        this._registerEvents(params);

        // Catch is there to prevent 'cUnhandled rejection TypeError: _clipboard2.default is not
        // a constructor' warnings when launching tests with Firefox.
        Wait.forId('copy-invite-link').then(() => {
            new Clipboard('#copy-invite-link'); // eslint-disable-line
        }).catch(() => {});

        this._unregisterMyNameObserver();
        this._myNameObserverCb = () => {
            if (!!!this.me.name) {
                return;
            }

            let waitForPlate = Wait.forId('create-game-plate');
            let waitForMe = Wait.forId('create-game-me');
            let waitForGateLeft = Wait.forId('create-game-gate-left');
            let waitForSlots = Wait.forId('create-game-slots');
            let waitForBg = Wait.forId('create-game-bg');
            let waitAll = Promise.all(
                    [waitForPlate, waitForMe, waitForGateLeft, waitForSlots, waitForBg]);

            waitAll.then(elts => this.resize(elts));
            addEventListener('resize', () => {
                waitAll.then(elts => this.resize(elts));
            });
        };

        this._observerLocator.getObserver(this._api.me, 'name')
            .subscribe(this._myNameObserverCb);
    }

    _unregisterMyNameObserver() {
        if (this._myNameObserverCb) {
            this._observerLocator.getObserver(this._api.me, 'name')
                .unsubscribe(this._myNameObserverCb);
            this._myNameObserverCb = null;
        }
    }

    initPlayerInfoDefered() {
        this.playerInfoDefered = {};
        this.playerInfoDefered.promise = new Promise((resolve, reject) => {
            this.playerInfoDefered.resolve = resolve;
        });
        this.playerInfoDefered.promise.then(data => this._storage.savePlayerInfos(data));
    }

    _registerEvents(params) {
        this._eas.dispose();
        this._eas.subscribe('aot:api:game_initialized', data => {
            if (!params.id) {
                this._router.navigateToRoute('create', this._getNavParams(data.game_id));
            }
        });
        this._eas.subscribe('aot:api:create_game', () => {
            if (params.id) {
                this._router.navigateToRoute('play', this._getNavParams(params.id));
            }
        });
        this._eas.subscribe('aot:api:game_initialized', () => {
            this._autoAddAi();
        });

        // This callback is used to redirect the player to the game if he/she reconnects on the
        // create page after a game was created.
        let subscription = this._ea.subscribe('aot:api:play', () => {
            if (/game\/.*\/create\/.+/.test(location.href)) {
                this._router.navigateToRoute('play', this._getNavParams(params.id));
            }
            subscription.dispose();
        });
    }

    _autoAddAi() {
        // auto set the 2nd slot to an AI so the player can start the game immediatly.
        let openedSlots = this.slots.filter(slot => slot.state === 'OPEN');
        if (!this._config.test.debug && this.me.is_game_master && openedSlots.length === 7) {
            let slot = this.slots[1];
            slot.state = 'AI';
            this.updateSlot(slot);
        }
    }

    resize(elts) {
        let plate = elts[0];
        let plateBoundingClientRect = plate.getBoundingClientRect();
        let me = elts[1];
        let name = me.getElementsByTagName('p')[0];
        let shareLink = me.getElementsByTagName('div')[0];
        let gateLeft = elts[2];
        let gateLeftBoundingClientRect = gateLeft.getBoundingClientRect();
        let slots = elts[3];
        let bg = elts[4];

        let plateWidth = plateBoundingClientRect.width + 'px';
        name.style.maxWidth = plateWidth;
        // Share link is only present for the game master.
        if (shareLink) {
            shareLink.style.maxWidth = plateWidth;
        }

        me.style.top = plateBoundingClientRect.top + 25 + 'px';
        me.style.left = plateBoundingClientRect.left +
            plateBoundingClientRect.width / 2 -
            me.getBoundingClientRect().width / 2 +
            'px';

        let gateLeftWidth = gateLeftBoundingClientRect.width + 'px';
        slots.style.top = gateLeftBoundingClientRect.top + 'px';
        slots.style.maxWidth = gateLeftWidth;
        slots.style.left = gateLeftBoundingClientRect.left +
            gateLeftBoundingClientRect.width / 2 -
            slots.getBoundingClientRect().width / 2 +
            'px';

        let heightDiff = me.getBoundingClientRect().bottom - bg.getBoundingClientRect().bottom;
        if (heightDiff > 0) {
            bg.style.height = bg.getBoundingClientRect().height + heightDiff + 'px';
        } else {
            bg.style.height = undefined;
        }
    }

    _joinGame(gameId) {
        let playerId = this._storage.retrievePlayerId(gameId);
        if (playerId) {
            this._api.joinGame({gameId: gameId, playerId: playerId}).then(() => {
                this.playerInfo.name = this.me.name;
                this.playerInfo.hero = this.me.hero;
            }, () => this._askName(gameId));
        } else {
            this._askName(gameId);
        }
    }

    _askName(gameId) {
        this.playerInfoDefered.promise.then(data => {
            this._api.joinGame({
                gameId: gameId,
                name: data.name,
                hero: data.hero,
            });
        });
    }

    updateSlot(slot) {
        if (slot.state === 'AI') {
            slot.player_name = `AI ${slot.index}`;
            slot.hero = Game.heroes[randomInt(0, Game.heroes.length - 1)];
        }
        this._api.updateSlot(slot);
    }

    editMe() {
        this.initPlayerInfoDefered();
        this.editing = true;
        this.playerInfoDefered.promise.then(data => {
            this.editing = false;
            this._api.updateMe(data.name, data.hero);
        });
    }

    createGame() {
        this._api.createGame();
    }

    deactivate() {
        this._eas.dispose();
        this._unregisterMyNameObserver();
    }

    get me() {
        return this._api.me;
    }

    get slots() {
        // If we pass directly the slots array, Aurelia won't update the view when a slot is
        // updated.
        if (this._api.game.slots) {
            return this._api.game.slots.map(slot => {
                return slot;
            });
        }

        return [];
    }

    get gameUrl() {
        return this._gameUrl;
    }

    get canCreateGame() {
        if (this.slots) {
            let numberTakenSlots = 0;
            this.slots.forEach(slot => {
                if (slot.state === 'TAKEN' || slot.state === 'AI') {
                    numberTakenSlots++;
                }
            });

            return numberTakenSlots >= 2;
        }

        return false;
    }

    get hasHero() {
        return this.me.hero !== undefined;
    }
}
