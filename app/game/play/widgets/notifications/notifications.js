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
import { ImageName, ImageSource } from '../../../services/utils';
import { Options } from '../../../../services/options';
import { browsers } from '../../../../services/browser-sniffer';
import './notifications.scss';


const GUIDED_VISIT_TIMEOUT = 3500;
const GUISED_VISIT_DISPLAY_TIME = 5000;
const GUIDED_VISIT_BLINK_TIME = 500;


let htmlCollection2Array = collection => Array.prototype.slice.call(collection);

let blinkImg = (elements, forceClear) => {
    if (browsers.msie || browsers.mac) {
        elements = htmlCollection2Array(elements);
    }

    for (let elt of elements) {
        if (elt.classList.contains('blink-img') || forceClear) {
            elt.classList.remove('blink-img');
        } else {
            elt.classList.add('blink-img');
        }
    }
};

let blinkContainer = (container, forceClear) => {
    if (container.classList.contains('blink-container') || forceClear) {
        container.classList.remove('blink-container');
    } else {
        container.classList.add('blink-container');
    }
};


@inject(Api, I18N, EventAggregator, Options)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerIndex = 0;
    proposeGuidedVisit = false;
    guidedVisitText;
    guidedVisitTextIndex = 0;
    guidedVisitTexts = [
        'game.visit.intro',
        'game.visit.goal',
        'game.visit.cards',
        'game.visit.trumps',
        'game.visit.notifications',
    ];
    _api;
    _lastAction = {};
    _i18n;
    _ea;
    _guidedVisitTimeout;

    constructor(api, i18n, ea, options) {
        this._api = api;
        this._i18n = i18n;
        this._ea = ea;
        this.options = options;

        this._guidedVisitTimeout = setTimeout(() => {
            this.proposeGuidedVisit = true;
        }, GUIDED_VISIT_TIMEOUT);
        this._ea.subscribe('aot:api:cancel_guided_visit', () => this._cancelGuidedVisit());

        this._api.onReconnectDefered.then(message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.player_played, message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.play_trump, message => {
            this._updateLastAction(message);
        });
    }

    _cancelGuidedVisit() {
        clearTimeout(this._guidedVisitTimeout);
        this.proposeGuidedVisit = false;
    }

    _updateLastAction(message) {
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
    }

    startGuidedVisit() {
        this.proposeGuidedVisit = false;
        this._ea.publish('aot:notifications:start_guided_visit');
        this._displayNextVisitText();
    }

    _displayNextVisitText() {
        let textId = this.guidedVisitTexts[this.guidedVisitTextIndex];
        this.guidedVisitText = this._i18n.tr(textId);
        this._highlightVisitElements(this.guidedVisitTextIndex);
        this.guidedVisitTextIndex++;

        if (this.guidedVisitTextIndex < this.guidedVisitTexts.length) {
            setTimeout(() => this._displayNextVisitText(), GUISED_VISIT_DISPLAY_TIME);
        } else {
            setTimeout(() => {
                this.guidedVisitText = '';
                this._ea.publish('aot:notifications:end_guided_visit');
                this.options.proposeGuidedVisit = false;
            }, GUISED_VISIT_DISPLAY_TIME);
        }
    }

    _highlightVisitElements(index) {
        let highlightFunction;

        switch (index) {
            case 1:
                highlightFunction = this._highlightLastLine;
                break;
            case 2:
                highlightFunction = this._highlightSquares;
                break;
            case 3:
                highlightFunction = this._highlightTrumps;
                break;
            case 4:
                highlightFunction = this._highlightNotifications;
                break;
            default:
                highlightFunction = null;
        }

        let blinkCount = 0;
        if (highlightFunction) {
            this._makeBlink(highlightFunction, blinkCount);
        }
    }

    _highlightLastLine(forceClear) {
        let lastLineSquares = document.getElementsByClassName('last-line-square');

        if (browsers.msie || browsers.mac) {
            lastLineSquares = htmlCollection2Array(lastLineSquares);
        }

        for (let square of lastLineSquares) {
            if (square.classList.contains('highlighted-square') || forceClear) {
                square.classList.remove('highlighted-square');
            } else {
                square.classList.add('highlighted-square');
            }
        }
    }

    _highlightSquares(forceClear) {
        let cardsContainer = document.getElementById('cards-img-container');
        let cards = cardsContainer.getElementsByClassName('card');
        blinkImg(cards, forceClear);
    }

    _highlightTrumps(forceClear) {
        let trumpsContainer = document.getElementById('player-trumps');
        let trumps = trumpsContainer.getElementsByTagName('img');
        trumps = Array.prototype.slice.call(trumps, 1);
        blinkImg(trumps, forceClear);
    }

    _highlightNotifications(forceClear) {
        let notifications = document.getElementById('notifications');
        blinkContainer(notifications);
    }

    _makeBlink(blinkFn, blinkCount) {
        setTimeout(() => {
            blinkFn();
            blinkCount++;
            if (blinkCount * GUIDED_VISIT_BLINK_TIME <= GUISED_VISIT_DISPLAY_TIME) {
                this._makeBlink(blinkFn, blinkCount);
            } else {
                blinkFn(true);
            }
        }, GUIDED_VISIT_BLINK_TIME);
    }

    get currentPlayerName() {
        return this.players.names[this.currentPlayerIndex];
    }

    get lastAction() {
        return this._lastAction;
    }
}
