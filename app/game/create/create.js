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
    _createGameCb;
    _gameUrl = "";

    constructor(router, game, api) {
        this._router = router;
        this._game = game;
        this._api = api;
    }

    activate(params = {}) {
        this._registerApiCallbacks();

        if (!params.id) {
            this._game.popup('create-game', {name: ''}).then(data => {
                this._api.initializeGame(data);
            });
        } else {
            this._gameUrl = window.location.href;
            if (this.me.is_game_master && this.slots.length < 2) {
                this.addSlot();
            }
        }
    }

    _registerApiCallbacks() {
        this._api.on(this._api.requestTypes.game_initialized, (data) => {
            this._router.navigateToRoute('create', {id: data.game_id});
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
        this._api.off(this._api.requestTypes.create_game, this._createGameCb);
    }

    get me() {
        return this._api.me;
    }

    get slots() {
        return this._api.game.slots;
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
            this.solts.forEach(slot => {
                if (slot.state == 'TAKEN') {
                    numberTakenSlots++;
                }
            });

            return numberTakenSlots >= 2;
        }

        return false;
    }
}
