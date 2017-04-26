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
import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { DOM } from 'aurelia-pal';
import { Popup } from '../../../widgets/popups/popup';
import { Api } from '../../../services/api';
import { randomInt, EventAggregatorSubscriptions } from '../../../services/utils';


@inject(Api, Popup, I18N, DOM.Element, EventAggregatorSubscriptions)
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

    constructor(api, popup, i18n, element, eas) {
        this._api = api;
        this._popup = popup;
        this._i18n = i18n;
        this._element = element;
        this._eas = eas;

        this._logger = LogManager.getLogger('AotTrumps');
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
            let selectedIndex = randomInt(0, otherPlayerNames.length - 1);
            let popupData = {
                selectedChoice: otherPlayerNames[selectedIndex],
                choices: otherPlayerNames,
                translate: {
                    messages: {
                        title: `trumps.${this.normalizeTrumpName()}`,
                        description: `trumps.${this.normalizeTrumpName()}_description`,
                        message: 'game.play.select_trump_target',
                    },
                    paramsToTranslate: {
                        trumpname: `trumps.${this.normalizeTrumpName()}`,
                    },
                },
            };
            this._popup.display('confirm', popupData).then(choice => {
                this._api.playTrump({trumpName: this.trump.name, targetIndex: choice.index});
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
