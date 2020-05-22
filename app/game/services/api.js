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
 */

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { EventAggregator } from "aurelia-event-aggregator";
import { Animations } from "./animations";
import { ErrorsReporter } from "./errors-reporter";
import { Storage } from "./storage";
import { Ws } from "./ws";
import { REQUEST_TYPES } from "../constants";
import { keysToCamel } from "../actions/utils";

@inject(Ws, Store, Storage, EventAggregator, Animations, ErrorsReporter)
export class Api {
    _ea;
    _storage;
    _ws;
    _logger;
    _gameId;
    _mustInitBoard;

    constructor(ws, store, storage, ea, animations, errorsReporter) {
        this._store = store;
        this._storage = storage;
        this._ws = ws;
        this._ws.onmessage(message => {
            this.handleMessage(message);
        });
        this._ea = ea;
        this._animations = animations;
        this._errorsReporter = errorsReporter;
        this._logger = LogManager.getLogger("AoTApi");
        this._mustInitBoard = true;

        this.lobby = {};
        this._store.state.subscribe(state => (this.lobby = state.lobby));

        this.init();
    }

    init() {
        this._animations.enable();
        this._errorsReporter.enable();
        if (this._reconnectSubscription) {
            this._reconnectSubscription.dispose();
        }
        this._reconnectSubscription = this._ea.subscribe("aot:ws:reconnected", () => {
            this._store.dispatch("reconnect");
            this._ws.sendDeferred();
        });
    }

    handleMessage(message) {
        const request = keysToCamel(message.request);

        switch (message.rt) {
            case REQUEST_TYPES.joinedLobby:
                this._store.dispatch("lobbyJoined", request);
                break;
            case REQUEST_TYPES.slotUpdated:
                this._store.dispatch("slotUpdated", request);
                break;
            case REQUEST_TYPES.viewPossibleSquares:
                this._store.dispatch("viewPossibleSquaresResponse", request);
                break;
            case REQUEST_TYPES.specialActionViewPossibleActions:
                this._store.dispatch("viewPossibleSquaresResponse", request);
                break;
            case REQUEST_TYPES.joinGame:
                this._store.dispatch("gameJoined", request);
                break;
            case REQUEST_TYPES.playerUpdated:
                this._store.dispatch("playerUpdated", request);
                break;
            case REQUEST_TYPES.gameUpdated:
                this._store.dispatch("gameUpdated", request);
                break;
            default:
                this._handleErrors(message);
                break;
        }
    }

    _handleErrors(message) {
        if (message.error_to_display) {
            this._ea.publish("aot:api:error", {
                message: message.error_to_display,
                isFatal: message.is_fatal,
            });
        } else if (message.debug) {
            this._logger.debug(message.debug);
        } else {
            this._logger.error(message);
        }
    }

    reconnect(gameId, playerId) {
        this._ws.send({
            rt: REQUEST_TYPES.reconnect,
            request: {
                game_id: gameId,
                player_id: playerId,
            },
        });
    }

    createLobby(name, hero) {
        this._ws.send({
            rt: REQUEST_TYPES.createLobby,
            request: {
                player_name: name,
                hero: hero,
            },
        });
    }

    updateSlot(slot) {
        this._ws.send({
            rt: REQUEST_TYPES.updateSlot,
            request: {
                slot: {
                    player_name: slot.playerName,
                    index: slot.index,
                    state: slot.state,
                    hero: slot.hero,
                },
            },
        });
    }

    joinGame({ gameId, playerName, hero }) {
        // When we reconnect after a failure of the API, joinGame is called in the API. So we
        // save the gameId to transmit it in that case. In all the other cases, joinGame is
        // called from a viewPossibleSquares which has the gameId as parameter.
        if (gameId) {
            this._gameId = gameId;
        }

        this._ws.send({
            rt: REQUEST_TYPES.joinGame,
            request: {
                player_name: playerName,
                game_id: gameId,
                hero: hero,
            },
        });
    }

    createGame() {
        let players = this.lobby.slots.map(slot => ({
            name: slot.playerName,
            index: slot.index,
        }));

        this._ws.send({
            rt: REQUEST_TYPES.createGame,
            request: {
                players,
            },
        });
    }

    viewPossibleMovements({ name: name, color: color }) {
        this._ws.send({
            rt: REQUEST_TYPES.viewPossibleSquares,
            request: {
                card_name: name,
                card_color: color,
            },
        });
    }

    viewPossibleActions(name, targetIndex) {
        this._ws.send({
            rt: REQUEST_TYPES.specialActionViewPossibleActions,
            request: {
                special_action_name: name,
                target_index: targetIndex,
            },
        });
    }

    playCard({ name, color, x, y }) {
        this._ws.send({
            rt: REQUEST_TYPES.playCard,
            request: {
                card_name: name,
                card_color: color,
                x: parseInt(x, 10),
                y: parseInt(y, 10),
            },
        });
    }

    playSpecialAction({ x, y, name, targetIndex }) {
        this._ws.send({
            rt: REQUEST_TYPES.specialActionPlay,
            request: {
                special_action_name: name,
                x: parseInt(x, 10),
                y: parseInt(y, 10),
                target_index: targetIndex,
            },
        });
    }

    passSpecialAction(name, { auto } = { auto: false }) {
        this._ws.send({
            rt: REQUEST_TYPES.specialActionPlay,
            request: {
                auto,
                cancel: true,
                special_action_name: name,
            },
        });
    }

    playTrump({ name, color, square }, targetIndex) {
        this._ws.send({
            rt: REQUEST_TYPES.playTrump,
            request: {
                square,
                name,
                color,
                target_index: targetIndex,
            },
        });
    }

    passTurn({ auto } = { auto: false }) {
        this._ws.send({
            rt: REQUEST_TYPES.playCard,
            request: {
                auto,
                pass: true,
            },
        });
    }

    discardCard({ name, color }) {
        this._ws.send({
            rt: REQUEST_TYPES.playCard,
            request: {
                discard: true,
                card_name: name,
                card_color: color,
            },
        });
    }
}
