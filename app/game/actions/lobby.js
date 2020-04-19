/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
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

import DEFAULT_NAMES from "../create/default-names";
import environment from "../../environment";
import { selectRandomElement } from "../services/utils";
import { getApi } from "./utils";

export function createLobby(state, playerInfo) {
    const newState = { ...state };
    newState.lobby = {
        joining: true,
    };
    newState.game = {};
    newState.me = {};

    const playerInfosToDispatch = createPlayerInfosToDispatch(playerInfo);
    getApi().createLobby(playerInfosToDispatch.name, playerInfosToDispatch.hero);

    return newState;
}

function createPlayerInfosToDispatch(playerInfo) {
    return {
        name: playerInfo.name || selectRandomElement(DEFAULT_NAMES),
        hero: playerInfo.hero || selectRandomElement(environment.heroes),
    };
}

export function gameJoined(state, request) {
    if (request.mustRegisterAgain) {
        joinGame(state, request.gameId, createPlayerInfosToDispatch({}));
        return state;
    }

    const newState = { ...state };
    newState.lobby = { ...newState.lobby };
    newState.game = { ...newState.game };
    newState.me = { ...newState.me };

    newState.lobby = {
        isGameMaster: request.isGameMaster,
        joining: false,
        slots: request.slots.map(slot => ({
            ...slot,
            hero: slot.hero ? slot.hero.toLowerCase() : undefined,
        })),
    };

    newState.game.id = request.gameId;

    newState.me.id = request.playerId;
    newState.me.index = request.index;

    return newState;
}

export function joinGame(state, gameId, playerInfo) {
    const playersInfosToDispatch = createPlayerInfosToDispatch(playerInfo);

    getApi().joinGame({
        gameId,
        playerName: playersInfosToDispatch.name,
        hero: playersInfosToDispatch.hero,
    });

    return state;
}

export function updateSlot(state, slot) {
    getApi().updateSlot(slot);

    return state;
}

export function slotUpdated(state, request) {
    const newState = { ...state };
    newState.lobby = { ...newState.lobby };
    newState.lobby.slots = request.slots;
    return newState;
}

export function createGame(state) {
    getApi().createGame();

    return state;
}
