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
import { Router } from 'aurelia-router';
import { Game } from '../game';
import { Api } from '../services/api';
import { Wait, ImageSource, randomInt } from '../services/utils';
import { Storage } from '../../services/storage';
import { History } from '../services/history';
import Config from '../../../config/application';
import Clipboard from 'clipboard';


@inject(Router, Api, Storage, Config, ObserverLocator, History)
export class Create {
    CHOOSABLE_SLOTS_STATES = ['OPEN', 'AI', 'CLOSED']

    _router;
    _api;
    _initGameCb;
    _gameUrl = '';
    _config;
    _observerLocator;
    _history;

    constructor(router, api, storage, config, observerLocator, history) {
        this._router = router;
        this._api = api;
        this._storage = storage;
        this._config = config;
        this._observerLocator = observerLocator;
        this._history = history;
    }

    activate(params = {}) {
        this._registerApiCallbacks(params);
        this._gameUrl = window.location.href;

        if (!params.id || (params.id && params.id !== this._api.game.id)) {
            this.init(params);
        }

        if (this._config.test.debug) {
            if (!params.id) {
                this._api.createGameDebug();
            } else {
                this._router.navigateToRoute('play', {id: params.id});
            }
        } else if (!params.id) {
            this.playerInfoDefered.promise.then(data => {
                this._api.initializeGame(data.name, data.hero);
            });
        } else {
            this._joinGame(params.id);
        }
    }

    init(params) {
        Wait.flushCache();
        this._api.init();
        this._history.init();
        this.initPlayerInfoDefered();
        this.playerInfo = this._storage.loadPlayerInfos();
        this.editing = false;
        this._registerApiCallbacks(params);

        // Catch is there to prevent 'cUnhandled rejection TypeError: _clipboard2.default is not
        // a constructor' warnings when launching tests with Firefox.
        Wait.forId('copy-invite-link').then(() => {
            new Clipboard('#copy-invite-link'); // eslint-disable-line
        }).catch(() => {});

        this._observerLocator.getObserver(this._api.me, 'name').subscribe(() => {
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
        });
    }

    initPlayerInfoDefered() {
        this.playerInfoDefered = {};
        this.playerInfoDefered.promise = new Promise((resolve, reject) => {
            this.playerInfoDefered.resolve = resolve;
        });
        this.playerInfoDefered.promise.then(data => this._storage.savePlayerInfos(data));
    }

    _registerApiCallbacks(params) {
        this._initGameCb = this._api.on(this._api.requestTypes.game_initialized, (data) => {
            if (!params.id) {
                this._router.navigateToRoute('create', {id: data.game_id});
            }
        });
        this._createGameCb = this._api.on(this._api.requestTypes.create_game, () => {
            if (params.id) {
                this._router.navigateToRoute('play', {id: params.id});
            }
        });
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
        let addSlotsBtn = slots.getElementsByTagName('button')[0];
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
        // Share link is only present for the game master.
        if (addSlotsBtn) {
            addSlotsBtn.style.maxWidth = gateLeftWidth;
        }
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

    addSlot() {
        this._api.addSlot();
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
        this._api.off(this._api.requestTypes.init_game, this._initGameCb);
        this._api.off(this._api.requestTypes.create_game, this._createGameCb);
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

    get canAddSlot() {
        return this.slots && this.slots.length < Game.MAX_NUMBER_PLAYERS;
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

    get heroSrc() {
        return ImageSource.forHero(this.me.hero);
    }
}
