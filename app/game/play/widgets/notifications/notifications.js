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
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../../services/api';
import { ImageName, ImageSource, Elements, Blink } from '../../../services/utils';
import { Options } from '../../../../services/options';
import { Game } from '../../../game';


const GUIDED_VISIT_DISPLAY_TIME = 5000;
const GUIDED_VISIT_BLINK_TIME = 500;


@inject(Api, I18N, EventAggregator, Options, Game)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerIndex = 0;
    guidedVisitText;
    guidedVisitTextIndex = 0;
    guidedVisitTexts = [
        'game.visit.intro',
        'game.visit.goal',
        'game.visit.cards',
        'game.visit.trumps',
        'game.visit.notifications',
    ];
    specialActionInProgress = false;
    specialActionText;
    _specialActionTextId;
    _api;
    _lastAction = {};
    _i18n;
    _ea;
    _lastActionMessageFromApi;
    _popupMessage;
    _popupMessageId;
    _tutorialInProgress;


    constructor(api, i18n, ea, options, game) {
        this._api = api;
        this._i18n = i18n;
        this._ea = ea;
        this._options = options;
        this._game = game;
        this._popupMessage = {};
        this._popupMessageId;
        this._tutorialInProgress = false;

        this._ea.subscribe('i18n:locale:changed', () => {
            if (this._lastActionMessageFromApi) {
                this._updateLastAction(this._lastActionMessageFromApi);
            }

            if (this._specialActionTextId) {
                this._translateSpecialActionText();
            }

            this._translatePopupMessage();
        });

        this._api.onReconnectDefered.then(message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.player_played, message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.play_trump, message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.special_action_notify, message => {
            this._notifySpecialAction(message);
        });

        this._api.on(this._api.requestTypes.special_action_play, message => {
            this._handleSpecialActionPlayed(message);
        });
    }

    bind() {
        this._popupMessageId = 'game.visit.propose';
        this._translatePopupMessage();
        if (this._options.proposeGuidedVisit) {
            this._game.popup('yes-no', this._popupMessage).then(
                () => this._startGuidedVisit(),
                () => {
                    this._options.proposeGuidedVisit = false;
                }
            );
        }
    }

    _translatePopupMessage() {
        if (this._popupMessageId) {
            this._popupMessage.title = this._i18n.tr(this._popupMessageId);
        }
    }

    _updateLastAction(message) {
        this._lastActionMessageFromApi = message;
        let lastAction = message.last_action || {};
        let description;
        if (lastAction.description) {
            description = this._i18n.tr(
                `actions.${lastAction.description}`,
                {
                    playerName: lastAction.player_name,
                    targetName: lastAction.target_name,
                });
        }
        this._lastAction = {
            description: description,
        };

        if (lastAction.card) {
            this._lastAction.card = lastAction.card;
            let cardName = lastAction.card.name;
            let cardColor = lastAction.card.color.toLowerCase();
            this._lastAction.card.title =
                this._i18n.tr(`cards.${cardName.toLowerCase()}_${cardColor}`);
            this._lastAction.card.description = this._i18n.tr(`cards.${cardName.toLowerCase()}`);
            this._lastAction.card.complementaryDescription =
                    this._i18n.tr(`cards.${cardName.toLowerCase()}_complementary_description`);

            this._lastAction.img = ImageSource.forCard(lastAction.card);
        }

        if (lastAction.trump) {
            let trump = lastAction.trump;
            this._lastAction.trump = trump;
            this._lastAction.img = ImageSource.forTrump(trump);
            let trumpName = ImageName.forTrump(trump).replace('-', '_');
            this._lastAction.trump.title = this._i18n.tr(`trumps.${trumpName}`);
            this._lastAction.trump.description = this._i18n.tr(`trumps.${trumpName}_description`);
        }

        if (lastAction.special_action) {
            let action = lastAction.special_action;
            this._lastAction.specialAction = action;
            let actionName = action.name.toLowerCase();
            this._lastAction.specialAction.title = this._i18n.tr(`trumps.${actionName}`);
            this._lastAction.specialAction.description =
                    this._i18n.tr(`trumps.${actionName}_description`);
        }
    }

    _startGuidedVisit() {
        this._ea.publish('aot:notifications:start_guided_visit');
        this._tutorialInProgress = true;
        this._displayNextVisitText();
    }

    _displayNextVisitText() {
        let textId = this.guidedVisitTexts[this.guidedVisitTextIndex];
        this.guidedVisitText = this._i18n.tr(textId);
        this._highlightVisitElements(this.guidedVisitTextIndex);
        this.guidedVisitTextIndex++;

        if (this.guidedVisitTextIndex < this.guidedVisitTexts.length) {
            setTimeout(() => this._displayNextVisitText(), GUIDED_VISIT_DISPLAY_TIME);
        } else {
            setTimeout(() => {
                this.guidedVisitText = '';
                this._ea.publish('aot:notifications:end_guided_visit');
                this._tutorialInProgress = false;
                this._options.proposeGuidedVisit = false;
            }, GUIDED_VISIT_DISPLAY_TIME);
        }
    }

    _highlightVisitElements(index) {
        let elements;
        let blinkClass;

        switch (index) {
            case 1:  // last line
                elements = Elements.forClass('last-line-square');
                blinkClass = 'highlighted-square';
                break;
            case 2:  // Cards
                elements = Elements.forClass('card', 'cards-img-container');
                blinkClass = 'blink-img';
                break;
            case 3:  // Trumps
                elements = Elements.forClass('player-trumps', 'player-trumps');
                blinkClass = 'blink-img';
                break;
            case 4:  // Notfications
                elements = [document.getElementById('notifications')];
                blinkClass = 'blink-container';
                break;
            default:
                elements = null;
                break;
        }

        if (elements) {
            let blinker = new Blink(
                elements, GUIDED_VISIT_DISPLAY_TIME, GUIDED_VISIT_BLINK_TIME, blinkClass);
            blinker.blink();
        }
    }

    _handleSpecialActionPlayed(message) {
        this.specialActionInProgress = false;
        this._specialActionTextId = undefined;
        this._updateLastAction(message);
    }

    _notifySpecialAction(message) {
        if (this.game.your_turn) {
            this.specialActionInProgress = true;
            this._specialActionTextId = `actions.special_action_${message.name.toLowerCase()}`;
            this._translateSpecialActionText();
        }
    }

    _translateSpecialActionText() {
        this.specialActionText = this._i18n.tr(this._specialActionTextId);
    }

    get currentPlayerName() {
        return this.players.names[this.currentPlayerIndex];
    }

    get lastAction() {
        return this._lastAction;
    }

    get game()  {
        return this._api.game;
    }

    get tutorialInProgress() {
        return this._tutorialInProgress;
    }
}
