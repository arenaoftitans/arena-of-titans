/*
 * Copyright (C) 2015-2018 by Arena of Titans Contributors.
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

export const REQUEST_TYPES = {
    // Lobby requests.
    joinedLobby: "JOINED_LOBBY",
    reconnect: "RECONNECT",
    createLobby: "CREATE_LOBBY",
    joinGame: "JOIN_GAME",
    updateSlot: "UPDATE_SLOT",
    slotUpdated: "SLOT_UPDATED",
    createGame: "CREATE_GAME",
    // Game requests.
    viewPossibleSquares: "VIEW_POSSIBLE_SQUARES",
    playCard: "PLAY_CARD",
    playTrump: "PLAY_TRUMP",
    playerUpdated: "PLAYER_UPDATED",
    gameUpdated: "GAME_UPDATED",
    specialActionPlay: "SPECIAL_ACTION_PLAY",
    specialActionViewPossibleActions: "SPECIAL_ACTION_VIEW_POSSIBLE_ACTIONS",
};

export const BOARD_MOVE_MODE = "move_mode";
export const BOARD_SELECT_SQUARE_MODE = "select_square_mode";

export const COLORS = ["black", "blue", "red", "yellow"];
export const COLOR_CHOICES = COLORS.map(color => ({ index: color, name: `game.${color}` }));
