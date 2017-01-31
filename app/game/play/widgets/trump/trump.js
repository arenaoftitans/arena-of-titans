/*
 * Copyright (C) 2017 by Arena of Titans Contributors.
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
import { bindable, inject, NewInstance } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Game } from '../../../game';
import { Api } from '../../../services/api';
import { randomInt, EventAggregatorSubscriptions } from '../../../services/utils';


@inject(Api, Game, I18N, Element, NewInstance.of(EventAggregatorSubscriptions))
export class AotTrumpCustomElement {
    _api;
    _logger;
    infos = {};
    @bindable trump = {};
    /**
     * Use the index of the trump so the image is correct `url(#trump-${index})`. If we don't on
     * some browsers (eg FireFox), all the trumps have the same image because the pattern id is
     * duplicated.
     */
    @bindable index;
    /**
     * Used to know the proper class on the SVG ('player' or 'affecting')
     */
    @bindable kind;

    constructor(api, game, i18n, element, eas) {
        this._api = api;
        this._game = game;
        this._i18n = i18n;
        this._element = element;
        this._eas = eas;

        this._popupMessage = {};
        this._lastSelected = null;

        this._logger = LogManager.getLogger('AotTrumps');

        this._eas.subscribe('i18n:locale:changed', () => this._translatePopupMessage());
    }

    attached() {
        // Rewrite gradient ids to make them specific to this component.
        let gradientIdTemplate = 'trump-gradient-{i}';
        let i = 1;
        let svg = this._element.getElementsByTagName('svg')[0];
        let gradientId = gradientIdTemplate.replace('{i}', i);
        let gradient = svg.getElementById(gradientId);

        while (gradient !== null) {
            let newId = `${gradientId}-${this.kind}-${this.index}`;
            gradient.id = newId;
            for (let svgElement of svg.querySelectorAll(`[style*="${gradientId}"]`)) {
                svgElement.style.fill = `url(#${newId})`;
            }

            i++;
            gradientId = gradientIdTemplate.replace('{i}', i);
            gradient = svg.getElementById(gradientId);
        }
    }

    bind() {
        switch (this.kind) {
            case 'player':
                this.svgClass = 'player-trump';
                this.infosType = 'trumps';
                break;
            case 'affecting':
                this.svgClass = 'trump-affecting-player';
                this.infosType = 'affecting-trumps';
                break;
            default:
                this.svgClass = undefined;
                break;
        }
        // We define these two properties to use id.bind and style.bind to dispaly the proper
        // image. If we don't and use string interpolation instead, we get a lint error:
        // https://github.com/MeirionHughes/aurelia-template-lint/issues/23
        this.imagePatternId = `trump-${this.kind}-${this.index}`;
        this.imageFillStyle = `fill: url(#${this.imagePatternId})`;
    }

    unbind() {
        this._eas.dispose();
    }

    displayInfos(event) {
        this.infos = {
            title: this.getTranslatedTrumpTitle(),
            description: this.getTranslatedTrumpDescription(),
            visible: true,
            event: event,
        };
        this._eas.publish('aot:trump:mouseover', this.trump);
    }

    normalizeTrumpName() {
        return this.trump.name.toLowerCase().replace(' ', '_');
    }

    getTranslatedTrumpDescription() {
        return this._i18n.tr(`trumps.${this.normalizeTrumpName()}_description`);
    }

    getTranslatedTrumpTitle() {
        return this._i18n.tr(`trumps.${this.normalizeTrumpName()}`);
    }

    hideInfos() {
        this.infos = {
            visible: false,
        };
        this._eas.publish('aot:trump:mouseout');
    }

    play() {
        if (!this.yourTurn || !this.trumpsStatuses[this.index] || this.kind !== 'player') {
            return;
        } else if (this.trump.must_target_player) {
            let otherPlayerNames = this._getOtherPlayerNames();
            this._lastSelected = {
                trump: this.trump,
                otherPlayerNames: otherPlayerNames,
            };
            this._translatePopupMessage();
            this._game.popup('confirm', this._popupMessage).then(targetIndex => {
                // targetIndex is binded in a template, hence it became a string and must be
                // converted before usage in the API
                targetIndex = parseInt(targetIndex, 10);
                this._api.playTrump({trumpName: this.trump.name, targetIndex: targetIndex});
            }, () => this._logger.debug('Player canceled trump'));
        } else {
            this._api.playTrump({trumpName: this.trump.name});
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

    get yourTurn() {
        return this._api.game.your_turn;
    }

    get trumpsStatuses() {
        return this._api.game.trumps_statuses;
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
}
