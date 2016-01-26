import { inject } from 'aurelia-framework';
import { Api } from '../services/api';
import { Game } from '../game';


@inject(Api, Game)
export class Play {
    // Used to keep the selected card in the cards interface in sync with the card used in
    // board.js to play a move.
    selectedCard = null;
    _game;
    _api;

    constructor(api, game) {
        this._api = api;
        this._game = game;
    }

    activate(params = {}) {
        if (!this.me.name) {
            this._api.joinGame({gameId: params.id});
        }

        this._api.onGameOverDefered.then(winners => {
            this._game.popup('game-over', {message: winners});
        });
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
}
