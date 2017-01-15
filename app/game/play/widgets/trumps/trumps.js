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
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { randomInt } from '../../../services/utils';
import { Api } from '../../../services/api';
import { Game } from '../../../game';


@inject(Api, Game, I18N, EventAggregator)
export class AotTrumpsCustomElement {
    _api;
    _game;
    _i18n;
    _logger;
    infos = {};
    affectingInfos = {};
    selectedTrumpCost = 0;

    constructor(api, game, i18n, ea) {
        this._api = api;
        this._game = game;
        this._i18n = i18n;
        this._popupMessage = {};
        this._lastSelected = null;
        this._logger = LogManager.getLogger('AotTrumps');

        ea.subscribe('i18n:locale:changed', () => this._translatePopupMessage());
    }

    _translatePopupMessage() {
        if (this._lastSelected) {
            this._popupMessage.message = this._i18n.tr(
                'game.play.select_trump_target', {
                    trumpname: this.getTranslatedTrumpTitle(this._lastSelected.trump),
                });
            this._popupMessage.title = this.getTranslatedTrumpTitle(this._lastSelected.trump);
            this._popupMessage.description =
                    this.getTranslatedTrumpDescription(this._lastSelected.trump);
            this._popupMessage.choices = this._lastSelected.otherPlayerNames;
            this._popupMessage.selectedChoice =
                    randomInt(1, this._popupMessage.choices.length).toString();
        }
    }

    play(trump, index) {
        if (!this.yourTurn || !this.trumpsStatuses[index]) {
            return;
        } else if (trump.must_target_player) {
            let otherPlayerNames = this._getOtherPlayerNames();
            this._lastSelected = {
                trump: trump,
                otherPlayerNames: otherPlayerNames,
            };
            this._translatePopupMessage();
            this._game.popup('confirm', this._popupMessage).then(targetIndex => {
                // targetIndex is binded in a template, hence it became a string and must be
                // converted before usage in the API
                targetIndex = parseInt(targetIndex, 10);
                this._api.playTrump({trumpName: trump.name, targetIndex: targetIndex});
            }, () => this._logger.debug('Player canceled trump'));
        } else {
            this._api.playTrump({trumpName: trump.name});
        }
    }

    _getOtherPlayerNames() {
        let otherPlayerNames = [];
        for (let playerIndex of this.playerIndexes) {
            // We need to check that playerIndex is neither null nor undefined.
            // Just relying on "falsyness" isn't enough since 0 is valid but false.
            if (playerIndex != null && playerIndex !== this.myIndex) { // eslint-disable-line
                let player = {
                    index: playerIndex,
                    name: this.playerNames[playerIndex],
                };
                otherPlayerNames.push(player);
            }
        }

        return otherPlayerNames;
    }

    getTranslatedTrumpTitle(trump) {
        return this._i18n.tr(`trumps.${this.normalizeTrumpName(trump)}`);
    }

    normalizeTrumpName(trump) {
        return trump.name.toLowerCase().replace(' ', '_');
    }

    getTranslatedTrumpDescription(trump) {
        return this._i18n.tr(`trumps.${this.normalizeTrumpName(trump)}_description`);
    }

    displayInfos(trump, event) {
        this.infos = {
            title: this.getTranslatedTrumpTitle(trump),
            description: this.getTranslatedTrumpDescription(trump),
            visible: true,
            event: event,
        };
        this.selectedTrumpCost = trump.cost;
    }

    hideInfos() {
        this.infos = {
            visible: false,
        };
        this.selectedTrumpCost = 0;
    }

    displayAffectingInfos(trump, event) {
        this.affectingInfos = {
            title: this.getTranslatedTrumpTitle(trump),
            description: this.getTranslatedTrumpDescription(trump),
            initiator: trump.initiator,
            visible: true,
            event: event,
        };
    }

    hideAffectingInfos() {
        this.affectingInfos = {
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

    get me() {
        return this._api.me;
    }

    get myIndex() {
        return this._api.me.index;
    }

    get yourTurn() {
        return this._api.game.your_turn;
    }

    get trumpsStatuses() {
        return this._api.game.trumps_statuses;
    }
}
