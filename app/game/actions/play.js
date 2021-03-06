/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
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
 *
 */

import { dispatchify } from "aurelia-store";
import { AssetSource, ImageClass } from "../../services/assets";
import { displayPopup, getApi, getEmptyCurrentTurn } from "./utils";
import { BOARD_MOVE_MODE, BOARD_SELECT_SQUARE_MODE, COLOR_CHOICES } from "../constants";
import { translationsKey } from "../../translations";

export function gameUpdated(state, request) {
    const newState = { ...state };
    newState.game = {
        ...newState.game,
        ...request,
    };
    if (
        (newState.currentTurn && Object.entries(newState.currentTurn).length === 0) ||
        newState.currentTurn === undefined
    ) {
        newState.currentTurn = getEmptyCurrentTurn();
    }

    return newState;
}

export function playerUpdated(state, request) {
    const newState = { ...state };
    newState.me = request;
    newState.me.hand = buildHand(newState.me.hand);
    newState.me.power.img = AssetSource.forPower(newState.me.power);
    newState.me.availableTrumps = buildTrumpsList(newState.me.availableTrumps);
    newState.me.activeTrumps = buildTrumpsList(newState.me.activeTrumps);

    if (!newState.me.yourTurn) {
        newState.currentTurn = getEmptyCurrentTurn();
    }

    if (newState.currentTurn.mustAutoAskPossibleSquares) {
        dispatchify(viewPossibleMovements)(state.currentTurn.selectedCard);
        newState.currentTurn.mustAutoAskPossibleSquares = false;
    }

    return newState;
}

function buildTrumpsList(trumps) {
    return trumps.map(trump => ({
        ...trump,
        img:
            trump.effectType === "power"
                ? AssetSource.forPower(trump)
                : AssetSource.forTrump(trump),
    }));
}

function buildHand(hand) {
    return hand.map(card => ({
        ...card,
        img: ImageClass.forCard(card),
    }));
}

export function gameJoined(state, request) {
    const newState = { ...state };
    newState.game = request.game;
    newState.me = request.player;
    newState.me.hand = buildHand(newState.me.hand);
    newState.me.availableTrumps = buildTrumpsList(newState.me.availableTrumps);
    newState.me.activeTrumps = buildTrumpsList(newState.me.activeTrumps);
    newState.me.power.img = AssetSource.forPower(newState.me.power);
    newState.currentTurn = getEmptyCurrentTurn();

    return newState;
}

export function viewPossibleMovements(state, card) {
    const newState = state;
    newState.currentTurn = {
        ...newState.currentTurn,
        selectedCard: card,
    };

    getApi().viewPossibleMovements(card);

    return newState;
}

export function viewPossibleSquaresResponse(state, request) {
    const newState = state;
    newState.currentTurn = {
        ...newState.currentTurn,
        possibleSquares: request.possibleSquares,
    };

    return newState;
}

export function playCard(state, square) {
    const selectedCard = state.currentTurn.selectedCard;

    const newState = state;
    newState.currentTurn = {
        ...newState.currentTurn,
        possibleSquares: [],
        selectedCard: null,
    };

    getApi().playCard({ ...square, ...selectedCard });

    return newState;
}

export function passTurn(state, passOptions = {}) {
    getApi().passTurn(passOptions);

    return state;
}

export function discardCard(state) {
    const selectedCard = state.currentTurn.selectedCard;
    const newState = { ...state };
    newState.currentTurn = {
        ...newState.currentTurn,
        selectedCard: null,
        possibleSquares: [],
    };

    getApi().discardCard(selectedCard);

    return newState;
}

export function playTrump(state, trump, targetIndex) {
    const newState = { ...state };

    getApi().playTrump(trump, targetIndex);

    if (state.currentTurn.selectedCard) {
        newState.currentTurn.mustAutoAskPossibleSquares = true;
    }

    return newState;
}

export function passSpecialAction(state, options = {}) {
    getApi().passSpecialAction(state.me.specialAction, options);

    return state;
}

export function viewSpecialActionActions(state, targetIndex) {
    getApi().viewPossibleActions(state.me.specialAction, targetIndex);

    return state;
}

export function playSpecialAction(state, playRequest) {
    const newState = { ...state };
    newState.currentTurn = {
        ...newState.currentTurn,
        possibleSquares: [],
    };

    getApi().playSpecialAction({ ...playRequest, name: state.me.specialAction });

    return newState;
}

export function selectSquareForTrump(state, selectedTrump) {
    const newState = { ...state };

    newState.currentTurn = {
        ...newState.currentTurn,
        selectedTrump,
        boardMode: BOARD_SELECT_SQUARE_MODE,
    };

    return newState;
}

export function selectSquare(state, square) {
    const newState = { ...state };
    const trump = newState.currentTurn.selectedTrump;

    newState.currentTurn = {
        ...newState.currentTurn,
        boardMode: BOARD_MOVE_MODE,
        selectedTrump: null,
    };

    displayPopup("confirm", {
        choices: COLOR_CHOICES,
        translate: {
            messages: {
                title: translationsKey("game.play.board_select_square_color"),
            },
        },
    }).then(chosenColor => {
        const squareWithColor = {
            ...square,
            color: chosenColor,
        };
        const trumpWithSquare = {
            ...trump,
            square: squareWithColor,
        };

        dispatchify(playTrump)(trumpWithSquare, state.me.index);
    });

    return newState;
}
