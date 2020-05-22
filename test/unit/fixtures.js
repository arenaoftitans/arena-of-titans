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

import { Store } from "aurelia-store";

import { keysToCamel } from "../../app/game/actions/utils";
import * as commonActions from "../../app/game/actions/common";
import * as lobbyActions from "../../app/game/actions/lobby";
import * as playActions from "../../app/game/actions/play";

export const createStore = (initialState = {}) => {
    const store = new Store(initialState);

    Object.entries(commonActions).map(([name, action]) => store.registerAction(name, action));
    Object.entries(lobbyActions).map(([name, action]) => store.registerAction(name, action));
    Object.entries(playActions).map(([name, action]) => store.registerAction(name, action));

    return store;
};

export const lobbyJoined = keysToCamel({
    rt: "JOINED_LOBBY",
    request: {
        game_id: "O1xY66VTTvy6iNPuHAuugA",
        player_id: "YNa4GHgX7BJTpNjy0ggdLQ==",
        is_game_master: true,
        index: 0,
        slots: [
            { player_name: "Edwin", index: 0, state: "TAKEN", hero: "Mirindrel" },
            { player_name: "", index: 1, state: "OPEN" },
            { player_name: "", index: 2, state: "OPEN" },
            { player_name: "", index: 3, state: "OPEN" },
        ],
        api_version: "latest",
    },
});

export const playerUpdatedNotYourTurn = keysToCamel({
    rt: "PLAYER_UPDATED",
    request: {
        name: "Edwin",
        index: 0,
        id: "xgjfvkDc3p1hGI+Dw7kRLA==",
        available_trumps: [
            {
                name: "Blizzard",
                description: "Reduce the number of cards a player can play by 1.",
                duration: 1,
                cost: 6,
                must_target_player: true,
                color: null,
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
                delta_moves: -1,
            },
            {
                name: "Ram",
                description: "Destroy towers and reduce duration for fortress",
                duration: 1,
                cost: 4,
                must_target_player: false,
                color: null,
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
                delta_duration: -1,
                trump_names: ["Fortress", "Tower"],
            },
            {
                name: "Fortress",
                description: "Prevent the player to move on some colors.",
                duration: 2,
                cost: 7,
                must_target_player: true,
                color: "YELLOW",
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
            },
            {
                name: "Reinforcements",
                description: "Allow the player to play one more move.",
                duration: 1,
                cost: 8,
                must_target_player: false,
                color: null,
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
                delta_moves: 1,
            },
        ],
        hero: "Mirindrel",
        your_turn: false,
        on_last_line: false,
        has_won: false,
        rank: -1,
        hand: [
            {
                name: "Assassin",
                color: "RED",
                description: "Move two squares in line or diagonal.",
            },
            {
                name: "Wizard",
                color: "RED",
                description:
                    "Move one squares in line or diagonal. Can move on a square of any color.",
            },
            {
                name: "Knight",
                color: "BLUE",
                description: "Move one square in L.",
            },
            {
                name: "King",
                color: "BLUE",
                description: "Move three squares in line.",
            },
            { name: "Knight", color: "YELLOW", description: "Move one square in L." },
        ],
        active_trumps: [],
        trump_target_indexes: [0, 1],
        has_remaining_moves_to_play: true,
        trumps_statuses: [false, false, false, false],
        can_power_be_played: false,
        gauge_value: 0,
        elapsed_time: 0,
        power: {
            passive: false,
            trump_cost_delta: 0,
            require_square_target: true,
            name: "Terraforming",
            description: "Change the color of a square",
            cost: 8,
            must_target_player: false,
            is_power: true,
        },
        special_action: null,
    },
});

export const gameUpdatedNotYourTurn = keysToCamel({
    rt: "GAME_UPDATED",
    request: {
        id: "fPuZBQDWQxGuKSo-YUY-hQ",
        actions: [
            {
                initiator: { name: "Edwin", index: 0 },
                target: null,
                description: "passed_turn",
                special_action: null,
                card: null,
                trump: null,
            },
        ],
        board: { updated_squares: [] },
        is_over: false,
        current_player_index: 1,
        nb_turns: 0,
        players: {
            "0": {
                active_trumps: [],
                square: { x: 6, y: 7, color: "RED" },
                name: "Edwin",
                index: 0,
                hero: "Mirindrel",
                is_visible: true,
            },
            "1": {
                active_trumps: [],
                square: { x: 6, y: 8, color: "YELLOW" },
                name: "AI 1",
                index: 1,
                hero: "Luni",
                is_visible: true,
            },
        },
        winners: [],
    },
});

