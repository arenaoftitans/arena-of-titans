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

import * as LogManager from 'aurelia-logging';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Animations } from './animations';
import { ErrorsReporter } from './errors-reporter';
import { Notify } from './notify';
import { State } from './state';
import { Storage } from '../../services/storage';
import { Wait } from './utils';
import { Ws } from './ws';
import { REQUEST_TYPES } from '../constants';
import environment from '../../environment';


@inject(Ws, State, Storage, Notify, EventAggregator, Animations, ErrorsReporter)
export class Api {
    _ea;
    _reconnectDeferred = {};
    _gameOverDeferred = {};
    _storage;
    _ws;
    _logger;
    _gameId;
    _mustInitBoard;

    constructor(ws, state, storage, notify, ea, animations, errorsReporter) {
        this._state = state;
        this._storage = storage;
        this._ws = ws;
        this._ws.onmessage((message) => {
            this._handleMessage(message);
        });
        this._notify = notify;
        this._ea = ea;
        this._animations = animations;
        this._errorsReporter = errorsReporter;
        this._logger = LogManager.getLogger('AoTApi');
        this._mustInitBoard = true;

        this.init();
    }

    init() {
        this._state.reset();
        this._animations.enable();
        this._errorsReporter.enable();

        this._gameOverDeferred.promise = new Promise(resolve => {
            this._gameOverDeferred.resolve = resolve;
        });
        this._createReconnectDeferred();

        if (this._reconnectSubscription) {
            this._reconnectSubscription.dispose();
        }
        this._reconnectSubscription = this._ea.subscribe('aot:ws:reconnected', () => {
            this._handleWsReconnected();
        });
        if (this._playTrumpSubscription) {
            this._playTrumpSubscription.dispose();
        }
        this._playTrumpSubscription = this._ea.subscribe(
            'aot:trump:play', trump => this.playTrump(trump)
        );
    }

    _handleWsReconnected() {
        if (!this._gameId) {
            // Don't attempt to reconnect if no game was created.
            // This happen on the create game page if the API is down.
            return;
        }

        this._createReconnectDeferred();
        // We must send the gameId in joinGame to avoid an error: joinGame expect an object,
        // if we call it with undefined it crashes.
        this.joinGame({gameId: this._gameId}).then(() => {
            this._ws.sendDeferred();
        });
    }

    _createReconnectDeferred() {
        this._reconnectDeferred.promise = new Promise((resolve, reject) => {
            this._reconnectDeferred.resolve = resolve;
            this._reconnectDeferred.reject = reject;
        });
    }

    _handleMessage(message) {
        switch (message.rt) {
            case REQUEST_TYPES.gameInitialized:
                this._handleGameInitialized(message);
                break;
            case REQUEST_TYPES.slotUpdated:
                this._handleSlotUpdated(message);
                break;
            case REQUEST_TYPES.createGame:
                this._handleCreateGame(message);
                break;
            case REQUEST_TYPES.view:
                // Nothing to do beside calling callbacks
                break;
            case REQUEST_TYPES.play:
                this._handlePlay(message);
                break;
            case REQUEST_TYPES.playerPlayed:
                this._handlePlayerPlayed(message);
                break;
            case REQUEST_TYPES.playTrump:
                this._handlePlayTrump(message);
                break;
            case REQUEST_TYPES.trumpHasNoEffect:
                this._handlePlayTrump(message);
                break;
            case REQUEST_TYPES.specialActionNotify:
                // Nothing to do beside calling callbacks
                break;
            case REQUEST_TYPES.specialActionViewPossibleActions:
                // Nothing to do beside calling callbacks
                break;
            case REQUEST_TYPES.specialActionPlay:
                this._handleSpecialActionPlayed(message);
                break;
            default:
                this._handleErrors(message);
                return;
        }

        this._ea.publish(`aot:api:${message.rt.toLowerCase()}`, message);
    }

    _handleGameInitialized(message) {
        this._gameId = message.game_id;
        this._storage.saveGameData(message.game_id, {
            playerId: message.player_id,
            apiVersion: message.api_version,
        });

        if (message.index === -1) {
            this._reconnectDeferred.reject();
            return;
        } else {  // eslint-disable-line no-else-return
            this._reconnectDeferred.resolve(message);
        }
        this._state.initializeGame(message);
    }

    _handleSlotUpdated(message) {
        this._state.updateSlot(message);
    }

