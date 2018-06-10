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
import { DOM } from 'aurelia-pal';
import { Api } from '../../../services/api';
import { AssetSource } from '../../../../services/assets';
import {
    EventAggregatorSubscriptions,
    Wait,
} from '../../../services/utils';
import { State } from '../../../services/state';


const ZOOM_STEP = 0.4;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;
const MOVE_STEP = 10;


export { MAX_ZOOM, MIN_ZOOM, MOVE_STEP, ZOOM_STEP };


@inject(Api, DOM.Element, EventAggregatorSubscriptions, State)
export class AotBoardCustomElement {
    @bindable selectedCard = null;
    @bindable playerIndex = null;
    @bindable pawnClickable = false;
    @bindable pawnsForcedNotClickable = [];
    @bindable onPawnClicked = null;
    // This is called when the player clicks on a square after clicking on a pawn.
    @bindable onPawnSquareClicked = null;
    _api;
    infos = {};
    possibleSquares = [];
    _selectedPawnIndex = -1;

    constructor(api, element, eas, state) {
        this._element = element;
        this._api = api;
        this._eas = eas;
        this._state = state;
        this.assetSource = AssetSource;

        this._eas.subscribe('aot:api:view_possible_squares', data => {
            this._highlightPossibleSquares(data.possible_squares);
        });
        this._eas.subscribe('aot:api:player_played', () => this._resetPossibleSquares());
        this._eas.subscribe('aot:api:special_action_view_possible_actions', message => {
            if (message.possible_squares) {
                this._highlightPossibleSquares(message.possible_squares);
            }
        });

        this._eas.subscribe('aot:board:controls:zoom', data => {
            if (data.direction !== null) {
                this.zoom(data.direction);
            } else {
                this.zoomTo(parseFloat(data.value, 10), data);
            }
        });

        this._eas.subscribe('aot:board:controls:move', data => {
            this.moveBoard(data.deltaX, data.deltaY);
        });

        this._eas.subscribe('aot:board:controls:reset', () => {
            this.reset();
        });

        this._currentScale = 1;
        this._currentTranslate = {
            x: 0,
            y: 0,
        };
        this._previousMousePosition = {
            x: 0,
            y: 0,
        };

        Wait.forId('board').then(board => {
            this._board = board;
        });
    }

    unbind() {
        this._eas.dispose();
    }

    attached() {
        this._wheelEventCb = event => {
            let direction = event.deltaY < 0 ? 'in' : 'out';
            // If the cursor is on an image, the user is pointing at the background. We just zoom.
            let followElement = event.target.tagName.toLowerCase() !== 'image';
            // Save the original position of the pointed element so we can move the board
            // correctly.
            let originalPosition = event.target.getBoundingClientRect();
            this.zoom(direction);

            // Save the position of the pointed element after zoom and calculate how much we need
            // to move the board.
            let afterPosition = event.target.getBoundingClientRect();
            if (followElement) {
                this._moveBoardToFollowElement(originalPosition, afterPosition);
            }
        };
        this._element.addEventListener('wheel', this._wheelEventCb);

        this._mousedownEventCb = event => {
            if (event.which === 1) {
                let mousemoveCb = moveEvent => {
                    this._board.style.cursor = 'move';
                    // We only move the board if we have a previous mouse position.
                    if (this._previousMousePosition.x !== 0 &&
                            this._previousMousePosition.y !== 0) {
                        let deltaX = moveEvent.clientX - this._previousMousePosition.x;
                        let deltaY = moveEvent.clientY - this._previousMousePosition.y;
                        this.moveBoard(deltaX, deltaY);
                    }

                    this._previousMousePosition.x = moveEvent.clientX;
                    this._previousMousePosition.y = moveEvent.clientY;
                };
                this._element.addEventListener('mousemove', mousemoveCb);

                let stopBoardMove = () => {
                    this._board.style.cursor = '';
                    this._previousMousePosition.x = 0;
                    this._previousMousePosition.y = 0;
                    this._element.removeEventListener('mousemove', mousemoveCb);
                    this._element.removeEventListener('mouseup', stopBoardMove);
                };
                this._element.addEventListener('mouseup', stopBoardMove);
            }
        };
        this._element.addEventListener('mousedown', this._mousedownEventCb);
    }

