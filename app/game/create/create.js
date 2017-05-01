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
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { Game } from '../game';
import { Api } from '../services/api';
import {
    BindingEngineSubscriptions,
    EventAggregatorSubscriptions,
    Wait,
    randomInt,
    selectRandomElement,
} from '../services/utils';
import { AssetSource } from '../../services/assets';
import { Storage } from '../../services/storage';
import { History } from '../services/history';
import Config from '../../services/configuration';


const DEFAULT_NAMES = [
    'Guido',
    'Aurelia',
    'Brendan',
    'Seb',
    'Fred',
];

@inject(
    Router,
    Api,
    Storage,
    Config,
    BindingEngineSubscriptions,
    History,
    EventAggregator,
    EventAggregatorSubscriptions
)
export class Create {
    _router;
    _api;
    _gameUrl = '';
    _config;
    _bes;
    _playerInfosChanged;
    _history;

    constructor(router, api, storage, config, bindingEngineSubscription, history, ea, eas) {
        this._router = router;
        this._api = api;
        this._storage = storage;
        this._config = config;
        this._bes = bindingEngineSubscription;
        this._history = history;
        this._ea = ea;
        this._eas = eas;
        this.assetSource = AssetSource;
        this._logger = LogManager.getLogger('aot:create');

        this.selectedHero = null;

        // We preload the board: it is big and can take a while to load on bad connections. So if
        // a player reaches the create game page, we consider he/she will play. So it makes sense
        // to start loading the board.
        require(['game/play/widgets/board/board'], () => {});
    }

    activate(params = {}) {
        this._registerEvents(params);
        this._gameUrl = window.location.href;
        this.init(params);

        if (!params.id) {
            this.creating = true;
            this._api.initializeGame(this.playerInfos.name, this.playerInfos.hero);
        } else if (this.creating) {
            this.creating = false;
        } else {
            this.gameId = params.id;
            this._joinGame();
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
        this.initPlayerInfos();
        this._registerEvents(params);
    }

    initPlayerInfos() {
        this.playerInfos = this._storage.loadPlayerInfos();
        if (!this.playerInfos.name) {
            this.playerInfos.name = selectRandomElement(DEFAULT_NAMES);
        }
        if (!this.playerInfos.hero) {
            this.playerInfos.hero = selectRandomElement(Game.heroes);
        }
        this._playerInfosChanged();
        this._disposeObservers();
        this._registerObservers();
    }

    _playerInfosChanged() {
        this._storage.savePlayerInfos(this.playerInfos);

        if (this.gameId && this.playerInfos.name && this.playerInfos.hero) {
            this._api.updateMe(this.playerInfos.name, this.playerInfos.hero);
        }
    }

    _disposeObservers() {
        this._bes.dispose();
    }

    _registerObservers() {
        let cb = () => {
            this._playerInfosChanged();
        };
        this._bes.subscribe(this.playerInfos, 'name', cb);
        this._bes.subscribe(this.playerInfos, 'hero', cb);
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

        // This callback is used to redirect the player to the game if he/she reconnects on the
        // create page after a game was created.
        let subscription = this._ea.subscribe('aot:api:play', () => {
            if (/game\/.*\/create\/.+/.test(location.href)) {
                this._router.navigateToRoute('play', this._getNavParams(params.id));
            }
            subscription.dispose();
        });
    }

    _joinGame() {
        this.playerId = this._storage.retrievePlayerId(this.gameId);
        if (this.playerId) {
            return this._api.joinGame({gameId: this.gameId, playerId: this.playerId}).then(() => {
                this.playerInfos.name = this.me.name;
                this.playerInfos.hero = this.me.hero;
            }, () => {
                this._logger.warn('Failed to join the game');
                this._storage.clearPlayerId(this.gameId);
                this._joinGame();
            });
        }

        return this._api.joinGame({
            gameId: this.gameId,
            name: this.playerInfos.name,
            hero: this.playerInfos.hero,
        });
    }

    updateSlot(slot) {
        if (slot.state === 'AI') {
            slot.player_name = `AI ${slot.index}`;
            slot.hero = Game.heroes[randomInt(0, Game.heroes.length - 1)];
        }
        this._api.updateSlot(slot);
    }

    createGame() {
        this._api.createGame();
    }

    deactivate() {
        this._eas.dispose();
        this._disposeObservers();
    }

    get me() {
        return this._api.me;
    }

    get isGameMaster() {
        return this.me.is_game_master;
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
}
