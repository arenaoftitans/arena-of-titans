import { inject } from 'aurelia-framework';
import { Api } from '../services/api';


@inject(Api)
export class Play {
    // Used to keep the selected card in the cards interface in sync with the card used in
    // board.js to play a move.
    selectedCard = null;
    _game;
    _api;

    constructor(api) {
        this._api = api;
    }

    activate(params) {
        if (!this.me.name) {
            this._api.joinGame({gameId: params.id});
        }
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
