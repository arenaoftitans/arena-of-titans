import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Game } from '../game';
import { Api } from '../services/api';
import { Wait } from '../services/utils';
import { Storage } from '../services/storage';
import Config from '../../../config/application.json';


@inject(Router, Api, Storage, Config)
export class Create {
    _router;
    _api;
    _initGameCb;
    _gameUrl = '';
    _config;

    constructor(router, api, storage, config) {
        this._router = router;
        this._api = api;
        this._storage = storage;
        this._config = config;
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
        } else if (this.me.name) {
            if (!this._config.test.debug && this.me.is_game_master && this.slots.length < 2) {
                this.addSlot();
            }
        } else {
            this._joinGame(params.id);
        }
    }

    init(params) {
        Wait.flushCache();
        this._api.init();
        this.initPlayerInfoDefered();
        this.playerInfo = {name: '', hero: ''};
        this.editing = false;
        this._registerApiCallbacks(params);
    }

    initPlayerInfoDefered() {
        this.playerInfoDefered = {};
        this.playerInfoDefered.promise = new Promise((resolve, reject) => {
            this.playerInfoDefered.resolve = resolve;
        });
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
                if (slot.state === 'TAKEN') {
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
