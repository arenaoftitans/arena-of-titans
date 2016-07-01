/*
* Copyright (C) 2015-2016 by Arena of Titans Contributors.
*
* This file is part of Arena of Titans.
*
* Arena of Titans is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Arena of Titans is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
*/

import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../../services/api';
import { Game } from '../../../game';


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
            event: event,
        };
    }

    hideInfos() {
        this.infos = {
            visible: false,
        };
    }

    pass() {
        let message;
        if (this.onLastLine) {
            message = this._i18n.tr('game.play.complete_turn_confirm_message');
        } else {
            message = this._i18n.tr('game.play.pass_confirm_message');
        }
        this._game.popup('confirm', {message: message}).then(() => {
            this._api.pass();
            this.selectedCard = null;
        }, () => {
            console.info('Player canceled passe turn.');  // eslint-disable-line no-console
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
                    cardColor: this.selectedCard.color,
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

    get onLastLine() {
        return this._api.me.on_last_line;
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
