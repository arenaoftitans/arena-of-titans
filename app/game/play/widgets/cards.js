import { bindable, inject } from 'aurelia-framework';
import { Api } from '../../services/api';
import { Game } from '../../game';


@inject(Api, Game)
export class AotCardsCustomElement {
    @bindable selectedCard;
    _api;
    _game;
    infos = {};

    constructor(api, game) {
        this._api = api;
        this._game = game;
    }

    viewPossibleMovements(card) {
        if (this.yourTurn) {
            this.selectedCard = card;
            this._api.viewPossibleMovements({name: card.name, color: card.color});
        }
    }

    displayInfos(card, event) {
        this.infos = {
            title: `${card.name} ${card.color.toLowerCase()}`,
            description: card.description,
            visible: true,
            event: event
        };
    }

    hideInfos() {
        this.infos.visible = false;
    }

    pass() {
        let message =  'Are you sure you want to pass your turn?';
        this._game.popup('confirm', {message: message}).then(() => {
            this._api.pass();
            this.selectedCard = null;
        });
    }

    discard() {
        if (this.selectedCard) {
            let name = this.selectedCard.name;
            let color = this.selectedCard.color.toLowerCase();
            let message = `Are you sure you want to discard ${name} ${color}?`;
            this._game.popup('confirm', {message: message}).then(() => {
                this._api.discard({
                    cardName: this.selectedCard.name,
                    cardColor: this.selectedCard.color
                });
                this.selectedCard = null;
            });
        } else {
            this._game.popup('infos', {message: 'You must select a card'});
        }
    }

    get yourTurn() {
        return this._api.game.your_turn;
    }

    get hand() {
        return this._api.me.hand;
    }

    get hasWon() {
        return this._api.me.has_won;
    }

    get rank() {
        return this._api.me.rank;
    }
}
