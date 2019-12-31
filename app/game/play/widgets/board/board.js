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

import * as LogManager from "aurelia-logging";
import { bindable, inject } from "aurelia-framework";
import sync from "css-animation-sync";
import { Api } from "../../../services/api";
import { AssetSource } from "../../../../services/assets";
import { EventAggregatorSubscriptions } from "../../../services/utils";
import { State } from "../../../services/state";
import { BOARD_MOVE_MODE, BOARD_SELECT_SQUARE_MODE } from "../../../constants";

@inject(Api, EventAggregatorSubscriptions, State)
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

    squaresColorsToTypes = {
        black: "#mountain-symbol",
        blue: "#water-symbol",
        yellow: "#desert-symbol",
        red: "#forest-symbol",
    };

    constructor(api, eas, state) {
        this._api = api;
        this._eas = eas;
        this._state = state;
        this._logger = LogManager.getLogger("AoTBoard");
        this.assetSource = AssetSource;
        // Map squares to its color if the color changed from the default.
        this.squaresToColors = {};
        this._logger = LogManager.getLogger("aot:board");
        // Will be populated by ref.
        this.pawnLayer = null;
        // Will be populated by ref.
        this.squaresLayer = null;
        // Sync animations
        if (sync) {
            sync("square-blink");
        } else {
            this._logger.warn("sync function is not defined. Animations can be not sync properly");
        }

        this._eas.subscribe("aot:api:view_possible_squares", data => {
            this._highlightPossibleSquares(data.possible_squares);
        });
        this._eas.subscribeMultiple(["aot:api:player_played", "aot:api:play"], () =>
            this._resetPossibleSquares(),
        );
        this._eas.subscribe("aot:api:play_trump", message => this._updateSquare(message.square));
        this._eas.subscribe("aot:api:special_action_view_possible_actions", message => {
            if (message.possible_squares) {
                this._highlightPossibleSquares(message.possible_squares);
            }
        });
        this._eas.subscribe("aot:api:hide_player", playerIndex => {
            this.hidePlayer(playerIndex);
        });
        this._eas.subscribe("aot:api:show_player", playerIndex => {
            this.showPlayer(playerIndex);
        });

        this._eas.subscribe("aot:state:set_board_mode", newMode => this.setMode(newMode));
    }

    unbind() {
        this._eas.dispose();
    }

    _highlightPossibleSquares(possibleSquares) {
        this.possibleSquares = possibleSquares.map(square => {
            return `square-${square.x}-${square.y}`;
        });
    }

    _resetPossibleSquares() {
        this.possibleSquares = [];
    }

    _updateSquare(square) {
        if (!square) {
            return;
        }

        this._logger.debug(`Updating square with ${JSON.stringify(square)}`);
        const squareId = `square-${square.x}-${square.y}`;
        this.squaresToColors = {
            ...this.squaresToColors,
            [squareId]: this.squaresColorsToTypes[square.color],
        };
        this._eas.publish("aot:board:squares_updated");
    }

    handleSquareClicked(squareId, x, y, { isArrivalSquare }) {
        this._logger.debug(`${squareId} was clicked in mode: ${this._state.board.mode}`);
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        switch (this._state.board.mode) {
            case BOARD_SELECT_SQUARE_MODE:
                // We can't change the color of arrival squares.
                if (!isArrivalSquare) {
                    this._eas.publish("aot:board:selected_square", { x, y });
                }
                break;
            case BOARD_MOVE_MODE:
            default:
                this._moveTo(squareId, x, y);
                break;
        }
    }

    _moveTo(squareId, x, y) {
        if (
            this.possibleSquares.length > 0 &&
            this.possibleSquares.includes(squareId) &&
            this.selectedCard
        ) {
            this._api.play({
                cardName: this.selectedCard.name,
                cardColor: this.selectedCard.color,
                x: x,
                y: y,
            });
            this._resetPossibleSquares();
            this.selectedCard = null;
        } else if (
            this.possibleSquares.length > 0 &&
            this.possibleSquares.includes(squareId) &&
            this._selectedPawnIndex > -1 &&
            this.onPawnSquareClicked
        ) {
            this.onPawnSquareClicked(squareId, x, y, this._selectedPawnIndex);
            this._selectedPawnIndex = -1;
            this._resetPossibleSquares();
        }
    }

    setMode(newMode) {
        this._logger.debug(`Switched board to ${newMode}`);
        const squares = this.squaresLayer.querySelectorAll(".square");
        switch (newMode) {
            case BOARD_SELECT_SQUARE_MODE:
                for (let i = 0; i < squares.length; i++) {
                    squares[i].classList.add("selectable");
                }
                break;
            case BOARD_MOVE_MODE:
            default:
                for (let i = 0; i < squares.length; i++) {
                    squares[i].classList.remove("selectable");
                }
                break;
        }
    }

    showPlayerName(index, event) {
        this.infos = {
            title: this._state.game.players.names[index],
            event: event,
            visible: true,
        };
    }

    hidePlayer(playerIndex) {
        const playerContainer = this.pawnLayer.querySelector(`#player${playerIndex}Container`);
        if (playerContainer) {
            playerContainer.classList.add("hidden");
        }
    }

    showPlayer(playerIndex) {
        const playerContainer = this.pawnLayer.querySelector(`#player${playerIndex}Container`);
        if (playerContainer) {
            playerContainer.classList.remove("hidden");
        }
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

    get heroes() {
        return this._state.game.players.heroes;
    }
}
