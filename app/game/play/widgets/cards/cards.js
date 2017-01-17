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

import * as LogManager from 'aurelia-logging';
import { bindable, inject, NewInstance, ObserverLocator } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../../services/api';
import { Blink, Elements, EventAggregatorSubscriptions } from '../../../services/utils';
import { Game } from '../../../game';


const BUTTON_BLINK_TIME = 1000;
const MAX_BUTTON_BLINK_TIME = 90000;
const BUTTON_BLINK_CLASS = 'blink-container';


@inject(Api, Game, I18N, ObserverLocator, NewInstance.of(EventAggregatorSubscriptions))
export class AotCardsCustomElement {
    @bindable selectedCard;
    _api;
    _game;
    _i18n;
    _logger;
    infos = {};
    specialActionInProgress = false;

    constructor(api, game, i18n, ol, eas) {
        this._api = api;
        this._game = game;
        this._i18n = i18n;
        this._eas = eas;
        this._popupMessage = {};
        this._popupMesasgeId;
        this._logger = LogManager.getLogger('AotCards');

        let blinker;
        ol.getObserver(this, 'highlightPassButton').subscribe(() => {
            if (this.highlightPassButton) {
                let elements = Elements.forClass('grey-button', 'cards-actions');
                blinker = new Blink(
                    elements, MAX_BUTTON_BLINK_TIME, BUTTON_BLINK_TIME, BUTTON_BLINK_CLASS);
                blinker.blink();
            } else if (blinker) {
                blinker.clearElements();
            }
        });

        this._eas.subscribe('i18n:locale:changed', () => this._translatePopupMessage());

        this._eas.subscribe('aot:api:special_action_notify', message => {
            this._notifySpecialAction(message);
        });

        this._eas.subscribe('aot:api:special_action_play', () => {
            this._handleSpecialActionPlayed();
        });

        this._eas.subscribe('aot:api:play', () => {
            // When we receive a play message, there cannot be a special action in
            // progress. This is mostly useful when a player passes his/her turn during a special
            // action.
            this._handleSpecialActionPlayed();
        });
    }

    unbind() {
        this._eas.dispose();
    }

    _translatePopupMessage() {
        if (this._popupMessageId) {
            let params;
            if (this._popupMessageId === 'game.play.discard_confirm_message') {
                params = {
                    cardName: this.getTranslatedCardName(this.selectedCard),
                };
            }

            this._popupMessage.message = this._i18n.tr(this._popupMessageId, params);
        }
    }

    getTranslatedCardName(card) {
        return this._i18n.tr(`cards.${card.name.toLowerCase()}_${card.color.toLowerCase()}`);
    }

    getTranslatedCardDescription(card) {
        return this._i18n.tr(`cards.${card.name.toLowerCase()}`);
    }

    _notifySpecialAction() {
        this.specialActionInProgress = true;
    }

    _handleSpecialActionPlayed() {
        this.specialActionInProgress = false;
    }

    viewPossibleMovements(card) {
        if (this.yourTurn && !this.specialActionInProgress) {
            this.selectedCard = card;
            this._api.viewPossibleMovements({name: card.name, color: card.color});
        }
    }

    displayInfos(card, event) {
        this.infos = {
            title: this.getTranslatedCardName(card),
            description: this.getTranslatedCardDescription(card),
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
        if (this.onLastLine) {
            this._popupMessageId = 'game.play.complete_turn_confirm_message';
        } else {
            this._popupMessageId = 'game.play.pass_confirm_message';
        }
        this._translatePopupMessage();
        this._game.popup('confirm', this._popupMessage).then(() => {
            this._api.pass();
            this.selectedCard = null;
        }, () => {
            this._logger.debug('Player canceled pass turn.');
        });
    }

    discard() {
        if (this.selectedCard) {
            this._popupMessageId = 'game.play.discard_confirm_message';
            this._translatePopupMessage();
            this._game.popup('confirm', this._popupMessage).then(() => {
                this._api.discard({
                    cardName: this.selectedCard.name,
                    cardColor: this.selectedCard.color,
                });
                this.selectedCard = null;
            });
        } else {
            this._popupMessageId = 'game.play.discard_no_selected_card';
            this._translatePopupMessage();
            this._game.popup('infos', this._popupMessage);
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

    get highlightPassButton() {
        return this.yourTurn && this.onLastLine;
    }
}
