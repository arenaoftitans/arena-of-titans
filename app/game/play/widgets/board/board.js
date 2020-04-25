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
import { Store } from "aurelia-store";
import sync from "css-animation-sync";
import { AssetSource } from "../../../../services/assets";
import { BOARD_MOVE_MODE, BOARD_SELECT_SQUARE_MODE } from "../../../constants";

@inject(Store)
export class AotBoardCustomElement {
    @bindable playerIndex = null;
    infos = {};
    possibleSquares = [];
    _selectedPawnIndex = -1;

    squaresColorsToTypes = {
        black: "#mountain-symbol",
        blue: "#water-symbol",
        yellow: "#desert-symbol",
        red: "#forest-symbol",
    };

    constructor(store) {
        this._store = store;
        this._logger = LogManager.getLogger("AoTBoard");
        this.boardMode = BOARD_MOVE_MODE;
        this.players = {};
        this._hiddenPlayerIndexes = [];
        this.assetSource = AssetSource;
        // Map squares to its color if the color changed from the default.
        this.squaresToColors = {};
        this._logger = LogManager.getLogger("aot:board");
        this._attached = false;
        // Will be populated by ref.
        this.pawnLayer = null;
        // Will be populated by ref.
        this.squaresLayer = null;
        this.pawnClickable = false;
        this.myIndex = -1;
        // Sync animations
        if (sync) {
            sync("square-blink");
        } else {
            this._logger.warn(
                "sync function is not defined. Animations can be not synced properly",
            );
        }
    }

    bind() {
        this._subscription = this._store.state.subscribe(state => {
            this.selectedCard = state.currentTurn.selectedCard;

            const newBoardMode = state.currentTurn.boardMode || BOARD_MOVE_MODE;
            if (this.boardMode !== newBoardMode) {
                this.boardMode = newBoardMode;
                this.enableBoardMode();
            }
            this.players = state.game.players || {};
            this.possibleSquares = state.currentTurn.possibleSquares.map(square => {
                return `square-${square.x}-${square.y}`;
            });
            this.myIndex = state.me.index;
            this._updateSquares(state.game.board.updatedSquares);
            this._showHidePlayers();
            this._movePlayers();

            if (state.me.specialAction) {
                this._startSpecialAction();
            } else if (!state.me.specialAction) {
                this._endSpecialAction();
            }
        });
    }

    unbind() {
        this._subscription.unsubscribe();
    }

    attached() {
        this._attached = true;
        this._movePlayers();
    }

    detached() {
        this._attached = false;
    }

    _movePlayers() {
        if (!this._attached) {
            return;
        }

        Object.values(this.players).map(this._movePlayer);
    }

    _movePlayer(player) {
        let pawnId = `player${player.index}Container`;
        let pawn = document.getElementById(pawnId);
        let square = document.getElementById("square-" + player.square.x + "-" + player.square.y);
        // Squares position depends on a `transform="translate()"` attribute. We need to parse it to
        // place the pawns correctly.
        const transform = square.getAttribute("transform");
        const transformElements = /^[a-z]+\((\d+\.?\d*)[ ,](\d+\.?\d*)/.exec(transform);
        const xTransform = transformElements[1];
        const yTransform = transformElements[2];

        pawn.setAttribute("height", square.getAttribute("height"));
        pawn.setAttribute("width", square.getAttribute("width"));
        pawn.setAttribute("x", xTransform);
        pawn.setAttribute("y", yTransform);
    }

    _updateSquares(squares) {
        for (let square of squares) {
            this._logger.debug(`Updating square with ${JSON.stringify(square)}`);
            const squareId = `square-${square.x}-${square.y}`;
            this.squaresToColors = {
                ...this.squaresToColors,
                [squareId]: this.squaresColorsToTypes[square.color.toLowerCase()],
            };
        }
    }

    handleSquareClicked(squareId, x, y, { isArrivalSquare }) {
        this._logger.debug(`${squareId} was clicked in mode: ${this.boardMode}`);
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        switch (this.boardMode) {
            case BOARD_SELECT_SQUARE_MODE:
                // We can't change the color of arrival squares.
                if (!isArrivalSquare) {
                    this._store.dispatch("selectSquare", { x, y });
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
            this._store.dispatch("playCard", { x, y });
        } else if (
            this.possibleSquares.length > 0 &&
            this.possibleSquares.includes(squareId) &&
            this._selectedPawnIndex > -1
        ) {
            this._store.dispatch("playSpecialAction", {
                x,
                y,
                targetIndex: this._selectedPawnIndex,
            });
            this._selectedPawnIndex = -1;
        }
    }

    enableBoardMode() {
        this._logger.debug(`Switched board to ${this.boardMode}`);
        const squares = this.squaresLayer.querySelectorAll(".square");
        switch (this.boardMode) {
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
            title: this.players[index].name,
            event: event,
            visible: true,
        };
    }

    _showHidePlayers() {
        const allPlayersToHide = Object.values(this.players)
            .filter(player => !player.isVisible && player.index !== this.myIndex)
            .map(player => player.index);
        const newPlayersToShow = Object.values(this.players)
            .filter(player => player.isVisible)
            .filter(player => this._hiddenPlayerIndexes.includes(player.index))
            .map(player => player.index);

        this._showPlayer(newPlayersToShow);
        this._hidePlayer(allPlayersToHide);

        this._hiddenPlayerIndexes = allPlayersToHide;
    }

    _hidePlayer(playerIndexes) {
        for (let playerIndex of playerIndexes) {
            const playerContainer = this.pawnLayer.querySelector(`#player${playerIndex}Container`);
            if (playerContainer) {
                playerContainer.classList.add("hidden");
            }
        }
    }

    _showPlayer(playerIndexes) {
        for (let playerIndex of playerIndexes) {
            const playerContainer = this.pawnLayer.querySelector(`#player${playerIndex}Container`);
            if (playerContainer) {
                playerContainer.classList.remove("hidden");
            }
        }
    }

    hidePlayerName() {
        this.infos = {
            visible: false,
        };
    }

    pawnClicked(index) {
        if (this.isPawnClickable[index]) {
            this._selectedPawnIndex = index;
            this._store.dispatch("viewSpecialActionActions", index);
        }
    }

    _startSpecialAction() {
        this.pawnClickable = true;
    }

    _endSpecialAction() {
        this.pawnClickable = false;
        this._selectedPawnIndex = -1;
    }

    get playerIndexes() {
        return Object.values(this.players).map(player => player.index);
    }

    get isPawnClickable() {
        let results = [];
        for (let index of this.playerIndexes) {
            results.push(
                this.pawnClickable &&
                    this.players[index].canPawnBeSelected &&
                    index !== this.playerIndex,
            );
        }

        return results;
    }

    get heroes() {
        const heroes = {};
        Object.values(this.players).forEach(player => {
            heroes[player.index] = player.hero;
        });
        return heroes;
    }
}
