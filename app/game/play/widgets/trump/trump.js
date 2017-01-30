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

import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../../services/api';


@inject(Api, I18N)
export class AotTrumpCustomElement {
    _api;
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

    constructor(api, i18n) {
        this._api = api;
        this._i18n = i18n;
    }

    bind() {
        switch (this.kind) {
            case 'player':
                this.svgClass = 'player-trump';
                break;
            case 'affecting':
                this.svgClass = 'trump-affecting-player';
                break;
            default:
                this.svgClass = undefined;
                break;
        }
        // We define these two properties to use id.bind and style.bind to dispaly the proper
        // image. If we don't and use string interpolation instead, we get a lint error:
        // https://github.com/MeirionHughes/aurelia-template-lint/issues/23
        this.imagePatternId = `trump-${this.index}`;
        this.imageFillStyle = `fill: url(#${this.imagePatternId})`;
    }

    displayInfos(event) {
        this.infos = {
            title: this.getTranslatedTrumpTitle(),
            description: this.getTranslatedTrumpDescription(),
            visible: true,
            event: event,
        };
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
    }

    get yourTurn() {
        return this._api.game.your_turn;
    }

    get trumpsStatuses() {
        return this._api.game.trumps_statuses;
    }
}