export const playerUpdatedYourTurn = keysToCamel({
    rt: "PLAYER_UPDATED",
    request: {
        name: "Edwin",
        index: 0,
        id: "xgjfvkDc3p1hGI+Dw7kRLA==",
        available_trumps: [
            {
                name: "Blizzard",
                description: "Reduce the number of cards a player can play by 1.",
                duration: 1,
                cost: 6,
                must_target_player: true,
                color: null,
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
                delta_moves: -1,
            },
            {
                name: "Ram",
                description: "Destroy towers and reduce duration for fortress",
                duration: 1,
                cost: 4,
                must_target_player: false,
                color: null,
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
                delta_duration: -1,
                trump_names: ["Fortress", "Tower"],
            },
            {
                name: "Fortress",
                description: "Prevent the player to move on some colors.",
                duration: 2,
                cost: 7,
                must_target_player: true,
                color: "YELLOW",
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
            },
            {
                name: "Reinforcements",
                description: "Allow the player to play one more move.",
                duration: 1,
                cost: 8,
                must_target_player: false,
                color: null,
                colors: [],
                prevent_trumps_to_modify: [],
                apply_on_initiator: false,
                is_player_visible: true,
                require_square_target: false,
                delta_moves: 1,
            },
        ],
        hero: "Mirindrel",
        your_turn: true,
        on_last_line: false,
        has_won: false,
        rank: -1,
        hand: [
            {
                name: "Assassin",
                color: "RED",
                description: "Move two squares in line or diagonal.",
            },
            {
                name: "Wizard",
                color: "RED",
                description:
                    "Move one squares in line or diagonal. Can move on a square of any color.",
            },
            {
                name: "Knight",
                color: "BLUE",
                description: "Move one square in L.",
            },
            {
                name: "King",
                color: "BLUE",
                description: "Move three squares in line.",
            },
            { name: "Knight", color: "YELLOW", description: "Move one square in L." },
        ],
        active_trumps: [],
        trump_target_indexes: [0, 1],
        has_remaining_moves_to_play: true,
        trumps_statuses: [false, false, false, false],
        can_power_be_played: false,
        gauge_value: 0,
        elapsed_time: 0,
        power: {
            passive: false,
            trump_cost_delta: 0,
            require_square_target: true,
            name: "Terraforming",
            description: "Change the color of a square",
            cost: 8,
            must_target_player: false,
            is_power: true,
        },
        special_action: null,
    },
});

export const gameUpdatedYourTurn = keysToCamel({
    rt: "GAME_UPDATED",
    request: {
        id: "fPuZBQDWQxGuKSo-YUY-hQ",
        actions: [
            {
                initiator: { name: "Edwin", index: 0 },
                target: null,
                description: "passed_turn",
                special_action: null,
                card: null,
                trump: null,
            },
            {
                initiator: { name: "AI 1", index: 1 },
                target: null,
                description: "played_card",
                special_action: null,
                card: { name: "Bishop", color: "RED" },
                trump: null,
            },
            {
                initiator: { name: "AI 1", index: 1 },
                target: null,
                description: "played_card",
                special_action: null,
                card: { name: "Queen", color: "BLACK" },
                trump: null,
            },
        ],
        board: { updated_squares: [] },
        is_over: false,
        current_player_index: 0,
        nb_turns: 1,
        players: {
            "0": {
                active_trumps: [],
                square: { x: 6, y: 7, color: "RED" },
                name: "Edwin",
                index: 0,
                hero: "Mirindrel",
                is_visible: true,
            },
            "1": {
                active_trumps: [],
                square: { x: 5, y: 4, color: "BLACK" },
                name: "AI 1",
                index: 1,
                hero: "Luni",
                is_visible: true,
            },
        },
        winners: [],
    },
});
