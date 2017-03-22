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
import { ImageSource } from '../../services/utils';
import { History } from '../../services/history';
import { Api } from '../../services/api';


@inject(History, Api)
export class AotPlayerBoxInfosCustomElement {
    _history;
    _api;

    constructor(history, api) {
        this._history = history;
        this._api = api;
    }

    activate(model) {
        this.data = model.data;
        this.defered = model.defered;
    }

    close() {
        this.defered.resolve();
    }

    get heroSource() {
        return ImageSource.forCircledHero(this.data.hero);
    }

    get lastPlayedCards() {
        let images = [];
        for (let card of this._history.getLastPlayedCards(this.data.playerIndex)) {
            images.push(ImageSource.forCard(card));
        }

        return images;
    }

    get activeTrumps() {
        let trumps = this._api.game.active_trumps[this.data.playerIndex].trumps;
        let images = [];
        for (let trump of trumps) {
            images.push(ImageSource.forTrump(trump));
        }

        return images;
    }
}
