import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../services/api';
import { Game } from '../../game';


@inject(Api, Game, I18N)
export class AotTrumpsCustomElement {
    _api;
    _game;
    _i18n;
    infos = {};

    constructor(api, game, i18n) {
        this._api = api;
        this._game = game;
        this._i18n = i18n;
    }

    play(trump) {
        if (!this.yourTurn) {
            return;
        } else if (trump.must_target_player) {
            let otherPlayerNames = [];
            for (let playerIndex of this.playerIndexes) {
                if (playerIndex !== this.myIndex) {
                    let player = {
                        index: playerIndex,
                        name: this.playerNames[playerIndex],
                    };
                    otherPlayerNames.push(player);
                }
            }
            this.playerNames.filter(
                (name, index) => this.myIndex !== index);
            this._game.popup(
                'confirm',
                {
                    message: this._i18n.tr(
                        'game.play.select_trump_target',
                        {trumpname: trump.name}),
                    choices: otherPlayerNames,
                }).then(targetIndex => {
                    // targetIndex is binded in a template, hence it became a string and must be
                    // converted before usage in the API
                    targetIndex = parseInt(targetIndex, 10);
                    this._api.playTrump({trumpName: trump.name, targetIndex: targetIndex});
                });
        } else {
            this._api.playTrump({trumpName: trump.name});
        }
    }

    displayInfos(trump, event) {
        let trumpName = trump.name.toLowerCase().replace(' ', '_');
        this.infos = {
            title: this._i18n.tr(`trumps.${trumpName}`),
            description: this._i18n.tr(`trumps.${trumpName}_description`),
            visible: true,
            event: event,
        };
    }

    hideInfos() {
        this.infos = {
            visible: false,
        };
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

    get playerIndexes() {
        return this._api.game.players.indexes;
    }

    get myIndex() {
        return this._api.me.index;
    }

    get yourTurn() {
        return this._api.game.your_turn;
    }
}
