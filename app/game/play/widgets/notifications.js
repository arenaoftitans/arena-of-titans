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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../services/api';
import { ImageName, ImageSource } from '../../services/utils';


@inject(Api, I18N)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerIndex = 0;
    _api;
    _lastAction = {};
    _i18n;

    constructor(api, i18n) {
        this._api = api;
        this._i18n = i18n;

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

    _updateLastAction(message) {
        let lastAction = message.last_action == null ? {} : message.last_action;  // eslint-disable-line no-eq-null,eqeqeq,max-len
        this._lastAction = {
            player_name: lastAction.player_name,
            description: lastAction.description,
        };

        if (lastAction.card && Object.keys(lastAction.card).length > 0) {
            this._lastAction.card = lastAction.card;
            let cardName = lastAction.card.name;
            let cardColor = lastAction.card.color.toLowerCase();
            this._lastAction.card.title =
                this._i18n.tr(`cards.${cardName.toLowerCase()}_${cardColor}`);
            this._lastAction.card.description = this._i18n.tr(`cards.${cardName.toLowerCase()}`);

            this._lastAction.img = ImageSource.forCard(lastAction.card);
        }

        if (lastAction.trump && Object.keys(lastAction.trump).length > 0) {
            let trump = lastAction.trump;
            this._lastAction.trump = trump;
            this._lastAction.img = ImageSource.forTrump(trump);
            let trumpName = ImageName.forTrump(trump).replace('-', '_');
            this._lastAction.trump.title = this._i18n.tr(`trumps.${trumpName}`);
            this._lastAction.trump.description = this._i18n.tr(`trumps.${trumpName}_description`);
        }
    }

    get playerName() {
        return this._lastAction.player_name;
    }

    get lastAction() {
        return this._lastAction;
    }
}
