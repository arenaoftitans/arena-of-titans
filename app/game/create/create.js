import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Game } from '../game';
import { Api } from '../services/api';


@inject(Router, Game, Api)
export class Create {
    _router;
    _game;
    _api;
    _initGameCb;
    _gameUrl = "";

    constructor(router, game, api) {
        this._router = router;
        this._game = game;
        this._api = api;
    }

    activate(params = {}) {
        this._registerApiCallbacks(params);

        if (!params.id) {
            this._game.popup('create-game', {name: ''}).then(data => {
                this._api.initializeGame(data.name);
            });
        } else if (this.me.name) {
            this._gameUrl = window.location.href;
            if (this.me.is_game_master && this.slots.length < 2) {
                this.addSlot();
            }
        } else {
            this._game.popup('create-game', {name: ''}).then(data => {
                this._api.joinGame(params.id, data.name);
            });
        }
    }

    _registerApiCallbacks(params) {
        this._initGameCb = this._api.on(this._api.requestTypes.game_initialized, (data) => {
            if (!params.id) {
                this._router.navigateToRoute('create', {id: data.game_id});
            }
        });
    }

    addSlot() {
        this._api.addSlot();
    }

    editMe() {
        this._game.popup('create-game', {name: this.me.name}).then(data => {
            this._api.updateName(data.name);
        });
    }

    createGame() {
    }

    deactivate() {
        this._api.off(this._api.requestTypes.init_game, this._initGameCb);
    }

    get me() {
        return this._api.me;
    }

    get slots() {
        // If we pass directly the slots array, Aurelia won't update the view when a slot is updated.
        if (this._api.game.slots) {
            return this._api.game.slots.map(slot => {
                return slot;
            });
        } else {
            return [];
        }
    }

    get gameUrl() {
        return this._gameUrl;
    }

    get canAddSlot() {
        return this.slots && this.slots.length < this._game.maxNumberPlayers;
    }

    get canCreateGame() {
        if (this.slots) {
            let numberTakenSlots = 0;
            this.slots.forEach(slot => {
                if (slot.state == 'TAKEN') {
                    numberTakenSlots++;
                }
            });

            return numberTakenSlots >= 2;
        }

        return false;
    }
}
