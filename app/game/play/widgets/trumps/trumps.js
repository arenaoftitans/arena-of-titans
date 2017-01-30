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

import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../../services/api';


@inject(Api, I18N)
export class AotTrumpsCustomElement {
    _api;
    _game;
    _i18n;
    affectingInfos = {};

    constructor(api, i18n) {
        this._api = api;
        this._i18n = i18n;
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

    get me() {
        return this._api.me;
    }

    get yourTurn() {
        return this._api.game.your_turn;
    }

    get trumpsStatuses() {
        return this._api.game.trumps_statuses;
    }
}
