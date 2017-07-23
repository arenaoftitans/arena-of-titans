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
import { bindable, inject, ObserverLocator } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../../services/api';
import { Blink, Elements, EventAggregatorSubscriptions } from '../../../services/utils';
import { Popup } from '../../../widgets/popups/popup';


const BUTTON_BLINK_TIME = 1000;
const MAX_BUTTON_BLINK_TIME = 90000;
const BUTTON_BLINK_CLASS = 'blink-container';


@inject(Api, Popup, I18N, ObserverLocator, EventAggregatorSubscriptions)
export class AotCardsCustomElement {
    @bindable selectedCard;
    _api;
    _game;
    _i18n;
    _logger;
    infos = {};
    specialActionInProgress = false;

    constructor(api, popup, i18n, ol, eas) {
        this._api = api;
        this._popup = popup;
        this._i18n = i18n;
        this._ol = ol;
        this._eas = eas;
        this._logger = LogManager.getLogger('AotCards');

        let blinker;
        this._highlightPassButtonObserverCb = () => {
            if (this.highlightPassButton) {
                let elements = Elements.forClass('grey-button', 'cards-actions');
                blinker = new Blink(
                    elements, MAX_BUTTON_BLINK_TIME, BUTTON_BLINK_TIME, BUTTON_BLINK_CLASS);
                blinker.blink();
            } else if (blinker) {
                blinker.clearElements();
            }
        };
        this._ol.getObserver(this, 'highlightPassButton')
            .subscribe(this._highlightPassButtonObserverCb);

        this._eas.subscribe('aot:api:special_action_notify', message => {
            this._notifySpecialAction(message);
        });

        // If the special action is passed or the player passes his/her turn, special_action_play
        // is never fired. But in all cases a play request is made to update the position of the
        // players on the board.
        this._eas.subscribe('aot:api:play', () => {
            this._handleSpecialActionPlayed();
        });
    }

    unbind() {
        this._eas.dispose();
        this._ol.getObserver(this, 'highlightPassButton')
            .unsubscribe(this._highlightPassButtonObserverCb);
    }

    getTranslatedCardName(card) {
        return this._i18n.tr(`cards.${card.name.toLowerCase()}_${card.color.toLowerCase()}`);
    }

    getTranslatedCardDescription(card) {
        return this._i18n.tr(`cards.${card.name.toLowerCase()}`);
    }

    _notifySpecialAction(message) {
        this.specialActionInProgress = true;
        this.specialActionName = message.special_action_name;
    }

    _handleSpecialActionPlayed() {
        this.specialActionInProgress = false;
        this.specialActionName = null;
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
        let popupData = {
            translate: {
                messages: {},
            },
        };
        let popupCb = () => {
            this._api.pass();
            this.selectedCard = null;
        };

        if (this.specialActionInProgress) {
            popupData.translate.messages.message = 'game.play.pass_special_action_confirm_message';
            popupCb = () => {
                this._api.passSpecialAction(this.specialActionName);
            };
        } else if (this.onLastLine) {
            popupData.translate.messages.message = 'game.play.complete_turn_confirm_message';
        } else {
            popupData.translate.messages.message = 'game.play.pass_confirm_message';
        }
        this._popup.display('confirm', popupData).then(popupCb, () => {
            this._logger.debug('Player canceled pass turn.');
        });
    }

    discard() {
        let popupData = {
            translate: {
                messages: {},
                paramsToTranslate: {},
            },
        };
        if (this.selectedCard) {
            let card = this.selectedCard;
            popupData.translate.messages.message = 'game.play.discard_confirm_message';
            popupData.translate.paramsToTranslate.cardName =
                `cards.${card.name.toLowerCase()}_${card.color.toLowerCase()}`;
            this._popup.display('confirm', popupData).then(() => {
                this._api.discard({
                    cardName: this.selectedCard.name,
                    cardColor: this.selectedCard.color,
                });
                this.selectedCard = null;
            });
        } else {
            popupData.translate.messages.message = 'game.play.discard_no_selected_card';
            this._popup.display('infos', popupData);
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

    get canDiscard() {
        return this.yourTurn && !this.specialActionInProgress;
    }
}