    _handleCreateGame(message) {
        this._state.createGame(message);
        this._initBoard();
    }

    _handlePlay(message) {
        if (message.reconnect) {
            this._handleReconnect(message.reconnect);
        }

        this._state.updateAfterPlay(message);
        this._handleTrumpSideEffect(message.active_trumps);

        if (this._state.game.your_turn && !this._state.game.was_your_turn) {
            this._notify.notifyYourTurn();
        } else {
            this._notify.clearNotifications();
        }
    }

    _handlePlayerPlayed(message) {
        this._movePlayer({
            playerIndex: message.player_index,
            newSquare: message.new_square,
        });
        this._state.updateAfterPlayerPlayed(message);
        this._handleGameOverMessage(message);
    }

    _handleGameOverMessage(message) {
        if (message.game_over) {
            this._gameOverDeferred.resolve(message.winners);
            this._notify.notifyGameOver();
        }
    }

    _handlePlayTrump(message) {
        this._state.updateAfterTrumpPlayed(message);
        this._handleTrumpSideEffect(message.active_trumps);
    }

    /**
     * The idea is to hide the pawn of the player that has "night mist" among its active trumps
     * and to show the others. To do that, we loop an all active trumps, look which players
     * have "night mist" and hide/show the pawns.
     * @param {array} activeTrumps
     */
    _handleTrumpSideEffect(activeTrumps) {
        const keepNightMistForPlayers = [];

        for (let playerActiveTrumps of activeTrumps) {
            if (!playerActiveTrumps) {
                continue;
            }

            const playerIndex = playerActiveTrumps.player_index;
            for (let trump of playerActiveTrumps.trumps) {
                switch (trump.name.toLowerCase()) {
                    case 'night mist':
                        if (playerIndex !== this._state.me.index) {
                            keepNightMistForPlayers.push(playerIndex);
                            Wait.forId('board')
                                .then(() => this._ea.publish('aot:api:hide_player', playerIndex));
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        for (let playerIndex of this._state.game.players.indexes) {
            if (!keepNightMistForPlayers.includes(playerIndex) &&
                    playerIndex !== this._state.me.index) {
                this._ea.publish('aot:api:show_player', playerIndex);
            }
        }
    }

    _handleSpecialActionPlayed(message) {
        let actionName = message.special_action_name;
        // If player canceled the action, the name is null
        if (actionName === null) {
            return;
        }

        switch (actionName.toLowerCase()) {
            case 'assassination':
                this._movePlayer({
                    playerIndex: message.target_index,
                    newSquare: message.new_square,
                });
                break;
            default:
                message.info = 'Unknow special action';
                this._logger.error(message);
                break;
        }
    }

    _handleReconnect(reconnectMessage) {
        this._state.reconnect(reconnectMessage);

        this._initBoard();
        this._reconnectDeferred.resolve(reconnectMessage);
        this._handleGameOverMessage(reconnectMessage);
    }

    _initBoard() {
        if (!this._mustInitBoard) {
            return;
        }

        this._mustInitBoard = false;

        // When reconnecting, we must wait for the board to be loaded before trying to move
        // the pawns.
        let waitForBoard = Wait.forId('player0');

        waitForBoard.then(() => {
            this._rotateBoard();
            this._state.players.squares.forEach((square, index) => {
                if (square && Object.keys(square).length > 0) {
                    this._movePlayer({playerIndex: index, newSquare: square});
                }
            });
        }).catch(error => {
            if (!window.jasmine || !(error instanceof TypeError)) {
                this._logger.error(error);
            }
        });
    }

    _movePlayer({playerIndex: playerIndex, newSquare: newSquare}) {
        let pawnId = `player${playerIndex}`;
        let pawn = document.getElementById(pawnId);
        let pawnContainer = document.getElementById(`${pawnId}Container`);
        let square = document.getElementById('square-' + newSquare.x + '-' + newSquare.y);
        let boundingBox = square.getBBox();
        let transform = square.getAttribute('transform') || '';

        pawnContainer.setAttribute('transform', transform);
        pawn.setAttribute('height', boundingBox.height);
        pawn.setAttribute('width', boundingBox.width);
        pawn.setAttribute('x', boundingBox.x);

        if (square.tagName === 'rect') {
            pawn.setAttribute('y', boundingBox.y);
        } else {
            pawn.setAttribute('y', boundingBox.y + 0.25 * boundingBox.height);
        }
    }

    _rotateBoard() {
        let boardLayer = document.getElementById('boardLayer');
        let pawnLayer = document.getElementById('pawnLayer');
        let angle = 45 * this._state.me.index;
        let transformBoardLayer = boardLayer.getAttribute('transform');
        let transformPawnLayer = pawnLayer.getAttribute('transform');

        boardLayer.setAttribute(
            'transform',
            `${transformBoardLayer} rotate(${angle} 990 990)`
        );
        pawnLayer.setAttribute(
            'transform',
            `${transformPawnLayer} rotate(${angle} 990 990)`
        );
    }

    _handleErrors(message) {
        if (message.error_to_display) {
            this._ea.publish('aot:api:error', {
                message: message.error_to_display,
                isFatal: message.is_fatal,
            });
        } else if (message.debug) {
            this._logger.debug(message.debug);
        } else {
            this._logger.error(message);
        }
    }

    initializeGame(name, hero) {
        this._ws.send({
            rt: REQUEST_TYPES.initGame,
            player_name: name,
            hero: hero,
        });
    }

    updateMe(name, hero) {
        this._state.updateMe(name, hero);

        let slot = this._state.game.slots[this._state.me.index];
        this.updateSlot(slot);
    }

    updateSlot(slot) {
        this._ws.send({
            rt: REQUEST_TYPES.slotUpdated,
            slot: slot,
        });
    }

    joinGame({gameId: gameId, name: name, playerId: playerId, hero: hero}) {
        if (name === undefined && playerId === undefined) {
            playerId = this._storage.retrievePlayerId(gameId);
        }

        // When we reconnect after a failure of the API, joinGame is called in the API. So we
        // save the gameId to transmit it in that case. In all the other cases, joinGame is
        // called from a view which has the gameId as parameter.
        if (gameId) {
            this._gameId = gameId;
        }

        this._ws.send({
            rt: REQUEST_TYPES.initGame,
            player_name: name,
            game_id: this._gameId,
            player_id: playerId,
            hero: hero,
        });

        return this.onReconnectDeferred;
    }

    createGame() {
        let players = this._state.game.slots.map(slot => {
            return {
                name: slot.player_name,
                index: slot.index,
                hero: slot.hero,
            };
        });

        this._ws.send({
            rt: REQUEST_TYPES.createGame,
            debug: environment.debug,
            create_game_request: players,
        });
    }

    viewPossibleMovements({name: name, color: color}) {
        this._ws.send({
            rt: REQUEST_TYPES.view,
            play_request: {
                card_name: name,
                card_color: color,
            },
        });
    }

    viewPossibleActions({name, targetIndex}) {
        this._ws.send({
            rt: REQUEST_TYPES.specialActionViewPossibleActions,
            play_request: {
                special_action_name: name,
                target_index: targetIndex,
            },
        });
    }

    play({cardName: cardName, cardColor: cardColor, x: x, y: y}) {
        this._ws.send({
            rt: REQUEST_TYPES.play,
            play_request: {
                card_name: cardName,
                card_color: cardColor,
                x: parseInt(x, 10),
                y: parseInt(y, 10),
            },
        });
    }

    playSpecialAction({x, y, name, targetIndex}) {
        this._ws.send({
            rt: REQUEST_TYPES.specialActionPlay,
            play_request: {
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
            play_request: {
                auto,
                cancel: true,
                special_action_name: name,
            },
        });
    }

    playTrump({trumpName, trumpColor, targetIndex, square}) {
        this._ws.send({
            rt: REQUEST_TYPES.playTrump,
            play_request: {
                square,
                name: trumpName,
                color: trumpColor,
                target_index: targetIndex === undefined ? null : targetIndex,
            },
        });
    }

    pass({ auto } = { auto: false }) {
        this._ws.send({
            auto,
            rt: REQUEST_TYPES.play,
            play_request: {
                pass: true,
            },
        });
    }

    discard({cardName: cardName, cardColor: cardColor}) {
        this._ws.send({
            rt: REQUEST_TYPES.play,
            play_request: {
                discard: true,
                card_name: cardName,
                card_color: cardColor,
            },
        });
    }

    get onReconnectDeferred() {
        return this._reconnectDeferred.promise;
    }

    get onGameOverDeferred() {
        return this._gameOverDeferred.promise;
    }
}
