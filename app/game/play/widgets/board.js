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
import { Api } from '../../services/api';


@inject(Api)
export class AotBoardCustomElement {
    @bindable selectedCard = null;
    @bindable playerIndex = null;
    _api;
    infos = {};
    _possibleSquares = [];

    constructor(api) {
        this._api = api;
        this._api.on(this._api.requestTypes.view, data => {
            this._possibleSquares = data.possible_squares.map(square => {
                return `square-${square.x}-${square.y}`;
            });
        });
        this._api.on(this._api.requestTypes.player_played, () => this._resetPossibleSquares());
    }

    _resetPossibleSquares() {
        this._possibleSquares = [];
    }

    moveTo(squareId, x, y) {
        if (this._possibleSquares.length > 0 &&
                this._possibleSquares.indexOf(squareId) > -1 &&
                this.selectedCard) {
            this._api.play({
                cardName: this.selectedCard.name,
                cardColor: this.selectedCard.color,
                x: x,
                y: y,
            });
            this._possibleSquares = [];
            this.selectedCard = null;
        }
    }

    showPlayerName(index, event) {
        this.infos = {
            title: this._api.game.players.names[index],
            event: event,
            visible: true,
        };
    }

    hidePlayerName() {
        this.infos = {
            visible: false,
        };
    }

    get playerIndexes() {
        return this._api.game.players.indexes;
    }
}