    _moveBoardToFollowElement(originalPosition, afterPosition) {
        let scaleWidth;
        if (originalPosition.width > afterPosition.with) {
            scaleWidth = afterPosition.width / originalPosition.width;
        } else {
            scaleWidth = originalPosition.width / afterPosition.width;
        }
        let scaleHeight;
        if (originalPosition.height > afterPosition.height) {
            scaleHeight = afterPosition.height / originalPosition.height;
        } else {
            scaleHeight = originalPosition.height / afterPosition.height;
        }
        let deltaX = (originalPosition.left - afterPosition.left) * scaleWidth;
        let deltaY = (originalPosition.top - afterPosition.top) * scaleHeight;
        this.moveBoard(deltaX, deltaY);
    }

    detached() {
        this._element.removeEventListener('wheel', this._wheelEventCb);
        this._element.removeEventListener('mousedown', this._mousedownEventCb);
    }

    zoom(direction) {
        if (direction === 'in' && this._currentScale < MAX_ZOOM) {
            this._currentScale = (10 * this._currentScale + 10 * ZOOM_STEP) / 10;
        } else if (direction === 'out' && this._currentScale > MIN_ZOOM) {
            this._currentScale = (10 * this._currentScale - 10 * ZOOM_STEP) / 10;
        }
        this._eas.publish('aot:board:zoom', {value: this._currentScale});

        this._applyTransformOnBoard();
    }

    zoomTo(value, { fixPawn = false } = {}) {
        let originalPawnPosition;
        let pawnId = `player${this._state.me.index}`;
        let pawn = document.getElementById(pawnId);
        if (fixPawn && this._board) {
            originalPawnPosition = pawn.getBoundingClientRect();
        }

        this._currentScale = value;
        this._eas.publish('aot:board:zoom', {value: this._currentScale});
        this._applyTransformOnBoard();

        if (fixPawn && this._board) {
            let newPawnPosition = pawn.getBoundingClientRect();
            this._moveBoardToFollowElement(originalPawnPosition, newPawnPosition);
        }
    }

    _applyTransformOnBoard() {
        if (!this._board) {
            return;
        }

        let scale = `scale(${this._currentScale})`;
        let translate = `translate(${this._currentTranslate.x}px, ${this._currentTranslate.y}px)`;

        this._board.style.transform = `${scale} ${translate}`;
    }

    moveBoard(deltaX, deltaY) {
        this._currentTranslate.x += deltaX;
        this._currentTranslate.y += deltaY;

        this._applyTransformOnBoard();
    }

    reset() {
        this._currentScale = 1;
        this._currentTranslate.x = 0;
        this._currentTranslate.y = 0;

        this._applyTransformOnBoard();
    }

    _highlightPossibleSquares(possibleSquares) {
        this.possibleSquares = possibleSquares.map(square => {
            return `square-${square.x}-${square.y}`;
        });
    }

    _resetPossibleSquares() {
        this.possibleSquares = [];
    }

    moveTo(squareId, x, y) {
        if (this.possibleSquares.length > 0 &&
                this.possibleSquares.includes(squareId) &&
                this.selectedCard) {
            this._api.play({
                cardName: this.selectedCard.name,
                cardColor: this.selectedCard.color,
                x: x,
                y: y,
            });
            this._resetPossibleSquares();
            this.selectedCard = null;
        } else if (this.possibleSquares.length > 0 &&
                this.possibleSquares.indexOf(squareId) > -1 &&
                this._selectedPawnIndex > -1 &&
                this.onPawnSquareClicked) {
            this.onPawnSquareClicked(squareId, x, y, this._selectedPawnIndex);
            this._selectedPawnIndex = -1;
            this._resetPossibleSquares();
        }
    }

    showPlayerName(index, event) {
        this.infos = {
            title: this._state.game.players.names[index],
            event: event,
            visible: true,
        };
    }

    hidePlayerName() {
        this.infos = {
            visible: false,
        };
    }

    pawnClicked(index) {
        if (this.isClickable(index) && this.onPawnClicked) {
            this._selectedPawnIndex = index;
            this.onPawnClicked(index);
        }
    }

    isClickable(index) {
        return this.pawnClickable && this.pawnsForcedNotClickable.indexOf(index) === -1;
    }

    get playerIndexes() {
        return this._state.game.players.indexes;
    }

    get isPawnClickable() {
        let results = [];
        for (let i = 0; i < 7; i++) {
            results.push(this.isClickable(i));
        }

        return results;
    }
}
