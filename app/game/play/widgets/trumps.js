import { inject } from 'aurelia-framework';
import { Api } from '../../services/api';
import { Game } from '../../game';


@inject(Api, Game)
export class AotTrumpsCustomElement {
    _api;
    _game;

    constructor(api, game) {
        this._api = api;
        this._game = game;
    }

    play(trump) {
        if (trump.must_target_player) {
            let otherPlayerNames = this.playerNames.filter(
                (name, index) => this.myIndex !== index);
            this._game.popup(
                'confirm',
                {
                    message: `Who should be the target of ${trump.name}?`,
                    choices: otherPlayerNames
                }).then(targetName => {
                    let targetIndex = this.playerNames.indexOf(targetName);
                    this._api.playTrump({trumpName: trump.name, targetIndex: targetIndex});
                });
        } else {
            this._api.playTrump({trumpName: trump.name});
        }
    }

    get trumps() {
        return this._api.me.trumps;
    }

    get affectingTrumps() {
        return this._api.me.affecting_trumps;
    }

    get playerNames() {
        return this._api.game.players.names;
    }

    get myIndex() {
        return this._api.me.index;
    }
}
