import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../services/api';
import { Game } from '../../game';


@inject(Api, Game, I18N)
export class AotCardsCustomElement {
    @bindable selectedCard;
    _api;
    _game;
    _i18n;
    infos = {};

    constructor(api, game, i18n) {
        this._api = api;
        this._game = game;
        this._i18n = i18n;
    }

    viewPossibleMovements(card) {
        if (this.yourTurn) {
            this.selectedCard = card;
            this._api.viewPossibleMovements({name: card.name, color: card.color});
        }
    }

    displayInfos(card, event) {
        this.infos = {
            title: this._i18n.tr(`cards.${card.name.toLowerCase()}_${card.color.toLowerCase()}`),
            description: this._i18n.tr(`cards.${card.name.toLowerCase()}`),
            visible: true,
            event: event
        };
    }

    hideInfos() {
        this.infos = {
            visible: false
        };
    }

    pass() {
        let message =  this._i18n.tr('game.play.pass_confirm_message');
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
            this._game.popup(
                'infos',
                {message: this._i18n.tr('game.play.discard_no_selected_card')});
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
