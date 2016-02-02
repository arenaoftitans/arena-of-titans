import { inject } from 'aurelia-framework';
import { Api } from '../../services/api';
import { Game } from '../../game';


@inject(Api, Game)
export class AotTrumpsCustomElement {
    _api;
    _game;
    infos = {};

    constructor(api, game) {
        this._api = api;
        this._game = game;
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
                        name: this.playerNames[playerIndex]
                    };
                    otherPlayerNames.push(player);
                }
            }
            this.playerNames.filter(
                (name, index) => this.myIndex !== index);
            this._game.popup(
                'confirm',
                {
                    message: `Who should be the target of ${trump.name}?`,
                    choices: otherPlayerNames
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
        this.infos = {
            title: trump.name,
            description: trump.description,
            visible: true
        };

        let trumpsContainer = document.getElementById('player-trumps');
        let infosElement = document.getElementById('trumps-element-infos');
        let target = event.target;

        let infosHeight = 150;
        let top = 0;
        let element = target;
        do {
            top += element.offsetTop  || 0;
            element = element.offsetParent;
        } while (element);

        infosElement.style.top = top - infosHeight + 'px';
        infosElement.style.left = trumpsContainer.getBoundingClientRect().right + 'px';
    }

    hideInfos() {
        this.infos = {};
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
